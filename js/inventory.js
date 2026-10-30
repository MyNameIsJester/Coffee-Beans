/* CoffeeBeans - Phiếu nhập và tồn kho.
   Tồn kho KHÔNG lưu trực tiếp. Tồn = tổng nhập - tổng xuất, tính từ sổ giao dịch kho
   - Nhập: sinh ra đúng 1 lần khi phiếu nhập chuyển sang "Đã hoàn thành"
   - Xuất: sinh ra khi đơn hàng chuyển sang "Đã giao" */
(function (g) {
    'use strict';
    var CB = (g.CB = g.CB || {});
    var db = CB.db,
        K = CB.db.KEYS,
        U = CB.util;

    function fail(error, field) {
        return { ok: false, error: error, field: field || null };
    }
    function txList() {
        return db.read(K.stockTx, []);
    }

    var inventory = {
        /* ================= Phiếu nhập ================= */
        receipts: function () {
            return db.read(K.receipts, []);
        },
        receiptById: function (id) {
            var all = inventory.receipts();
            for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
            return null;
        },
        receiptTotal: function (r) {
            return r.lines.reduce(function (s, l) {
                return s + l.qty * l.unitCost;
            }, 0);
        },
        statusLabel: function (status) {
            return status === 'completed' ? 'Đã hoàn thành' : 'Chưa hoàn thành';
        },
        /* opts */
        searchReceipts: function (opts) {
            opts = opts || {};
            var q = U.norm(opts.q || '');
            return inventory
                .receipts()
                .filter(function (r) {
                    if (opts.status && r.status !== opts.status) return false;
                    if (opts.from && r.date < opts.from) return false;
                    if (opts.to && r.date > opts.to) return false;
                    if (q) {
                        var hit = U.norm(r.code).indexOf(q) !== -1;
                        if (!hit) {
                            hit = r.lines.some(function (l) {
                                var p = CB.catalog.productById(l.productId);
                                return p && U.norm(p.name).indexOf(q) !== -1;
                            });
                        }
                        if (!hit) return false;
                    }
                    return true;
                })
                .sort(function (a, b) {
                    return a.date < b.date ? 1 : a.date > b.date ? -1 : b.code.localeCompare(a.code);
                });
        },
        /* data: Chỉ tạo mới hoặc sửa phiếu đang ở trạng thái chưa hoàn thành. */
        saveReceipt: function (data) {
            if (!U.isDate(data.date)) return fail('Vui lòng chọn ngày nhập hợp lệ.', 'date');
            if (!data.lines || !data.lines.length)
                return fail('Phiếu nhập cần có ít nhất một sản phẩm.', 'lines');
            var seen = {};
            var lines = [];
            for (var i = 0; i < data.lines.length; i++) {
                var l = data.lines[i];
                var n = i + 1;
                if (!l.productId || !CB.catalog.productById(l.productId))
                    return fail('Dòng ' + n + ': vui lòng chọn sản phẩm.', 'lines');
                if (seen[l.productId])
                    return fail('Dòng ' + n + ': sản phẩm bị trùng trong cùng phiếu.', 'lines');
                seen[l.productId] = true;
                var qty = Number(l.qty),
                    cost = Number(l.unitCost);
                if (!isFinite(qty) || qty <= 0 || Math.floor(qty) !== qty)
                    return fail('Dòng ' + n + ': số lượng phải là số nguyên lớn hơn 0.', 'lines');
                if (!isFinite(cost) || cost <= 0 || Math.floor(cost) !== cost)
                    return fail('Dòng ' + n + ': giá nhập phải là số nguyên lớn hơn 0.', 'lines');
                lines.push({ productId: l.productId, qty: qty, unitCost: cost });
            }
            var all = inventory.receipts();
            var r;
            if (data.id) {
                r = all.filter(function (x) {
                    return x.id === data.id;
                })[0];
                if (!r) return fail('Không tìm thấy phiếu nhập.');
                if (r.status === 'completed')
                    return fail('Phiếu nhập đã hoàn thành nên không thể sửa.');
                r.date = data.date;
                r.note = String(data.note || '').trim();
                r.lines = lines;
            } else {
                r = {
                    id: U.uid('pn'),
                    code: 'PN' + U.pad(db.nextCounter('receipt'), 3),
                    date: data.date,
                    note: String(data.note || '').trim(),
                    status: 'draft',
                    lines: lines,
                    createdAt: U.nowISO(),
                    completedAt: null
                };
                all.push(r);
            }
            db.write(K.receipts, all);
            return { ok: true, receipt: r };
        },
        /* Hoàn thành phiếu */
        completeReceipt: function (id) {
            var all = inventory.receipts();
            var r = all.filter(function (x) {
                return x.id === id;
            })[0];
            if (!r) return fail('Không tìm thấy phiếu nhập.');
            if (r.status === 'completed') return fail('Phiếu nhập này đã hoàn thành trước đó.');
            var tx = txList();
            var already = tx.some(function (t) {
                return t.refType === 'receipt' && t.refId === r.id;
            });
            if (!already) {
                r.lines.forEach(function (l) {
                    tx.push({
                        id: U.uid('tx'),
                        productId: l.productId,
                        type: 'import',
                        qty: l.qty,
                        date: r.date,
                        refType: 'receipt',
                        refId: r.id,
                        note: 'Nhập hàng theo phiếu ' + r.code
                    });
                });
                db.write(K.stockTx, tx);
            }
            r.status = 'completed';
            r.completedAt = U.nowISO();
            db.write(K.receipts, all);
            return { ok: true, receipt: r };
        },
        /* Chỉ xóa phiếu chưa hoàn thành. */
        deleteReceipt: function (id) {
            var r = inventory.receiptById(id);
            if (!r) return fail('Không tìm thấy phiếu nhập.');
            if (r.status === 'completed')
                return fail('Phiếu nhập đã hoàn thành nên không thể xóa.');
            db.write(
                K.receipts,
                inventory.receipts().filter(function (x) {
                    return x.id !== id;
                })
            );
            return { ok: true };
        },

        /* ================= Tồn kho ================= */
        stock: function (productId, asOf) {
            return txList().reduce(function (s, t) {
                if (t.productId !== productId) return s;
                if (asOf && t.date > asOf) return s;
                return s + (t.type === 'import' ? t.qty : -t.qty);
            }, 0);
        },
        /* Số lượng đang giữ cho các đơn chưa giao (Mới đặt, Đã xử lý). */
        reserved: function (productId) {
            return CB.orders ? CB.orders.reservedQty(productId) : 0;
        },
        /* Số lượng khách còn có thể đặt = tồn thực tế - đang giữ cho đơn chưa giao. */
        available: function (productId) {
            return Math.max(0, inventory.stock(productId) - inventory.reserved(productId));
        },
        threshold: function () {
            return db.settings().lowStockThreshold;
        },
        setThreshold: function (n) {
            n = Number(n);
            if (!isFinite(n) || n < 0 || Math.floor(n) !== n)
                return fail('Ngưỡng cảnh báo phải là số nguyên không âm.');
            var s = db.settings();
            s.lowStockThreshold = n;
            db.write(K.settings, s);
            return { ok: true };
        },
        /* Sản phẩm có tồn thực tế <= ngưỡng cảnh báo. */
        lowStock: function () {
            var t = inventory.threshold();
            return CB.catalog
                .products({ includeHidden: true })
                .map(function (p) {
                    return { product: p, stock: inventory.stock(p.id) };
                })
                .filter(function (x) {
                    return x.stock <= t;
                });
        },
        /* Nhập - xuất - tồn của một sản phẩm trong khoảng thời gian */
        movement: function (productId, from, to) {
            var opening = 0,
                imports = 0,
                exports = 0;
            txList().forEach(function (t) {
                if (t.productId !== productId) return;
                var signed = t.type === 'import' ? t.qty : -t.qty;
                if (from && t.date < from) opening += signed;
                else if (!to || t.date <= to) {
                    if (t.type === 'import') imports += t.qty;
                    else exports += t.qty;
                }
            });
            return { opening: opening, imports: imports, exports: exports, closing: opening + imports - exports };
        },
        transactions: function (productId) {
            return txList()
                .filter(function (t) {
                    return !productId || t.productId === productId;
                })
                .sort(function (a, b) {
                    return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
                });
        }
    };

    CB.inventory = inventory;
})(typeof window !== 'undefined' ? window : globalThis);
