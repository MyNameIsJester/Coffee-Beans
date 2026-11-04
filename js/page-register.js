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

            root.innerHTML =
                '<div class="auth-wrapper" style="min-height:calc(100vh - 200px);display:flex;align-items:center;justify-content:center;background-image:url(\'images/thiet-ke-quan-cafe-van-phong-13.jpg\');background-size:cover;background-position:center;padding:40px 20px;">' +
                '  <div class="auth-card" style="background:#fff;padding:36px;border-radius:12px;box-shadow:var(--shadow);max-width:480px;width:100%;">' +
                '    <div style="display:flex;border-bottom:2px solid #eee;margin-bottom:28px;">' +
                '      <button type="button" id="tabBtnLogin" style="flex:1;padding:12px;text-align:center;font-weight:700;font-size:16px;cursor:pointer;border-bottom:3px solid transparent;margin-bottom:-2px;">Đăng Nhập</button>' +
                '      <button type="button" id="tabBtnRegister" style="flex:1;padding:12px;text-align:center;font-weight:700;font-size:16px;cursor:pointer;border-bottom:3px solid transparent;margin-bottom:-2px;">Đăng Ký</button>' +
                '    </div>' +

                '    <div id="authAlert" style="display:none;margin-bottom:20px;" class="alert alert-danger"></div>' +

                '    <!-- LOGIN FORM -->' +
                '    <form id="loginForm">' +
                '      <div class="form-group">' +
                '        <label for="loginIdent">Tên đăng nhập hoặc Email</label>' +
                '        <input type="text" id="loginIdent" placeholder="VD: guest1 hoặc guest1@example.com" required />' +
                '      </div>' +
                '      <div class="form-group">' +
                '        <label for="loginPassword">Mật khẩu</label>' +
                '        <input type="password" id="loginPassword" placeholder="Nhập mật khẩu..." required />' +
                '      </div>' +
                '      <button type="submit" class="btn btn-primary" style="width:100%;padding:12px;margin-top:10px;">Đăng nhập</button>' +
                '      <div style="margin-top:20px;padding:12px;background:#fdfbf9;border-radius:6px;font-size:12px;color:#777;border:1px solid #eee;">' +
                '        Tài khoản mẫu: <strong>guest1</strong> / Mật khẩu: <strong>guest1123</strong>' +
                '      </div>' +
                '    </form>' +

                '    <!-- REGISTER FORM -->' +
                '    <form id="registerForm" style="display:none;">' +
                '      <div class="form-group">' +
                '        <label for="regUsername">Tên đăng nhập</label>' +
                '        <input type="text" id="regUsername" placeholder="Tối thiểu 3 ký tự..." required />' +
                '      </div>' +
                '      <div class="form-group">' +
                '        <label for="regFullName">Họ và tên</label>' +
                '        <input type="text" id="regFullName" placeholder="Họ và tên của bạn..." required />' +
                '      </div>' +
                '      <div class="form-group">' +
                '        <label for="regEmail">Email</label>' +
                '        <input type="email" id="regEmail" placeholder="email@example.com" required />' +
                '      </div>' +
                '      <div class="form-group">' +
                '        <label for="regPhone">Số điện thoại</label>' +
                '        <input type="tel" id="regPhone" placeholder="VD: 0901234567" required />' +
                '      </div>' +
                '      <div class="form-group">' +
                '        <label for="regPassword">Mật khẩu</label>' +
                '        <input type="password" id="regPassword" placeholder="Tối thiểu 6 ký tự..." required />' +
                '      </div>' +
                '      <div class="form-group">' +
                '        <label for="regConfirmPassword">Xác nhận mật khẩu</label>' +
                '        <input type="password" id="regConfirmPassword" placeholder="Nhập lại mật khẩu..." required />' +
                '      </div>' +
                '      <button type="submit" class="btn btn-primary" style="width:100%;padding:12px;margin-top:10px;">Tạo tài khoản</button>' +
                '    </form>' +
                '  </div>' +
                '</div>';

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
