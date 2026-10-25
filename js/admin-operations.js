/* CoffeeBeans Admin - Phiếu nhập, Giá bán, Đơn hàng, Tồn kho. */
(function (g) {
    'use strict';
    var CB = g.CB,
        CBA = g.CBA,
        U = CB.util,
        esc = CBA.esc;

    function dateRangeError(from, to) {
        if (from && !U.isDate(from)) return 'Ngày bắt đầu không hợp lệ.';
        if (to && !U.isDate(to)) return 'Ngày kết thúc không hợp lệ.';
        if (from && to && from > to) return 'Ngày bắt đầu không được sau ngày kết thúc.';
        return '';
    }

    /* ===================== Phiếu nhập ===================== */
    CBA.views.receipts = function (main) {
        var st = { q: '', from: '', to: '', status: '' };
        main.innerHTML =
            '<div class="content-header"><h1 class="content-title">Quản lý nhập hàng</h1><button class="btn-primary" id="addReceipt" type="button">+ Thêm phiếu nhập</button></div>' +
            '<div class="advanced-search-panel"><div class="search-row">' +
            '<div class="search-group"><label for="rq">Mã phiếu hoặc tên sản phẩm</label><input type="text" id="rq" placeholder="Ví dụ: PN001 hoặc Arabica" /></div>' +
            '<div class="search-group"><label for="rfrom">Từ ngày</label><input type="date" id="rfrom" /></div>' +
            '<div class="search-group"><label for="rto">Đến ngày</label><input type="date" id="rto" /></div>' +
            '<div class="search-group"><label for="rstatus">Trạng thái</label><select id="rstatus"><option value="">Tất cả</option><option value="draft">Chưa hoàn thành</option><option value="completed">Đã hoàn thành</option></select></div>' +
            '</div><p class="field-error" id="rerr"></p><div class="search-actions"><button type="button" class="btn-primary" id="rsearch">Tìm kiếm</button><button type="button" class="btn-cancel" id="rclear">Xóa bộ lọc</button></div></div>' +
            '<div class="table-container"><div class="table-header"><h3>Danh sách phiếu nhập</h3></div><div id="list"></div></div>';

        function refresh() {
            var list = CB.inventory.searchReceipts(st);
            CBA.$('#list', main).innerHTML = CBA.table(['Mã phiếu', 'Ngày nhập', 'Sản phẩm', 'Tổng giá trị', 'Trạng thái', 'Thao tác'], list.map(function (r) {
                var done = r.status === 'completed';
                var names = r.lines.map(function (l) { return CBA.productName(l.productId) + ' (' + l.qty + ')'; }).join(', ');
                return '<tr><td>' + esc(r.code) + '</td><td>' + U.fmtDate(r.date) + '</td><td style="max-width:320px;">' + esc(names) + '</td>' +
                    '<td>' + CBA.money(CB.inventory.receiptTotal(r)) + '</td>' +
                    '<td>' + CBA.badge(CB.inventory.statusLabel(r.status), done ? 'active' : 'pending') + '</td>' +
                    '<td><div class="action-buttons">' + CBA.iconBtn('view', r.id, '👁', 'Xem phiếu ' + r.code) +
                    (done ? '' : CBA.iconBtn('edit', r.id, '✏️', 'Sửa phiếu ' + r.code) + CBA.iconBtn('complete', r.id, '✅', 'Hoàn thành phiếu ' + r.code) + CBA.iconBtn('delete', r.id, '🗑', 'Xóa phiếu ' + r.code)) +
                    '</div></td></tr>';
            }), 'Không có phiếu nhập phù hợp.');
        }
        function search() {
            var from = CBA.$('#rfrom', main).value, to = CBA.$('#rto', main).value;
            var err = dateRangeError(from, to);
            CBA.$('#rerr', main).textContent = err;
            if (err) return;
            st = { q: CBA.$('#rq', main).value, from: from, to: to, status: CBA.$('#rstatus', main).value };
            refresh();
        }
        CBA.$('#rsearch', main).addEventListener('click', search);
        CBA.$('#rq', main).addEventListener('keydown', function (e) { if (e.key === 'Enter') search(); });
        CBA.$('#rclear', main).addEventListener('click', function () {
            ['#rq', '#rfrom', '#rto', '#rstatus'].forEach(function (s) { CBA.$(s, main).value = ''; });
            CBA.$('#rerr', main).textContent = '';
            st = { q: '', from: '', to: '', status: '' };
            refresh();
        });

        function linesTable(lines, editable) {
            return '<table class="line-table"><thead><tr><th>Sản phẩm</th><th>Số lượng</th><th>Giá nhập (đ)</th><th>Thành tiền</th>' + (editable ? '<th></th>' : '') + '</tr></thead><tbody>' +
                lines.map(function (l, i) {
                    var amount = (Number(l.qty) || 0) * (Number(l.unitCost) || 0);
                    if (!editable) return '<tr><td>' + esc(CBA.productName(l.productId)) + '</td><td>' + l.qty + '</td><td>' + CBA.money(l.unitCost) + '</td><td>' + CBA.money(amount) + '</td></tr>';
                    return '<tr data-i="' + i + '"><td><select data-k="productId" aria-label="Sản phẩm dòng ' + (i + 1) + '">' + CBA.productOptions(l.productId) + '</select></td>' +
                        '<td><input type="number" data-k="qty" min="1" step="1" value="' + esc(l.qty) + '" aria-label="Số lượng dòng ' + (i + 1) + '" style="width:90px;" /></td>' +
                        '<td><input type="number" data-k="unitCost" min="1" step="1" value="' + esc(l.unitCost) + '" aria-label="Giá nhập dòng ' + (i + 1) + '" style="width:130px;" /></td>' +
                        '<td class="line-amount">' + CBA.money(amount) + '</td><td><button type="button" class="btn-icon" data-remove="' + i + '" title="Xóa dòng" aria-label="Xóa dòng ' + (i + 1) + '">✕</button></td></tr>';
                }).join('') + '</tbody></table>';
        }
        function total(lines) {
            return lines.reduce(function (s, l) { return s + (Number(l.qty) || 0) * (Number(l.unitCost) || 0); }, 0);
        }

        function form(r) {
            var lines = r ? r.lines.map(function (l) { return { productId: l.productId, qty: l.qty, unitCost: l.unitCost }; }) : [{ productId: '', qty: '', unitCost: '' }];
            var m = CBA.modal({
                title: r ? 'Sửa phiếu nhập ' + r.code : 'Thêm phiếu nhập hàng',
                wide: true,
                body: '<form id="rForm" novalidate><p class="form-error field-error" hidden></p>' +
                    '<div class="form-row">' + CBA.field('Ngày nhập <span class="req">*</span>', 'date', r ? r.date : U.today(), 'type="date"') +
                    CBA.field('Ghi chú', 'note', r ? r.note : '', 'maxlength="200"') + '</div>' +
                    '<div id="linesBox"></div><button type="button" class="btn-secondary" id="addLine">+ Thêm dòng sản phẩm</button>' +
                    '<p style="margin-top:16px;font-size:16px;">Tổng giá trị phiếu: <strong id="rTotal"></strong></p>' +
                    '<p class="form-note">Phiếu chỉ cộng vào tồn kho và giá vốn sau khi được hoàn thành. Phiếu đã hoàn thành không thể sửa.</p></form>',
                buttons: [
                    { label: 'Hủy', cls: 'btn-cancel' },
                    { label: 'Lưu phiếu', cls: 'btn-primary', id: 'saveReceipt', onClick: function (m) {
                        var f = CBA.$('#rForm', m.el);
                        var res = CB.inventory.saveReceipt({ id: r ? r.id : undefined, date: f.elements.date.value, note: f.elements.note.value, lines: lines });
                        if (!res.ok) { CBA.showResultError(m.el, res); return false; }
                        CBA.toast(r ? 'Đã cập nhật phiếu nhập.' : 'Đã tạo phiếu nhập ' + res.receipt.code + ' (chưa hoàn thành).');
                        refresh();
                    } }
                ]
            });
            var box = CBA.$('#linesBox', m.el);
            function draw() {
                box.innerHTML = linesTable(lines, true);
                CBA.$('#rTotal', m.el).textContent = CBA.money(total(lines));
            }
            box.addEventListener('input', function (e) {
                var tr = e.target.closest('tr[data-i]');
                if (!tr) return;
                var l = lines[Number(tr.getAttribute('data-i'))];
                l[e.target.getAttribute('data-k')] = e.target.value;
                CBA.$('.line-amount', tr).textContent = CBA.money((Number(l.qty) || 0) * (Number(l.unitCost) || 0));
                CBA.$('#rTotal', m.el).textContent = CBA.money(total(lines));
            });
            box.addEventListener('change', function (e) {
                var tr = e.target.closest('tr[data-i]');
                if (tr && e.target.getAttribute('data-k') === 'productId') lines[Number(tr.getAttribute('data-i'))].productId = e.target.value;
            });
            box.addEventListener('click', function (e) {
                var b = e.target.closest('[data-remove]');
                if (!b) return;
                lines.splice(Number(b.getAttribute('data-remove')), 1);
                if (!lines.length) lines.push({ productId: '', qty: '', unitCost: '' });
                draw();
            });
            CBA.$('#addLine', m.el).addEventListener('click', function () { lines.push({ productId: '', qty: '', unitCost: '' }); draw(); });
            draw();
        }

        CBA.$('#addReceipt', main).addEventListener('click', function () { form(null); });
        CBA.onAct(main, {
            view: function (id) {
                var r = CB.inventory.receiptById(id);
                CBA.modal({
                    title: 'Phiếu nhập ' + r.code, wide: true,
                    body: '<p>Ngày nhập: <strong>' + U.fmtDate(r.date) + '</strong> &nbsp; Trạng thái: ' + CBA.badge(CB.inventory.statusLabel(r.status), r.status === 'completed' ? 'active' : 'pending') +
                        (r.completedAt ? ' &nbsp; Hoàn thành lúc: ' + U.fmtDateTime(r.completedAt) : '') + '</p>' +
                        (r.note ? '<p>Ghi chú: ' + esc(r.note) + '</p>' : '') + linesTable(r.lines, false) +
                        '<p style="margin-top:16px;font-size:16px;">Tổng giá trị: <strong>' + CBA.money(CB.inventory.receiptTotal(r)) + '</strong></p>',
                    buttons: [{ label: 'Đóng', cls: 'btn-primary' }]
                });
            },
            edit: function (id) { form(CB.inventory.receiptById(id)); },
            complete: function (id) {
                var r = CB.inventory.receiptById(id);
                if (!CBA.confirm('Hoàn thành phiếu ' + r.code + '? Số lượng sẽ được cộng vào tồn kho và phiếu không thể sửa nữa.')) return;
                var res = CB.inventory.completeReceipt(id);
                if (!res.ok) return CBA.toast(res.error, 'error');
                CBA.toast('Đã hoàn thành phiếu ' + r.code + ' và cập nhật tồn kho.');
                refresh();
            },
            'delete': function (id) {
                var r = CB.inventory.receiptById(id);
                if (!CBA.confirm('Xóa phiếu nhập ' + r.code + '?')) return;
                var res = CB.inventory.deleteReceipt(id);
                if (!res.ok) return CBA.toast(res.error, 'error');
                CBA.toast('Đã xóa phiếu ' + r.code);
                refresh();
            }
        });
        refresh();
    };

    /* ===================== Giá bán ===================== */
    function pctText(v) { return (Math.round(v * 100) / 100) + '%'; }

    CBA.views.pricing = function (main) {
        var st = { q: '', cat: '' };
        main.innerHTML =
            '<div class="content-header"><h1 class="content-title">Quản lý giá bán</h1></div>' +
            '<p class="form-note" style="margin:-16px 0 20px;">Giá bán = Giá vốn × (1 + % lợi nhuận). Giá vốn là bình quân gia quyền của các phiếu nhập đã hoàn thành. Nếu sản phẩm có % riêng thì dùng %, ngược lại dùng % của loại.</p>' +
            '<div class="table-container"><div class="table-header"><h3>Tỉ lệ lợi nhuận theo loại</h3></div><div id="catList"></div></div>' +
            '<div class="table-container"><div class="table-header"><h3>Tra cứu giá và tỉ lệ lợi nhuận theo sản phẩm</h3><div class="search-box">' +
            '<input type="text" id="pq" placeholder="Tìm theo mã hoặc tên..." aria-label="Tìm sản phẩm" /><select id="pcat" aria-label="Lọc theo loại">' + CBA.categoryOptions('', true) + '</select></div></div><div id="prodList"></div></div>';

        function refresh() {
            var cm = CB.catalog.pricing().categoryMargins;
            CBA.$('#catList', main).innerHTML = CBA.table(['Loại sản phẩm', '% lợi nhuận', 'Số sản phẩm', 'Thao tác'], CB.catalog.categories({ includeHidden: true }).map(function (c) {
                return '<tr><td>' + esc(c.name) + '</td><td>' + (cm[c.id] === undefined ? '<em>Chưa đặt</em>' : pctText(cm[c.id])) + '</td><td>' + CB.catalog.productCountByCategory(c.id) + '</td>' +
                    '<td><div class="action-buttons">' + CBA.iconBtn('edit-cat', c.id, '✏️', 'Sửa % lợi nhuận loại ' + c.name) + '</div></td></tr>';
            }), 'Chưa có loại sản phẩm.');
            var q = U.norm(st.q);
            var prods = CB.catalog.products({ includeHidden: true }).filter(function (p) {
                if (st.cat && p.categoryId !== st.cat) return false;
                return !q || U.norm(p.code + ' ' + p.name).indexOf(q) !== -1;
            }).sort(function (a, b) { return a.code.localeCompare(b.code); });
            CBA.$('#prodList', main).innerHTML = CBA.table(['Mã', 'Tên sản phẩm', 'Loại', 'Giá vốn', '% lợi nhuận', 'Giá bán', 'Thao tác'], prods.map(function (p) {
                var v = CB.catalog.view(p);
                var pct = v.marginPercent === null ? '<em>Chưa đặt</em>' : pctText(v.marginPercent) + ' <small>(' + (v.marginSource === 'product' ? 'riêng' : 'theo loại') + ')</small>';
                return '<tr><td>' + esc(p.code) + '</td><td>' + esc(p.name) + '</td><td>' + esc(v.categoryName) + '</td>' +
                    '<td>' + (v.cost === null ? '<em>Chưa nhập hàng</em>' : CBA.money(v.cost)) + '</td><td>' + pct + '</td>' +
                    '<td><strong>' + (v.price === null ? '—' : CBA.money(v.price)) + '</strong></td>' +
                    '<td><div class="action-buttons">' + CBA.iconBtn('edit-prod', p.id, '✏️', 'Sửa % lợi nhuận ' + p.name) + '</div></td></tr>';
            }), 'Không có sản phẩm phù hợp.');
        }
        CBA.$('#pq', main).addEventListener('input', function (e) { st.q = e.target.value; refresh(); });
        CBA.$('#pcat', main).addEventListener('change', function (e) { st.cat = e.target.value; refresh(); });

        function priceAfter(productId, pct) {
            var cost = CB.catalog.cost(productId);
            return cost === null ? null : Math.round(cost * (1 + pct / 100));
        }
        function pctInputValid(s) { return s !== '' && isFinite(Number(s)) && Number(s) >= 0 && Number(s) <= 1000; }

        function editCategory(id) {
            var c = CB.catalog.categoryById(id);
            var cur = CB.catalog.pricing().categoryMargins[id];
            var prods = CB.catalog.products({ includeHidden: true, categoryId: id });
            var own = CB.catalog.pricing().productMargins;
            var affected = prods.filter(function (p) { return own[p.id] === undefined; });
            var m = CBA.modal({
                title: 'Sửa % lợi nhuận loại ' + c.name,
                body: '<form id="pctForm" novalidate><p class="form-error field-error" hidden></p>' +
                    CBA.field('% lợi nhuận <span class="req">*</span>', 'pct', cur === undefined ? '' : cur, 'type="number" min="0" max="1000" step="0.1"') +
                    '<p class="form-note">' + (prods.length - affected.length) + ' sản phẩm trong loại có % riêng sẽ không bị ảnh hưởng.</p>' +
                    '<h4 style="margin:12px 0 8px;">Giá bán sau khi áp dụng (' + affected.length + ' sản phẩm)</h4><div id="preview"></div></form>',
                buttons: [
                    { label: 'Hủy', cls: 'btn-cancel' },
                    { label: 'Lưu', cls: 'btn-primary', id: 'savePct', onClick: function (m) {
                        var v = CBA.$('#pctForm', m.el).elements.pct.value;
                        if (!pctInputValid(v)) { CBA.setErrors(m.el, { pct: 'Vui lòng nhập số từ 0 đến 1000.' }); return false; }
                        var r = CB.catalog.setCategoryMargin(id, v);
                        if (!r.ok) { CBA.showResultError(m.el, r); return false; }
                        CBA.toast('Đã cập nhật % lợi nhuận loại ' + c.name);
                        refresh();
                    } }
                ]
            });
            function preview() {
                var v = CBA.$('#pctForm', m.el).elements.pct.value;
                var ok = pctInputValid(v);
                CBA.$('#preview', m.el).innerHTML = affected.length ? '<table><thead><tr><th>Sản phẩm</th><th>Giá hiện tại</th><th>Giá mới</th></tr></thead><tbody>' + affected.map(function (p) {
                    var np = ok ? priceAfter(p.id, Number(v)) : null;
                    return '<tr><td>' + esc(p.name) + '</td><td>' + (CB.catalog.price(p.id) === null ? '—' : CBA.money(CB.catalog.price(p.id))) + '</td><td>' + (np === null ? '—' : CBA.money(np)) + '</td></tr>';
                }).join('') + '</tbody></table>' : '<p>Không có sản phẩm nào bị ảnh hưởng.</p>';
            }
            CBA.$('#pctForm', m.el).addEventListener('input', preview);
            CBA.$('#pctForm', m.el).addEventListener('submit', function (e) { e.preventDefault(); CBA.$('#savePct', m.el).click(); });
            preview();
        }

        function editProduct(id) {
            var p = CB.catalog.productById(id);
            var v = CB.catalog.view(p);
            var own = CB.catalog.pricing().productMargins[id];
            var catPct = CB.catalog.pricing().categoryMargins[p.categoryId];
            var m = CBA.modal({
                title: 'Sửa % lợi nhuận: ' + p.name,
                body: '<form id="pctForm" novalidate><p class="form-error field-error" hidden></p>' +
                    '<p>Giá vốn: <strong>' + (v.cost === null ? 'Chưa nhập hàng' : CBA.money(v.cost)) + '</strong> &nbsp; % của loại: <strong>' + (catPct === undefined ? 'Chưa đặt' : pctText(catPct)) + '</strong></p>' +
                    CBA.field('% lợi nhuận riêng của sản phẩm', 'pct', own === undefined ? '' : own, 'type="number" min="0" max="1000" step="0.1"', 'Để trống để dùng % của loại.') +
                    '<p>Giá bán sau khi áp dụng: <strong id="newPrice"></strong></p></form>',
                buttons: [
                    { label: 'Hủy', cls: 'btn-cancel' },
                    { label: 'Dùng % của loại', cls: 'btn-secondary', id: 'clearPct', onClick: function () {
                        var r = CB.catalog.setProductMargin(id, null);
                        if (!r.ok) { CBA.toast(r.error, 'error'); return false; }
                        CBA.toast('Sản phẩm dùng % của loại.');
                        refresh();
                    } },
                    { label: 'Lưu', cls: 'btn-primary', id: 'savePct', onClick: function (m) {
                        var s = CBA.$('#pctForm', m.el).elements.pct.value;
                        if (s !== '' && !pctInputValid(s)) { CBA.setErrors(m.el, { pct: 'Vui lòng nhập số từ 0 đến 1000.' }); return false; }
                        var r = CB.catalog.setProductMargin(id, s === '' ? null : s);
                        if (!r.ok) { CBA.showResultError(m.el, r); return false; }
                        CBA.toast('Đã cập nhật % lợi nhuận của ' + p.name);
                        refresh();
                    } }
                ]
            });
            function preview() {
                var s = CBA.$('#pctForm', m.el).elements.pct.value;
                var pct = s === '' ? catPct : (pctInputValid(s) ? Number(s) : undefined);
                var np = pct === undefined ? null : priceAfter(id, pct);
                CBA.$('#newPrice', m.el).textContent = np === null ? '—' : CBA.money(np);
            }
            CBA.$('#pctForm', m.el).addEventListener('input', preview);
            CBA.$('#pctForm', m.el).addEventListener('submit', function (e) { e.preventDefault(); CBA.$('#savePct', m.el).click(); });
            preview();
        }
        CBA.onAct(main, { 'edit-cat': editCategory, 'edit-prod': editProduct });
        refresh();
    };

    /* ===================== Đơn hàng ===================== */
    CBA.openOrder = function (id) {
        var o = CB.orders.byId(id);
        if (!o) return CBA.toast('Không tìm thấy đơn hàng.', 'error');
        var next = CB.orders.allowedNext(o.status);
        var s = o.shipping;
        return CBA.modal({
            title: 'Đơn hàng ' + o.code, wide: true,
            body: '<p>Trạng thái hiện tại: ' + CBA.orderBadge(o.status) + ' &nbsp; Ngày đặt: <strong>' + U.fmtDateTime(o.createdAt) + '</strong></p>' +
                '<div class="detail-grid"><div><h4>Khách hàng</h4><p>' + esc(o.customer.fullName) + ' (' + esc(o.customer.username) + ')<br>' + esc(o.customer.phone) + '<br>' + esc(o.customer.email) + '</p></div>' +
                '<div><h4>Giao hàng</h4><p>' + esc(s.fullName) + ' - ' + esc(s.phone) + '<br>' + esc(CB.auth.formatAddress(s)) + '</p></div></div>' +
                '<table class="line-table"><thead><tr><th>Sản phẩm</th><th>Đơn giá</th><th>Số lượng</th><th>Thành tiền</th></tr></thead><tbody>' +
                o.items.map(function (i) { return '<tr><td>' + esc(i.name) + ' <small>(' + esc(i.code) + ')</small></td><td>' + CBA.money(i.unitPrice) + '</td><td>' + i.qty + '</td><td>' + CBA.money(i.unitPrice * i.qty) + '</td></tr>'; }).join('') +
                '</tbody></table>' +
                '<p style="margin-top:12px;">Tạm tính: ' + CBA.money(o.subtotal) + ' &nbsp; Phí vận chuyển: ' + CBA.money(o.shippingFee) + ' &nbsp; <strong>Tổng cộng: ' + CBA.money(o.total) + '</strong></p>' +
                '<p>Thanh toán: ' + esc(o.payment.label) + (o.note ? '<br>Ghi chú của khách: ' + esc(o.note) : '') + '</p>' +
                '<h4>Lịch sử trạng thái</h4><ul class="history-list">' + o.statusHistory.map(function (h) { return '<li>' + U.fmtDateTime(h.at) + ' - ' + CBA.orderBadge(h.status) + '</li>'; }).join('') + '</ul>' +
                (next.length
                    ? '<div class="form-group" style="margin-top:16px;"><label for="newStatus">Cập nhật trạng thái</label><select id="newStatus"><option value="">-- Chọn trạng thái mới --</option>' +
                      next.map(function (n) { return '<option value="' + esc(n) + '">' + esc(n) + '</option>'; }).join('') + '</select><p class="field-error" id="statusErr"></p>' +
                      '<small class="form-hint">Tồn kho chỉ bị trừ khi đơn chuyển sang "Đã giao".</small></div>'
                    : '<p class="form-note">Đơn hàng đã ở trạng thái cuối, không thể thay đổi.</p>'),
            buttons: next.length
                ? [{ label: 'Đóng', cls: 'btn-cancel' }, { label: 'Cập nhật trạng thái', cls: 'btn-primary', id: 'applyStatus', onClick: function (m) {
                    var sel = m.$('#newStatus').value;
                    if (!sel) { m.$('#statusErr').textContent = 'Vui lòng chọn trạng thái mới.'; return false; }
                    if (!CBA.confirm('Chuyển đơn ' + o.code + ' sang "' + sel + '"?' + (sel === 'Hủy' ? ' Thao tác này không thể hoàn tác.' : ''))) return false;
                    var r = CB.orders.setStatus(o.id, sel);
                    if (!r.ok) { m.$('#statusErr').textContent = r.error; return false; }
                    CBA.toast('Đã cập nhật đơn ' + o.code + ': ' + sel);
                    if (CBA.onOrdersChanged) CBA.onOrdersChanged();
                    g.setTimeout(function () { CBA.openOrder(o.id); }, 0);
                } }]
                : [{ label: 'Đóng', cls: 'btn-primary' }]
        });
    };

    CBA.views.orders = function (main) {
        var st = { q: '', from: '', to: '', status: '' };
        main.innerHTML =
            '<div class="content-header"><h1 class="content-title">Quản lý đơn hàng</h1></div>' +
            '<div class="advanced-search-panel"><div class="search-row">' +
            '<div class="search-group"><label for="oq">Mã đơn hoặc khách hàng</label><input type="text" id="oq" placeholder="Ví dụ: DH2026 hoặc guest1" /></div>' +
            '<div class="search-group"><label for="ofrom">Ngày đặt từ</label><input type="date" id="ofrom" /></div>' +
            '<div class="search-group"><label for="oto">Ngày đặt đến</label><input type="date" id="oto" /></div>' +
            '<div class="search-group"><label for="ostatus">Tình trạng</label><select id="ostatus"><option value="">Tất cả</option>' +
            ['Mới đặt', 'Đã xử lý', 'Đã giao', 'Hủy'].map(function (s) { return '<option value="' + s + '">' + s + '</option>'; }).join('') + '</select></div></div>' +
            '<p class="field-error" id="oerr"></p><div class="search-actions"><button type="button" class="btn-primary" id="osearch">Tìm kiếm</button><button type="button" class="btn-cancel" id="oclear">Xóa bộ lọc</button></div></div>' +
            '<div class="table-container"><div class="table-header"><h3>Danh sách đơn hàng</h3><span id="ocount"></span></div><div id="list"></div></div>';

        function refresh() {
            var list = CB.orders.search(st);
            CBA.$('#ocount', main).textContent = list.length + ' đơn hàng';
            CBA.$('#list', main).innerHTML = CBA.table(['Mã đơn', 'Khách hàng', 'Ngày đặt', 'Tổng tiền', 'Thanh toán', 'Trạng thái', 'Thao tác'], list.map(function (o) {
                return '<tr><td>' + esc(o.code) + '</td><td>' + esc(o.customer.fullName) + '<br><small>' + esc(o.customer.username) + '</small></td><td>' + U.fmtDate(o.date) + '</td><td>' + CBA.money(o.total) + '</td>' +
                    '<td>' + esc(o.payment.label) + '</td><td>' + CBA.orderBadge(o.status) + '</td>' +
                    '<td><div class="action-buttons">' + CBA.iconBtn('open', o.id, '👁', 'Xem chi tiết đơn ' + o.code) + '</div></td></tr>';
            }), 'Không có đơn hàng phù hợp.');
        }
        CBA.onOrdersChanged = refresh;
        function search() {
            var from = CBA.$('#ofrom', main).value, to = CBA.$('#oto', main).value;
            var err = dateRangeError(from, to);
            CBA.$('#oerr', main).textContent = err;
            if (err) return;
            st = { q: CBA.$('#oq', main).value, from: from, to: to, status: CBA.$('#ostatus', main).value };
            refresh();
        }
        CBA.$('#osearch', main).addEventListener('click', search);
        CBA.$('#oq', main).addEventListener('keydown', function (e) { if (e.key === 'Enter') search(); });
        CBA.$('#oclear', main).addEventListener('click', function () {
            ['#oq', '#ofrom', '#oto', '#ostatus'].forEach(function (s) { CBA.$(s, main).value = ''; });
            CBA.$('#oerr', main).textContent = '';
            st = { q: '', from: '', to: '', status: '' };
            refresh();
        });
        CBA.onAct(main, { open: function (id) { CBA.openOrder(id); } });
        refresh();
    };

    /* ===================== Tồn kho ===================== */
    CBA.views.stock = function (main) {
        main.innerHTML =
            '<div class="content-header"><h1 class="content-title">Quản lý tồn kho</h1></div>' +
            '<div class="table-container"><div class="table-header"><h3>Cảnh báo sắp hết hàng</h3><div class="search-box"><label for="threshold">Ngưỡng cảnh báo (tồn ≤)</label>' +
            '<input type="number" id="threshold" min="0" step="1" style="width:90px;" /><button type="button" class="btn-secondary" id="saveThreshold">Lưu ngưỡng</button></div></div>' +
            '<p class="field-error" id="thErr" style="padding:0 20px;"></p><div id="lowList"></div></div>' +

            '<div class="advanced-search-panel"><h3 style="margin-bottom:16px;">Tra cứu tồn kho tại một thời điểm</h3><div class="search-row">' +
            '<div class="search-group"><label for="asOf">Tồn tại cuối ngày</label><input type="date" id="asOf" /></div>' +
            '<div class="search-group"><label for="scat">Loại sản phẩm</label><select id="scat">' + CBA.categoryOptions('', true) + '</select></div>' +
            '<div class="search-group"><label for="sprod">Sản phẩm</label><select id="sprod">' + CBA.productOptions('', true) + '</select></div></div>' +
            '<p class="field-error" id="serr"></p><div class="search-actions"><button type="button" class="btn-primary" id="sgo">Tra cứu</button></div></div>' +
            '<div class="table-container"><div id="stockList"></div></div>' +

            '<div class="advanced-search-panel"><h3 style="margin-bottom:16px;">Báo cáo nhập - xuất - tồn trong khoảng thời gian</h3><div class="search-row">' +
            '<div class="search-group"><label for="mprod">Sản phẩm</label><select id="mprod">' + CBA.productOptions('', true) + '</select></div>' +
            '<div class="search-group"><label for="mfrom">Từ ngày</label><input type="date" id="mfrom" /></div>' +
            '<div class="search-group"><label for="mto">Đến ngày</label><input type="date" id="mto" /></div></div>' +
            '<p class="field-error" id="merr"></p><div class="search-actions"><button type="button" class="btn-primary" id="mgo">Xem báo cáo</button></div></div>' +
            '<div class="table-container"><div id="moveList"></div></div>';

        var th = CBA.$('#threshold', main);
        th.value = CB.inventory.threshold();
        CBA.$('#asOf', main).value = U.today();
        var d = new Date(); d.setDate(1);
        CBA.$('#mfrom', main).value = U.dateStr(d);
        CBA.$('#mto', main).value = U.today();

        function lowList() {
            var low = CB.inventory.lowStock().sort(function (a, b) { return a.stock - b.stock; });
            CBA.$('#lowList', main).innerHTML = CBA.table(['Mã', 'Tên sản phẩm', 'Tồn kho', 'Mức cảnh báo'], low.map(function (x) {
                return '<tr><td>' + esc(x.product.code) + '</td><td>' + esc(x.product.name) + '</td><td><strong>' + x.stock + '</strong></td><td>' + (x.stock <= 0 ? CBA.badge('Hết hàng', 'inactive') : CBA.badge('Sắp hết hàng', 'pending')) + '</td></tr>';
            }), 'Không có sản phẩm nào sắp hết hàng (ngưỡng ' + CB.inventory.threshold() + ').');
        }
        CBA.$('#saveThreshold', main).addEventListener('click', function () {
            var r = CB.inventory.setThreshold(th.value);
            CBA.$('#thErr', main).textContent = r.ok ? '' : r.error;
            if (r.ok) { CBA.toast('Đã lưu ngưỡng cảnh báo.'); lowList(); lookup(); }
        });

        function lookup() {
            var asOf = CBA.$('#asOf', main).value;
            var err = !asOf || !U.isDate(asOf) ? 'Vui lòng chọn ngày tra cứu hợp lệ.' : '';
            CBA.$('#serr', main).textContent = err;
            if (err) return;
            var cat = CBA.$('#scat', main).value, pid = CBA.$('#sprod', main).value;
            var today = asOf === U.today();
            var list = CB.catalog.products({ includeHidden: true }).filter(function (p) {
                return (!cat || p.categoryId === cat) && (!pid || p.id === pid);
            }).sort(function (a, b) { return a.code.localeCompare(b.code); });
            var t = CB.inventory.threshold();
            CBA.$('#stockList', main).innerHTML = '<div class="table-header"><h3>Tồn kho cuối ngày ' + U.fmtDate(asOf) + '</h3></div>' +
                CBA.table(['Mã', 'Tên sản phẩm', 'Loại', 'Tồn kho', today ? 'Còn bán được' : '', 'Cảnh báo'].filter(Boolean), list.map(function (p) {
                    var s = CB.inventory.stock(p.id, asOf);
                    var c = CB.catalog.categoryById(p.categoryId);
                    return '<tr><td>' + esc(p.code) + '</td><td>' + esc(p.name) + '</td><td>' + esc(c ? c.name : '') + '</td><td><strong>' + s + '</strong></td>' +
                        (today ? '<td>' + CB.inventory.available(p.id) + '</td>' : '') +
                        '<td>' + (s <= 0 ? CBA.badge('Hết hàng', 'inactive') : s <= t ? CBA.badge('Sắp hết hàng', 'pending') : '') + '</td></tr>';
                }), 'Không có sản phẩm phù hợp.') +
                (today ? '<p class="form-note" style="padding:0 20px 16px;">"Còn bán được" = tồn kho trừ số lượng đang giữ cho các đơn chưa giao.</p>' : '');
        }
        CBA.$('#sgo', main).addEventListener('click', lookup);

        function movement() {
            var from = CBA.$('#mfrom', main).value, to = CBA.$('#mto', main).value;
            var err = !from || !to ? 'Vui lòng chọn khoảng thời gian.' : dateRangeError(from, to);
            CBA.$('#merr', main).textContent = err;
            if (err) return;
            var pid = CBA.$('#mprod', main).value;
            var prods = CB.catalog.products({ includeHidden: true }).filter(function (p) { return !pid || p.id === pid; }).sort(function (a, b) { return a.code.localeCompare(b.code); });
            var rows = prods.map(function (p) {
                var mv = CB.inventory.movement(p.id, from, to);
                return '<tr><td>' + esc(p.code) + '</td><td>' + esc(p.name) + '</td><td>' + mv.opening + '</td><td>' + mv.imports + '</td><td>' + mv.exports + '</td><td><strong>' + mv.closing + '</strong></td></tr>';
            });
            var html = '<div class="table-header"><h3>Nhập - xuất - tồn từ ' + U.fmtDate(from) + ' đến ' + U.fmtDate(to) + '</h3></div>' +
                CBA.table(['Mã', 'Tên sản phẩm', 'Tồn đầu kỳ', 'Nhập', 'Xuất', 'Tồn cuối kỳ'], rows, 'Không có sản phẩm phù hợp.');
            if (pid) {
                var tx = CB.inventory.transactions(pid).filter(function (t) { return t.date >= from && t.date <= to; });
                html += '<div class="table-header"><h3>Chi tiết giao dịch kho</h3></div>' + CBA.table(['Ngày', 'Loại', 'Số lượng', 'Nội dung'], tx.map(function (t) {
                    return '<tr><td>' + U.fmtDate(t.date) + '</td><td>' + (t.type === 'import' ? 'Nhập' : 'Xuất') + '</td><td>' + t.qty + '</td><td>' + esc(t.note) + '</td></tr>';
                }), 'Không có giao dịch trong khoảng thời gian này.');
            }
            CBA.$('#moveList', main).innerHTML = html;
        }
        CBA.$('#mgo', main).addEventListener('click', movement);
        lowList();
        lookup();
        movement();
    };
})(window);
