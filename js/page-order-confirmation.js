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
                CB.mountTemplate(root, 'tpl-confirmation-notfound');
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

            CB.mountTemplate(root, 'tpl-confirmation');
            var heading = root.querySelector('#confirmationHeading');
            if (isNew) {
                heading.innerHTML = '<div style="text-align:center"><div style="width:64px;height:64px;background:#e8f5e9;color:#2e7d32;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:32px;margin-bottom:16px">✓</div><h1 style="font-size:26px;color:var(--coffee-900);margin-bottom:8px">Đặt hàng thành công!</h1><p style="color:#666">Cảm ơn bạn đã lựa chọn Cà Phê Đậm Đà. Đơn hàng đang được xử lý.</p></div>';
            } else {
                heading.innerHTML = '<h1 style="font-size:24px;color:var(--coffee-900)">Chi tiết đơn hàng</h1>';
            }
            root.querySelector('#confirmationCode').textContent = order.code;
            root.querySelector('#confirmationStatus').innerHTML = CB.ui.statusBadge(order.status);
            var shippingInfo = root.querySelector('#confirmationShipping');
            shippingInfo.textContent = 'Người nhận: ' + (s.fullName || '') + '\nĐiện thoại: ' + (s.phone || '') + '\nĐịa chỉ giao: ' + CB.auth.formatAddress(s) + '\nPhương thức thanh toán: ' + order.payment.label + (order.note ? '\nGhi chú: ' + order.note : '');
            shippingInfo.style.whiteSpace = 'pre-line';
            var paymentNote = root.querySelector('#confirmationPaymentNote');
            if (order.payment.method === 'bank') {
                paymentNote.innerHTML = '<div style="margin-top:16px;padding:16px;background:#fdfbf9;border-radius:8px;border:1px solid #eed;font-size:14px;line-height:1.8"><strong>Thông tin chuyển khoản ngân hàng:</strong><br />Ngân hàng: <strong>MBBank (Ngân hàng Quân Đội)</strong><br />Số tài khoản: <strong>0123456789</strong><br />Chủ tài khoản: <strong>CÔNG TY CÀ PHÊ ĐẬM ĐÀ</strong><br />Nội dung chuyển khoản: <strong style="color:var(--coffee)"></strong></div>';
                paymentNote.querySelector('strong:last-child').textContent = order.code;
            } else if (order.payment.method === 'online') {
                paymentNote.textContent = 'ℹ️ Đây là chức năng thanh toán trực tuyến mô phỏng dành cho đồ án môn học.';
                paymentNote.style.cssText = 'margin-top:16px;padding:14px;background:#fff8e1;border-radius:8px;font-size:14px;color:#b78103';
            }
            root.querySelector('#confirmationItems').innerHTML = itemsHtml;
            root.querySelector('#confirmationSubtotal').textContent = U.fmtVND(order.subtotal);
            root.querySelector('#confirmationShippingFee').textContent = U.fmtVND(order.shippingFee);
            root.querySelector('#confirmationTotal').textContent = U.fmtVND(order.total);
        },
        unmount: function () {}
    };
})(typeof window !== 'undefined' ? window : globalThis);
