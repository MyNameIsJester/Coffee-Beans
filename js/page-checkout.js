/* Thanh toán: chọn địa chỉ (tài khoản / địa chỉ mới), phương thức thanh toán, đặt hàng từ giỏ hàng thật. */
(function () {
    'use strict';
    var U = CB.util;
    var user = CB.auth.requireLogin();
    if (!user) return;
    var root = document.getElementById('checkoutRoot');
    var TOKEN_KEY = 'cb_checkout_token';

    function token() {
        var t = null;
        try { t = sessionStorage.getItem(TOKEN_KEY); } catch (e) {}
        if (!t) {
            t = U.uid('co');
            try { sessionStorage.setItem(TOKEN_KEY, t); } catch (e) {}
        }
        return t;
    }
    function clearToken() { try { sessionStorage.removeItem(TOKEN_KEY); } catch (e) {} }

    var lines = CB.cart.detailed();
    var heading = '<h1 style="margin:0 0 1.5rem;font-size:1.75rem;color:#2d3748;font-weight:700;"><i class="fas fa-shopping-bag" style="margin-right:0.5rem;color:var(--coffee-500)"></i>Thanh toán đơn hàng</h1>';

    if (!lines.length) {
        root.innerHTML = heading + '<div class="cb-empty"><p style="font-size:1.1em;margin-bottom:12px;">Giỏ hàng đang trống nên chưa thể thanh toán.</p><a href="products.html">← Tiếp tục mua sắm</a></div>';
        return;
    }
    var problem = lines.some(function (l) { return l.problem; });
    if (problem) {
        root.innerHTML = heading + '<div class="cb-alert cb-alert-error" role="alert">Một số sản phẩm trong giỏ hàng không còn đủ điều kiện đặt hàng (hết hàng, vượt tồn kho hoặc ngừng bán).</div>' +
            '<a href="cart.html" style="color:var(--coffee);font-weight:600;">← Quay lại giỏ hàng để chỉnh sửa</a>';
        return;
    }

    var hasAddr = CB.auth.hasAddress(user);
    var subtotal = CB.cart.subtotal();
    var fee = CB.orders.shippingFee();
    var provinces = ['TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng', 'Đồng Nai', 'Bình Dương', 'Khánh Hòa', 'Lâm Đồng', 'Đắk Lắk', 'Thừa Thiên Huế', 'Quảng Ninh'];
    var STYLE_RO = 'padding:12px;background:#f7fafc;border-radius:6px;border:1px solid #e2e8f0;font-weight:500;color:#2d3748;';

    function field(id, label, value, placeholder, extra) {
        return '<div class="form-group" style="margin-bottom:1rem;"><label for="' + id + '">' + label + ' <span style="color:#e53e3e">*</span></label>' +
            '<input type="text" id="' + id + '" name="' + id + '" class="form-control" style="min-height:0;" value="' + U.esc(value || '') + '" placeholder="' + U.esc(placeholder || '') + '" ' + (extra || '') + ' />' +
            '<p class="cb-field-error" data-error-for="' + id + '"></p></div>';
    }
    function payOption(value, icon, title, desc, checked) {
        return '<div class="payment-option' + (checked ? ' selected' : '') + '" data-payment="' + value + '">' +
            '<input type="radio" name="paymentMethod" id="pay-' + value + '" value="' + value + '"' + (checked ? ' checked' : '') + ' />' +
            '<i class="fas ' + icon + ' icon"></i><div><div>' + title + '</div><small>' + desc + '</small></div></div>';
    }

    var itemsHtml = lines.map(function (l) {
        return '<div class="order-summary-item"><span>' + U.esc(l.product.name) + ' × ' + l.qty + '</span><span>' + U.fmtVND(l.lineTotal) + '</span></div>';
    }).join('');

    root.innerHTML = heading +
        '<div class="checkout-container">' +
        '<div class="checkout-section"><h2 class="section-title"><i class="fas fa-user-circle" style="margin-right:0.5rem"></i>Thông tin khách hàng</h2>' +
        '<form id="checkoutForm" novalidate>' +
        '<div class="form-group"><label>Họ và tên</label><div style="' + STYLE_RO + '">' + U.esc(user.fullName) + '</div></div>' +
        '<div class="form-group"><label>Số điện thoại</label><div style="' + STYLE_RO + '">' + U.esc(user.phone) + '</div></div>' +
        '<div class="form-group"><label>Email</label><div style="' + STYLE_RO + '">' + U.esc(user.email) + '</div></div>' +

        '<h2 class="section-title"><i class="fas fa-map-marker-alt" style="margin-right:0.5rem"></i>Địa chỉ nhận hàng</h2>' +
        '<div class="form-group">' +
        '<div style="margin-bottom:12px;"><div style="display:flex;align-items:center;margin-bottom:10px;">' +
        '<input type="radio" id="addrAccount" name="addressOption" value="account"' + (hasAddr ? ' checked' : ' disabled') + ' style="margin-right:8px;" />' +
        '<label for="addrAccount" style="margin:0;cursor:pointer;">Dùng địa chỉ trong tài khoản</label></div>' +
        (hasAddr
            ? '<div id="accountAddrBox" style="margin-left:24px;padding:12px;background:#f7fafc;border-radius:6px;border-left:3px solid var(--coffee-500);">' +
              '<div style="margin-bottom:4px;"><strong>' + U.esc(user.fullName) + '</strong></div><div>📞 ' + U.esc(user.phone) + '</div><div>📍 ' + U.esc(CB.auth.formatAddress(user.address)) + '</div></div>'
            : '<div style="margin-left:24px;padding:12px;background:#fff8e1;border-radius:6px;font-size:14px;">Tài khoản chưa có địa chỉ đầy đủ. <a href="profile.html" style="color:var(--coffee);font-weight:600;">Cập nhật hồ sơ</a> hoặc nhập địa chỉ giao hàng mới bên dưới.</div>') +
        '</div>' +
        '<div style="margin-bottom:12px;"><div style="display:flex;align-items:center;margin-bottom:10px;">' +
        '<input type="radio" id="addrNew" name="addressOption" value="new"' + (hasAddr ? '' : ' checked') + ' style="margin-right:8px;" />' +
        '<label for="addrNew" style="margin:0;cursor:pointer;">Dùng địa chỉ giao hàng khác</label></div></div>' +
        '<div id="newAddrFields" style="margin-left:24px;"' + (hasAddr ? ' hidden' : '') + '>' +
        field('fullName', 'Tên người nhận', user.fullName, 'Họ và tên người nhận') +
        field('phone', 'Số điện thoại người nhận', user.phone, 'Ví dụ: 0901234567', 'inputmode="tel"') +
        field('province', 'Tỉnh / Thành phố', '', 'Chọn hoặc nhập tỉnh/thành phố', 'list="provinceList"') +
        '<datalist id="provinceList">' + provinces.map(function (p) { return '<option value="' + U.esc(p) + '">'; }).join('') + '</datalist>' +
        field('district', 'Quận / Huyện', '', 'Ví dụ: Quận 1') +
        field('ward', 'Phường / Xã', '', 'Ví dụ: Phường Bến Nghé') +
        field('detail', 'Số nhà, tên đường', '', 'Ví dụ: 12 Nguyễn Huệ') +
        '</div></div>' +

        '<h2 class="section-title"><i class="fas fa-credit-card" style="margin-right:0.5rem"></i>Phương thức thanh toán</h2>' +
        '<div class="payment-method">' +
        payOption('cod', 'fa-money-bill-wave', 'Thanh toán tiền mặt khi nhận hàng (COD)', 'Nhận hàng mới thanh toán tiền mặt', true) +
        payOption('bank', 'fa-university', 'Chuyển khoản ngân hàng', 'Thông tin chuyển khoản hiển thị sau khi đặt hàng', false) +
        payOption('online', 'fa-credit-card', 'Thanh toán trực tuyến (mô phỏng)', 'Chức năng minh họa, không có giao dịch thật', false) +
        '</div>' +
        '<div class="form-group"><label for="note">Ghi chú đơn hàng</label>' +
        '<textarea id="note" class="form-control" rows="3" maxlength="300" placeholder="Ghi chú về đơn hàng, thời gian nhận hàng..."></textarea></div>' +
        '</form></div>' +

        '<div class="checkout-section" style="position:sticky;top:1.5rem;"><h2 class="section-title"><i class="fas fa-shopping-basket" style="margin-right:0.5rem"></i>Đơn hàng của bạn</h2>' +
        '<div class="order-summary">' + itemsHtml +
        '<div style="border-top:1px solid #e2e8f0;margin:12px 0;"></div>' +
        '<div class="order-summary-item"><span>Tạm tính:</span><span>' + U.fmtVND(subtotal) + '</span></div>' +
        '<div class="order-summary-item"><span>Phí vận chuyển:</span><span>' + U.fmtVND(fee) + '</span></div>' +
        '<div class="order-total"><span>Tổng cộng:</span><span>' + U.fmtVND(subtotal + fee) + '</span></div></div>' +
        '<p id="formAlert" class="cb-alert cb-alert-error" role="alert" hidden style="margin-top:16px;"></p>' +
        '<button type="button" id="placeOrder" class="btn-checkout" style="margin-top:16px;background-color:var(--coffee);">Đặt hàng</button>' +
        '<p style="margin-top:12px;font-size:13px;text-align:center;"><a href="cart.html" style="color:var(--coffee);">← Quay lại giỏ hàng</a></p>' +
        '</div></div>';

    var form = document.getElementById('checkoutForm');
    var alertBox = document.getElementById('formAlert');

    function syncAddress() {
        var useNew = form.elements.addressOption.value === 'new';
        document.getElementById('newAddrFields').hidden = !useNew;
        document.getElementById('addrAccount').closest('div').parentNode.classList.toggle('muted', useNew);
    }
    function syncPayment() {
        document.querySelectorAll('.payment-option').forEach(function (el) {
            var r = el.querySelector('input');
            el.classList.toggle('selected', r.checked);
        });
    }
    form.addEventListener('change', function () { syncAddress(); syncPayment(); });
    document.querySelectorAll('.payment-option').forEach(function (el) {
        el.addEventListener('click', function () {
            el.querySelector('input').checked = true;
            syncPayment();
        });
    });
    syncAddress();

    function clearErrors() {
        form.querySelectorAll('.cb-field-error').forEach(function (e) { e.textContent = ''; });
        form.querySelectorAll('.cb-input-error').forEach(function (e) { e.classList.remove('cb-input-error'); });
        alertBox.hidden = true;
    }

    var submitting = false;
    var btn = document.getElementById('placeOrder');
    btn.addEventListener('click', function () {
        if (submitting) return;
        clearErrors();
        var useNew = form.elements.addressOption.value === 'new';
        var data = {
            token: token(),
            paymentMethod: form.elements.paymentMethod.value,
            note: document.getElementById('note').value,
            shipping: { source: useNew ? 'new' : 'account' }
        };
        if (useNew) {
            ['fullName', 'phone', 'province', 'district', 'ward', 'detail'].forEach(function (k) {
                data.shipping[k] = document.getElementById(k).value;
            });
        }
        submitting = true;
        btn.disabled = true;
        btn.textContent = 'Đang xử lý...';
        var r = CB.orders.place(data);
        if (r.ok) {
            clearToken();
            location.href = 'order-confirmation.html?new=1&order=' + encodeURIComponent(r.order.id);
            return;
        }
        submitting = false;
        btn.disabled = false;
        btn.textContent = 'Đặt hàng';
        if (r.errors) {
            Object.keys(r.errors).forEach(function (k) {
                var el = form.querySelector('[data-error-for="' + k + '"]');
                if (el) el.textContent = r.errors[k];
                var input = document.getElementById(k);
                if (input) input.classList.add('cb-input-error');
            });
        }
        var msg = r.error + (r.problems ? ' ' + r.problems.join(' ') : '');
        alertBox.textContent = msg;
        alertBox.hidden = false;
        if (r.code === 'CART_INVALID' || r.code === 'EMPTY_CART') {
            alertBox.innerHTML = U.esc(msg) + ' <a href="cart.html" style="color:inherit;font-weight:600;">Quay lại giỏ hàng</a>';
        }
    });
})();
