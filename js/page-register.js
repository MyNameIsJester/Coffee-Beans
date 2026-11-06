/* CoffeeBeans - View: Auth (Đăng nhập / Đăng ký)
   File: js/page-register.js
*/
(function (g) {
    'use strict';
    var CB = (g.CB = g.CB || {});
    var U = CB.util;
    CB.views = CB.views || {};

    CB.views.auth = {
        mount: function (root, params) {
            var redirect = CB.auth.safeRedirect((params && params.redirect) || CB.ui.param('redirect'));
            var initialTab = (params && params.tab) || CB.ui.param('tab') || 'login';

            CB.mountTemplate(root, 'tpl-auth');

            var tabLogin = root.querySelector('#tabBtnLogin');
            var tabRegister = root.querySelector('#tabBtnRegister');
            var loginForm = root.querySelector('#loginForm');
            var registerForm = root.querySelector('#registerForm');
            var alertBox = root.querySelector('#authAlert');

            function setTab(isLogin) {
                alertBox.style.display = 'none';
                if (isLogin) {
                    tabLogin.style.color = 'var(--coffee)';
                    tabLogin.style.borderBottomColor = 'var(--coffee)';
                    tabRegister.style.color = '#888';
                    tabRegister.style.borderBottomColor = 'transparent';
                    loginForm.style.display = 'block';
                    registerForm.style.display = 'none';
                } else {
                    tabRegister.style.color = 'var(--coffee)';
                    tabRegister.style.borderBottomColor = 'var(--coffee)';
                    tabLogin.style.color = '#888';
                    tabLogin.style.borderBottomColor = 'transparent';
                    loginForm.style.display = 'none';
                    registerForm.style.display = 'block';
                }
            }

            tabLogin.addEventListener('click', function () { setTab(true); });
            tabRegister.addEventListener('click', function () { setTab(false); });

            setTab(initialTab !== 'register');

            loginForm.addEventListener('submit', function (e) {
                e.preventDefault();
                alertBox.style.display = 'none';
                var ident = root.querySelector('#loginIdent').value.trim();
                var pwd = root.querySelector('#loginPassword').value;
                var res = CB.auth.login(ident, pwd);
                if (!res.ok) {
                    alertBox.textContent = res.error || 'Đăng nhập không thành công.';
                    alertBox.style.display = 'block';
                } else {
                    CB.ui.toast('Đăng nhập thành công! Đang chuyển hướng...');
                    CB.ui.refreshBadge();
                    g.setTimeout(function () {
                        g.location.href = redirect;
                    }, 400);
                }
            });

            registerForm.addEventListener('submit', function (e) {
                e.preventDefault();
                alertBox.style.display = 'none';
                var u = root.querySelector('#regUsername').value.trim();
                var fn = root.querySelector('#regFullName').value.trim();
                var em = root.querySelector('#regEmail').value.trim();
                var ph = root.querySelector('#regPhone').value.trim();
                var pw = root.querySelector('#regPassword').value;
                var cpw = root.querySelector('#regConfirmPassword').value;

                if (pw !== cpw) {
                    alertBox.textContent = 'Mật khẩu xác nhận không khớp.';
                    alertBox.style.display = 'block';
                    return;
                }

                var res = CB.auth.register({
                    username: u,
                    fullName: fn,
                    email: em,
                    phone: ph,
                    password: pw,
                    confirm: cpw
                });

                if (!res.ok) {
                    var msg = res.error;
                    if (res.errors) {
                        msg = Object.values(res.errors).join(' ');
                    }
                    alertBox.textContent = msg || 'Đăng ký không thành công.';
                    alertBox.style.display = 'block';
                } else {
                    CB.ui.toast('Tạo tài khoản thành công!');
                    CB.auth.login(u, pw);
                    CB.ui.refreshBadge();
                    g.setTimeout(function () {
                        g.location.href = redirect;
                    }, 400);
                }
            });
        },
        unmount: function () {}
    };
})(typeof window !== 'undefined' ? window : globalThis);
