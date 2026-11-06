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
    CBA.mountTemplate = function (root, id) {
        var template = document.getElementById(id);
        if (!template || !template.content) throw new Error('Không tìm thấy admin template: ' + id);
        root.replaceChildren(template.content.cloneNode(true));
        return root;
    };

    /* Hộp xác nhận dùng chung cho các thao tác quản trị cần xác nhận */
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
    /* Hiện kết quả của tầng dữ liệu lên form */
    CBA.showResultError = function (root, result) {
        var e = {};
        e[result.field || '_'] = result.error;
        CBA.setErrors(root, e);
    };

    /* Hộp thoại. */
    CBA.modal = function (opts) {
        var root = document.getElementById('modalRoot');
        var template = document.getElementById('tpl-admin-modal');
        if (!root || !template) throw new Error('Thiếu vùng modal hoặc template modal quản trị.');
        var fragment = template.content.cloneNode(true);
        var el = fragment.querySelector('.modal');
        var content = fragment.querySelector('[data-modal-size]');
        content.style.maxWidth = opts.wide ? '920px' : '560px';
        content.style.maxHeight = '92vh';
        fragment.querySelector('[data-modal-title]').textContent = opts.title || '';
        fragment.querySelector('[data-modal-body]').innerHTML = opts.body || '';
        root.appendChild(fragment);
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

    /* Bảng dữ liệu. */
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
        var admin = CB.auth.adminCurrent();
        var app = document.getElementById('adminApp') || document.body;

        if (!admin) {
            // Hiển thị cổng đăng nhập Admin
            document.title = 'Đăng nhập Quản trị - Cà Phê Đậm Đà';
            CBA.mountTemplate(app, 'tpl-admin-login');

            var loginForm = document.getElementById('adminLoginForm');
            if (loginForm) {
                loginForm.addEventListener('submit', function (e) {
                    e.preventDefault();
                    var errBox = document.getElementById('adminLoginError');
                    if (errBox) errBox.style.display = 'none';
                    var u = document.getElementById('adminUsername').value.trim();
                    var pw = document.getElementById('adminPassword').value;
                    if (!u || !pw) {
                        if (errBox) {
                            errBox.textContent = 'Vui lòng nhập tên đăng nhập và mật khẩu.';
                            errBox.style.display = 'block';
                        }
                        return;
                    }
                    var r = CB.auth.adminLogin(u, pw);
                    if (!r.ok) {
                        if (errBox) {
                            errBox.textContent = r.error;
                            errBox.style.display = 'block';
                        }
                        return;
                    }
                    CB.ui.toast('Đăng nhập quản trị thành công!');
                    CBA.init();
                });
            }
            return;
        }

        // Đã đăng nhập: Hiển thị đầy đủ bảng điều khiển Admin Dashboard
        document.title = 'Quản trị hệ thống - Cà Phê Đậm Đà';
        CBA.mountTemplate(app, 'tpl-admin-shell');
        document.getElementById('userAvatar').textContent = (admin.fullName || admin.username).charAt(0).toUpperCase();
        document.getElementById('adminName').textContent = admin.fullName || admin.username;

        var logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function () {
                CB.auth.adminLogout();
                CB.ui.toast('Đã đăng xuất quản trị.');
                CBA.init();
            });
        }

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
