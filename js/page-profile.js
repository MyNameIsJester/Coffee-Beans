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

            CB.mountTemplate(root, 'tpl-profile');
            root.querySelector('#profileAvatar').textContent = (user.fullName || user.username).charAt(0).toUpperCase();
            root.querySelector('#profileFullNameHeading').textContent = user.fullName || '';
            root.querySelector('#profileUsername').textContent = '@' + user.username + ' • Khách hàng thân thiết';
            root.querySelector('#profFullName').value = user.fullName || '';
            root.querySelector('#profPhone').value = user.phone || '';
            root.querySelector('#profEmail').value = user.email || '';
            root.querySelector('#profProvince').value = a.province || '';
            root.querySelector('#profDistrict').value = a.district || '';
            root.querySelector('#profWard').value = a.ward || '';
            root.querySelector('#profDetail').value = a.detail || '';

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

                var res = CB.auth.changePassword(user.id, oldP, newP, confP);
                if (!res.ok) {
                    alertBox.className = 'alert alert-danger';
                    var errMsg = res.error || (res.errors && (res.errors.currentPassword || res.errors.newPassword || res.errors.confirmPassword)) || 'Đổi mật khẩu thất bại.';
                    alertBox.textContent = errMsg;
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
