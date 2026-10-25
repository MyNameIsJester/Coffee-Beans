/* CoffeeBeans Admin - Lõi dùng chung: điều hướng, hộp thoại, bảng, tiện ích form.
   Mỗi chức năng quản trị là một "view" đăng ký vào CBA.views[tên] = function (main) {...}. */
(function (g) {
    'use strict';
    var CB = g.CB;
    var U = CB.util;
    var esc = U.esc;

    var CBA = (g.CBA = { views: {}, current: null });
    CBA.esc = esc;
    CBA.money = U.fmtVND;
    CBA.main = function () { return document.getElementById('adminMain'); };
    CBA.$ = function (sel, root) { return (root || document).querySelector(sel); };
    CBA.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

    /* Cho phép test thay thế hộp xác nhận mặc định của trình duyệt */
    CBA.confirm = function (message) { return g.confirm(message); };

    CBA.toast = function (message, type) { CB.ui.toast(message, type); };

    /* Nhãn trạng thái đơn hàng theo class của admin */
    CBA.orderBadge = function (status) {
        var cls = { 'Mới đặt': 'status-pending', 'Đã xử lý': 'status-processing', 'Đã giao': 'status-active', 'Hủy': 'status-inactive' }[status] || 'status-pending';
        return '<span class="status-badge ' + cls + '">' + esc(status) + '</span>';
    };
    CBA.badge = function (text, kind) {
        return '<span class="status-badge status-' + kind + '">' + esc(text) + '</span>';
    };

    /* Ô nhập liệu có nhãn và chỗ hiện lỗi */
    CBA.field = function (label, name, value, attrs, hint) {
        return '<div class="form-group"><label for="f-' + name + '">' + label + '</label>' +
            '<input id="f-' + name + '" name="' + name + '" value="' + esc(value === undefined || value === null ? '' : value) + '" ' + (attrs || '') + ' />' +
            (hint ? '<small class="form-hint">' + hint + '</small>' : '') +
            '<p class="field-error" data-error-for="' + name + '"></p></div>';
    };
    CBA.setErrors = function (root, errors) {
        CBA.$$('.field-error', root).forEach(function (e) { if (!e.classList.contains('form-error')) e.textContent = ''; });
        CBA.$$('.invalid', root).forEach(function (e) { e.classList.remove('invalid'); });
        var general = CBA.$('.form-error', root);
        if (general) { general.textContent = ''; general.hidden = true; }
        Object.keys(errors || {}).forEach(function (k) {
            var el = CBA.$('[data-error-for="' + k + '"]', root);
            if (el) {
                el.textContent = errors[k];
                var input = CBA.$('[name="' + k + '"]', root);
                if (input) input.classList.add('invalid');
            } else if (general) {
                general.textContent = errors[k];
                general.hidden = false;
            }
        });
    };
    /* Hiện kết quả {ok:false, error, field} của tầng dữ liệu lên form */
    CBA.showResultError = function (root, result) {
        var e = {};
        e[result.field || '_'] = result.error;
        CBA.setErrors(root, e);
    };

    /* Hộp thoại. buttons: [{label, cls, onClick(modal)}]; onClick trả về false thì giữ hộp thoại mở. */
    CBA.modal = function (opts) {
        var root = document.getElementById('modalRoot');
        var el = document.createElement('div');
        el.className = 'modal active';
        el.setAttribute('role', 'dialog');
        el.setAttribute('aria-modal', 'true');
        el.innerHTML =
            '<div class="modal-content" style="max-width:' + (opts.wide ? '920px' : '560px') + ';max-height:92vh;">' +
            '<div class="modal-header"><h2>' + esc(opts.title) + '</h2><button class="close-btn" type="button" data-close aria-label="Đóng">×</button></div>' +
            '<div class="modal-body">' + opts.body + '</div><div class="modal-footer"></div></div>';
        root.appendChild(el);
        var m = {
            el: el,
            $: function (sel) { return CBA.$(sel, el); },
            $$: function (sel) { return CBA.$$(sel, el); },
            close: function () {
                if (el.parentNode) el.parentNode.removeChild(el);
                document.removeEventListener('keydown', onKey);
                if (opts.onClose) opts.onClose();
            }
        };
        function onKey(e) { if (e.key === 'Escape' && root.lastElementChild === el) m.close(); }
        document.addEventListener('keydown', onKey);
        el.addEventListener('mousedown', function (e) { if (e.target === el) m.close(); });
        CBA.$('[data-close]', el).addEventListener('click', m.close);
        var footer = CBA.$('.modal-footer', el);
        (opts.buttons || []).forEach(function (b) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = b.cls || 'btn-cancel';
            btn.textContent = b.label;
            if (b.id) btn.id = b.id;
            btn.addEventListener('click', function () {
                var r = b.onClick ? b.onClick(m) : undefined;
                if (r !== false) m.close();
            });
            footer.appendChild(btn);
        });
        var first = CBA.$('input:not([type=file]), select, textarea', el);
        if (first) first.focus();
        return m;
    };
    CBA.message = function (title, bodyHtml) {
        return CBA.modal({ title: title, body: bodyHtml, buttons: [{ label: 'Đóng', cls: 'btn-primary' }] });
    };

    /* Bảng dữ liệu. headers: ['Cột 1', ...]; rows: mảng chuỗi HTML của từng <tr> */
    CBA.table = function (headers, rows, emptyText) {
        if (!rows.length) return '<div class="empty-state">' + esc(emptyText || 'Không có dữ liệu.') + '</div>';
        return '<table><thead><tr>' + headers.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' + rows.join('') + '</tbody></table>';
    };
    CBA.iconBtn = function (act, id, icon, title, extra) {
        return '<button type="button" class="btn-icon" data-act="' + act + '" data-id="' + esc(id) + '" title="' + esc(title) + '" aria-label="' + esc(title) + '"' + (extra || '') + '>' + icon + '</button>';
    };
    /* Gắn xử lý bấm cho mọi phần tử có data-act trong vùng root */
    CBA.onAct = function (root, handlers) {
        root.addEventListener('click', function (e) {
            var b = e.target.closest('[data-act]');
            if (!b || !root.contains(b) || b.disabled) return;
            var h = handlers[b.getAttribute('data-act')];
            if (h) h(b.getAttribute('data-id'), b);
        });
    };
    CBA.categoryOptions = function (selected, withAll, includeHidden) {
        var opts = withAll ? '<option value="">Tất cả loại</option>' : '';
        CB.catalog.categories({ includeHidden: includeHidden !== false }).forEach(function (c) {
            opts += '<option value="' + esc(c.id) + '"' + (c.id === selected ? ' selected' : '') + '>' + esc(c.name) + (c.hidden ? ' (đang ẩn)' : '') + '</option>';
        });
        return opts;
    };
    CBA.productOptions = function (selected, withAll) {
        var opts = withAll ? '<option value="">Tất cả sản phẩm</option>' : '<option value="">-- Chọn sản phẩm --</option>';
        CB.catalog.products({ includeHidden: true }).sort(function (a, b) { return a.code.localeCompare(b.code); }).forEach(function (p) {
            opts += '<option value="' + esc(p.id) + '"' + (p.id === selected ? ' selected' : '') + '>' + esc(p.code + ' - ' + p.name) + '</option>';
        });
        return opts;
    };
    CBA.productName = function (id) {
        var p = CB.catalog.productById(id);
        return p ? p.name : '(sản phẩm đã xóa)';
    };

    /* ---------- Điều hướng ---------- */
    CBA.go = function (name) {
        if (!CBA.views[name]) name = 'dashboard';
        CBA.current = name;
        CBA.onOrdersChanged = null;
        CBA.$$('.nav-btn').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-view') === name); });
        // Thay vùng nội dung bằng phần tử mới để các trình xử lý bấm của chức năng trước không còn tồn tại
        var old = CBA.main();
        var main = old.cloneNode(false);
        old.parentNode.replaceChild(main, old);
        CBA.views[name](main);
        if (g.location.hash !== '#' + name) g.history.replaceState(null, '', '#' + name);
        g.scrollTo(0, 0);
    };
    CBA.refresh = function () { CBA.go(CBA.current); };

    CBA.init = function () {
        var admin = CB.auth.requireAdmin();
        if (!admin) return;
        document.getElementById('adminName').textContent = admin.fullName || admin.username;
        document.getElementById('userAvatar').textContent = (admin.fullName || admin.username).charAt(0).toUpperCase();
        document.getElementById('logoutBtn').addEventListener('click', function () {
            CB.auth.adminLogout();
            g.location.href = 'admin-login.html';
        });
        CBA.$$('.nav-btn').forEach(function (b) {
            b.addEventListener('click', function () { CBA.go(b.getAttribute('data-view')); });
        });
        g.addEventListener('hashchange', function () {
            var n = g.location.hash.slice(1);
            if (n && n !== CBA.current) CBA.go(n);
        });
        CBA.go(g.location.hash.slice(1) || 'dashboard');
    };
})(window);
