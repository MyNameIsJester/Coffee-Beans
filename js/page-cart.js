/* CoffeeBeans - View: Cart (Giỏ hàng)
   File: js/page-cart.js
*/
(function (g) {
    'use strict';
    var CB = (g.CB = g.CB || {});
    var U = CB.util;
    CB.views = CB.views || {};

    var QTY_BTN = 'width:28px;height:28px;border:1px solid #ddd;background:#f7fafc;cursor:pointer;border-radius:4px;font-size:16px;';
    var PROBLEM = {
        unavailable: 'Sản phẩm không còn được bán. Hãy xóa khỏi giỏ hàng.',
        noprice: 'Sản phẩm chưa có giá bán. Hãy xóa khỏi giỏ hàng.'
    };

    function lineHtml(l) {
        var p = l.product;
        var note = '';
        if (l.problem === 'stock') {
            note = '<div class="cb-field-error" style="color:#d32f2f;font-size:12px;margin-top:4px;">Chỉ còn ' + p.available + ' sản phẩm trong kho. ' +
                (p.available > 0 ? '<a href="#" data-fix="' + U.esc(l.productId) + '" data-max="' + p.available + '" style="text-decoration:underline;color:var(--coffee);">Đặt lại ' + p.available + '</a>' : 'Hãy xóa khỏi giỏ hàng.') + '</div>';
        } else if (l.problem) {
            note = '<div class="cb-field-error" style="color:#d32f2f;font-size:12px;margin-top:4px;">' + PROBLEM[l.problem] + '</div>';
        }
        var name = p ? U.esc(p.name) : 'Sản phẩm không còn tồn tại';
        return '<tr data-id="' + U.esc(l.productId) + '" style="border-bottom:1px solid #eee;">' +
            '<td style="padding:14px 10px;"><div class="product-cell" style="display:flex;gap:12px;align-items:center;">' +
            '<img src="' + U.esc(p ? p.image : CB.catalog.placeholderImage) + '" alt="" style="width:60px;height:60px;object-fit:cover;border-radius:6px;" />' +
            '<div><div style="font-weight:600;margin-bottom:4px;">' +
            (p ? '<a href="index.html#/product?id=' + encodeURIComponent(l.productId) + '" style="color:var(--coffee-900);">' + name + '</a>' : name) + '</div>' +
            '<div style="font-size:12px;color:#777;">Loại: ' + U.esc(p ? p.categoryName : '') + '</div>' + note + '</div></div></td>' +
            '<td style="text-align:center;padding:14px 10px;"><div style="display:flex;align-items:center;justify-content:center;gap:6px;">' +
            '<button type="button" data-act="minus" style="' + QTY_BTN + '" aria-label="Giảm số lượng">−</button>' +
            '<input type="number" data-act="qty" min="1" value="' + l.qty + '" aria-label="Số lượng" style="width:50px;text-align:center;padding:4px;border:1px solid #ddd;border-radius:4px;" />' +
            '<button type="button" data-act="plus" style="' + QTY_BTN + '" aria-label="Tăng số lượng">+</button></div></td>' +
            '<td style="text-align:right;padding:14px 10px;"><span style="color:var(--coffee);font-weight:600;">' + (l.unitPrice === null ? '—' : U.fmtVND(l.unitPrice)) + '</span></td>' +
            '<td style="text-align:right;padding:14px 10px;"><span style="font-weight:700;">' + (l.unitPrice === null ? '—' : U.fmtVND(l.lineTotal)) + '</span></td>' +
            '<td style="text-align:right;padding:14px 10px;"><button type="button" data-act="remove" title="Xóa khỏi giỏ" style="border:none;background:none;color:#c62828;cursor:pointer;font-size:18px;">✕</button></td></tr>';
    }

    CB.views.cart = {
        mount: function (root, params) {
            var user = CB.auth.requireLogin();
            if (!user) return;

            function render(message) {
                CB.ui.refreshBadge();
                var lines = CB.cart.detailed();
                if (!lines.length) {
                    root.innerHTML =
                        '<div class="container" style="padding:60px 20px;">' +
                        '<div class="cb-empty">' +
                        '  <h1 style="font-size:24px;color:var(--coffee-900);margin-bottom:12px;">Giỏ hàng của bạn</h1>' +
                        '  <p style="color:var(--muted);margin-bottom:24px;">Giỏ hàng đang trống.</p>' +
                        '  <a href="index.html#/products" class="btn btn-primary">← Tiếp tục mua sắm</a>' +
                        '</div></div>';
                    return;
                }

                var subtotal = lines.reduce(function (s, l) { return s + l.lineTotal; }, 0);
                var fee = CB.orders.shippingFee();
                var blocked = lines.some(function (l) { return l.problem; });

                root.innerHTML =
                    '<div class="container" style="padding:40px 20px;">' +
                    '  <h1 style="font-size:28px;color:var(--coffee-900);margin-bottom:24px;font-family:\'Playfair Display\', serif;">Giỏ hàng của bạn</h1>' +
                    (message ? '<div class="alert alert-danger" style="margin-bottom:20px;">' + U.esc(message) + '</div>' : '') +
                    '  <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:30px;align-items:flex-start;">' +
                    '    <section style="background:#fff;padding:24px;border-radius:12px;box-shadow:var(--shadow);overflow-x:auto;">' +
                    '      <table style="width:100%;border-collapse:collapse;min-width:500px;">' +
                    '        <thead><tr style="border-bottom:2px solid #eee;text-align:left;color:#666;font-size:13px;">' +
                    '          <th style="padding:10px;">Sản phẩm</th><th style="text-align:center;padding:10px;">Số lượng</th><th style="text-align:right;padding:10px;">Đơn giá</th><th style="text-align:right;padding:10px;">Thành tiền</th><th></th>' +
                    '        </tr></thead>' +
                    '        <tbody>' + lines.map(lineHtml).join('') + '</tbody>' +
                    '      </table>' +
                    '      <div style="margin-top:20px;text-align:right;">' +
                    '        <button type="button" id="clearCartBtn" style="color:#888;font-size:13px;text-decoration:underline;cursor:pointer;">Xóa toàn bộ giỏ hàng</button>' +
                    '      </div>' +
                    '    </section>' +

                    '    <aside style="background:#fff;padding:24px;border-radius:12px;box-shadow:var(--shadow);">' +
                    '      <h3 style="font-size:20px;color:var(--coffee-900);margin-bottom:16px;">Tổng đơn hàng</h3>' +
                    '      <div style="display:flex;justify-content:space-between;margin-bottom:12px;font-size:14px;color:#555;">' +
                    '        <span>Tạm tính:</span><span>' + U.fmtVND(subtotal) + '</span>' +
                    '      </div>' +
                    '      <div style="display:flex;justify-content:space-between;margin-bottom:16px;font-size:14px;color:#555;">' +
                    '        <span>Phí vận chuyển:</span><span>' + U.fmtVND(fee) + '</span>' +
                    '      </div>' +
                    '      <div style="display:flex;justify-content:space-between;margin-bottom:24px;padding-top:16px;border-top:1px solid #eee;font-size:18px;font-weight:700;color:var(--coffee);">' +
                    '        <span>Tổng thanh toán:</span><span>' + U.fmtVND(subtotal + fee) + '</span>' +
                    '      </div>' +
                    '      <div style="display:flex;flex-direction:column;gap:10px;">' +
                    (blocked
                        ? '<button type="button" class="btn btn-primary" disabled style="width:100%;">Cần sửa lỗi để thanh toán</button>'
                        : '<a href="checkout.html#/checkout" class="btn btn-primary" style="width:100%;">Tiến hành thanh toán →</a>') +
                    '        <a href="index.html#/products" class="btn btn-outline" style="width:100%;text-align:center;">← Tiếp tục mua sắm</a>' +
                    '      </div>' +
                    '    </aside>' +
                    '  </div>' +
                    '</div>';

                var clearBtn = root.querySelector('#clearCartBtn');
                if (clearBtn) {
                    clearBtn.addEventListener('click', function () {
                        if (g.confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
                            CB.cart.clear();
                            render();
                        }
                    });
                }
            }

            root.addEventListener('click', function (e) {
                var fix = e.target.closest('[data-fix]');
                if (fix) {
                    e.preventDefault();
                    CB.cart.set(fix.getAttribute('data-fix'), parseInt(fix.getAttribute('data-max'), 10));
                    render();
                    return;
                }
                var tr = e.target.closest('tr[data-id]');
                if (!tr) return;
                var id = tr.getAttribute('data-id');
                var act = e.target.getAttribute('data-act');
                if (act === 'remove') {
                    CB.cart.remove(id);
                    render();
                } else if (act === 'minus') {
                    var cur = CB.cart.get(id);
                    if (cur <= 1) CB.cart.remove(id);
                    else CB.cart.set(id, cur - 1);
                    render();
                } else if (act === 'plus') {
                    var r = CB.cart.add(id, 1);
                    if (!r.ok) render(r.error);
                    else render();
                }
            });

            root.addEventListener('change', function (e) {
                if (e.target.getAttribute('data-act') !== 'qty') return;
                var tr = e.target.closest('tr[data-id]');
                if (!tr) return;
                var id = tr.getAttribute('data-id');
                var val = parseInt(e.target.value, 10);
                if (!val || val < 1) {
                    CB.cart.remove(id);
                    render();
                } else {
                    var r = CB.cart.set(id, val);
                    if (!r.ok) render(r.error);
                    else render();
                }
            });

            render();
        },
        unmount: function () {}
    };
})(typeof window !== 'undefined' ? window : globalThis);
