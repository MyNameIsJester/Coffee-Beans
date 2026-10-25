/* Lịch sử đơn hàng của khách hàng đang đăng nhập. */
(function () {
    'use strict';
    var U = CB.util,
        PAGE_SIZE = 5;
    var user = CB.auth.requireLogin();
    if (!user) return;
    var root = document.getElementById('ordersRoot');
    var pager = document.getElementById('pagination');
    var all = CB.orders.byUser(user.id);

    function deliveredDate(o) {
        var h = o.statusHistory.filter(function (x) { return x.status === CB.orders.STATUS.DELIVERED; })[0];
        return h ? U.fmtDate(U.dateStr(new Date(h.at))) : '';
    }
    function card(o) {
        var count = o.items.reduce(function (s, i) { return s + i.qty; }, 0);
        var preview = o.items.map(function (i) { return U.esc(i.name) + ' (x' + i.qty + ')'; }).join(', ');
        var extra = o.status === CB.orders.STATUS.DELIVERED
            ? '<div class="info-item"><div class="info-label">Ngày giao</div><div class="info-value">' + deliveredDate(o) + '</div></div>'
            : '';
        return '<div class="order-card"><div class="order-card-header"><div>' +
            '<div class="order-card-title">Đơn hàng</div><div class="order-id">' + U.esc(o.code) + '</div></div>' +
            CB.ui.statusBadge(o.status) + '</div>' +
            '<div class="order-card-info"><div class="info-item"><div class="info-label">Ngày đặt</div><div class="info-value">' + U.fmtDate(o.date) + '</div></div>' + extra +
            '<div class="info-item"><div class="info-label">Số sản phẩm</div><div class="info-value">' + count + ' sản phẩm</div></div>' +
            '<div class="info-item"><div class="info-label">Tổng tiền</div><div class="info-value" style="color:var(--coffee);">' + U.fmtVND(o.total) + '</div></div></div>' +
            '<div class="order-items-preview">📦 ' + preview + '</div>' +
            '<div class="order-actions"><a href="order-confirmation.html?order=' + encodeURIComponent(o.id) + '" class="btn-small btn-view">' +
            '<i class="fas fa-eye" style="margin-right:6px;"></i>Xem chi tiết</a></div></div>';
    }

    function render(page) {
        var head = '<h1 class="section-title" style="margin-bottom:30px;"><i class="fas fa-history" style="margin-right:10px;color:var(--coffee);"></i>Lịch sử đơn hàng</h1>';
        if (!all.length) {
            root.innerHTML = head + '<div class="cb-empty"><p style="font-size:1.1em;margin-bottom:12px;">Bạn chưa có đơn hàng nào.</p><a href="products.html">Bắt đầu mua sắm →</a></div>';
            pager.innerHTML = '';
            return;
        }
        var pg = U.paginate(all, page, PAGE_SIZE);
        root.innerHTML = head + pg.items.map(card).join('');
        CB.ui.renderPagination(pager, pg, function (p) {
            render(p);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    render(1);
})();
