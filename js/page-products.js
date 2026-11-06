/* CoffeeBeans - View: Products (Danh sách sản phẩm)
   File: js/page-products.js
*/
(function (g) {
    'use strict';
    var CB = (g.CB = g.CB || {});
    var U = CB.util,
        PAGE_SIZE = 9;
    CB.views = CB.views || {};

    CB.views.products = {
        mount: function (root, params) {
            CB.mountTemplate(root, 'tpl-products');

            var grid = root.querySelector('#productGrid'),
                pagerBox = root.querySelector('#pagination'),
                form = root.querySelector('#filterForm'),
                catSelect = root.querySelector('#category'),
                prodSearch = root.querySelector('#productSearch'),
                minPrice = root.querySelector('#priceMin'),
                maxPrice = root.querySelector('#priceMax'),
                sortSelect = root.querySelector('#sort'),
                resultInfo = root.querySelector('#resultInfo'),
                errBox = root.querySelector('#filterError'),
                resetBtn = root.querySelector('#resetFilter');

            // Populate category select
            var cats = CB.catalog ? CB.catalog.categories() : [];
            cats.forEach(function (c) {
                var o = document.createElement('option');
                o.value = c.slug;
                o.textContent = c.name;
                catSelect.appendChild(o);
            });

            function readFilter() {
                return {
                    q: (params && params.q) || CB.ui.param('q') || '',
                    cat: (params && params.cat) || CB.ui.param('cat') || '',
                    min: (params && params.min) || CB.ui.param('min') || '',
                    max: (params && params.max) || CB.ui.param('max') || '',
                    sort: (params && params.sort) || CB.ui.param('sort') || 'default',
                    page: parseInt((params && params.page) || CB.ui.param('page'), 10) || 1
                };
            }

            function fillForm(f) {
                prodSearch.value = f.q;
                catSelect.value = f.cat;
                minPrice.value = f.min;
                maxPrice.value = f.max;
                sortSelect.value = f.sort;
            }

            function showError(msg) {
                errBox.textContent = msg || '';
                errBox.hidden = !msg;
                minPrice.classList.toggle('cb-input-error', !!msg);
                maxPrice.classList.toggle('cb-input-error', !!msg);
            }

            function collectForm() {
                var min = minPrice.value.trim(),
                    max = maxPrice.value.trim();
                var nMin = min === '' ? null : Number(min),
                    nMax = max === '' ? null : Number(max);
                if ((nMin !== null && (isNaN(nMin) || nMin < 0)) || (nMax !== null && (isNaN(nMax) || nMax < 0))) {
                    showError('Khoảng giá phải là số không âm.');
                    return null;
                }
                if (nMin !== null && nMax !== null && nMin > nMax) {
                    showError('Giá tối thiểu không được lớn hơn giá tối đa.');
                    return null;
                }
                showError('');
                return {
                    q: prodSearch.value.trim(),
                    cat: catSelect.value,
                    min: min,
                    max: max,
                    sort: sortSelect.value,
                    page: 1
                };
            }

            function card(v) {
                var link = 'index.html#/product?id=' + encodeURIComponent(v.id);
                var stockNote = '';
                var disabled = false,
                    label = 'Thêm vào giỏ';
                if (v.price === null) {
                    stockNote = '<small class="stock-note out">Chưa có giá bán</small>';
                    disabled = true;
                    label = 'Chưa có giá';
                } else if (v.available <= 0) {
                    stockNote = '<small class="stock-note out">Hết hàng</small>';
                    disabled = true;
                    label = 'Hết hàng';
                } else if (v.available <= CB.inventory.threshold()) {
                    stockNote = '<small class="stock-note low">Sắp hết hàng: còn ' + v.available + '</small>';
                }
                return (
                    '<article class="card">' +
                    '<a href="' + link + '" style="text-decoration:none;color:inherit;"><img src="' + U.esc(v.image) + '" alt="' + U.esc(v.name) + '" /></a>' +
                    '<div class="card-body"><span class="chip">' + U.esc(v.categoryName) + '</span><div class="spacer"></div>' +
                    '<div class="prod"><img src="' + U.esc(v.image) + '" alt="" />' +
                    '<div><h4><a href="' + link + '" style="text-decoration:none;color:inherit;">' + U.esc(v.name) + '</a></h4>' +
                    '<div><span class="price">' + (v.price === null ? '—' : U.fmtVND(v.price)) + '</span></div>' + stockNote + '</div>' +
                    '<div class="button-group"><button class="btn btn-primary add" data-id="' + U.esc(v.id) + '"' + (disabled ? ' disabled' : '') + '>' + label + '</button></div>' +
                    '</div></div></article>'
                );
            }

            function syncUrl(f) {
                var p = [];
                if (f.q) p.push('q=' + encodeURIComponent(f.q));
                if (f.cat) p.push('cat=' + encodeURIComponent(f.cat));
                if (f.min !== '') p.push('min=' + encodeURIComponent(f.min));
                if (f.max !== '') p.push('max=' + encodeURIComponent(f.max));
                if (f.sort && f.sort !== 'default') p.push('sort=' + encodeURIComponent(f.sort));
                if (f.page > 1) p.push('page=' + f.page);
                var qs = p.length ? '?' + p.join('&') : '';
                CB.router.navigate('products' + qs, true);
            }

            function render(f) {
                var cat = f.cat ? CB.catalog.categoryBySlug(f.cat) : null;
                var list = CB.catalog.search({
                    q: f.q,
                    categoryId: cat ? cat.id : (f.cat ? '__none__' : ''),
                    min: f.min !== '' ? Number(f.min) : null,
                    max: f.max !== '' ? Number(f.max) : null,
                    sort: f.sort
                });
                var pg = U.paginate(list, f.page, PAGE_SIZE);

                var titleEl = root.querySelector('#pageTitle'),
                    descEl = root.querySelector('#pageDesc');
                if (titleEl) titleEl.textContent = cat ? 'Cà phê ' + cat.name : 'Cà Phê Chất Lượng Cao';
                if (descEl) descEl.textContent = cat && cat.description
                    ? cat.description
                    : 'Khám phá bộ sưu tập cà phê rang xay tươi mới từ các vùng trồng tốt nhất';
                g.document.title = (cat ? cat.name : 'Sản phẩm') + ' - Cà Phê Đậm Đà';

                var filtering = !!(f.q || f.cat || f.min !== '' || f.max !== '');
                if (resultInfo) {
                    resultInfo.textContent = filtering
                        ? 'Tìm thấy ' + pg.total + ' sản phẩm phù hợp'
                        : 'Hiển thị ' + pg.total + ' sản phẩm';
                }

                if (!pg.total) {
                    grid.style.display = 'block';
                    grid.innerHTML = '<div class="no-results" style="text-align:center;padding:40px 20px;">Không tìm thấy sản phẩm phù hợp với điều kiện tìm kiếm.<br>' +
                        '<button type="button" class="reset-filter" id="clearFromEmpty" style="margin-top:16px;padding:10px 20px;">Xóa bộ lọc</button></div>';
                    var cBtn = root.querySelector('#clearFromEmpty');
                    if (cBtn) cBtn.addEventListener('click', clearAll);
                    pagerBox.innerHTML = '';
                    return;
                }
                grid.style.display = '';
                grid.innerHTML = pg.items.map(card).join('');
                CB.ui.renderPagination(pagerBox, pg, function (page) {
                    f.page = page;
                    syncUrl(f);
                    render(f);
                    g.scrollTo({ top: 0, behavior: 'smooth' });
                });
            }

            function clearAll() {
                var f = { q: '', cat: '', min: '', max: '', sort: 'default', page: 1 };
                showError('');
                fillForm(f);
                syncUrl(f);
                render(f);
            }

            form.addEventListener('submit', function (e) {
                e.preventDefault();
                var f = collectForm();
                if (!f) return;
                syncUrl(f);
                render(f);
            });

            resetBtn.addEventListener('click', clearAll);
            sortSelect.addEventListener('change', function () {
                var f = collectForm();
                if (!f) return;
                syncUrl(f);
                render(f);
            });

            grid.addEventListener('click', function (e) {
                var btn = e.target.closest('button.add');
                if (!btn || btn.disabled) return;
                var r = CB.cart.add(btn.getAttribute('data-id'), 1);
                if (r.ok) {
                    CB.ui.toast('Đã thêm vào giỏ hàng.');
                    CB.ui.refreshBadge();
                } else if (r.code === 'LOGIN_REQUIRED') {
                    g.location.href = CB.auth.loginUrl();
                } else {
                    CB.ui.toast(r.error, 'error');
                }
            });

            var initial = readFilter();
            fillForm(initial);
            render(initial);
        },
        unmount: function () {}
    };
})(typeof window !== 'undefined' ? window : globalThis);
