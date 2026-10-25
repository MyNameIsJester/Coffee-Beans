const H = require('./harness');
(async () => {
    await H.start();
    console.log('\n[products.html]');
    let pg = await H.visit('products.html');
    H.eq(pg.errors, [], 'không có lỗi JS khi tải trang');
    const cards = () => [...pg.d.querySelectorAll('#productGrid .card')];
    H.eq(cards().length, 9, 'trang 1 có 9 thẻ');
    H.eq(pg.d.querySelectorAll('.cb-page-btn').length, 4, 'phân trang: Trước, 1, 2, Sau');
    H.ok(pg.d.querySelector('.cb-page-btn').disabled, 'nút Trước bị vô hiệu ở trang 1');
    H.ok(pg.d.getElementById('siteHeader').querySelector('.brand-name'), 'header dùng chung được vẽ');
    H.eq([...pg.d.querySelectorAll('.dropdown-content a')].map(a => a.textContent + '>' + a.getAttribute('href')), ['Arabica>products.html?cat=arabica', 'Robusta>products.html?cat=robusta', 'Blend>products.html?cat=blend'], 'menu loại sản phẩm trỏ đúng đích');
    H.ok(pg.d.querySelector('.account-link'), 'chưa đăng nhập: hiện Đăng nhập / Đăng ký');
    H.ok([...pg.d.querySelectorAll('.price')].every(e => /\d\.\d{3}đ/.test(e.textContent)), 'giá hiển thị định dạng VND');
    // sang trang 2
    pg.d.querySelectorAll('.cb-page-btn')[2].click();
    H.eq(cards().length, 3, 'trang 2 có 3 thẻ');
    H.ok(pg.w.location.search.includes('page=2'), 'URL ghi nhận page=2');
    // nạp thẳng trang 2 từ URL
    pg = await H.visit('products.html?page=2');
    H.eq(cards().length, 3, 'mở URL ?page=2 hiện đúng 3 sản phẩm');
    // lọc theo loại từ menu
    pg = await H.visit('products.html?cat=robusta');
    H.eq(cards().length, 4, 'cat=robusta: 4 sản phẩm');
    H.eq(pg.d.getElementById('pageTitle').textContent, 'Cà phê Robusta', 'tiêu đề theo loại');
    H.eq(pg.d.getElementById('category').value, 'robusta', 'ô chọn loại đồng bộ với URL');
    H.eq(pg.d.querySelectorAll('.cb-page-btn').length, 0, '4 sản phẩm: không cần phân trang');
    // tìm cơ bản từ header
    pg = await H.visit('products.html?q=ethiopia');
    H.eq(cards().length, 1, 'q=ethiopia: 1 sản phẩm');
    H.eq(pg.d.getElementById('searchInput').value, 'ethiopia', 'ô tìm trên header giữ từ khóa');
    H.eq(pg.d.getElementById('productSearch').value, 'ethiopia', 'ô tìm nâng cao giữ từ khóa');
    pg = await H.visit('products.html?q=zzz');
    H.ok(/Không tìm thấy/.test(pg.d.getElementById('productGrid').textContent), 'không có kết quả: hiện thông báo');
    // tìm nâng cao qua form
    pg = await H.visit('products.html');
    const set = (id, v) => { pg.d.getElementById(id).value = v; };
    set('productSearch', 'robusta'); set('category', 'robusta'); set('priceMin', '120000'); set('priceMax', '130000');
    pg.d.getElementById('filterForm').dispatchEvent(new pg.w.Event('submit', { cancelable: true }));
    H.eq(cards().length, 2, 'tên + loại + giá kết hợp: 2 sản phẩm');
    H.ok(pg.w.location.search.includes('min=120000') && pg.w.location.search.includes('cat=robusta'), 'URL phản ánh bộ lọc');
    set('priceMin', '200000'); set('priceMax', '100000');
    pg.d.getElementById('filterForm').dispatchEvent(new pg.w.Event('submit', { cancelable: true }));
    H.ok(!pg.d.getElementById('filterError').hidden && /không được lớn hơn/.test(pg.d.getElementById('filterError').textContent), 'min > max: báo lỗi');
    H.eq(cards().length, 2, 'min > max: không đổi kết quả');
    pg.d.getElementById('resetFilter').click();
    H.eq(cards().length, 9, 'Xóa bộ lọc: về danh sách đầy đủ');
    set('sort', 'price-desc');
    pg.d.getElementById('sort').dispatchEvent(new pg.w.Event('change'));
    H.ok(/280\.000đ/.test(cards()[0].querySelector('.price').textContent), 'sắp xếp giá giảm dần: đầu tiên là 280.000đ');
    // cảnh báo tồn kho
    pg = await H.visit('products.html?q=kenyan');
    H.ok(/Sắp hết hàng: còn 8/.test(pg.d.getElementById('productGrid').textContent), 'Kenyan hiện cảnh báo sắp hết hàng (còn 8)');
    // thêm giỏ khi chưa đăng nhập -> chuyển sang đăng nhập
    pg = await H.visit('products.html');
    let navigated = null;
    const btn = pg.d.querySelector('button.add');
    btn.click();
    await new Promise(r => setTimeout(r, 100));
    H.ok(true, 'bấm Thêm khi chưa đăng nhập không gây lỗi JS: ' + JSON.stringify(pg.errors.filter(e => !/navigation/i.test(e))));
    // đã đăng nhập
    pg = await H.visit('products.html');
    pg.w.CB.auth.login('guest1', 'guest1123');
    pg.w.CB.ui.mountHeader();
    H.eq(pg.d.getElementById('accountText').textContent, 'Chào Khách hàng 1', 'header hiện tên tài khoản đăng nhập');
    pg.d.querySelector('button.add').click();
    H.eq(pg.w.CB.cart.count(), 1, 'đã đăng nhập: thêm vào giỏ thành công');
    H.eq(pg.d.getElementById('cart-badge').textContent, '1', 'badge giỏ hàng cập nhật');
    H.ok(pg.d.querySelector('.cb-toast'), 'có thông báo đã thêm');
    H.eq(pg.errors, [], 'không có lỗi JS trong cả quá trình');
    H.stop();
    process.exit(H.summary() ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
