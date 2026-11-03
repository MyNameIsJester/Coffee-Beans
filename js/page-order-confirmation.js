/* CoffeeBeans - View: Order Confirmation (Xác nhận đơn hàng)
   File: js/page-order-confirmation.js
*/
(function (g) {
    'use strict';
    var CB = (g.CB = g.CB || {});
    var U = CB.util;
    CB.views = CB.views || {};

    CB.views.confirmation = {
        mount: function (root, params) {
            var user = CB.auth.requireLogin();
            if (!user) return;

            var orderId = (params && params.order) || CB.ui.param('order') || '';
            var order = CB.orders.byId(orderId);

            if (!order || order.userId !== user.id) {
                root.innerHTML =
                    '<div class="container" style="padding:60px 20px;">' +
                    '<div class="cb-empty">' +
                    '  <h2 style="font-size:24px;color:var(--coffee-900);margin-bottom:12px;">Không tìm thấy đơn hàng</h2>' +
                    '  <p style="color:var(--muted);margin-bottom:20px;">Đơn hàng không tồn tại hoặc không thuộc tài khoản của bạn.</p>' +
                    '  <a href="account.html#/orders" class="btn btn-primary">Xem lịch sử đơn hàng</a>' +
                    '</div></div>';
                return;
            }

            var isNew = (params && params.new === '1') || CB.ui.param('new') === '1';
            var s = order.shipping || {};
            var itemsHtml = order.items.map(function (i) {
                return '<tr style="border-bottom:1px solid #eee;">' +
                    '<td style="padding:10px;">' + U.esc(i.name) + '</td>' +
                    '<td style="text-align:center;padding:10px;">' + i.qty + '</td>' +
                    '<td style="text-align:right;padding:10px;">' + U.fmtVND(i.unitPrice) + '</td>' +
                    '<td style="text-align:right;padding:10px;font-weight:600;">' + U.fmtVND(i.unitPrice * i.qty) + '</td>' +
                    '</tr>';
            }).join('');

            var payNote = '';
            if (order.payment.method === 'bank') {
                payNote = '<div style="margin-top:16px;padding:16px;background:#fdfbf9;border-radius:8px;border:1px solid #eed;font-size:14px;line-height:1.8;">' +
                    '<strong>Thông tin chuyển khoản ngân hàng:</strong><br>' +
                    'Ngân hàng: <strong>MBBank (Ngân hàng Quân Đội)</strong><br>' +
                    'Số tài khoản: <strong>0123456789</strong><br>' +
                    'Chủ tài khoản: <strong>CÔNG TY CÀ PHÊ ĐẬM ĐÀ</strong><br>' +
                    'Nội dung chuyển khoản: <strong style="color:var(--coffee);">' + U.esc(order.code) + '</strong>' +
                    '</div>';
            } else if (order.payment.method === 'online') {
                payNote = '<div style="margin-top:16px;padding:14px;background:#fff8e1;border-radius:8px;font-size:14px;color:#b78103;">' +
                    'ℹ️ Đây là chức năng thanh toán trực tuyến mô phỏng dành cho đồ án môn học.' +
                    '</div>';
            }

            root.innerHTML =
                '<div class="container" style="padding:40px 20px;max-width:800px;">' +
                '  <div style="background:#fff;padding:36px;border-radius:12px;box-shadow:var(--shadow);">' +
                (isNew
                    ? '<div style="text-align:center;margin-bottom:30px;">' +
                      '  <div style="width:64px;height:64px;background:#e8f5e9;color:#2e7d32;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:32px;margin-bottom:16px;">✓</div>' +
                      '  <h1 style="font-size:26px;color:var(--coffee-900);margin-bottom:8px;">Đặt hàng thành công!</h1>' +
                      '  <p style="color:#666;">Cảm ơn bạn đã lựa chọn Cà Phê Đậm Đà. Đơn hàng đang được xử lý.</p>' +
                      '</div>'
                    : '<div style="margin-bottom:30px;"><h1 style="font-size:24px;color:var(--coffee-900);">Chi tiết đơn hàng</h1></div>') +

                '    <div style="background:var(--cream);padding:16px 20px;border-radius:8px;display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;">' +
                '      <div><span style="font-size:13px;color:#777;">Mã đơn hàng:</span><br><strong style="font-size:18px;color:var(--coffee-900);">' + U.esc(order.code) + '</strong></div>' +
                '      <div><span style="font-size:13px;color:#777;">Trạng thái:</span><br>' + CB.ui.statusBadge(order.status) + '</div>' +
                '    </div>' +

                '    <div style="margin-bottom:28px;">' +
                '      <h3 style="font-size:16px;color:var(--coffee-900);margin-bottom:12px;border-bottom:1px solid #eee;padding-bottom:8px;">Thông tin nhận hàng</h3>' +
                '      <div style="font-size:14px;line-height:1.8;color:#444;">' +
                '        <strong>Người nhận:</strong> ' + U.esc(s.fullName) + '<br>' +
                '        <strong>Điện thoại:</strong> ' + U.esc(s.phone) + '<br>' +
                '        <strong>Địa chỉ giao:</strong> ' + U.esc(CB.auth.formatAddress(s)) + '<br>' +
                '        <strong>Phương thức thanh toán:</strong> ' + U.esc(order.payment.label) +
                (order.note ? '<br><strong>Ghi chú:</strong> ' + U.esc(order.note) : '') +
                '      </div>' +
                payNote +
                '    </div>' +

                '    <div style="margin-bottom:28px;">' +
                '      <h3 style="font-size:16px;color:var(--coffee-900);margin-bottom:12px;border-bottom:1px solid #eee;padding-bottom:8px;">Danh sách sản phẩm</h3>' +
                '      <table style="width:100%;border-collapse:collapse;font-size:14px;">' +
                '        <thead><tr style="text-align:left;color:#777;border-bottom:1px solid #ddd;">' +
                '          <th style="padding:8px 10px;">Sản phẩm</th><th style="text-align:center;padding:8px 10px;">SL</th><th style="text-align:right;padding:8px 10px;">Đơn giá</th><th style="text-align:right;padding:8px 10px;">Thành tiền</th>' +
                '        </tr></thead>' +
                '        <tbody>' + itemsHtml + '</tbody>' +
                '      </table>' +
                '      <div style="margin-top:16px;text-align:right;font-size:14px;color:#555;">' +
                '        <div>Tạm tính: <strong>' + U.fmtVND(order.subtotal) + '</strong></div>' +
                '        <div style="margin:4px 0;">Phí vận chuyển: <strong>' + U.fmtVND(order.shippingFee) + '</strong></div>' +
                '        <div style="font-size:18px;color:var(--coffee);font-weight:700;margin-top:8px;">Tổng cộng: ' + U.fmtVND(order.total) + '</div>' +
                '      </div>' +
                '    </div>' +

                '    <div style="display:flex;flex-wrap:wrap;gap:14px;justify-content:center;margin-top:30px;">' +
                '      <a href="index.html#/home" class="btn btn-primary" style="padding:12px 24px;">← Quay về trang chủ</a>' +
                '      <a href="account.html#/orders" class="btn btn-secondary" style="padding:12px 24px;">Xem lịch sử đơn hàng</a>' +
                '    </div>' +
                '  </div>' +
                '</div>';
        },
        unmount: function () {}
    };
})(typeof window !== 'undefined' ? window : globalThis);
