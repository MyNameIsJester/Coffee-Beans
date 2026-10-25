/* Giỏ hàng: chỉ dùng được khi đã đăng nhập. Số lượng bị giới hạn theo tồn kho còn bán được. */
(function () {
    'use strict';
    var U = CB.util;
    var user = CB.auth.requireLogin();
    if (!user) return;
    var root = document.getElementById('cartRoot');

    var QTY_BTN = 'width:28px;height:28px;border:1px solid #ddd;background:#f7fafc;cursor:pointer;border-radius:4px;font-size:16px;';
    var PROBLEM = {
        unavailable: 'Sản phẩm không còn được bán. Hãy xóa khỏi giỏ hàng.',
        noprice: 'Sản phẩm chưa có giá bán. Hãy xóa khỏi giỏ hàng.'
    };

    function lineHtml(l) {
        var p = l.product;
        var note = '';
        if (l.problem === 'stock') {
            note = '<div class="cb-field-error">Chỉ còn ' + p.available + ' sản phẩm trong kho. ' +
                (p.available > 0 ? '<a href="#" data-fix="' + U.esc(l.productId) + '" data-max="' + p.available + '">Đặt lại ' + p.available + '</a>' : 'Hãy xóa khỏi giỏ hàng.') + '</div>';
        } else if (l.problem) {
            note = '<div class="cb-field-error">' + PROBLEM[l.problem] + '</div>';
        }
        var name = p ? U.esc(p.name) : 'Sản phẩm không còn tồn tại';
        return '<tr data-id="' + U.esc(l.productId) + '"><td><div class="product-cell">' +
            '<img src="' + U.esc(p ? p.image : CB.catalog.placeholderImage) + '" alt="" class="product-img" />' +
            '<div><div style="font-weight:500;margin-bottom:4px;">' +
            (p ? '<a href="product-detail.html?id=' + encodeURIComponent(l.productId) + '" style="color:inherit;text-decoration:none;">' + name + '</a>' : name) + '</div>' +
            '<div style="font-size:12px;color:#666;">Loại: ' + U.esc(p ? p.categoryName : '') + '</div>' + note + '</div></div></td>' +
            '<td data-label="Số lượng" style="text-align:center;"><div style="display:flex;align-items:center;justify-content:center;gap:8px;">' +
            '<button type="button" data-act="minus" style="' + QTY_BTN + '" aria-label="Giảm số lượng">−</button>' +
            '<input type="number" data-act="qty" min="1" value="' + l.qty + '" aria-label="Số lượng" style="width:56px;text-align:center;padding:5px;border:1px solid #ddd;border-radius:4px;" />' +
            '<button type="button" data-act="plus" style="' + QTY_BTN + '" aria-label="Tăng số lượng">+</button></div></td>' +
            '<td data-label="Giá" style="text-align:right;"><span style="color:var(--coffee);font-weight:600;">' + (l.unitPrice === null ? '—' : U.fmtVND(l.unitPrice)) + '</span></td>' +
            '<td data-label="Thành tiền" style="text-align:right;"><span style="font-weight:600;">' + (l.unitPrice === null ? '—' : U.fmtVND(l.lineTotal)) + '</span></td>' +
            '<td style="text-align:right;"><button type="button" data-act="remove" title="Xóa khỏi giỏ hàng" aria-label="Xóa khỏi giỏ hàng" style="border:none;background:none;color:#c62828;cursor:pointer;font-size:18px;">✕</button></td></tr>';
    }

    function render(message) {
        CB.ui.refreshBadge();
        var lines = CB.cart.detailed();
        if (!lines.length) {
            root.innerHTML = '<h1 class="section-title">Giỏ hàng của bạn</h1>' +
                '<div class="cb-empty"><p style="font-size:1.1em;margin-bottom:12px;">Giỏ hàng đang trống.</p>' +
                '<a href="products.html">← Tiếp tục mua sắm</a></div>';
            return;
        }
        var subtotal = lines.reduce(function (s, l) { return s + l.lineTotal; }, 0);
        var fee = CB.orders.shippingFee();
        var blocked = lines.some(function (l) { return l.problem; });
        root.innerHTML =
            '<h1 class="section-title">Giỏ hàng của bạn</h1>' +
            (message ? '<div class="cb-alert cb-alert-error" role="alert">' + U.esc(message) + '</div>' : '') +
            '<div class="cart-layout">' +
            '<section class="cart-items">' +
            '<table class="cart-table"><thead><tr><th>Sản phẩm</th><th style="text-align:center;">Số lượng</th>' +
            '<th style="text-align:right;">Giá</th><th style="text-align:right;">Thành tiền</th><th></th></tr></thead><tbody>' +
            lines.map(lineHtml).join('') + '</tbody></table>' +
            '<button type="button" id="clearCart" style="border:none;background:none;color:#888;cursor:pointer;text-decoration:underline;">Xóa toàn bộ giỏ hàng</button></section>' +
            '<aside class="cart-summary">' +
            '<h3 style="margin:0 0 16px 0;font-size:18px;color:var(--coffee-900);">Tổng kết</h3>' +
            '<div style="display:grid;gap:12px;margin-bottom:20px;">' +
            '<div style="display:flex;justify-content:space-between;font-size:14px;"><span style="color:#666;">Tạm tính</span><strong style="color:var(--coffee);">' + U.fmtVND(subtotal) + '</strong></div>' +
            '<div style="display:flex;justify-content:space-between;font-size:14px;"><span style="color:#666;">Phí vận chuyển</span><strong style="color:var(--coffee);">' + U.fmtVND(fee) + '</strong></div>' +
            '<div style="border-top:1px solid #eee;padding-top:12px;display:flex;justify-content:space-between;"><span style="font-weight:600;color:var(--coffee-900);">Tổng tiền</span><strong style="font-size:18px;color:var(--coffee);">' + U.fmtVND(subtotal + fee) + '</strong></div></div>' +
            (blocked ? '<p class="cb-field-error" style="margin-bottom:12px;">Vui lòng xử lý các sản phẩm có cảnh báo trước khi thanh toán.</p>' : '') +
            '<div style="display:flex;gap:12px;">' +
            '<a href="products.html" style="flex:1;text-align:center;padding:12px 14px;background:#fff;color:#333;border:1px solid #ddd;border-radius:8px;font-weight:600;text-decoration:none;">Tiếp tục mua</a>' +
            (blocked
                ? '<span style="flex:1;text-align:center;padding:12px 14px;background:#ddd;color:#888;border-radius:8px;font-weight:600;cursor:not-allowed;">Thanh toán</span>'
                : '<a href="checkout.html" style="flex:1;text-align:center;padding:12px 14px;background:var(--gold);color:var(--coffee-900);border-radius:8px;font-weight:600;text-decoration:none;">Thanh toán</a>') +
            '</div></aside></div>';
    }

    function setQty(id, qty) {
        var r = CB.cart.setQty(id, qty);
        render(r.ok ? '' : r.error);
    }

    root.addEventListener('click', function (e) {
        var fix = e.target.closest('[data-fix]');
        if (fix) {
            e.preventDefault();
            setQty(fix.getAttribute('data-fix'), parseInt(fix.getAttribute('data-max'), 10));
            return;
        }
        if (e.target.id === 'clearCart') {
            if (confirm('Xóa toàn bộ sản phẩm trong giỏ hàng?')) { CB.cart.clear(); render(); }
            return;
        }
        var btn = e.target.closest('[data-act]');
        if (!btn) return;
        var tr = btn.closest('tr');
        var id = tr.getAttribute('data-id');
        var cur = CB.cart.items().filter(function (i) { return i.productId === id; })[0];
        var act = btn.getAttribute('data-act');
        if (act === 'remove') { CB.cart.remove(id); render(); }
        else if (act === 'plus') setQty(id, cur.qty + 1);
        else if (act === 'minus') {
            if (cur.qty <= 1) render('Số lượng tối thiểu là 1. Dùng nút ✕ để xóa sản phẩm.');
            else setQty(id, cur.qty - 1);
        }
    });
    root.addEventListener('change', function (e) {
        if (e.target.getAttribute('data-act') !== 'qty') return;
        var id = e.target.closest('tr').getAttribute('data-id');
        var n = Number(e.target.value);
        if (!isFinite(n) || n < 1 || Math.floor(n) !== n) { render('Số lượng phải là số nguyên từ 1 trở lên.'); return; }
        setQty(id, n);
    });

    render();
})();
