const H = require('./harness');
(async () => {
    await H.start();
    console.log('\n[register.html]');
    let pg = await H.visit('register.html?tab=login&redirect=cart.html');
    H.eq(pg.errors, [], 'không lỗi JS');
    H.ok(pg.d.getElementById('login').classList.contains('active'), 'mở đúng tab đăng nhập');
    H.eq(pg.d.getElementById('login-password').type, 'password', 'mật khẩu được ẩn (type=password)');
    H.ok(!pg.d.getElementById('redirectNote').hidden, 'có nhắc đăng nhập khi bị chuyển từ trang khác');
    const submit = (id) => pg.d.getElementById(id).dispatchEvent(new pg.w.Event('submit', { cancelable: true }));
    // đăng nhập trống
    submit('loginForm');
    H.ok(/Vui lòng nhập tên đăng nhập/.test(pg.d.querySelector('#loginForm [data-error-for=identifier]').textContent), 'đăng nhập trống: báo lỗi trường');
    // sai mật khẩu
    pg.d.getElementById('login-identifier').value = 'guest1';
    pg.d.getElementById('login-password').value = 'sai';
    submit('loginForm');
    H.ok(/không đúng/.test(pg.d.querySelector('#loginForm .cb-alert').textContent) && !pg.d.querySelector('#loginForm .cb-alert').hidden, 'sai mật khẩu: báo lỗi chung');
    H.eq(pg.w.CB.auth.current(), null, 'sai mật khẩu: không tạo phiên');
    // đăng ký sai
    pg.d.getElementById('tabRegister').click();
    H.ok(pg.d.getElementById('register').classList.contains('active'), 'chuyển sang tab đăng ký');
    submit('registerForm');
    H.eq(pg.d.querySelectorAll('#registerForm .cb-field-error').length, 6, 'có đủ 6 chỗ hiển thị lỗi');
    H.eq([...pg.d.querySelectorAll('#registerForm .cb-field-error')].filter(e => e.textContent.length > 0).length, 5, 'đăng ký trống: 5 trường báo lỗi (xác nhận trống trùng với mật khẩu trống nên không báo thêm)');
    // trùng tên đăng nhập
    const fill = (o) => Object.keys(o).forEach(k => { pg.d.querySelector('#registerForm [name=' + k + ']').value = o[k]; });
    fill({ fullName: 'Người Mới', username: 'guest1', email: 'moi@example.com', phone: '0911222333', password: 'abcdef', confirm: 'abcdef' });
    submit('registerForm');
    H.ok(/đã được sử dụng/.test(pg.d.querySelector('#registerForm [data-error-for=username]').textContent), 'trùng tên đăng nhập: báo lỗi');
    fill({ username: 'nguoimoi', confirm: 'khac' });
    submit('registerForm');
    H.ok(/không khớp/.test(pg.d.querySelector('#registerForm [data-error-for=confirm]').textContent), 'xác nhận mật khẩu không khớp: báo lỗi');
    fill({ confirm: 'abcdef' });
    submit('registerForm');
    H.eq(pg.w.CB.auth.customers().filter(u => u.username === 'nguoimoi').length, 1, 'đăng ký thành công: tài khoản được lưu');
    H.ok(pg.d.getElementById('login').classList.contains('active') && pg.d.getElementById('login-identifier').value === 'nguoimoi', 'sau đăng ký: về tab đăng nhập, điền sẵn tên đăng nhập');
    // đăng nhập thành công -> redirect
    pg.d.getElementById('login-password').value = 'abcdef';
    submit('loginForm');
    H.ok(pg.w.CB.auth.current() && pg.w.CB.auth.current().username === 'nguoimoi', 'đăng nhập tài khoản mới tạo thành công');
    // đã đăng nhập: hiện lựa chọn
    const st = pg.snap();
    pg = await H.visit('register.html?redirect=https://evil.com', st);
    H.ok(!pg.d.getElementById('alreadyLoggedIn').hidden && pg.d.getElementById('authForms').hidden, 'đã đăng nhập: ẩn form, hiện lựa chọn');
    H.eq(pg.d.getElementById('continueLink').getAttribute('href'), 'index.html', 'chặn redirect ra ngoài, về trang chủ');
    H.eq(pg.errors, [], 'không lỗi JS');
    H.stop();
    process.exit(H.summary() ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
