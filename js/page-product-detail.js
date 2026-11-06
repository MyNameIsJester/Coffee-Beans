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
                CB.mountTemplate(root, 'tpl-product-notfound');
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

            CB.mountTemplate(root, 'tpl-product-detail');
            var detailLink = root.querySelector('#detailCategoryLink');
            detailLink.href = 'index.html#/products?cat=' + encodeURIComponent(catSlug);
            root.querySelector('#detailCategoryName').textContent = catName;
            root.querySelector('#detailBreadcrumbName').textContent = v.name;
            root.querySelector('#mainDetailImg').src = v.image;
            root.querySelector('#mainDetailImg').alt = v.name;
            root.querySelector('#detailCategoryChip').textContent = catName;
            root.querySelector('#detailName').textContent = v.name;
            root.querySelector('#detailPrice').textContent = v.price === null ? 'Liên hệ báo giá' : U.fmtVND(v.price);
            var stockBox = root.querySelector('#detailStock');
            stockBox.style.background = canBuy ? '#e8f5e9' : '#ffebee';
            stockBox.style.color = canBuy ? '#2e7d32' : '#c62828';
            stockBox.textContent = canBuy ? '✓ Còn hàng (còn ' + v.available + ' sản phẩm trong kho)' : '✕ Tạm thời hết hàng';
            root.querySelector('#detailDescription').textContent = v.description || 'Hạt cà phê nguyên chất được thu hoạch và rang mộc tỉ mỉ, đem lại hương vị đậm đà thuần khiết cho người thưởng thức.';
            root.querySelector('#detailOrigin').textContent = product.origin || 'Việt Nam (Tây Nguyên)';
            root.querySelector('#detailRoast').textContent = product.roast || 'Rang vừa (Medium Roast)';
            root.querySelector('#detailWeight').textContent = product.weight || 'Túi 500g (Van 1 chiều)';
            var qty = root.querySelector('#detailQty');
            qty.max = Math.max(1, v.available);
            root.querySelector('#addDetailCartBtn').disabled = !canBuy;
            root.querySelector('#buyNowDetailBtn').disabled = !canBuy;
            var relatedSection = root.querySelector('#relatedSection');
            if (related.length) {
                relatedSection.hidden = false;
                root.querySelector('#relatedProducts').innerHTML = relatedHtml;
            }

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
