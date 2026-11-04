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
                root.innerHTML =
                    '<div class="container" style="padding:60px 20px;">' +
                    '<div class="cb-empty">' +
                    '  <h1 style="font-size:24px;color:var(--coffee-900);margin-bottom:12px;">Thanh toán đơn hàng</h1>' +
                    '  <p style="color:var(--muted);margin-bottom:20px;">Giỏ hàng của bạn đang trống.</p>' +
                    '  <a href="index.html#/products" class="btn btn-primary">← Mua sắm ngay</a>' +
                    '</div></div>';
                return;
            }

            var subtotal = lines.reduce(function (s, l) { return s + l.lineTotal; }, 0);
            var fee = CB.orders.shippingFee();
            var total = subtotal + fee;
            var prof = user.address || {};
            var hasProfileAddress = !!(prof.province && prof.detail);

            var itemsHtml = lines.map(function (l) {
                return '<div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:14px;">' +
                    '<span>' + U.esc(l.product.name) + ' <strong style="color:#777;">× ' + l.qty + '</strong></span>' +
                    '<span>' + U.fmtVND(l.lineTotal) + '</span>' +
                    '</div>';
            }).join('');

            root.innerHTML =
                '<div class="container" style="padding:40px 20px;">' +
                '  <h1 style="font-size:28px;color:var(--coffee-900);margin-bottom:24px;font-family:\'Playfair Display\', serif;">Thanh toán đơn hàng</h1>' +
                '  <div id="checkoutAlert" style="display:none;margin-bottom:20px;" class="alert alert-danger"></div>' +

                '  <form id="checkoutForm" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:30px;align-items:flex-start;">' +
                '    <!-- Left: Info & Shipping -->' +
                '    <div style="background:#fff;padding:28px;border-radius:12px;box-shadow:var(--shadow);">' +
                '      <h3 style="font-size:18px;color:var(--coffee-900);margin-bottom:16px;">1. Địa chỉ nhận hàng</h3>' +
                '      <div style="margin-bottom:16px;">' +
                '        <label style="display:flex;align-items:center;gap:8px;font-size:14px;cursor:pointer;margin-bottom:8px;">' +
                '          <input type="radio" name="addrMode" value="profile"' + (hasProfileAddress ? ' checked' : '') + ' />' +
                '          Sử dụng địa chỉ từ hồ sơ cá nhân' +
                '        </label>' +
                '        <label style="display:flex;align-items:center;gap:8px;font-size:14px;cursor:pointer;">' +
                '          <input type="radio" name="addrMode" value="custom"' + (!hasProfileAddress ? ' checked' : '') + ' />' +
                '          Nhập địa chỉ nhận hàng mới' +
                '        </label>' +
                '      </div>' +

                '      <div id="profileAddressBox" style="background:#fdfbf9;padding:16px;border-radius:8px;border:1px solid #eee;margin-bottom:20px;' + (hasProfileAddress ? '' : 'display:none;') + '">' +
                '        <div style="font-size:14px;line-height:1.6;"><strong>Người nhận:</strong> ' + U.esc(user.fullName) + '<br>' +
                '        <strong>Số điện thoại:</strong> ' + U.esc(user.phone || 'Chưa có') + '<br>' +
                '        <strong>Địa chỉ:</strong> ' + U.esc(CB.auth.formatAddress(prof) || 'Chưa cập nhật') + '</div>' +
                '        <div style="margin-top:10px;"><a href="account.html#/profile" style="font-size:13px;color:var(--coffee);text-decoration:underline;">Chỉnh sửa hồ sơ</a></div>' +
                '      </div>' +

                '      <div id="customAddressBox" style="margin-bottom:20px;' + (!hasProfileAddress ? '' : 'display:none;') + '">' +
                '        <div class="form-group"><label for="coFullName">Họ và tên người nhận</label><input type="text" id="coFullName" value="' + U.esc(user.fullName) + '" /></div>' +
                '        <div class="form-group"><label for="coPhone">Số điện thoại</label><input type="tel" id="coPhone" value="' + U.esc(user.phone || '') + '" /></div>' +
                '        <div class="form-group"><label for="coProvince">Tỉnh / Thành phố</label><input type="text" id="coProvince" placeholder="VD: TP. Hồ Chí Minh" /></div>' +
                '        <div class="form-group"><label for="coDistrict">Quận / Huyện</label><input type="text" id="coDistrict" placeholder="VD: Quận 1" /></div>' +
                '        <div class="form-group"><label for="coWard">Phường / Xã</label><input type="text" id="coWard" placeholder="VD: Phường Bến Nghé" /></div>' +
                '        <div class="form-group"><label for="coDetail">Số nhà, tên đường</label><input type="text" id="coDetail" placeholder="VD: 123 Lê Lợi" /></div>' +
                '      </div>' +

                '      <div class="form-group"><label for="coNote">Ghi chú đơn hàng (tùy chọn)</label><textarea id="coNote" placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."></textarea></div>' +

                '      <h3 style="font-size:18px;color:var(--coffee-900);margin:24px 0 16px;">2. Phương thức thanh toán</h3>' +
                '      <div style="display:flex;flex-direction:column;gap:12px;">' +
                '        <label style="display:flex;align-items:center;gap:10px;padding:12px;border:1px solid #ddd;border-radius:8px;cursor:pointer;">' +
                '          <input type="radio" name="paymentMethod" value="cod" checked />' +
                '          <span><strong>Thanh toán khi nhận hàng (COD)</strong><br><small style="color:#777;">Thanh toán tiền mặt cho nhân viên giao hàng</small></span>' +
                '        </label>' +
                '        <label style="display:flex;align-items:center;gap:10px;padding:12px;border:1px solid #ddd;border-radius:8px;cursor:pointer;">' +
                '          <input type="radio" name="paymentMethod" value="bank" />' +
                '          <span><strong>Chuyển khoản ngân hàng</strong><br><small style="color:#777;">Chuyển khoản qua số tài khoản sau khi tạo đơn</small></span>' +
                '        </label>' +
                '        <label style="display:flex;align-items:center;gap:10px;padding:12px;border:1px solid #ddd;border-radius:8px;cursor:pointer;">' +
                '          <input type="radio" name="paymentMethod" value="online" />' +
                '          <span><strong>Thanh toán trực tuyến (Mô phỏng)</strong><br><small style="color:#777;">Cổng thanh toán thẻ ATM / Visa / MoMo</small></span>' +
                '        </label>' +
                '      </div>' +
                '    </div>' +

                '    <!-- Right: Summary -->' +
                '    <div style="background:#fff;padding:28px;border-radius:12px;box-shadow:var(--shadow);">' +
                '      <h3 style="font-size:18px;color:var(--coffee-900);margin-bottom:16px;">Tóm tắt đơn hàng</h3>' +
                '      <div style="border-bottom:1px solid #eee;padding-bottom:16px;margin-bottom:16px;">' + itemsHtml + '</div>' +
                '      <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:14px;color:#666;"><span>Tạm tính:</span><span>' + U.fmtVND(subtotal) + '</span></div>' +
                '      <div style="display:flex;justify-content:space-between;margin-bottom:16px;font-size:14px;color:#666;"><span>Phí vận chuyển:</span><span>' + U.fmtVND(fee) + '</span></div>' +
                '      <div style="display:flex;justify-content:space-between;margin-bottom:24px;padding-top:16px;border-top:1px solid #eee;font-size:20px;font-weight:700;color:var(--coffee);">' +
                '        <span>Tổng cộng:</span><span>' + U.fmtVND(total) + '</span>' +
                '      </div>' +
                '      <button type="submit" id="placeOrderBtn" class="btn btn-primary" style="width:100%;padding:14px;font-size:16px;">Đặt hàng ngay</button>' +
                '      <p style="text-align:center;margin-top:14px;font-size:13px;"><a href="checkout.html#/cart" style="color:var(--coffee);">← Quay lại giỏ hàng</a></p>' +
                '    </div>' +
                '  </form>' +
                '</div>';

            var form = root.querySelector('#checkoutForm');
            var alertBox = root.querySelector('#checkoutAlert');
            var profileBox = root.querySelector('#profileAddressBox');
            var customBox = root.querySelector('#customAddressBox');

            root.querySelectorAll('input[name="addrMode"]').forEach(function (radio) {
                radio.addEventListener('change', function () {
                    var useProf = radio.value === 'profile';
                    if (profileBox) profileBox.style.display = useProf ? 'block' : 'none';
                    if (customBox) customBox.style.display = useProf ? 'none' : 'block';
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
