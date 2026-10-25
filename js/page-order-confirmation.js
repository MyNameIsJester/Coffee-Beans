/* Xem lại đơn hàng vừa đặt: order-confirmation.html?order=<id> */
(function () {
    'use strict';
    var U = CB.util;
    var user = CB.auth.requireLogin();
    if (!user) return;
    var root = document.getElementById('confirmRoot');
    var order = CB.orders.byId(CB.ui.param('order') || '');

    if (!order || order.userId !== user.id) {
        root.innerHTML = '<div class="cb-empty"><h2 style="margin-bottom:12px;">Không tìm thấy đơn hàng</h2>' +
            '<p>Đơn hàng không tồn tại hoặc không thuộc tài khoản của bạn.</p>' +
            '<p style="margin-top:16px;"><a href="order-history.html">Xem lịch sử đơn hàng</a></p></div>';
        return;
    }

    var s = order.shipping;
    function row(label, value, style) {
        return '<div class="info-row"><span class="info-label">' + label + '</span><span class="info-value"' + (style ? ' style="' + style + '"' : '') + '>' + value + '</span></div>';
    }
    var items = order.items.map(function (i) {
        return '<tr><td class="item-name">' + U.esc(i.name) + '</td><td style="text-align:center;">' + i.qty + '</td>' +
            '<td class="item-price" style="text-align:right;">' + U.fmtVND(i.unitPrice) + '</td>' +
            '<td style="text-align:right;font-weight:600;">' + U.fmtVND(i.unitPrice * i.qty) + '</td></tr>';
    }).join('');

    var payNote = '';
    if (order.payment.method === 'bank') {
        payNote = '<div style="margin-top:12px;padding:12px;background:#f7fafc;border-radius:8px;font-size:14px;line-height:1.7;">' +
            '<strong>Thông tin chuyển khoản (mẫu)</strong><br>Ngân hàng: Ngân hàng Demo<br>Số tài khoản: 0123 456 789<br>Chủ tài khoản: CÀ PHÊ ĐẬM ĐÀ<br>' +
            'Nội dung: ' + U.esc(order.code) + '</div>';
    } else if (order.payment.method === 'online') {
        payNote = '<div style="margin-top:12px;padding:12px;background:#fff8e1;border-radius:8px;font-size:14px;">Thanh toán trực tuyến chỉ là chức năng minh họa, chưa có giao dịch thật nào được thực hiện.</div>';
    }

    var isNew = CB.ui.param('new') === '1';
    var head = isNew
        ? '<div class="success-header"><div class="success-icon">✓</div><h1 class="success-title">Đặt hàng thành công!</h1>' +
          '<p class="success-subtitle">Cảm ơn bạn đã mua hàng tại Cà Phê Đậm Đà</p></div>'
        : '<div class="success-header"><h1 class="success-title">Chi tiết đơn hàng</h1></div>';
    var history = order.statusHistory.map(function (h) {
        return '<div class="info-row"><span class="info-label">' + U.fmtDateTime(h.at) + '</span><span class="info-value">' + CB.ui.statusBadge(h.status) + '</span></div>';
    }).join('');
    document.title = (isNew ? 'Đặt hàng thành công' : 'Chi tiết đơn ' + order.code) + ' - Cà Phê Đậm Đà';

    root.innerHTML = head +
        '<div class="order-id-box"><div class="order-id-label">Mã đơn hàng</div><div class="order-id">' + U.esc(order.code) + '</div></div>' +
        '<div class="info-section"><div class="info-title">Thông tin khách hàng</div>' +
        row('Họ và tên', U.esc(order.customer.fullName)) + row('Số điện thoại', U.esc(order.customer.phone)) + row('Email', U.esc(order.customer.email)) +
        row('Ngày đặt', U.fmtDateTime(order.createdAt)) + '</div>' +
        '<div class="info-section"><div class="info-title">Thông tin giao hàng</div>' +
        row('Người nhận', U.esc(s.fullName)) + row('Số điện thoại', U.esc(s.phone)) +
        row('Địa chỉ', U.esc(CB.auth.formatAddress(s)), 'text-align:right;') +
        row('Phương thức vận chuyển', 'Giao hàng tận nơi') +
        (order.note ? row('Ghi chú', U.esc(order.note), 'text-align:right;') : '') + '</div>' +
        '<div class="info-section"><div class="info-title">Chi tiết đơn hàng</div>' +
        '<table class="items-table"><thead><tr><th>Sản phẩm</th><th style="text-align:center;">Số lượng</th><th style="text-align:right;">Giá</th><th style="text-align:right;">Thành tiền</th></tr></thead><tbody>' + items + '</tbody></table>' +
        '<div class="total-section"><div class="total-row"><span>Tạm tính:</span><span>' + U.fmtVND(order.subtotal) + '</span></div>' +
        '<div class="total-row"><span>Phí vận chuyển:</span><span>' + U.fmtVND(order.shippingFee) + '</span></div>' +
        '<div class="total-row grand-total"><span>Tổng cộng:</span><span>' + U.fmtVND(order.total) + '</span></div></div></div>' +
        '<div class="info-section"><div class="info-title">Thông tin thanh toán</div>' +
        row('Phương thức', U.esc(order.payment.label)) +
        row('Tổng tiền', U.fmtVND(order.total), 'color:var(--coffee);font-weight:700;') +
        row('Trạng thái đơn', CB.ui.statusBadge(order.status)) + payNote + '</div>' +
        '<div class="info-section"><div class="info-title">Lịch sử trạng thái</div>' + history + '</div>' +
        '<div class="action-buttons"><a href="index.html" class="btn-primary"><i class="fas fa-home" style="margin-right:8px;"></i>Quay về trang chủ</a>' +
        '<a href="order-history.html" class="btn-secondary"><i class="fas fa-list" style="margin-right:8px;"></i>Xem lịch sử đơn hàng</a></div>';
})();
