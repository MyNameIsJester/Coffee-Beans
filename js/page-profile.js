/* CoffeeBeans - View: Profile (Thông tin cá nhân)
   File: js/page-profile.js
*/
(function (g) {
    'use strict';
    var CB = (g.CB = g.CB || {});
    var U = CB.util;
    CB.views = CB.views || {};

    CB.views.profile = {
        mount: function (root, params) {
            var user = CB.auth.requireLogin();
            if (!user) return;

            var a = user.address || {};

            root.innerHTML =
                '<div class="container" style="padding:40px 20px;max-width:800px;">' +
                '  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;">' +
                '    <h1 style="font-size:28px;color:var(--coffee-900);margin:0;font-family:\'Playfair Display\', serif;">Hồ sơ cá nhân</h1>' +
                '    <button type="button" id="profLogoutBtn" class="btn" style="background:#b30000;color:#fff;padding:8px 16px;font-size:13px;border-radius:6px;cursor:pointer;"><i class="fa fa-sign-out"></i> Đăng xuất</button>' +
                '  </div>' +
                '  <div id="profAlert" style="display:none;margin-bottom:20px;" class="alert"></div>' +

                '  <div style="background:#fff;padding:32px;border-radius:12px;box-shadow:var(--shadow);margin-bottom:30px;">' +
                '    <div style="display:flex;align-items:center;gap:16px;margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid #eee;">' +
                '      <div style="width:64px;height:64px;border-radius:50%;background:var(--coffee);color:#fff;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;">' +
                '        ' + (user.fullName || user.username).charAt(0).toUpperCase() +
                '      </div>' +
                '      <div>' +
                '        <h2 style="font-size:20px;color:var(--coffee-900);margin-bottom:4px;">' + U.esc(user.fullName) + '</h2>' +
                '        <p style="color:#777;font-size:14px;">@' + U.esc(user.username) + ' • Khách hàng thân thiết</p>' +
                '      </div>' +
                '    </div>' +

                '    <form id="profileForm">' +
                '      <h3 style="font-size:16px;color:var(--coffee-900);margin-bottom:16px;">Thông tin liên hệ & địa chỉ mặc định</h3>' +
                '      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">' +
                '        <div class="form-group"><label for="profFullName">Họ và tên</label><input type="text" id="profFullName" value="' + U.esc(user.fullName) + '" required /></div>' +
                '        <div class="form-group"><label for="profPhone">Số điện thoại</label><input type="tel" id="profPhone" value="' + U.esc(user.phone || '') + '" required /></div>' +
                '      </div>' +
                '      <div class="form-group"><label for="profEmail">Email</label><input type="email" id="profEmail" value="' + U.esc(user.email) + '" required /></div>' +
                '      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;">' +
                '        <div class="form-group"><label for="profProvince">Tỉnh / Thành phố</label><input type="text" id="profProvince" value="' + U.esc(a.province || '') + '" /></div>' +
                '        <div class="form-group"><label for="profDistrict">Quận / Huyện</label><input type="text" id="profDistrict" value="' + U.esc(a.district || '') + '" /></div>' +
                '        <div class="form-group"><label for="profWard">Phường / Xã</label><input type="text" id="profWard" value="' + U.esc(a.ward || '') + '" /></div>' +
                '      </div>' +
                '      <div class="form-group"><label for="profDetail">Địa chỉ chi tiết (Số nhà, đường)</label><input type="text" id="profDetail" value="' + U.esc(a.detail || '') + '" /></div>' +
                '      <button type="submit" class="btn btn-primary" style="padding:12px 24px;">Lưu thông tin</button>' +
                '    </form>' +
                '  </div>' +

                '  <div style="background:#fff;padding:32px;border-radius:12px;box-shadow:var(--shadow);">' +
                '    <h3 style="font-size:18px;color:var(--coffee-900);margin-bottom:16px;">Đổi mật khẩu</h3>' +
                '    <form id="pwForm">' +
                '      <div class="form-group"><label for="oldPw">Mật khẩu hiện tại</label><input type="password" id="oldPw" required /></div>' +
                '      <div class="form-group"><label for="newPw">Mật khẩu mới (tối thiểu 6 ký tự)</label><input type="password" id="newPw" required /></div>' +
                '      <div class="form-group"><label for="confirmNewPw">Xác nhận mật khẩu mới</label><input type="password" id="confirmNewPw" required /></div>' +
                '      <button type="submit" class="btn btn-secondary" style="padding:12px 24px;">Đổi mật khẩu</button>' +
                '    </form>' +
                '  </div>' +
                '</div>';

            var profForm = root.querySelector('#profileForm');
            var pwForm = root.querySelector('#pwForm');
            var alertBox = root.querySelector('#profAlert');

            profForm.addEventListener('submit', function (e) {
                e.preventDefault();
                alertBox.style.display = 'none';

                var fn = root.querySelector('#profFullName').value.trim();
                var ph = root.querySelector('#profPhone').value.trim();
                var em = root.querySelector('#profEmail').value.trim();
                var pv = root.querySelector('#profProvince').value.trim();
                var dt = root.querySelector('#profDistrict').value.trim();
                var wd = root.querySelector('#profWard').value.trim();
                var de = root.querySelector('#profDetail').value.trim();

                var res = CB.auth.updateProfile(user.id, {
                    fullName: fn,
                    phone: ph,
                    email: em,
                    address: { province: pv, district: dt, ward: wd, detail: de }
                });

                if (!res.ok) {
                    alertBox.className = 'alert alert-danger';
                    alertBox.textContent = res.error || 'Cập nhật thất bại.';
                    alertBox.style.display = 'block';
                } else {
                    alertBox.className = 'alert alert-success';
                    alertBox.textContent = 'Đã cập nhật thông tin thành công!';
                    alertBox.style.display = 'block';
                    CB.ui.refreshBadge();
                }
            });

            var profLogout = root.querySelector('#profLogoutBtn');
            if (profLogout) {
                profLogout.addEventListener('click', function () {
                    CB.ui.logout();
                });
            }

            pwForm.addEventListener('submit', function (e) {
                e.preventDefault();
                alertBox.style.display = 'none';

                var oldP = root.querySelector('#oldPw').value;
                var newP = root.querySelector('#newPw').value;
                var confP = root.querySelector('#confirmNewPw').value;

                if (newP !== confP) {
                    alertBox.className = 'alert alert-danger';
                    alertBox.textContent = 'Mật khẩu mới và xác nhận mật khẩu không khớp.';
                    alertBox.style.display = 'block';
                    return;
                }

                var res = CB.auth.changePassword(user.id, oldP, newP);
                if (!res.ok) {
                    alertBox.className = 'alert alert-danger';
                    alertBox.textContent = res.error || 'Đổi mật khẩu thất bại.';
                    alertBox.style.display = 'block';
                } else {
                    alertBox.className = 'alert alert-success';
                    alertBox.textContent = 'Đổi mật khẩu thành công!';
                    alertBox.style.display = 'block';
                    pwForm.reset();
                }
            });
        },
        unmount: function () {}
    };
})(typeof window !== 'undefined' ? window : globalThis);
