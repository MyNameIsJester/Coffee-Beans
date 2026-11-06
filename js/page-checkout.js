/* CoffeeBeans - View: Checkout (Thanh toán)
   File: js/page-checkout.js
*/
(function (g) {
    'use strict';
    var CB = (g.CB = g.CB || {});
    var U = CB.util;
    CB.views = CB.views || {};

    var TOKEN_KEY = 'cb_checkout_token';
    function getToken() {
        var t = null;
        try { t = g.sessionStorage.getItem(TOKEN_KEY); } catch (e) {}
        if (!t) {
            t = U.uid('co');
            try { g.sessionStorage.setItem(TOKEN_KEY, t); } catch (e) {}
        }
        return t;
    }

    CB.views.checkout = {
        mount: function (root, params) {
            var user = CB.auth.requireLogin();
            if (!user) return;

            var lines = CB.cart.detailed();
            if (!lines.length) {
                CB.mountTemplate(root, 'tpl-checkout-empty');
                return;
            }

            var subtotal = lines.reduce(function (s, l) { return s + l.lineTotal; }, 0);
            var fee = CB.orders.shippingFee();
            var total = subtotal + fee;
            var prof = user.address || {};
            var hasProfileAddress = !!(prof.province && prof.detail);

            CB.mountTemplate(root, 'tpl-checkout');
            root.querySelector('input[name="addrMode"][value="profile"]').checked = hasProfileAddress;
            root.querySelector('input[name="addrMode"][value="custom"]').checked = !hasProfileAddress;
            var profileBoxText = root.querySelector('#profileAddressText');
            profileBoxText.textContent = 'Người nhận: ' + user.fullName + '\nSố điện thoại: ' + (user.phone || 'Chưa có') + '\nĐịa chỉ: ' + (CB.auth.formatAddress(prof) || 'Chưa cập nhật');
            profileBoxText.style.whiteSpace = 'pre-line';
            root.querySelector('#profileAddressBox').hidden = !hasProfileAddress;
            root.querySelector('#customAddressBox').hidden = hasProfileAddress;
            root.querySelector('#coFullName').value = user.fullName || '';
            root.querySelector('#coPhone').value = user.phone || '';
            var itemsHost = root.querySelector('#checkoutItems');
            lines.forEach(function (line) {
                var row = document.createElement('div');
                row.style.display = 'flex';
                row.style.justifyContent = 'space-between';
                row.style.marginBottom = '10px';
                row.style.fontSize = '14px';
                var name = document.createElement('span');
                name.textContent = line.product.name + ' × ' + line.qty;
                var amount = document.createElement('span');
                amount.textContent = U.fmtVND(line.lineTotal);
                row.append(name, amount);
                itemsHost.appendChild(row);
            });
            root.querySelector('#checkoutSubtotal').textContent = U.fmtVND(subtotal);
            root.querySelector('#checkoutShipping').textContent = U.fmtVND(fee);
            root.querySelector('#checkoutTotal').textContent = U.fmtVND(total);

            var form = root.querySelector('#checkoutForm');
            var alertBox = root.querySelector('#checkoutAlert');
            var profileBox = root.querySelector('#profileAddressBox');
            var customBox = root.querySelector('#customAddressBox');

            root.querySelectorAll('input[name="addrMode"]').forEach(function (radio) {
                radio.addEventListener('change', function () {
                    var useProf = radio.value === 'profile';
                    if (profileBox) profileBox.hidden = !useProf;
                    if (customBox) customBox.hidden = useProf;
                });
            });

            form.addEventListener('submit', function (e) {
                e.preventDefault();
                alertBox.style.display = 'none';

                var mode = (root.querySelector('input[name="addrMode"]:checked') || {}).value || 'custom';
                var shipping = {};

                if (mode === 'profile') {
                    if (!prof.province || !prof.detail) {
                        alertBox.textContent = 'Địa chỉ trong hồ sơ chưa đầy đủ. Vui lòng nhập địa chỉ mới.';
                        alertBox.style.display = 'block';
                        return;
                    }
                    shipping = {
                        fullName: user.fullName,
                        phone: user.phone,
                        province: prof.province,
                        district: prof.district,
                        ward: prof.ward,
                        detail: prof.detail
                    };
                } else {
                    var fn = root.querySelector('#coFullName').value.trim();
                    var ph = root.querySelector('#coPhone').value.trim();
                    var pv = root.querySelector('#coProvince').value.trim();
                    var dt = root.querySelector('#coDistrict').value.trim();
                    var wd = root.querySelector('#coWard').value.trim();
                    var de = root.querySelector('#coDetail').value.trim();
                    if (!fn || !ph || !pv || !de) {
                        alertBox.textContent = 'Vui lòng điền đầy đủ họ tên, số điện thoại, tỉnh/thành và địa chỉ chi tiết.';
                        alertBox.style.display = 'block';
                        return;
                    }
                    shipping = { fullName: fn, phone: ph, province: pv, district: dt, ward: wd, detail: de };
                }

                var payMethod = (root.querySelector('input[name="paymentMethod"]:checked') || {}).value || 'cod';
                var note = (root.querySelector('#coNote') || {}).value || '';

                shipping.source = (mode === 'profile') ? 'account' : 'new';

                var submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Đang xử lý đơn hàng...';
                }

                var res = CB.orders.place({
                    shipping: shipping,
                    paymentMethod: payMethod,
                    note: note,
                    token: getToken()
                });

                if (!res.ok) {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Đặt hàng';
                    }
                    var msg = res.error;
                    if (res.errors) msg = Object.values(res.errors).join(' ');
                    alertBox.textContent = msg || 'Có lỗi xảy ra khi tạo đơn hàng.';
                    alertBox.style.display = 'block';
                } else {
                    try { g.sessionStorage.removeItem(TOKEN_KEY); } catch (err) {}
                    CB.ui.refreshBadge();
                    g.location.href = 'checkout.html#/confirmation?order=' + encodeURIComponent(res.order.id) + '&new=1';
                }
            });
        },
        unmount: function () {}
    };
})(typeof window !== 'undefined' ? window : globalThis);
