/* Hồ sơ cá nhân: xem và sửa thông tin của tài khoản đang đăng nhập. */
(function () {
    'use strict';
    var U = CB.util;
    var user = CB.auth.requireLogin();
    if (!user) return;
    var root = document.getElementById('profileRoot');

    function input(id, label, value, opts) {
        opts = opts || {};
        return '<div class="form-group"><label for="' + id + '">' + label + '</label>' +
            '<input id="' + id + '" name="' + id + '" type="text" value="' + U.esc(value || '') + '"' +
            (opts.placeholder ? ' placeholder="' + U.esc(opts.placeholder) + '"' : '') + (opts.list ? ' list="' + opts.list + '"' : '') + ' />' +
            '<p class="cb-field-error" data-error-for="' + id + '"></p></div>';
    }

    function pwInput(id, label, autocomplete, hint) {
        return '<div class="form-group"><label for="' + id + '">' + label + '</label>' +
            '<input id="' + id + '" name="' + id + '" type="password" autocomplete="' + autocomplete + '" />' +
            (hint ? '<small style="color:#777;">' + hint + '</small>' : '') +
            '<p class="cb-field-error" data-error-for="' + id + '"></p></div>';
    }

    function render(u, savedMsg) {
        var addr = CB.auth.formatAddress(u.address);
        root.innerHTML =
            '<div class="profile-card"><div class="profile-header"><div class="user-avatar"><i class="fas fa-user"></i></div>' +
            '<h1>Hồ sơ cá nhân</h1><p>@' + U.esc(u.username) + '</p></div>' +
            (savedMsg ? '<div class="cb-alert cb-alert-info" role="status">' + U.esc(savedMsg) + '</div>' : '') +
            '<div class="info-box"><h3><i class="fas fa-id-card"></i> Thông tin cá nhân</h3>' +
            '<p><strong>Họ và tên:</strong> <span id="displayName">' + U.esc(u.fullName) + '</span></p>' +
            '<p><strong>Tên đăng nhập:</strong> ' + U.esc(u.username) + '</p>' +
            '<p><strong>Email:</strong> <span id="displayEmail">' + U.esc(u.email) + '</span></p></div>' +
            '<div class="info-box"><h3><i class="fas fa-phone"></i> Liên hệ</h3>' +
            '<p><strong>Số điện thoại:</strong> <span id="displayPhone">' + U.esc(u.phone) + '</span></p>' +
            '<p><strong>Địa chỉ:</strong> <span id="displayAddress">' + (addr ? U.esc(addr) : '<em>Chưa cập nhật</em>') + '</span></p></div>' +
            '<div class="action-buttons"><button id="editProfileBtn" class="btn btn-primary"><i class="fas fa-edit"></i> Chỉnh sửa</button>' +
            '<button id="changePwBtn" class="btn"><i class="fas fa-key"></i> Đổi mật khẩu</button>' +
            '<button id="logoutBtn" class="btn btn-danger"><i class="fas fa-sign-out-alt"></i> Đăng xuất</button></div></div>' +

            '<div id="pwSection" class="profile-card edit-form"><h2>Đổi mật khẩu</h2>' +
            '<form id="pwForm" novalidate autocomplete="off">' +
            pwInput('currentPassword', 'Mật khẩu hiện tại', 'current-password') +
            pwInput('newPassword', 'Mật khẩu mới', 'new-password', 'Ít nhất 6 ký tự, khác mật khẩu hiện tại.') +
            pwInput('confirmPassword', 'Xác nhận mật khẩu mới', 'new-password') +
            '<p class="cb-field-error" style="color:#666;">Chức năng minh họa: mật khẩu được lưu trong localStorage của trình duyệt, không phải cơ chế xác thực an toàn cho website thương mại điện tử thực tế.</p>' +
            '<div class="form-buttons"><button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Đổi mật khẩu</button>' +
            '<button type="button" id="cancelPw" class="btn"><i class="fas fa-times"></i> Hủy</button></div></form></div>' +

            '<div id="editSection" class="profile-card edit-form"><h2>Chỉnh sửa thông tin</h2>' +
            '<form id="editForm" novalidate>' +
            input('fullName', 'Họ và tên', u.fullName, { placeholder: 'Nhập họ và tên' }) +
            input('email', 'Email', u.email, { placeholder: 'Nhập email' }) +
            input('phone', 'Số điện thoại', u.phone, { placeholder: 'Ví dụ: 0901234567' }) +
            input('province', 'Tỉnh / Thành phố', u.address.province, { placeholder: 'Ví dụ: TP. Hồ Chí Minh', list: 'provinceList' }) +
            '<datalist id="provinceList"><option value="TP. Hồ Chí Minh"><option value="Hà Nội"><option value="Đà Nẵng"><option value="Cần Thơ"><option value="Hải Phòng"></datalist>' +
            input('district', 'Quận / Huyện', u.address.district, { placeholder: 'Ví dụ: Quận 1' }) +
            input('ward', 'Phường / Xã', u.address.ward, { placeholder: 'Ví dụ: Phường Bến Nghé' }) +
            input('detail', 'Số nhà, tên đường', u.address.detail, { placeholder: 'Ví dụ: 12 Nguyễn Huệ' }) +
            '<p class="cb-field-error" id="addrHint" style="color:#666;">Địa chỉ này dùng làm địa chỉ giao hàng mặc định. Hãy điền đủ cả 4 ô hoặc để trống cả 4 ô.</p>' +
            '<div class="form-buttons"><button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Lưu</button>' +
            '<button type="button" id="cancelEdit" class="btn"><i class="fas fa-times"></i> Hủy</button></div></form></div>';

        var section = document.getElementById('editSection');
        document.getElementById('editProfileBtn').addEventListener('click', function () { section.classList.toggle('show'); });
        var pwSection = document.getElementById('pwSection');
        document.getElementById('changePwBtn').addEventListener('click', function () { pwSection.classList.toggle('show'); });
        document.getElementById('cancelPw').addEventListener('click', function () { render(user); });
        document.getElementById('pwForm').addEventListener('submit', function (e) {
            e.preventDefault();
            var f = e.target;
            f.querySelectorAll('.cb-field-error[data-error-for]').forEach(function (x) { x.textContent = ''; });
            var r = CB.auth.changePassword(user.id, f.elements.currentPassword.value, f.elements.newPassword.value, f.elements.confirmPassword.value);
            if (!r.ok) {
                Object.keys(r.errors).forEach(function (k) { f.querySelector('[data-error-for="' + k + '"]').textContent = r.errors[k]; });
                return;
            }
            render(user, 'Đã đổi mật khẩu thành công. Hãy dùng mật khẩu mới cho lần đăng nhập sau.');
        });
        document.getElementById('cancelEdit').addEventListener('click', function () { section.classList.remove('show'); render(user); });
        document.getElementById('logoutBtn').addEventListener('click', function () {
            if (confirm('Bạn có chắc chắn muốn đăng xuất?')) CB.ui.logout();
        });
        document.getElementById('editForm').addEventListener('submit', function (e) {
            e.preventDefault();
            var f = e.target;
            f.querySelectorAll('.cb-field-error[data-error-for]').forEach(function (x) { x.textContent = ''; });
            var addr = {
                province: f.elements.province.value, district: f.elements.district.value,
                ward: f.elements.ward.value, detail: f.elements.detail.value
            };
            var filled = Object.keys(addr).filter(function (k) { return addr[k].trim(); }).length;
            if (filled > 0 && filled < 4) {
                Object.keys(addr).forEach(function (k) {
                    if (!addr[k].trim()) f.querySelector('[data-error-for="' + k + '"]').textContent = 'Vui lòng điền đủ địa chỉ hoặc để trống cả 4 ô.';
                });
                return;
            }
            var r = CB.auth.updateProfile(user.id, {
                fullName: f.elements.fullName.value, email: f.elements.email.value, phone: f.elements.phone.value, address: addr
            });
            if (!r.ok) {
                if (r.errors) Object.keys(r.errors).forEach(function (k) { f.querySelector('[data-error-for="' + k + '"]').textContent = r.errors[k]; });
                else CB.ui.toast(r.error, 'error');
                return;
            }
            user = r.user;
            render(user, 'Đã lưu thông tin cá nhân.');
            CB.ui.mountHeader();
        });
    }
    render(user);
})();
