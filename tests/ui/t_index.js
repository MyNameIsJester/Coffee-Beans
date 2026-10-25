const H = require('./harness');
(async () => {
    await H.start();
    console.log('\n[index.html]');
    let pg = await H.visit('index.html');
    H.eq(pg.errors, [], 'không lỗi JS khi tải trang');
    const cards = [...pg.d.querySelectorAll('#featuredGrid .card')];
    H.eq(cards.length, 3, '3 thẻ danh mục (mỗi loại 1 sản phẩm)');
    H.eq(cards.map(c => c.querySelector('.price').textContent), ['135.000đ', '129.000đ', '265.000đ'], 'giá khớp giá cũ (135.000đ, 129.000đ, 265.000đ)');
    H.ok(!pg.d.querySelector('.strike'), 'đã bỏ giá gạch ngang bịa');
    H.eq(cards.map(c => c.querySelector('h4 a').getAttribute('href')), ['product-detail.html?id=arabica-premium', 'product-detail.html?id=robusta-bold', 'product-detail.html?id=signature-blend'], 'liên kết chi tiết có id');
    H.eq(cards.map(c => c.querySelector('a').getAttribute('href')), ['products.html?cat=arabica', 'products.html?cat=robusta', 'products.html?cat=blend'], 'ảnh dẫn tới trang loại');
    H.ok(pg.d.querySelector('a[href="register.html?tab=login&redirect=index.html"]') || pg.d.querySelector('.account-link'), 'chưa đăng nhập: hiện link đăng nhập');
    H.ok(pg.d.querySelector('a[href="#ve-chung-toi"]'), 'liên kết Giới thiệu trỏ neo trong trang chủ');
    // slider
    pg.d.querySelectorAll('.hero-dot')[2].click();
    H.eq(pg.d.querySelector('.hero-slider').style.transform, 'translateX(-200%)', 'bấm chấm 3: slider dịch -200%');
    H.ok(pg.d.querySelectorAll('.hero-dot')[2].classList.contains('active'), 'chấm 3 được đánh dấu active');
    pg.d.dispatchEvent(new pg.w.KeyboardEvent('keydown', { key: 'ArrowRight' }));
    H.eq(pg.d.querySelector('.hero-slider').style.transform, 'translateX(-300%)', 'phím → chuyển slide kế');
    // thêm giỏ: chưa đăng nhập
    pg.d.querySelector('button.add').click();
    H.eq(pg.w.CB.cart.count(), 0, 'chưa đăng nhập: không thêm vào giỏ');
    // đã đăng nhập
    pg.w.CB.auth.login('guest1', 'guest1123');
    pg = await H.visit('index.html', pg.snap());
    H.eq(pg.d.getElementById('accountText').textContent, 'Chào Khách hàng 1', 'đăng nhập: header hiện tên tài khoản');
    H.ok(!pg.d.querySelector('.account-link'), 'đăng nhập: không còn nút Đăng nhập/Đăng ký');
    pg.d.querySelector('button.add').click();
    H.eq(pg.w.CB.cart.count(), 1, 'đăng nhập: thêm vào giỏ');
    H.eq(pg.d.getElementById('cart-badge').textContent, '1', 'badge giỏ = 1');
    // đăng xuất qua header
    pg.d.getElementById('logoutLink').click();
    H.eq(pg.w.CB.auth.current(), null, 'đăng xuất từ menu tài khoản');
    // ẩn sản phẩm khỏi trang chủ
    pg.w.CB.catalog.setProductHidden('arabica-premium', true);
    pg = await H.visit('index.html', pg.snap());
    H.eq(pg.d.querySelector('#featuredGrid .card .chip').textContent + ':' + pg.d.querySelector('#featuredGrid .card h4').textContent.trim(), 'Arabica:Ethiopia Yirgacheffe 300g', 'ẩn sản phẩm: trang chủ lấy sản phẩm kế tiếp');
    H.eq(pg.errors, [], 'không lỗi JS');
    H.stop();
    process.exit(H.summary() ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
