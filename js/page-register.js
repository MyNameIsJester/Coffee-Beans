/* Trang đăng nhập / đăng ký khách hàng. */
(function () {
    'use strict';
    var $ = function (id) { return document.getElementById(id); };
    var redirect = CB.auth.safeRedirect(CB.ui.param('redirect'));

    function showTab(name) {
        var isLogin = name !== 'register';
        $('login').classList.toggle('active', isLogin);
        $('register').classList.toggle('active', !isLogin);
        $('tabLogin').classList.toggle('active', isLogin);
        $('tabRegister').classList.toggle('active', !isLogin);
        $('tabLogin').setAttribute('aria-selected', String(isLogin));
        $('tabRegister').setAttribute('aria-selected', String(!isLogin));
    }
    function clearErrors(form) {
        form.querySelectorAll('.cb-field-error').forEach(function (e) { e.textContent = ''; });
        form.querySelectorAll('input').forEach(function (i) { i.classList.remove('cb-input-error'); });
        var box = form.querySelector('.cb-alert');
        if (box) box.hidden = true;
    }
    function fieldError(form, name, msg) {
        var el = form.querySelector('[data-error-for="' + name + '"]');
        if (el) el.textContent = msg;
        var input = form.elements[name];
        if (input) input.classList.add('cb-input-error');
    }
    function formAlert(form, msg, kind) {
        var box = form.querySelector('.cb-alert');
        box.className = 'cb-alert cb-alert-' + (kind || 'error');
        box.textContent = msg;
        box.hidden = false;
    }

    $('tabLogin').addEventListener('click', function () { showTab('login'); });
    $('tabRegister').addEventListener('click', function () { showTab('register'); });

    /* Đã đăng nhập sẵn */
    var current = CB.auth.current();
    if (current) {
        $('authForms').hidden = true;
        $('alreadyLoggedIn').hidden = false;
        $('alreadyName').textContent = current.fullName + ' (' + current.username + ')';
        $('continueLink').href = redirect;
        $('logoutBtn').addEventListener('click', function () {
            CB.auth.logout();
            location.reload();
        });
        return;
    }

    showTab(CB.ui.param('tab') === 'register' ? 'register' : 'login');
    if (redirect !== 'index.html') {
        var note = $('redirectNote');
        note.textContent = 'Vui lòng đăng nhập để tiếp tục.';
        note.hidden = false;
    }

    $('loginForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var f = e.target;
        clearErrors(f);
        var ident = f.elements.identifier.value.trim();
        var pw = f.elements.password.value;
        var bad = false;
        if (!ident) { fieldError(f, 'identifier', 'Vui lòng nhập tên đăng nhập hoặc email.'); bad = true; }
        if (!pw) { fieldError(f, 'password', 'Vui lòng nhập mật khẩu.'); bad = true; }
        if (bad) return;
        var r = CB.auth.login(ident, pw);
        if (!r.ok) { formAlert(f, r.error); return; }
        location.href = redirect;
    });

    $('registerForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var f = e.target;
        clearErrors(f);
        var r = CB.auth.register({
            fullName: f.elements.fullName.value,
            username: f.elements.username.value,
            email: f.elements.email.value,
            phone: f.elements.phone.value,
            password: f.elements.password.value,
            confirm: f.elements.confirm.value
        });
        if (!r.ok) {
            Object.keys(r.errors).forEach(function (k) { fieldError(f, k, r.errors[k]); });
            return;
        }
        f.reset();
        var lf = $('loginForm');
        clearErrors(lf);
        lf.elements.identifier.value = r.user.username;
        showTab('login');
        formAlert(lf, 'Đăng ký thành công. Hãy đăng nhập bằng tài khoản vừa tạo.', 'info');
        lf.elements.password.focus();
    });
})();
