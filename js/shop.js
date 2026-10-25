/* CoffeeBeans - Giỏ hàng và đơn hàng.
   - Giỏ hàng lưu riêng theo từng tài khoản, chỉ dùng được khi đã đăng nhập.
   - Đơn hàng lưu "ảnh chụp" tên/giá tại thời điểm đặt, nên đổi giá sau này không làm đổi đơn cũ.
   - Tồn kho chỉ bị trừ khi đơn chuyển sang "Đã giao" (đúng một lần). */
(function (g) {
    'use strict';
    var CB = (g.CB = g.CB || {});
    var db = CB.db,
        K = CB.db.KEYS,
        U = CB.util;

    var ST = { NEW: 'Mới đặt', PROCESSED: 'Đã xử lý', DELIVERED: 'Đã giao', CANCELED: 'Hủy' };
    var NEXT = {};
    NEXT[ST.NEW] = [ST.PROCESSED, ST.CANCELED];
    NEXT[ST.PROCESSED] = [ST.DELIVERED, ST.CANCELED];
    NEXT[ST.DELIVERED] = [];
    NEXT[ST.CANCELED] = [];

    var PAYMENTS = {
        cod: 'Thanh toán tiền mặt khi nhận hàng',
        bank: 'Chuyển khoản ngân hàng',
        online: 'Thanh toán trực tuyến (mô phỏng)'
    };

    function fail(error, extra) {
        return Object.assign({ ok: false, error: error }, extra || {});
    }
    function allOrders() {
        return db.read(K.orders, []);
    }

    /* ================= Giỏ hàng ================= */
    function cartMap() {
        return db.read(K.carts, {});
    }
    function userCart(userId) {
        return cartMap()[userId] || [];
    }
    function saveUserCart(userId, items) {
        var m = cartMap();
        m[userId] = items;
        db.write(K.carts, m);
    }

    var cart = {
        items: function () {
            var u = CB.auth.current();
            return u ? userCart(u.id) : [];
        },
        /* Tổng số lượng sản phẩm trong giỏ (hiển thị trên biểu tượng giỏ hàng) */
        count: function () {
            return cart.items().reduce(function (s, i) {
                return s + i.qty;
            }, 0);
        },
        add: function (productId, qty) {
            var u = CB.auth.current();
            if (!u)
                return fail('Vui lòng đăng nhập để sử dụng giỏ hàng.', { code: 'LOGIN_REQUIRED' });
            qty = qty === undefined ? 1 : Number(qty);
            if (!isFinite(qty) || qty < 1 || Math.floor(qty) !== qty)
                return fail('Số lượng phải là số nguyên từ 1 trở lên.');
            var v = CB.catalog.view(productId);
            if (!v || !v.visible) return fail('Sản phẩm không còn được bán.');
            if (v.price === null) return fail('Sản phẩm này chưa có giá bán nên chưa thể đặt mua.');
            var items = userCart(u.id);
            var line = items.filter(function (i) {
                return i.productId === productId;
            })[0];
            var inCart = line ? line.qty : 0;
            if (inCart + qty > v.available) {
                var canAdd = Math.max(0, v.available - inCart);
                return fail(
                    v.available === 0
                        ? 'Sản phẩm này hiện đã hết hàng.'
                        : 'Chỉ còn ' + v.available + ' sản phẩm trong kho' +
                          (inCart ? ' (bạn đã có ' + inCart + ' trong giỏ)' : '') + '.',
                    { code: 'OUT_OF_STOCK', canAdd: canAdd }
                );
            }
            if (line) line.qty += qty;
            else items.push({ productId: productId, qty: qty });
            saveUserCart(u.id, items);
            return { ok: true, count: cart.count() };
        },
        setQty: function (productId, qty) {
            var u = CB.auth.current();
            if (!u) return fail('Vui lòng đăng nhập.', { code: 'LOGIN_REQUIRED' });
            qty = Number(qty);
            if (!isFinite(qty) || qty < 1 || Math.floor(qty) !== qty)
                return fail('Số lượng phải là số nguyên từ 1 trở lên.');
            var items = userCart(u.id);
            var line = items.filter(function (i) {
                return i.productId === productId;
            })[0];
            if (!line) return fail('Sản phẩm không có trong giỏ hàng.');
            var v = CB.catalog.view(productId);
            if (v && qty > v.available)
                return fail('Chỉ còn ' + v.available + ' sản phẩm trong kho.', { code: 'OUT_OF_STOCK', max: v.available });
            line.qty = qty;
            saveUserCart(u.id, items);
            return { ok: true };
        },
        remove: function (productId) {
            var u = CB.auth.current();
            if (!u) return fail('Vui lòng đăng nhập.', { code: 'LOGIN_REQUIRED' });
            saveUserCart(
                u.id,
                userCart(u.id).filter(function (i) {
                    return i.productId !== productId;
                })
            );
            return { ok: true };
        },
        clear: function () {
            var u = CB.auth.current();
            if (u) saveUserCart(u.id, []);
        },
        /* Giỏ hàng kèm thông tin sản phẩm hiện tại. problem: null | 'unavailable' | 'noprice' | 'stock' */
        detailed: function () {
            return cart.items().map(function (i) {
                var v = CB.catalog.view(i.productId);
                var problem = null;
                if (!v || !v.visible) problem = 'unavailable';
                else if (v.price === null) problem = 'noprice';
                else if (i.qty > v.available) problem = 'stock';
                return {
                    productId: i.productId,
                    qty: i.qty,
                    product: v,
                    unitPrice: v ? v.price : null,
                    lineTotal: v && v.price !== null ? v.price * i.qty : 0,
                    problem: problem
                };
            });
        },
        subtotal: function () {
            return cart.detailed().reduce(function (s, l) {
                return s + l.lineTotal;
            }, 0);
        }
    };

    /* ================= Đơn hàng ================= */
    var orders = {
        STATUS: ST,
        PAYMENTS: PAYMENTS,
        allowedNext: function (status) {
            return (NEXT[status] || []).slice();
        },
        shippingFee: function () {
            return db.settings().shippingFee;
        },
        all: function () {
            return allOrders();
        },
        byId: function (id) {
            return allOrders().filter(function (o) {
                return o.id === id;
            })[0] || null;
        },
        byUser: function (userId) {
            return allOrders()
                .filter(function (o) {
                    return o.userId === userId;
                })
                .sort(function (a, b) {
                    return a.createdAt < b.createdAt ? 1 : -1;
                });
        },
        /* Số lượng đang giữ cho đơn chưa giao (Mới đặt, Đã xử lý) */
        reservedQty: function (productId) {
            return allOrders().reduce(function (s, o) {
                if (o.status !== ST.NEW && o.status !== ST.PROCESSED) return s;
                o.items.forEach(function (i) {
                    if (i.productId === productId) s += i.qty;
                });
                return s;
            }, 0);
        },
        /* Tra cứu cho admin: from/to (ngày đặt, yyyy-mm-dd), status, q (mã đơn / tên khách / tên đăng nhập) */
        search: function (opts) {
            opts = opts || {};
            var q = U.norm(opts.q || '');
            return allOrders()
                .filter(function (o) {
                    if (opts.status && o.status !== opts.status) return false;
                    if (opts.from && o.date < opts.from) return false;
                    if (opts.to && o.date > opts.to) return false;
                    if (q) {
                        var hay = U.norm(o.code + ' ' + o.customer.fullName + ' ' + o.customer.username);
                        if (hay.indexOf(q) === -1) return false;
                    }
                    return true;
                })
                .sort(function (a, b) {
                    return a.createdAt < b.createdAt ? 1 : -1;
                });
        },

        /* Đặt hàng từ giỏ hàng của tài khoản đang đăng nhập.
           d: {token, paymentMethod, note, shipping:{source:'account'|'new', fullName, phone, province, district, ward, detail}}
           token chống đặt trùng khi bấm nhiều lần hoặc tải lại trang. */
        place: function (d) {
            var user = CB.auth.current();
            if (!user) return fail('Vui lòng đăng nhập để đặt hàng.', { code: 'LOGIN_REQUIRED' });

            if (d.token) {
                var dup = allOrders().filter(function (o) {
                    return o.userId === user.id && o.checkoutToken === d.token;
                })[0];
                if (dup) return { ok: true, order: dup, duplicate: true };
            }

            var lines = cart.detailed();
            if (!lines.length) return fail('Giỏ hàng đang trống.', { code: 'EMPTY_CART' });
            var problems = [];
            lines.forEach(function (l) {
                var name = l.product ? l.product.name : 'Sản phẩm';
                if (l.problem === 'unavailable') problems.push(name + ' không còn được bán.');
                else if (l.problem === 'noprice') problems.push(name + ' chưa có giá bán.');
                else if (l.problem === 'stock')
                    problems.push(name + ': chỉ còn ' + l.product.available + ' sản phẩm (bạn đặt ' + l.qty + ').');
            });
            if (problems.length)
                return fail('Một số sản phẩm không đủ điều kiện đặt hàng.', { code: 'CART_INVALID', problems: problems });

            var method = d.paymentMethod || 'cod';
            if (!PAYMENTS[method]) return fail('Phương thức thanh toán không hợp lệ.', { code: 'INVALID' });

            var src = d.shipping && d.shipping.source === 'new' ? 'new' : 'account';
            var shipping;
            var errors = {};
            if (src === 'account') {
                if (!CB.auth.hasAddress(user))
                    return fail('Tài khoản chưa có địa chỉ đầy đủ. Hãy cập nhật hồ sơ hoặc nhập địa chỉ mới.', {
                        code: 'NO_ACCOUNT_ADDRESS',
                        errors: { source: 'Tài khoản chưa có địa chỉ đầy đủ.' }
                    });
                shipping = {
                    source: 'account',
                    fullName: user.fullName,
                    phone: user.phone,
                    province: user.address.province,
                    district: user.address.district,
                    ward: user.address.ward,
                    detail: user.address.detail
                };
            } else {
                var s = d.shipping;
                shipping = {
                    source: 'new',
                    fullName: String(s.fullName || '').trim(),
                    phone: String(s.phone || '').replace(/[\s.-]/g, ''),
                    province: String(s.province || '').trim(),
                    district: String(s.district || '').trim(),
                    ward: String(s.ward || '').trim(),
                    detail: String(s.detail || '').trim()
                };
                if (shipping.fullName.length < 2) errors.fullName = 'Vui lòng nhập tên người nhận.';
                if (!U.isPhone(shipping.phone)) errors.phone = 'Số điện thoại người nhận không hợp lệ.';
                if (!shipping.province) errors.province = 'Vui lòng nhập tỉnh/thành phố.';
                if (!shipping.district) errors.district = 'Vui lòng nhập quận/huyện.';
                if (!shipping.ward) errors.ward = 'Vui lòng nhập phường/xã.';
                if (!shipping.detail) errors.detail = 'Vui lòng nhập số nhà, tên đường.';
                if (Object.keys(errors).length)
                    return fail('Vui lòng kiểm tra lại thông tin giao hàng.', { code: 'INVALID', errors: errors });
            }

            var subtotal = lines.reduce(function (sum, l) { return sum + l.lineTotal; }, 0);
            var fee = orders.shippingFee();
            var now = new Date();
            var order = {
                id: U.uid('dh'),
                code: 'DH' + U.dateStr(now).replace(/-/g, '') + '-' + U.pad(db.nextCounter('order'), 4),
                checkoutToken: d.token || null,
                userId: user.id,
                customer: { username: user.username, fullName: user.fullName, phone: user.phone, email: user.email },
                createdAt: now.toISOString(),
                date: U.dateStr(now),
                items: lines.map(function (l) {
                    return {
                        productId: l.productId,
                        code: l.product.code,
                        name: l.product.name,
                        image: l.product.image,
                        unitPrice: l.unitPrice,
                        qty: l.qty
                    };
                }),
                shipping: shipping,
                payment: { method: method, label: PAYMENTS[method], simulated: method === 'online' },
                note: String(d.note || '').trim(),
                subtotal: subtotal,
                shippingFee: fee,
                total: subtotal + fee,
                status: ST.NEW,
                statusHistory: [{ status: ST.NEW, at: now.toISOString() }],
                stockDeducted: false
            };
            var all = allOrders();
            all.push(order);
            db.write(K.orders, all);
            cart.clear();
            return { ok: true, order: order };
        },

        /* Cập nhật trạng thái (admin). Chỉ cho phép chuyển hợp lệ, và tồn kho chỉ đổi đúng một lần.
           opts.at: thời điểm ISO (dùng khi tạo dữ liệu mẫu). */
        setStatus: function (orderId, newStatus, opts) {
            var all = allOrders();
            var o = all.filter(function (x) {
                return x.id === orderId;
            })[0];
            if (!o) return fail('Không tìm thấy đơn hàng.');
            if (o.status === newStatus) return fail('Đơn hàng đã ở trạng thái "' + newStatus + '".');
            if ((NEXT[o.status] || []).indexOf(newStatus) === -1)
                return fail('Không thể chuyển đơn từ "' + o.status + '" sang "' + newStatus + '".');

            var at = (opts && opts.at) || new Date().toISOString();
            var txDate = U.dateStr(new Date(at));
            var tx = db.read(K.stockTx, []);

            if (newStatus === ST.DELIVERED) {
                var short = o.items.filter(function (i) {
                    return CB.inventory.stock(i.productId) < i.qty;
                });
                if (short.length)
                    return fail('Không đủ tồn kho để giao: ' + short.map(function (i) { return i.name; }).join(', ') + '.');
                var exported = tx.some(function (t) {
                    return t.refType === 'order' && t.refId === o.id && t.type === 'export';
                });
                if (!o.stockDeducted && !exported) {
                    o.items.forEach(function (i) {
                        tx.push({
                            id: U.uid('tx'), productId: i.productId, type: 'export', qty: i.qty,
                            date: txDate, refType: 'order', refId: o.id, note: 'Xuất kho giao đơn ' + o.code
                        });
                    });
                    db.write(K.stockTx, tx);
                }
                o.stockDeducted = true;
            } else if (newStatus === ST.CANCELED && o.stockDeducted) {
                // hoàn kho nếu đơn đã trừ kho trước khi bị hủy (chỉ một lần)
                o.items.forEach(function (i) {
                    tx.push({
                        id: U.uid('tx'), productId: i.productId, type: 'import', qty: i.qty,
                        date: txDate, refType: 'order-cancel', refId: o.id, note: 'Hoàn kho do hủy đơn ' + o.code
                    });
                });
                db.write(K.stockTx, tx);
                o.stockDeducted = false;
            }
            o.status = newStatus;
            o.statusHistory.push({ status: newStatus, at: at });
            db.write(K.orders, all);
            return { ok: true, order: o };
        }
    };

    CB.cart = cart;
    CB.orders = orders;
})(typeof window !== 'undefined' ? window : globalThis);
