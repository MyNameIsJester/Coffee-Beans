const H = require('./harness');
(async () => {
    await H.start();
    console.log('\n[product-detail.html]');
    let pg = await H.visit('product-detail.html?id=ethiopia-yirgacheffe');
    H.eq(pg.errors, [], 'không lỗi JS');
    H.eq(pg.d.querySelector('.product-title').textContent, 'Ethiopia Yirgacheffe 300g', 'đúng tên sản phẩm theo id');
    H.eq(pg.d.querySelector('.product-price').textContent, '145.000đ', 'đúng giá (giữ nguyên 145.000đ)');
    H.ok(/Còn hàng \(59 sản phẩm\)/.test(pg.d.querySelector('.stock-status').textContent), 'số lượng còn bán = 59 (tồn 60, giữ 1 cho đơn đang xử lý)');
    H.ok(/Yirgacheffe, Ethiopia/.test(pg.d.querySelector('.product-details').textContent), 'xuất xứ theo dữ liệu');
    H.ok(!pg.d.querySelector('.wishlist-btn') && !pg.d.querySelector('.product-original-price') && !pg.d.querySelector('.rating-count'), 'đã bỏ đánh giá/giá gốc/yêu thích giả');
    H.eq(pg.d.querySelectorAll('.related-grid .product-card').length, 3, '3 sản phẩm liên quan');
    H.ok(![...pg.d.querySelectorAll('.related-grid .product-card-name')].some(e => /Ethiopia/.test(e.textContent)), 'liên quan không chứa chính nó');
    H.ok([...pg.d.querySelectorAll('.related-grid a')].every(a => /product-detail\.html\?id=/.test(a.getAttribute('href'))), 'liên kết sản phẩm liên quan có id');
    // liên kết cũ ?product=
    pg = await H.visit('product-detail.html?product=robusta-bold');
    H.eq(pg.d.querySelector('.product-title').textContent, 'Robusta Bold 500g', '?product= (link cũ) vẫn hoạt động');
    // không tồn tại
    pg = await H.visit('product-detail.html?id=khong-co');
    H.ok(/Không tìm thấy sản phẩm/.test(pg.d.getElementById('productRoot').textContent), 'id sai: hiện trang không tìm thấy');
    pg = await H.visit('product-detail.html');
    H.ok(/Không tìm thấy sản phẩm/.test(pg.d.getElementById('productRoot').textContent), 'thiếu id: hiện trang không tìm thấy');
    // sắp hết hàng
    pg = await H.visit('product-detail.html?id=kenyan-aa-grade');
    H.ok(/Sắp hết hàng \(còn 8/.test(pg.d.querySelector('.stock-status').textContent), 'Kenyan: sắp hết hàng còn 8');
    // số lượng + thêm giỏ
    const q = () => pg.d.getElementById('quantity');
    pg.d.getElementById('qtyMinus').click();
    H.eq(q().value, '1', 'không giảm dưới 1');
    for (let i = 0; i < 12; i++) pg.d.getElementById('qtyPlus').click();
    H.eq(q().value, '8', 'không tăng quá tồn khả dụng (8)');
    H.ok(/Chỉ còn 8/.test(pg.d.getElementById('qtyError').textContent), 'báo chỉ còn 8');
    q().value = 'abc'; q().dispatchEvent(new pg.w.Event('change'));
    H.eq(q().value, '1', 'giá trị không hợp lệ trở về 1');
    // chưa đăng nhập: giỏ hàng yêu cầu đăng nhập (không tạo dữ liệu giỏ)
    pg.d.getElementById('addToCart').click();
    H.eq(pg.w.CB.cart.count(), 0, 'chưa đăng nhập: không thêm được vào giỏ');
    // đăng nhập rồi thêm
    pg.w.CB.auth.login('guest1', 'guest1123');
    q().value = '3'; q().dispatchEvent(new pg.w.Event('change'));
    pg.d.getElementById('addToCart').click();
    H.eq(pg.w.CB.cart.count(), 3, 'thêm 3 vào giỏ');
    q().value = '6'; q().dispatchEvent(new pg.w.Event('change'));
    pg.d.getElementById('addToCart').click();
    H.eq(pg.w.CB.cart.count(), 3, 'thêm 6 nữa vượt tồn (3+6>8): bị từ chối, giỏ giữ nguyên 3');
    H.ok(/Chỉ còn 8/.test(pg.d.getElementById('qtyError').textContent), 'hiện lý do từ chối');
    H.eq(pg.errors, [], 'không lỗi JS');
    H.stop();
    process.exit(H.summary() ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
