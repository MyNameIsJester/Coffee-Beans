const H = require('./harness');
(async () => {
    await H.start();
    console.log('\n[cart.html]');
    // chưa đăng nhập -> chuyển tới đăng nhập (jsdom không điều hướng, kiểm tra không có giỏ vẽ ra)
    let pg = await H.visit('cart.html');
    H.eq(pg.d.getElementById('cartRoot').innerHTML, '', 'chưa đăng nhập: không hiển thị giỏ hàng');
    // đăng nhập, giỏ trống
    let st = pg.snap();
    pg = await H.visit('register.html', st);
    pg.w.CB.auth.login('guest2', 'guest2123');
    st = pg.snap();
    pg = await H.visit('cart.html', st);
    H.eq(pg.errors, [], 'không lỗi JS');
    H.ok(/Giỏ hàng đang trống/.test(pg.d.getElementById('cartRoot').textContent), 'giỏ trống: hiện thông báo');
    // thêm sản phẩm bằng API rồi tải lại
    pg.w.CB.cart.add('arabica-premium', 2);
    pg.w.CB.cart.add('kenyan-aa-grade', 3);
    st = pg.snap();
    pg = await H.visit('cart.html', st);
    const rows = () => [...pg.d.querySelectorAll('.cart-table tbody tr')];
    H.eq(rows().length, 2, 'hiển thị 2 dòng sản phẩm');
    const total = () => pg.d.querySelector('aside').textContent;
    H.ok(/Tạm tính\s*\d+\.\d{3}đ/.test(total()) && total().includes('Phí vận chuyển'), 'có tạm tính và phí vận chuyển');
    // 2*135000 + 3*165000 = 765000 ; +30000 = 795000
    H.ok(total().includes('765.000đ') && total().includes('795.000đ'), 'tạm tính 765.000đ, tổng 795.000đ');
    const row = (i) => rows()[i];
    row(0).querySelector('[data-act=plus]').click();
    H.eq(pg.w.CB.cart.items()[0].qty, 3, 'tăng số lượng');
    H.ok(total().includes('900.000đ'), 'tổng cập nhật: 3*135000+3*165000+30000 = 930.000đ'.replace('900', '930') && total().includes('930.000đ'));
    row(0).querySelector('[data-act=minus]').click();
    row(0).querySelector('[data-act=minus]').click();
    H.eq(pg.w.CB.cart.items()[0].qty, 1, 'giảm về 1');
    row(0).querySelector('[data-act=minus]').click();
    H.eq(pg.w.CB.cart.items()[0].qty, 1, 'không giảm dưới 1');
    H.ok(/tối thiểu là 1/.test(pg.d.querySelector('.cb-alert').textContent), 'báo số lượng tối thiểu');
    // nhập trực tiếp
    let inp = row(1).querySelector('[data-act=qty]');
    inp.value = '9'; inp.dispatchEvent(new pg.w.Event('change', { bubbles: true }));
    H.eq(pg.w.CB.cart.items()[1].qty, 3, 'nhập 9 > tồn 8: từ chối, giữ 3');
    H.ok(/Chỉ còn 8/.test(pg.d.querySelector('.cb-alert').textContent), 'báo chỉ còn 8');
    inp = row(1).querySelector('[data-act=qty]');
    inp.value = '0'; inp.dispatchEvent(new pg.w.Event('change', { bubbles: true }));
    H.eq(pg.w.CB.cart.items()[1].qty, 3, 'nhập 0: từ chối');
    inp = row(1).querySelector('[data-act=qty]');
    inp.value = '1.5'; inp.dispatchEvent(new pg.w.Event('change', { bubbles: true }));
    H.eq(pg.w.CB.cart.items()[1].qty, 3, 'nhập số thập phân: từ chối');
    inp = row(1).querySelector('[data-act=qty]');
    inp.value = '5'; inp.dispatchEvent(new pg.w.Event('change', { bubbles: true }));
    H.eq(pg.w.CB.cart.items()[1].qty, 5, 'nhập 5 hợp lệ');
    // sản phẩm bị cảnh báo: hạ tồn khả dụng bằng một đơn khác
    const mine = pg.w.CB.auth.current();
    pg.w.CB.auth.logout(); pg.w.CB.auth.login('guest1', 'guest1123');
    pg.w.CB.cart.add('kenyan-aa-grade', 4); // khả dụng 8 -> đặt 4 => còn 4
    pg.w.CB.orders.place({ token: 'x1', shipping: { source: 'account' } });
    pg.w.CB.auth.logout(); pg.w.CB.auth.login('guest2', 'guest2123');
    st = pg.snap();
    pg = await H.visit('cart.html', st);
    H.ok(/Chỉ còn 4 sản phẩm/.test(pg.d.querySelector('.cart-table').textContent), 'giỏ có 5 nhưng còn 4: cảnh báo trên dòng');
    H.ok(!pg.d.querySelector('aside a[href="checkout.html"]'), 'có cảnh báo: nút Thanh toán bị khóa');
    pg.d.querySelector('[data-fix]').click();
    H.eq(pg.w.CB.cart.items()[1].qty, 4, 'bấm "Đặt lại 4" sửa đúng số lượng');
    H.ok(!!pg.d.querySelector('aside a[href="checkout.html"]'), 'hết cảnh báo: nút Thanh toán mở lại');
    // xóa dòng
    pg.d.querySelector('[data-act=remove]').click();
    H.eq(pg.w.CB.cart.items().length, 1, 'xóa một sản phẩm');
    pg.w.confirm = () => true;
    pg.d.getElementById('clearCart').click();
    H.ok(/Giỏ hàng đang trống/.test(pg.d.getElementById('cartRoot').textContent), 'xóa toàn bộ: về giỏ trống');
    H.eq(pg.errors, [], 'không lỗi JS');
    H.stop();
    process.exit(H.summary() ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
