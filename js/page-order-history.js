/* CoffeeBeans - View: Order History (Lịch sử đơn hàng)
   File: js/page-order-history.js
*/
(function (g) {
    'use strict';
    var CB = (g.CB = g.CB || {});
    var U = CB.util,
        PAGE_SIZE = 5;
    CB.views = CB.views || {};

    CB.views.orders = {
        mount: function (root, params) {
            var user = CB.auth.requireLogin();
            if (!user) return;

            var all = CB.orders.byUser(user.id);

            root.innerHTML =
                '<div class="container" style="padding:40px 20px;max-width:900px;">' +
                '  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;">' +
                '    <h1 style="font-size:28px;color:var(--coffee-900);margin:0;font-family:\'Playfair Display\', serif;">Đơn hàng của tôi</h1>' +
                '    <a href="index.html#/products" class="btn btn-outline">Mua thêm sản phẩm</a>' +
                '  </div>' +
                '  <div id="ordersList"></div>' +
                '  <div id="ordersPagination" style="margin-top:30px;"></div>' +
                '</div>';

            var list = root.querySelector('#ordersList');
            var pagerBox = root.querySelector('#ordersPagination');

            function renderPage(page) {
                if (!all.length) {
                    list.innerHTML =
                        '<div class="cb-empty">' +
                        '  <p style="color:var(--muted);margin-bottom:16px;">Bạn chưa có đơn hàng nào.</p>' +
                        '  <a href="index.html#/products" class="btn btn-primary">Bắt đầu mua sắm ngay</a>' +
                        '</div>';
                    return;
                }

                var totalPages = Math.ceil(all.length / PAGE_SIZE) || 1;
                if (page < 1) page = 1;
                if (page > totalPages) page = totalPages;

                var start = (page - 1) * PAGE_SIZE;
                var pageItems = all.slice(start, start + PAGE_SIZE);

                list.innerHTML = pageItems.map(function (o) {
                    var itemsText = o.items.map(function (i) {
                        return U.esc(i.name) + ' (×' + i.qty + ')';
                    }).join(', ');

                    return '<div style="background:#fff;padding:24px;border-radius:12px;box-shadow:var(--shadow);margin-bottom:20px;border-left:4px solid var(--coffee);">' +
                        '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:16px;border-bottom:1px solid #eee;padding-bottom:12px;">' +
                        '  <div>' +
                        '    <span style="font-size:12px;color:#777;">Mã đơn:</span> <strong style="font-size:16px;color:var(--coffee-900);">' + U.esc(o.code) + '</strong>' +
                        '    <span style="font-size:12px;color:#999;margin-left:12px;">' + U.fmtDateTime(o.createdAt) + '</span>' +
                        '  </div>' +
                        '  <div>' + CB.ui.statusBadge(o.status) + '</div>' +
                        '</div>' +
                        '<div style="margin-bottom:16px;font-size:14px;color:#555;line-height:1.6;">' +
                        '  <strong>Sản phẩm:</strong> ' + itemsText + '<br>' +
                        '  <strong>Địa chỉ nhận:</strong> ' + U.esc(CB.auth.formatAddress(o.shipping)) +
                        '</div>' +
                        '<div style="display:flex;justify-content:space-between;align-items:center;padding-top:12px;border-top:1px solid #eee;">' +
                        '  <div style="font-size:16px;">Tổng tiền: <strong style="color:var(--coffee);font-size:18px;">' + U.fmtVND(o.total) + '</strong></div>' +
                        '  <a href="checkout.html#/confirmation?order=' + encodeURIComponent(o.id) + '" class="btn btn-sm btn-outline">Xem chi tiết đơn</a>' +
                        '</div></div>';
                }).join('');

                CB.ui.renderPagination(pagerBox, { page: page, pages: totalPages }, function (newPage) {
                    renderPage(newPage);
                });
            }

            renderPage(1);
        },
        unmount: function () {}
    };
})(typeof window !== 'undefined' ? window : globalThis);
