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
                    CB.mountTemplate(root, 'tpl-cart-empty');
                    return;
                }

                var subtotal = lines.reduce(function (s, l) { return s + l.lineTotal; }, 0);
                var fee = CB.orders.shippingFee();
                var blocked = lines.some(function (l) { return l.problem; });

                CB.mountTemplate(root, 'tpl-cart');
                var alertBox = root.querySelector('#cartAlert');
                if (message) {
                    alertBox.textContent = message;
                    alertBox.hidden = false;
                }
                root.querySelector('#cartItems').innerHTML = lines.map(lineHtml).join('');
                root.querySelector('#cartSubtotal').textContent = U.fmtVND(subtotal);
                root.querySelector('#cartShipping').textContent = U.fmtVND(fee);
                root.querySelector('#cartTotal').textContent = U.fmtVND(subtotal + fee);
                if (blocked) {
                    var checkoutLink = root.querySelector('#cartCheckoutLink');
                    var disabled = document.createElement('button');
                    disabled.type = 'button';
                    disabled.className = 'btn btn-primary';
                    disabled.disabled = true;
                    disabled.style.width = '100%';
                    disabled.textContent = 'Cần sửa lỗi để thanh toán';
                    checkoutLink.replaceWith(disabled);
                }

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

            if (!root.dataset.cartHandlersBound) {
            root.dataset.cartHandlersBound = '1';
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
            }

            render();
        },
        unmount: function () {}
    };
})(typeof window !== 'undefined' ? window : globalThis);
