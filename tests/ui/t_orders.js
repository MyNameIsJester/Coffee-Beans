const H = require('./harness');
(async () => {
    await H.start();
    console.log('\n[checkout -> confirmation -> history]');
    let pg = await H.visit('register.html');
    pg.w.CB.auth.login('guest2', 'guest2123');
    pg.w.CB.cart.add('arabica-premium', 2);
    pg.w.CB.cart.add('robusta-bold', 1);
    let st = pg.snap();
    pg = await H.visit('checkout.html', st);
    H.eq(pg.errors, [], 'checkout: không lỗi JS');
    const $ = (id) => pg.d.getElementById(id);
    H.ok(!$('addrAccount').disabled && $('addrAccount').checked, 'tài khoản có địa chỉ: mặc định chọn địa chỉ tài khoản');
    H.ok(/Hoàng Diệu/.test($('accountAddrBox').textContent), 'hiển thị địa chỉ tài khoản guest2');
    H.ok($('newAddrFields').hidden, 'các ô địa chỉ mới đang ẩn');
    H.ok($('pay-cod').checked, 'mặc định chọn thanh toán tiền mặt');
    H.eq(pg.d.querySelectorAll('input[name=paymentMethod]').length, 3, 'có 3 phương thức: tiền mặt, chuyển khoản, trực tuyến');
    H.ok(/270\.000đ/.test(pg.d.querySelector('.order-summary').textContent) && /399\.000đ/.test(pg.d.querySelector('.order-summary').textContent) && /429\.000đ/.test(pg.d.querySelector('.order-summary').textContent), 'tạm tính 399.000đ + 30.000đ = 429.000đ');
    // chọn địa chỉ khác
    $('addrNew').checked = true; $('addrNew').dispatchEvent(new pg.w.Event('change', { bubbles: true }));
    H.ok(!$('newAddrFields').hidden, 'chọn địa chỉ khác: hiện ô nhập');
    $('placeOrder').click();
    H.eq(pg.w.CB.orders.all().length, 5, 'địa chỉ mới để trống: không tạo đơn');
    H.ok(!$('formAlert').hidden, 'hiện thông báo lỗi chung');
    H.eq([...pg.d.querySelectorAll('#newAddrFields .cb-field-error')].filter(e => e.textContent).length, 4, 'báo lỗi 4 ô còn trống (tỉnh, huyện, xã, số nhà)');
    $('phone').value = '123'; $('placeOrder').click();
    H.ok(/Số điện thoại người nhận không hợp lệ/.test(pg.d.querySelector('[data-error-for=phone]').textContent), 'SĐT sai: báo lỗi');
    $('phone').value = '0912345678'; $('province').value = 'Đà Nẵng'; $('district').value = 'Hải Châu'; $('ward').value = 'Thanh Bình'; $('detail').value = '5 Lê Duẩn';
    $('pay-bank').checked = true; $('pay-bank').dispatchEvent(new pg.w.Event('change', { bubbles: true }));
    H.ok(pg.d.querySelector('[data-payment=bank]').classList.contains('selected'), 'chọn chuyển khoản: đánh dấu selected');
    $('note').value = 'Giao giờ hành chính';
    $('placeOrder').click();
    $('placeOrder').click(); // bấm lần hai
    const orders = pg.w.CB.orders.all();
    H.eq(orders.length, 6, 'đặt thành công đúng 1 đơn dù bấm 2 lần');
    const o = orders[orders.length - 1];
    H.eq([o.shipping.source, o.shipping.province, o.payment.method, o.total, o.status], ['new', 'Đà Nẵng', 'bank', 429000, 'Mới đặt'], 'nội dung đơn đúng');
    H.eq(pg.w.CB.cart.items().length, 0, 'giỏ hàng được xóa sau khi đặt');
    // xác nhận
    st = pg.snap();
    pg = await H.visit('order-confirmation.html?new=1&order=' + o.id, st);
    H.eq(pg.errors, [], 'confirmation: không lỗi JS');
    const txt = pg.d.getElementById('confirmRoot').textContent;
    H.ok(/Đặt hàng thành công/.test(txt) && txt.includes(o.code), 'hiển thị thành công và mã đơn');
    H.ok(txt.includes('Đà Nẵng') && txt.includes('429.000đ') && txt.includes('Chuyển khoản ngân hàng') && /Số tài khoản/.test(txt), 'hiển thị địa chỉ, tổng tiền, hướng dẫn chuyển khoản');
    H.ok(/Mới đặt/.test(txt), 'trạng thái Mới đặt');
    // xem chi tiết từ lịch sử (không có new=1)
    pg = await H.visit('order-confirmation.html?order=' + o.id, st);
    H.ok(/Chi tiết đơn hàng/.test(pg.d.getElementById('confirmRoot').textContent) && !/Đặt hàng thành công/.test(pg.d.getElementById('confirmRoot').textContent), 'xem lại đơn cũ: không hiện "Đặt hàng thành công"');
    // đơn của người khác
    const other = pg.w.CB.orders.all().filter(x => x.customer.username === 'guest1')[0];
    pg = await H.visit('order-confirmation.html?order=' + other.id, st);
    H.ok(/Không tìm thấy đơn hàng/.test(pg.d.getElementById('confirmRoot').textContent), 'không xem được đơn của tài khoản khác');
    // lịch sử guest2
    pg = await H.visit('order-history.html', st);
    H.eq(pg.errors, [], 'history: không lỗi JS');
    H.eq(pg.d.querySelectorAll('.order-card').length, 2, 'guest2 thấy đúng 2 đơn (1 mẫu đã giao + 1 mới)');
    H.ok(/Đã giao/.test(pg.d.getElementById('ordersRoot').textContent) && /Ngày giao/.test(pg.d.getElementById('ordersRoot').textContent), 'đơn đã giao hiển thị kèm Ngày giao');
    H.ok(![...pg.d.querySelectorAll('.order-card')].some(c => /guest1|Khách hàng 1/.test(c.textContent)), 'không lẫn đơn của guest1');
    H.ok([...pg.d.querySelectorAll('.btn-view')].every(a => /order-confirmation\.html\?order=dh-/.test(a.getAttribute('href'))), 'nút Xem chi tiết trỏ đúng đơn');
    // guest3: chưa có đơn, không có địa chỉ tài khoản
    let g3 = await H.visit('register.html');
    g3.w.CB.auth.login('guest3', 'guest3123');
    g3.w.CB.cart.add('vietnam-robusta', 1);
    pg = await H.visit('order-history.html', g3.snap());
    H.ok(/chưa có đơn hàng/.test(pg.d.getElementById('ordersRoot').textContent), 'guest3: lịch sử trống có thông báo');
    pg = await H.visit('checkout.html', g3.snap());
    H.ok(pg.d.getElementById('addrAccount').disabled && pg.d.getElementById('addrNew').checked && !pg.d.getElementById('newAddrFields').hidden, 'tài khoản không có địa chỉ: tự chọn địa chỉ mới');
    // giỏ trống
    pg = await H.visit('register.html'); pg.w.CB.auth.login('guest3', 'guest3123');
    pg = await H.visit('checkout.html', pg.snap());
    H.ok(/Giỏ hàng đang trống/.test(pg.d.getElementById('checkoutRoot').textContent), 'giỏ trống: không cho thanh toán');
    H.eq(pg.errors, [], 'không lỗi JS');
    H.stop();
    process.exit(H.summary() ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
