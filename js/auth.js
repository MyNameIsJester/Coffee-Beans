/* CoffeeBeans - Tài khoản khách hàng và admin (phiên làm việc tách biệt).
   Lưu ý: băm mật khẩu phía trình duyệt chỉ để trình diễn, không phải bảo mật thực tế. */
(function (g) {
    'use strict';
    var CB = (g.CB = g.CB || {});
    var db = CB.db,
        K = CB.db.KEYS,
        U = CB.util;

    var DEFAULT_RESET_PASSWORD = '123456';

    function fail(error, field) {
        return { ok: false, error: error, field: field || null };
    }
    function users() {
        return db.read(K.users, []);
    }
    function publicUser(u) {
        if (!u) return null;
        var c = Object.assign({}, u);
        delete c.passwordHash;
        delete c.salt;
        return c;
    }
    function makeUser(d) {
        var salt = U.uid('s');
        return {
            id: d.id || U.uid('u'),
            username: d.username,
            email: d.email,
            fullName: d.fullName,
            phone: d.phone,
            address: d.address || { province: '', district: '', ward: '', detail: '' },
            salt: salt,
            passwordHash: U.hashPassword(d.password, salt),
            status: 'active',
            createdAt: d.createdAt || U.nowISO()
        };
    }
    function findByIdentifier(list, ident) {
        var key = U.norm(ident);
        for (var i = 0; i < list.length; i++) {
            if (U.norm(list[i].username) === key || U.norm(list[i].email) === key) return list[i];
        }
        return null;
    }

    var auth = {
        DEFAULT_RESET_PASSWORD: DEFAULT_RESET_PASSWORD,
        makeUser: makeUser,

        /* ================= Khách hàng ================= */
        /* d: {fullName, username, email, phone, password, confirm} -> {ok, user} | {ok:false, errors:{field:msg}} */
        register: function (d) {
            var errors = {};
            var fullName = String(d.fullName || '').trim();
            var username = String(d.username || '').trim();
            var email = String(d.email || '').trim();
            var phone = String(d.phone || '').replace(/[\s.-]/g, '');
            var password = String(d.password || '');
            if (fullName.length < 2) errors.fullName = 'Vui lòng nhập họ và tên.';
            if (!/^[A-Za-z0-9_.]{3,30}$/.test(username))
                errors.username = 'Tên đăng nhập gồm 3-30 ký tự: chữ không dấu, số, dấu . hoặc _.';
            if (!U.isEmail(email)) errors.email = 'Email không hợp lệ.';
            if (!U.isPhone(phone)) errors.phone = 'Số điện thoại không hợp lệ (ví dụ 0901234567).';
            if (password.length < 6) errors.password = 'Mật khẩu cần ít nhất 6 ký tự.';
            if (password !== String(d.confirm || '')) errors.confirm = 'Mật khẩu xác nhận không khớp.';
            var list = users();
            if (!errors.username && list.some(function (u) { return U.norm(u.username) === U.norm(username); }))
                errors.username = 'Tên đăng nhập đã được sử dụng.';
            if (!errors.email && list.some(function (u) { return U.norm(u.email) === U.norm(email); }))
                errors.email = 'Email đã được sử dụng.';
            if (Object.keys(errors).length) return { ok: false, errors: errors };

            var user = makeUser({ username: username, email: email, fullName: fullName, phone: phone, password: password });
            list.push(user);
            db.write(K.users, list);
            return { ok: true, user: publicUser(user) };
        },
        /* ident: tên đăng nhập hoặc email */
        login: function (ident, password) {
            ident = String(ident || '').trim();
            if (!ident || !password) return fail('Vui lòng nhập tên đăng nhập/email và mật khẩu.');
            var u = findByIdentifier(users(), ident);
            if (!u || U.hashPassword(password, u.salt) !== u.passwordHash)
                return fail('Tên đăng nhập/email hoặc mật khẩu không đúng.');
            if (u.status === 'locked')
                return fail('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ cửa hàng để được hỗ trợ.');
            db.write(K.customerSession, { userId: u.id, at: U.nowISO() });
            return { ok: true, user: publicUser(u) };
        },
        logout: function () {
            db.remove(K.customerSession);
        },
        /* Người dùng đang đăng nhập. Tự đăng xuất nếu tài khoản bị khóa hoặc không còn tồn tại. */
        current: function () {
            var s = db.read(K.customerSession, null);
            if (!s) return null;
            var u = users().filter(function (x) { return x.id === s.userId; })[0];
            if (!u || u.status === 'locked') {
                db.remove(K.customerSession);
                return null;
            }
            return publicUser(u);
        },
        userById: function (id) {
            return publicUser(users().filter(function (x) { return x.id === id; })[0]);
        },
        loginUrl: function (redirect) {
            var back = redirect || (g.location ? g.location.pathname.split('/').pop() + g.location.search : '');
            return 'register.html?tab=login&redirect=' + encodeURIComponent(back);
        },
        /* Chuyển sang trang đăng nhập nếu chưa đăng nhập. Trả về user hoặc null. */
        requireLogin: function () {
            var u = auth.current();
            if (!u && g.location) g.location.href = auth.loginUrl();
            return u;
        },
        /* Chỉ cho phép quay lại trang nội bộ, tránh chuyển hướng ra ngoài */
        safeRedirect: function (target) {
            target = String(target || '');
            if (/^[A-Za-z0-9_-]+\.html(\?[^#]*)?$/.test(target)) return target;
            return 'index.html';
        },
        /* d: {fullName, email, phone, address:{province,district,ward,detail}} */
        updateProfile: function (userId, d) {
            var errors = {};
            var fullName = String(d.fullName || '').trim();
            var email = String(d.email || '').trim();
            var phone = String(d.phone || '').replace(/[\s.-]/g, '');
            if (fullName.length < 2) errors.fullName = 'Vui lòng nhập họ và tên.';
            if (!U.isEmail(email)) errors.email = 'Email không hợp lệ.';
            if (!U.isPhone(phone)) errors.phone = 'Số điện thoại không hợp lệ.';
            var list = users();
            if (!errors.email && list.some(function (u) { return u.id !== userId && U.norm(u.email) === U.norm(email); }))
                errors.email = 'Email đã được tài khoản khác sử dụng.';
            if (Object.keys(errors).length) return { ok: false, errors: errors };
            var u = list.filter(function (x) { return x.id === userId; })[0];
            if (!u) return fail('Không tìm thấy tài khoản.');
            var a = d.address || {};
            u.fullName = fullName;
            u.email = email;
            u.phone = phone;
            u.address = {
                province: String(a.province || '').trim(),
                district: String(a.district || '').trim(),
                ward: String(a.ward || '').trim(),
                detail: String(a.detail || '').trim()
            };
            db.write(K.users, list);
            return { ok: true, user: publicUser(u) };
        },
        /* Khách hàng tự đổi mật khẩu. Trả về {ok:true} hoặc {ok:false, errors:{currentPassword|newPassword|confirmPassword: thông báo}}.
           Chỉ phục vụ trình diễn: mật khẩu băm phía trình duyệt và lưu trong localStorage, không phải xác thực an toàn. */
        changePassword: function (userId, currentPassword, newPassword, confirmPassword) {
            var list = users();
            var u = list.filter(function (x) { return x.id === userId; })[0];
            if (!u) return { ok: false, errors: { currentPassword: 'Không tìm thấy tài khoản.' } };
            var errors = {};
            currentPassword = String(currentPassword || '');
            newPassword = String(newPassword || '');
            confirmPassword = String(confirmPassword || '');
            if (!currentPassword) errors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại.';
            else if (U.hashPassword(currentPassword, u.salt) !== u.passwordHash) errors.currentPassword = 'Mật khẩu hiện tại không đúng.';
            if (newPassword.length < 6) errors.newPassword = 'Mật khẩu mới cần ít nhất 6 ký tự.';
            else if (newPassword === currentPassword) errors.newPassword = 'Mật khẩu mới phải khác mật khẩu hiện tại.';
            if (!errors.newPassword && newPassword !== confirmPassword) errors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
            if (Object.keys(errors).length) return { ok: false, errors: errors };
            u.salt = U.uid('s');
            u.passwordHash = U.hashPassword(newPassword, u.salt);
            db.write(K.users, list);
            return { ok: true };
        },
        hasAddress: function (user) {
            var a = user && user.address;
            return !!(a && a.province && a.district && a.ward && a.detail);
        },
        formatAddress: function (a) {
            if (!a) return '';
            return [a.detail, a.ward, a.district, a.province].filter(Boolean).join(', ');
        },

        /* ================= Quản trị khách hàng (dùng trong admin) ================= */
        customers: function () {
            return users().map(publicUser);
        },
        resetPassword: function (userId) {
            var list = users();
            var u = list.filter(function (x) { return x.id === userId; })[0];
            if (!u) return fail('Không tìm thấy tài khoản.');
            u.passwordHash = U.hashPassword(DEFAULT_RESET_PASSWORD, u.salt);
            db.write(K.users, list);
            return { ok: true, newPassword: DEFAULT_RESET_PASSWORD };
        },
        setLocked: function (userId, locked) {
            var list = users();
            var u = list.filter(function (x) { return x.id === userId; })[0];
            if (!u) return fail('Không tìm thấy tài khoản.');
            u.status = locked ? 'locked' : 'active';
            db.write(K.users, list);
            return { ok: true, user: publicUser(u) };
        },

        /* ================= Admin (phiên riêng, không dùng chung với khách) ================= */
        adminLogin: function (username, password) {
            var list = db.read(K.admins, []);
            var a = findByIdentifier(list, username);
            if (!a || U.hashPassword(String(password || ''), a.salt) !== a.passwordHash)
                return fail('Tên đăng nhập hoặc mật khẩu admin không đúng.');
            db.write(K.adminSession, { adminId: a.id, at: U.nowISO() });
            return { ok: true, admin: { id: a.id, username: a.username, fullName: a.fullName } };
        },
        adminLogout: function () {
            db.remove(K.adminSession);
        },
        adminCurrent: function () {
            var s = db.read(K.adminSession, null);
            if (!s) return null;
            var a = db.read(K.admins, []).filter(function (x) { return x.id === s.adminId; })[0];
            return a ? { id: a.id, username: a.username, fullName: a.fullName } : null;
        },
        requireAdmin: function () {
            var a = auth.adminCurrent();
            if (!a && g.location) g.location.href = 'admin-login.html';
            return a;
        }
    };

    CB.auth = auth;
})(typeof window !== 'undefined' ? window : globalThis);
