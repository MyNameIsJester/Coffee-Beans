/* Trang chi tiết sản phẩm */
(function () {
    'use strict';
    var U = CB.util;
    var root = document.getElementById('productRoot');
    var id = CB.ui.param('id') || CB.ui.param('product');
    var product = id ? CB.catalog.productById(id) : null;
    var v = product ? CB.catalog.view(product) : null;

    if (!v || !v.visible) {
        document.title = 'Không tìm thấy sản phẩm - Cà Phê Đậm Đà';
        root.innerHTML =
            '<div class="cb-empty"><h2 style="margin-bottom:12px;">Không tìm thấy sản phẩm</h2>' +
            '<p>Sản phẩm không tồn tại hoặc đã ngừng bán.</p><p style="margin-top:16px;"><a href="products.html">← Quay lại danh sách sản phẩm</a></p></div>';
        return;
    }

    document.title = v.name + ' - Cà Phê Đậm Đà';

    function stockHtml(x) {
        if (x.price === null)
            return '<div class="stock-status out-of-stock"><i class="fas fa-times-circle"></i><span>Chưa có giá bán</span></div>';
        if (x.available <= 0)
            return '<div class="stock-status out-of-stock"><i class="fas fa-times-circle"></i><span>Hết hàng</span></div>';
        if (x.available <= CB.inventory.threshold())
            return '<div class="stock-status low-stock"><i class="fas fa-exclamation-circle"></i><span>Sắp hết hàng (còn ' + x.available + ' sản phẩm)</span></div>';
        return '<div class="stock-status in-stock"><i class="fas fa-check-circle"></i><span>Còn hàng (' + x.available + ' sản phẩm)</span></div>';
    }

    function row(label, value) {
        if (!value) return '';
        return '<div class="detail-row"><span class="detail-label">' + label + '</span><span class="detail-value">' + U.esc(value) + '</span></div>';
    }

    function related() {
        var all = CB.catalog.products().filter(function (p) { return p.id !== v.id; }).map(CB.catalog.view);
        var same = all.filter(function (x) { return x.categoryId === v.categoryId; });
        var others = all.filter(function (x) { return x.categoryId !== v.categoryId; });
        return same.concat(others).slice(0, 3);
    }

    function render() {
        v = CB.catalog.view(product);
        var canBuy = v.price !== null && v.available > 0;
        var notes = (v.notes || []).map(function (n) { return '<li>' + U.esc(n) + '</li>'; }).join('');
        var rel = related().map(function (x) {
            return '<div class="product-card"><img class="product-card-image" src="' + U.esc(x.image) + '" alt="' + U.esc(x.name) + '" />' +
                '<div class="product-card-body"><div class="product-card-category">' + U.esc(x.categoryName) + '</div>' +
                '<div class="product-card-name">' + U.esc(x.name) + '</div>' +
                '<div class="product-card-price">' + (x.price === null ? '—' : U.fmtVND(x.price)) + '</div>' +
                '<a href="product-detail.html?id=' + encodeURIComponent(x.id) + '"><button class="product-card-btn" type="button">Xem chi tiết</button></a></div></div>';
        }).join('');

        root.innerHTML =
            '<div style="margin-bottom:2rem;color:#666;font-size:0.875rem;">' +
            '<a href="index.html" style="color:var(--coffee);text-decoration:none;">Trang chủ</a><span style="margin:0 0.5rem;">›</span>' +
            '<a href="products.html" style="color:var(--coffee);text-decoration:none;">Sản phẩm</a><span style="margin:0 0.5rem;">›</span>' +
            '<a href="products.html?cat=' + encodeURIComponent(v.category.slug) + '" style="color:var(--coffee);text-decoration:none;">' + U.esc(v.categoryName) + '</a><span style="margin:0 0.5rem;">›</span>' +
            '<span>' + U.esc(v.name) + '</span></div>' +
            '<div class="product-container">' +
            '<div class="product-gallery"><div class="product-gallery-main"><img id="mainImage" src="' + U.esc(v.image) + '" alt="' + U.esc(v.name) + '" /></div></div>' +
            '<div class="product-info"><div class="product-header">' +
            '<span class="product-category">' + U.esc(v.categoryName) + '</span>' +
            '<h1 class="product-title">' + U.esc(v.name) + '</h1>' +
            '<div class="product-price-section"><span class="product-price">' + (v.price === null ? 'Chưa có giá bán' : U.fmtVND(v.price)) + '</span></div>' +
            stockHtml(v) + '</div>' +
            (v.description ? '<div class="product-description"><p>' + U.esc(v.description) + '</p></div>' : '') +
            '<div class="product-details">' +
            row('Mã sản phẩm:', v.code) + row('Loại cà phê:', v.categoryName) + row('Khối lượng:', v.weight) +
            row('Mức độ rang:', v.roast) + row('Xuất xứ:', v.origin) + '</div>' +
            (notes ? '<div class="product-benefits"><div class="benefits-title">Đặc điểm nổi bật</div><ul class="benefits-list">' + notes + '</ul></div>' : '') +
            '<div class="quantity-section"><div class="quantity-control">' +
            '<button class="quantity-btn" type="button" id="qtyMinus" aria-label="Giảm số lượng"' + (canBuy ? '' : ' disabled') + '>−</button>' +
            '<input type="number" id="quantity" class="quantity-input" value="1" min="1" max="' + Math.max(1, v.available) + '" aria-label="Số lượng"' + (canBuy ? '' : ' disabled') + ' />' +
            '<button class="quantity-btn" type="button" id="qtyPlus" aria-label="Tăng số lượng"' + (canBuy ? '' : ' disabled') + '>+</button></div>' +
            '<div class="action-buttons" style="flex:1;display:flex;gap:1rem;">' +
            '<button class="add-to-cart-btn" id="addToCart" type="button"' + (canBuy ? '' : ' disabled') + '><i class="fas fa-shopping-cart"></i> ' + (canBuy ? 'Thêm vào giỏ' : v.price === null ? 'Chưa có giá' : 'Hết hàng') + '</button>' +
            '</div></div><p id="qtyError" class="cb-field-error" role="alert"></p></div></div>' +
            (rel ? '<div class="related-products"><h2 class="related-title">Sản phẩm liên quan</h2><div class="related-grid">' + rel + '</div></div>' : '');

        wire();
    }

    function wire() {
        var qty = document.getElementById('quantity');
        var err = document.getElementById('qtyError');
        function clamp() {
            var n = parseInt(qty.value, 10);
            if (isNaN(n) || n < 1) n = 1;
            if (n > v.available) { n = Math.max(1, v.available); err.textContent = 'Chỉ còn ' + v.available + ' sản phẩm trong kho.'; }
            else err.textContent = '';
            qty.value = n;
            return n;
        }
        document.getElementById('qtyMinus').addEventListener('click', function () { qty.value = (parseInt(qty.value, 10) || 1) - 1; clamp(); });
        document.getElementById('qtyPlus').addEventListener('click', function () { qty.value = (parseInt(qty.value, 10) || 0) + 1; clamp(); });
        qty.addEventListener('change', clamp);
        document.getElementById('addToCart').addEventListener('click', function () {
            var n = clamp();
            var r = CB.cart.add(v.id, n);
            if (r.ok) {
                CB.ui.toast('Đã thêm ' + n + ' sản phẩm vào giỏ hàng.');
                CB.ui.refreshBadge();
                render();
            } else if (r.code === 'LOGIN_REQUIRED') {
                location.href = CB.auth.loginUrl();
            } else {
                err.textContent = r.error;
                CB.ui.toast(r.error, 'error');
            }
        });
    }

    render();
})();
