/* CoffeeBeans Admin - Lõi dùng chung: điều hướng, hộp thoại, bảng, tiện ích form.
   Mỗi chức năng quản trị là một "view" đăng ký vào CBA.views[tên] = function (main) {...}. */
(function (g) {
    'use strict';
    var CB = g.CB;
    var U = CB.util;
    var esc = U.esc;

    var CBA = (g.CBA = { views: {}, current: null });
    CBA.esc = esc;
    CBA.money = U.fmtVND;
    CBA.main = function () { return document.getElementById('adminMain'); };
    CBA.$ = function (sel, root) { return (root || document).querySelector(sel); };
    CBA.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

    /* Cho phép test thay thế hộp xác nhận mặc định của trình duyệt */
    CBA.confirm = function (message) { return g.confirm(message); };

    CBA.toast = function (message, type) { CB.ui.toast(message, type); };

    /* Nhãn trạng thái đơn hàng theo class của admin */
    CBA.orderBadge = function (status) {
        var cls = { 'Mới đặt': 'status-pending', 'Đã xử lý': 'status-processing', 'Đã giao': 'status-active', 'Hủy': 'status-inactive' }[status] || 'status-pending';
        return '<span class="status-badge ' + cls + '">' + esc(status) + '</span>';
    };
    CBA.badge = function (text, kind) {
        return '<span class="status-badge status-' + kind + '">' + esc(text) + '</span>';
    };

    /* Ô nhập liệu có nhãn và chỗ hiện lỗi */
    CBA.field = function (label, name, value, attrs, hint) {
        return '<div class="form-group"><label for="f-' + name + '">' + label + '</label>' +
            '<input id="f-' + name + '" name="' + name + '" value="' + esc(value === undefined || value === null ? '' : value) + '" ' + (attrs || '') + ' />' +
            (hint ? '<small class="form-hint">' + hint + '</small>' : '') +
            '<p class="field-error" data-error-for="' + name + '"></p></div>';
    };
    CBA.setErrors = function (root, errors) {
        CBA.$$('.field-error', root).forEach(function (e) { if (!e.classList.contains('form-error')) e.textContent = ''; });
        CBA.$$('.invalid', root).forEach(function (e) { e.classList.remove('invalid'); });
        var general = CBA.$('.form-error', root);
        if (general) { general.textContent = ''; general.hidden = true; }
        Object.keys(errors || {}).forEach(function (k) {
            var el = CBA.$('[data-error-for="' + k + '"]', root);
            if (el) {
                el.textContent = errors[k];
                var input = CBA.$('[name="' + k + '"]', root);
                if (input) input.classList.add('invalid');
            } else if (general) {
                general.textContent = errors[k];
                general.hidden = false;
            }
        });
    };
    /* Hiện kết quả {ok:false, error, field} của tầng dữ liệu lên form */
    CBA.showResultError = function (root, result) {
        var e = {};
        e[result.field || '_'] = result.error;
        CBA.setErrors(root, e);
    };

    /* Hộp thoại. buttons: [{label, cls, onClick(modal)}]; onClick trả về false thì giữ hộp thoại mở. */
    CBA.modal = function (opts) {
        var root = document.getElementById('modalRoot');
        var el = document.createElement('div');
        el.className = 'modal active show';
        el.setAttribute('role', 'dialog');
        el.setAttribute('aria-modal', 'true');
        el.innerHTML =
            '<div class="modal-content" style="max-width:' + (opts.wide ? '920px' : '560px') + ';max-height:92vh;">' +
            '<div class="modal-header"><h2>' + esc(opts.title) + '</h2><button class="close-btn" type="button" data-close aria-label="Đóng">×</button></div>' +
            '<div class="modal-body">' + opts.body + '</div><div class="modal-footer"></div></div>';
        root.appendChild(el);
        var m = {
            el: el,
            $: function (sel) { return CBA.$(sel, el); },
            $$: function (sel) { return CBA.$$(sel, el); },
            close: function () {
                if (el.parentNode) el.parentNode.removeChild(el);
                document.removeEventListener('keydown', onKey);
                if (opts.onClose) opts.onClose();
            }
        };
        function onKey(e) { if (e.key === 'Escape' && root.lastElementChild === el) m.close(); }
        document.addEventListener('keydown', onKey);
        el.addEventListener('mousedown', function (e) { if (e.target === el) m.close(); });
        CBA.$('[data-close]', el).addEventListener('click', m.close);
        var footer = CBA.$('.modal-footer', el);
        (opts.buttons || []).forEach(function (b) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = b.cls || 'btn-cancel';
            btn.textContent = b.label;
            if (b.id) btn.id = b.id;
            btn.addEventListener('click', function () {
                var r = b.onClick ? b.onClick(m) : undefined;
                if (r !== false) m.close();
            });
            footer.appendChild(btn);
        });
        var first = CBA.$('input:not([type=file]), select, textarea', el);
        if (first) first.focus();
        return m;
    };
    CBA.message = function (title, bodyHtml) {
        return CBA.modal({ title: title, body: bodyHtml, buttons: [{ label: 'Đóng', cls: 'btn-primary' }] });
    };

    /* Bảng dữ liệu. headers: ['Cột 1', ...]; rows: mảng chuỗi HTML của từng <tr> */
    CBA.table = function (headers, rows, emptyText) {
        if (!rows.length) return '<div class="empty-state">' + esc(emptyText || 'Không có dữ liệu.') + '</div>';
        return '<table><thead><tr>' + headers.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' + rows.join('') + '</tbody></table>';
    };
    CBA.iconBtn = function (act, id, icon, title, extra) {
        return '<button type="button" class="btn-icon" data-act="' + act + '" data-id="' + esc(id) + '" title="' + esc(title) + '" aria-label="' + esc(title) + '"' + (extra || '') + '>' + icon + '</button>';
    };
    /* Gắn xử lý bấm cho mọi phần tử có data-act trong vùng root */
    CBA.onAct = function (root, handlers) {
        root.addEventListener('click', function (e) {
            var b = e.target.closest('[data-act]');
            if (!b || !root.contains(b) || b.disabled) return;
            var h = handlers[b.getAttribute('data-act')];
            if (h) h(b.getAttribute('data-id'), b);
        });
    };
    CBA.categoryOptions = function (selected, withAll, includeHidden) {
        var opts = withAll ? '<option value="">Tất cả loại</option>' : '';
        CB.catalog.categories({ includeHidden: includeHidden !== false }).forEach(function (c) {
            opts += '<option value="' + esc(c.id) + '"' + (c.id === selected ? ' selected' : '') + '>' + esc(c.name) + (c.hidden ? ' (đang ẩn)' : '') + '</option>';
        });
        return opts;
    };
    CBA.productOptions = function (selected, withAll) {
        var opts = withAll ? '<option value="">Tất cả sản phẩm</option>' : '<option value="">-- Chọn sản phẩm --</option>';
        CB.catalog.products({ includeHidden: true }).sort(function (a, b) { return a.code.localeCompare(b.code); }).forEach(function (p) {
            opts += '<option value="' + esc(p.id) + '"' + (p.id === selected ? ' selected' : '') + '>' + esc(p.code + ' - ' + p.name) + '</option>';
        });
        return opts;
    };
    CBA.productName = function (id) {
        var p = CB.catalog.productById(id);
        return p ? p.name : '(sản phẩm đã xóa)';
    };

    /* ---------- Điều hướng ---------- */
    CBA.go = function (name) {
        if (!CBA.views[name]) name = 'dashboard';
        CBA.current = name;
        CBA.onOrdersChanged = null;
        CBA.$$('.nav-btn').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-view') === name); });
        // Thay vùng nội dung bằng phần tử mới để các trình xử lý bấm của chức năng trước không còn tồn tại
        var old = CBA.main();
        var main = old.cloneNode(false);
        old.parentNode.replaceChild(main, old);
        CBA.views[name](main);
        if (g.location.hash !== '#' + name) g.history.replaceState(null, '', '#' + name);
        g.scrollTo(0, 0);
    };
    CBA.refresh = function () { CBA.go(CBA.current); };

    CBA.init = function () {
        var admin = CB.auth.adminCurrent();
        var app = document.getElementById('adminApp') || document.body;

        if (!admin) {
            // Hiển thị cổng đăng nhập Admin sang trọng
            document.title = 'Đăng nhập Quản trị - Cà Phê Đậm Đà';
            app.innerHTML =
                '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#2a1c16 0%,#4b3429 100%);padding:20px;">' +
                '  <div class="login-container" style="background:#fff;padding:40px;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,0.3);max-width:400px;width:100%;">' +
                '    <div class="login-header" style="text-align:center;margin-bottom:28px;">' +
                '      <div style="font-size:36px;margin-bottom:8px;">☕</div>' +
                '      <h1 style="font-size:24px;color:var(--coffee-900);margin:0 0 6px;font-family:\'Playfair Display\', serif;">Cà Phê Đậm Đà</h1>' +
                '      <p style="color:#777;font-size:14px;margin:0;">Cổng Quản trị viên</p>' +
                '    </div>' +
                '    <div id="adminLoginError" style="display:none;background:#fdecea;color:#b71c1c;padding:12px;border-radius:8px;font-size:13px;margin-bottom:16px;border:1px solid #f5c2c0;"></div>' +
                '    <form id="adminLoginForm">' +
                '      <div class="form-group" style="margin-bottom:18px;">' +
                '        <label for="adminUsername" style="display:block;font-size:13px;font-weight:600;margin-bottom:6px;color:#333;">Tên đăng nhập</label>' +
                '        <input type="text" id="adminUsername" name="username" placeholder="admin" autocomplete="username" required style="width:100%;padding:10px 14px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;" />' +
                '      </div>' +
                '      <div class="form-group" style="margin-bottom:24px;">' +
                '        <label for="adminPassword" style="display:block;font-size:13px;font-weight:600;margin-bottom:6px;color:#333;">Mật khẩu</label>' +
                '        <input type="password" id="adminPassword" name="password" placeholder="••••••••" autocomplete="current-password" required style="width:100%;padding:10px 14px;border:1.5px solid #ddd;border-radius:8px;font-size:14px;" />' +
                '      </div>' +
                '      <button type="submit" class="btn btn-primary" style="width:100%;padding:12px;background:var(--coffee);color:#fff;border-radius:8px;font-weight:600;font-size:15px;cursor:pointer;">Đăng nhập Quản trị</button>' +
                '      <div style="margin-top:20px;text-align:center;">' +
                '        <a href="index.html#/home" style="color:var(--coffee);font-size:13px;text-decoration:none;">← Quay về trang chủ</a>' +
                '      </div>' +
                '      <div style="margin-top:16px;padding:10px;background:#fdfbf9;border-radius:6px;font-size:12px;color:#777;border:1px solid #eee;text-align:center;">' +
                '        Tài khoản mẫu: <strong>admin</strong> / Mật khẩu: <strong>admin123</strong>' +
                '      </div>' +
                '    </form>' +
                '  </div>' +
                '</div>';

            var loginForm = document.getElementById('adminLoginForm');
            if (loginForm) {
                loginForm.addEventListener('submit', function (e) {
                    e.preventDefault();
                    var errBox = document.getElementById('adminLoginError');
                    if (errBox) errBox.style.display = 'none';
                    var u = document.getElementById('adminUsername').value.trim();
                    var pw = document.getElementById('adminPassword').value;
                    if (!u || !pw) {
                        if (errBox) {
                            errBox.textContent = 'Vui lòng nhập tên đăng nhập và mật khẩu.';
                            errBox.style.display = 'block';
                        }
                        return;
                    }
                    var r = CB.auth.adminLogin(u, pw);
                    if (!r.ok) {
                        if (errBox) {
                            errBox.textContent = r.error;
                            errBox.style.display = 'block';
                        }
                        return;
                    }
                    CB.ui.toast('Đăng nhập quản trị thành công!');
                    CBA.init();
                });
            }
            return;
        }

        // Đã đăng nhập: Hiển thị đầy đủ bảng điều khiển Admin Dashboard
        document.title = 'Quản trị hệ thống - Cà Phê Đậm Đà';
        app.innerHTML =
            '<header class="admin-header">' +
            '  <div class="header-content">' +
            '    <div class="header-left">' +
            '      <span style="font-size: 24px;">☕</span>' +
            '      <span class="logo-text">Cà Phê Đậm Đà - Admin</span>' +
            '    </div>' +
            '    <div class="header-right">' +
            '      <div class="user-info">' +
            '        <div class="user-avatar" id="userAvatar">' + (admin.fullName || admin.username).charAt(0).toUpperCase() + '</div>' +
            '        <div id="adminName">' + esc(admin.fullName || admin.username) + '</div>' +
            '      </div>' +
            '      <a class="logout-btn" href="index.html#/home">← Quay về</a>' +
            '      <button class="logout-btn" id="logoutBtn" type="button">Đăng xuất</button>' +
            '    </div>' +
            '  </div>' +
            '</header>' +
            '<div class="admin-layout">' +
            '  <aside class="sidebar">' +
            '    <div class="sidebar-title">Quản trị</div>' +
            '    <button data-view="dashboard" class="nav-btn active" type="button">📊 Tổng quan</button>' +
            '    <button data-view="users" class="nav-btn" type="button">👥 Khách hàng</button>' +
            '    <button data-view="categories" class="nav-btn" type="button">📂 Loại sản phẩm</button>' +
            '    <button data-view="products" class="nav-btn" type="button">☕ Sản phẩm</button>' +
            '    <button data-view="receipts" class="nav-btn" type="button">📥 Nhập hàng</button>' +
            '    <button data-view="pricing" class="nav-btn" type="button">💰 Giá bán</button>' +
            '    <button data-view="orders" class="nav-btn" type="button">📦 Đơn hàng</button>' +
            '    <button data-view="stock" class="nav-btn" type="button">📈 Tồn kho</button>' +
            '  </aside>' +
            '  <main class="main-content" id="adminMain"></main>' +
            '</div>' +
            '<div id="modalRoot"></div>';

        var logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function () {
                CB.auth.adminLogout();
                CB.ui.toast('Đã đăng xuất quản trị.');
                CBA.init();
            });
        }

        CBA.$$('.nav-btn').forEach(function (b) {
            b.addEventListener('click', function () { CBA.go(b.getAttribute('data-view')); });
        });

        g.addEventListener('hashchange', function () {
            var n = g.location.hash.slice(1);
            if (n && n !== CBA.current) CBA.go(n);
        });

        CBA.go(g.location.hash.slice(1) || 'dashboard');
    };
})(window);
