/* Trang chủ: danh mục sản phẩm nổi bật (mỗi loại một sản phẩm đại diện), slider hero. */
(function () {
    'use strict';
    var U = CB.util;
    var grid = document.getElementById('featuredGrid');

    function card(cat, v, idx) {
        var detail = 'product-detail.html?id=' + encodeURIComponent(v.id);
        var canBuy = v.price !== null && v.available > 0;
        return '<article class="card fade-in-left stagger-' + (idx + 1) + '">' +
            '<a href="products.html?cat=' + encodeURIComponent(cat.slug) + '" aria-label="Xem tất cả ' + U.esc(cat.name) + '"><img src="' + U.esc(v.image) + '" alt="Hạt ' + U.esc(cat.name) + '" /></a>' +
            '<div class="card-body"><span class="chip">' + U.esc(cat.name) + '</span><div class="spacer"></div>' +
            '<div class="prod"><img src="' + U.esc(v.image) + '" alt="' + U.esc(v.name) + '" />' +
            '<div><h4><a href="' + detail + '">' + U.esc(v.name) + '</a></h4>' +
            '<div><span class="price">' + (v.price === null ? '—' : U.fmtVND(v.price)) + '</span></div></div>' +
            '<div class="button-group"><button class="add" data-id="' + U.esc(v.id) + '"' + (canBuy ? '' : ' disabled') + '>' + (canBuy ? 'Thêm' : 'Hết hàng') + '</button></div>' +
            '</div></div></article>';
    }

    function render() {
        var all = CB.catalog.search({});
        var html = CB.catalog.categories().map(function (cat, i) {
            var first = all.filter(function (v) { return v.categoryId === cat.id; })[0];
            return first ? card(cat, first, i) : '';
        }).join('');
        grid.innerHTML = html || '<div class="cb-empty">Chưa có sản phẩm nào.</div>';
    }

    grid.addEventListener('click', function (e) {
        var btn = e.target.closest('button.add');
        if (!btn || btn.disabled) return;
        var r = CB.cart.add(btn.getAttribute('data-id'), 1);
        if (r.ok) { CB.ui.toast('Đã thêm vào giỏ hàng.'); CB.ui.refreshBadge(); render(); }
        else if (r.code === 'LOGIN_REQUIRED') location.href = CB.auth.loginUrl();
        else CB.ui.toast(r.error, 'error');
    });

    render();
})();
