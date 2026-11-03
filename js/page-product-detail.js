/* CoffeeBeans - View: Product Detail (Chi tiết sản phẩm)
   File: js/page-product-detail.js
*/
(function (g) {
    'use strict';
    var CB = (g.CB = g.CB || {});
    var U = CB.util;
    CB.views = CB.views || {};

    CB.views.product = {
        mount: function (root, params) {
            var id = (params && (params.id || params.product)) || CB.ui.param('id') || CB.ui.param('product');
            var product = id ? CB.catalog.productById(id) : null;
            var v = product ? CB.catalog.view(product) : null;

            if (!v || !v.visible) {
                g.document.title = 'Không tìm thấy sản phẩm - Cà Phê Đậm Đà';
                root.innerHTML =
                    '<div class="container" style="padding:60px 20px;">' +
                    '<div class="cb-empty">' +
                    '  <h2 style="margin-bottom:12px;color:var(--coffee-900);">Không tìm thấy sản phẩm</h2>' +
                    '  <p style="color:var(--muted);margin-bottom:20px;">Sản phẩm không tồn tại hoặc đã ngừng kinh doanh.</p>' +
                    '  <a href="index.html#/products" class="btn btn-primary">← Quay lại danh sách sản phẩm</a>' +
                    '</div></div>';
                return;
            }

            g.document.title = v.name + ' - Cà Phê Đậm Đà';

            var canBuy = v.price !== null && v.available > 0;
            var cat = CB.catalog.categoryById(v.categoryId);
            var catName = cat ? cat.name : 'Cà phê';
            var catSlug = cat ? cat.slug : '';

            // Related products
            var allProds = CB.catalog.products().filter(function (p) { return p.id !== v.id; }).map(CB.catalog.view);
            var sameProds = allProds.filter(function (x) { return x.categoryId === v.categoryId; });
            var otherProds = allProds.filter(function (x) { return x.categoryId !== v.categoryId; });
            var related = sameProds.concat(otherProds).slice(0, 3);

            var relatedHtml = related.map(function (rel) {
                return '<div class="card" style="padding:12px;">' +
                    '<a href="index.html#/product?id=' + encodeURIComponent(rel.id) + '">' +
                    '<img src="' + U.esc(rel.image) + '" alt="' + U.esc(rel.name) + '" style="height:140px;width:100%;object-fit:cover;border-radius:6px;" />' +
                    '</a>' +
                    '<h4 style="margin:8px 0;font-size:14px;"><a href="index.html#/product?id=' + encodeURIComponent(rel.id) + '">' + U.esc(rel.name) + '</a></h4>' +
                    '<span style="color:var(--coffee);font-weight:700;">' + (rel.price === null ? '—' : U.fmtVND(rel.price)) + '</span>' +
                    '</div>';
            }).join('');

            root.innerHTML =
                '<div class="container" style="padding:40px 20px;">' +
                '  <!-- Breadcrumbs -->' +
                '  <nav style="margin-bottom:24px;font-size:14px;color:var(--muted);">' +
                '    <a href="index.html#/home">Trang chủ</a> <span style="margin:0 6px;">›</span> ' +
                '    <a href="index.html#/products">Sản phẩm</a> <span style="margin:0 6px;">›</span> ' +
                '    <a href="index.html#/products?cat=' + encodeURIComponent(catSlug) + '">' + U.esc(catName) + '</a> <span style="margin:0 6px;">›</span> ' +
                '    <span style="color:var(--text);">' + U.esc(v.name) + '</span>' +
                '  </nav>' +

                '  <!-- Product Detail Container -->' +
                '  <div class="product-container" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:40px;background:#fff;padding:32px;border-radius:12px;box-shadow:var(--shadow);">' +
                '    <!-- Gallery -->' +
                '    <div class="product-gallery">' +
                '      <div style="margin-bottom:16px;border-radius:8px;overflow:hidden;border:1px solid #eee;">' +
                '        <img id="mainDetailImg" src="' + U.esc(v.image) + '" alt="' + U.esc(v.name) + '" style="width:100%;height:380px;object-fit:cover;" />' +
                '      </div>' +
                '    </div>' +

                '    <!-- Info -->' +
                '    <div class="product-info">' +
                '      <span class="chip" style="margin-bottom:12px;display:inline-block;">' + U.esc(catName) + '</span>' +
                '      <h1 style="font-size:28px;color:var(--coffee-900);margin-bottom:12px;font-family:\'Playfair Display\', serif;">' + U.esc(v.name) + '</h1>' +
                '      <div style="font-size:26px;color:var(--coffee);font-weight:700;margin-bottom:20px;">' + (v.price === null ? 'Liên hệ báo giá' : U.fmtVND(v.price)) + '</div>' +
                '      <div style="margin-bottom:20px;padding:12px 16px;background:' + (canBuy ? '#e8f5e9' : '#ffebee') + ';border-radius:8px;font-size:14px;color:' + (canBuy ? '#2e7d32' : '#c62828') + ';">' +
                '        ' + (canBuy ? '✓ Còn hàng (còn ' + v.available + ' sản phẩm trong kho)' : '✕ Tạm thời hết hàng') +
                '      </div>' +
                '      <p style="color:#555;margin-bottom:24px;line-height:1.7;">' + U.esc(v.description || 'Hạt cà phê nguyên chất được thu hoạch và rang mộc tỉ mỉ, đem lại hương vị đậm đà thuần khiết cho người thưởng thức.') + '</p>' +

                '      <!-- Specs Table -->' +
                '      <div style="margin-bottom:28px;background:#fdfbf9;padding:16px;border-radius:8px;border:1px solid #eed;">' +
                '        <div style="display:grid;grid-template-columns:120px 1fr;gap:8px;font-size:13px;">' +
                '          <span style="color:#777;">Xuất xứ:</span><strong>Việt Nam (Tây Nguyên)</strong>' +
                '          <span style="color:#777;">Mức rang:</span><strong>Rang vừa (Medium Roast)</strong>' +
                '          <span style="color:#777;">Đóng gói:</span><strong>Túi 500g (Van 1 chiều)</strong>' +
                '          <span style="color:#777;">Hạn dùng:</span><strong>12 tháng kể từ ngày rang</strong>' +
                '        </div>' +
                '      </div>' +

                '      <!-- Quantity & Actions -->' +
                '      <div style="display:flex;flex-wrap:wrap;gap:16px;align-items:center;margin-bottom:20px;">' +
                '        <div style="display:inline-flex;align-items:center;border:1px solid #ddd;border-radius:6px;overflow:hidden;">' +
                '          <button id="decQtyBtn" type="button" style="width:36px;height:36px;background:#f5f5f5;font-weight:bold;cursor:pointer;">-</button>' +
                '          <input id="detailQty" type="number" value="1" min="1" max="' + Math.max(1, v.available) + '" style="width:50px;height:36px;text-align:center;border:none;outline:none;" />' +
                '          <button id="incQtyBtn" type="button" style="width:36px;height:36px;background:#f5f5f5;font-weight:bold;cursor:pointer;">+</button>' +
                '        </div>' +
                '        <button id="addDetailCartBtn" class="btn btn-secondary" style="flex:1;min-width:160px;padding:12px;"' + (canBuy ? '' : ' disabled') + '>Thêm vào giỏ hàng</button>' +
                '        <button id="buyNowDetailBtn" class="btn btn-primary" style="flex:1;min-width:140px;padding:12px;"' + (canBuy ? '' : ' disabled') + '>Mua ngay</button>' +
                '      </div>' +
                '    </div>' +
                '  </div>' +

                (related.length ?
                '  <div style="margin-top:50px;">' +
                '    <h3 style="font-size:22px;color:var(--coffee-900);margin-bottom:20px;">Sản phẩm cùng loại</h3>' +
                '    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:20px;">' + relatedHtml + '</div>' +
                '  </div>' : '') +
                '</div>';

            var qtyInput = root.querySelector('#detailQty');
            var decBtn = root.querySelector('#decQtyBtn');
            var incBtn = root.querySelector('#incQtyBtn');
            var addBtn = root.querySelector('#addDetailCartBtn');
            var buyBtn = root.querySelector('#buyNowDetailBtn');

            if (decBtn && qtyInput) {
                decBtn.addEventListener('click', function () {
                    var val = parseInt(qtyInput.value, 10) || 1;
                    if (val > 1) qtyInput.value = val - 1;
                });
            }
            if (incBtn && qtyInput) {
                incBtn.addEventListener('click', function () {
                    var val = parseInt(qtyInput.value, 10) || 1;
                    if (val < v.available) qtyInput.value = val + 1;
                });
            }

            if (addBtn && qtyInput) {
                addBtn.addEventListener('click', function () {
                    var qty = parseInt(qtyInput.value, 10) || 1;
                    var r = CB.cart.add(v.id, qty);
                    if (r.ok) {
                        CB.ui.toast('Đã thêm ' + qty + ' sản phẩm vào giỏ hàng.');
                        CB.ui.refreshBadge();
                    } else if (r.code === 'LOGIN_REQUIRED') {
                        g.location.href = CB.auth.loginUrl();
                    } else {
                        CB.ui.toast(r.error, 'error');
                    }
                });
            }

            if (buyBtn && qtyInput) {
                buyBtn.addEventListener('click', function () {
                    var qty = parseInt(qtyInput.value, 10) || 1;
                    var r = CB.cart.add(v.id, qty);
                    if (r.ok) {
                        CB.ui.refreshBadge();
                        g.location.href = 'checkout.html#/checkout';
                    } else if (r.code === 'LOGIN_REQUIRED') {
                        g.location.href = CB.auth.loginUrl();
                    } else {
                        CB.ui.toast(r.error, 'error');
                    }
                });
            }
        },
        unmount: function () {}
    };
})(typeof window !== 'undefined' ? window : globalThis);
