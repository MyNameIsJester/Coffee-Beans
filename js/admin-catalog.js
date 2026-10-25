/* CoffeeBeans Admin - Tổng quan, Khách hàng, Loại sản phẩm, Sản phẩm. */
(function (g) {
    'use strict';
    var CB = g.CB,
        CBA = g.CBA,
        U = CB.util,
        esc = CBA.esc;

    /* ===================== Tổng quan ===================== */
    CBA.views.dashboard = function (main) {
        var orders = CB.orders.all();
        var delivered = orders.filter(function (o) { return o.status === CB.orders.STATUS.DELIVERED; });
        var revenue = delivered.reduce(function (s, o) { return s + o.total; }, 0);
        var waiting = orders.filter(function (o) { return o.status === CB.orders.STATUS.NEW; }).length;
        var low = CB.inventory.lowStock();
        var recent = orders.slice().sort(function (a, b) { return a.createdAt < b.createdAt ? 1 : -1; }).slice(0, 6);

        function stat(icon, label, value) {
            return '<div class="stat-card"><div class="stat-card-icon">' + icon + '</div><div class="stat-card-label">' + label + '</div><div class="stat-card-value">' + esc(String(value)) + '</div></div>';
        }
        main.innerHTML =
            '<div class="content-header"><h1 class="content-title">Tổng quan</h1></div>' +
            '<div class="stats-grid">' +
            stat('👥', 'Khách hàng', CB.auth.customers().length) +
            stat('☕', 'Sản phẩm', CB.catalog.products({ includeHidden: true }).length) +
            stat('📦', 'Tổng số đơn hàng', orders.length + (waiting ? ' (' + waiting + ' mới đặt)' : '')) +
            stat('💰', 'Doanh thu (đơn đã giao)', CBA.money(revenue)) +
            stat('⚠️', 'Sản phẩm sắp hết hàng', low.length) +
            '</div>' +
            '<div class="table-container"><div class="table-header"><h3>Đơn hàng gần đây</h3></div>' +
            CBA.table(['Mã đơn', 'Khách hàng', 'Ngày đặt', 'Tổng tiền', 'Trạng thái', 'Thao tác'], recent.map(function (o) {
                return '<tr><td>' + esc(o.code) + '</td><td>' + esc(o.customer.fullName) + '</td><td>' + U.fmtDate(o.date) + '</td><td>' + CBA.money(o.total) +
                    '</td><td>' + CBA.orderBadge(o.status) + '</td><td><div class="action-buttons">' + CBA.iconBtn('view-order', o.id, '👁', 'Xem đơn ' + o.code) + '</div></td></tr>';
            }), 'Chưa có đơn hàng nào.') + '</div>';
        CBA.onAct(main, { 'view-order': function (id) { CBA.openOrder(id); } });
    };

    /* ===================== Khách hàng ===================== */
    CBA.views.users = function (main) {
        var st = { q: '', status: '' };
        main.innerHTML =
            '<div class="content-header"><h1 class="content-title">Quản lý khách hàng</h1></div>' +
            '<div class="table-container"><div class="table-header"><h3>Danh sách khách hàng</h3><div class="search-box">' +
            '<input type="text" id="userSearch" placeholder="Tìm theo tên, tài khoản, email, SĐT..." aria-label="Tìm khách hàng" />' +
            '<select id="userStatus" aria-label="Lọc trạng thái"><option value="">Mọi trạng thái</option><option value="active">Đang hoạt động</option><option value="locked">Đã khóa</option></select></div></div>' +
            '<div id="list"></div></div>';

        function refresh() {
            var q = U.norm(st.q);
            var list = CB.auth.customers().filter(function (u) {
                if (st.status && u.status !== st.status) return false;
                return !q || U.norm([u.fullName, u.username, u.email, u.phone].join(' ')).indexOf(q) !== -1;
            }).sort(function (a, b) { return a.createdAt < b.createdAt ? 1 : -1; });
            CBA.$('#list', main).innerHTML = CBA.table(
                ['Họ tên', 'Tên đăng nhập', 'Email', 'Số điện thoại', 'Địa chỉ', 'Ngày đăng ký', 'Trạng thái', 'Thao tác'],
                list.map(function (u) {
                    var locked = u.status === 'locked';
                    return '<tr><td>' + esc(u.fullName) + '</td><td>' + esc(u.username) + '</td><td>' + esc(u.email) + '</td><td>' + esc(u.phone) + '</td>' +
                        '<td>' + (CB.auth.formatAddress(u.address) ? esc(CB.auth.formatAddress(u.address)) : '<em>Chưa cập nhật</em>') + '</td>' +
                        '<td>' + U.fmtDate(u.createdAt) + '</td><td>' + CBA.badge(locked ? 'Đã khóa' : 'Hoạt động', locked ? 'inactive' : 'active') + '</td>' +
                        '<td><div class="action-buttons">' + CBA.iconBtn('reset', u.id, '🔑', 'Đặt lại mật khẩu của ' + u.username) +
                        CBA.iconBtn('lock', u.id, locked ? '🔓' : '🔒', (locked ? 'Mở khóa ' : 'Khóa ') + u.username) + '</div></td></tr>';
                }), 'Không có khách hàng phù hợp.');
        }
        CBA.$('#userSearch', main).addEventListener('input', function (e) { st.q = e.target.value; refresh(); });
        CBA.$('#userStatus', main).addEventListener('change', function (e) { st.status = e.target.value; refresh(); });
        CBA.onAct(main, {
            reset: function (id) {
                var u = CB.auth.userById(id);
                if (!CBA.confirm('Đặt lại mật khẩu của "' + u.username + '" về mật khẩu mặc định ' + CB.auth.DEFAULT_RESET_PASSWORD + '?')) return;
                var r = CB.auth.resetPassword(id);
                if (!r.ok) return CBA.toast(r.error, 'error');
                CBA.message('Đã đặt lại mật khẩu',
                    '<p>Mật khẩu của <strong>' + esc(u.fullName) + '</strong> (' + esc(u.username) + ') đã được đặt lại thành <strong>' + esc(r.newPassword) + '</strong>.</p>' +
                    '<p class="form-note">Chỉ tài khoản này bị thay đổi, các tài khoản khác không bị ảnh hưởng. Đây là cơ chế trình diễn: hãy báo mật khẩu mới cho khách hàng, khách có thể tự đổi lại trong Hồ sơ cá nhân.</p>');
            },
            lock: function (id) {
                var u = CB.auth.userById(id);
                var lock = u.status !== 'locked';
                if (!CBA.confirm((lock ? 'Khóa' : 'Mở khóa') + ' tài khoản "' + u.username + '"?' + (lock ? ' Khách hàng sẽ không thể đăng nhập.' : ''))) return;
                var r = CB.auth.setLocked(id, lock);
                if (!r.ok) return CBA.toast(r.error, 'error');
                CBA.toast(lock ? 'Đã khóa tài khoản ' + u.username : 'Đã mở khóa tài khoản ' + u.username);
                refresh();
            }
        });
        refresh();
    };

    /* ===================== Loại sản phẩm ===================== */
    CBA.views.categories = function (main) {
        main.innerHTML =
            '<div class="content-header"><h1 class="content-title">Quản lý loại sản phẩm</h1><button class="btn-primary" id="addCategory" type="button">+ Thêm loại</button></div>' +
            '<div class="table-container"><div class="table-header"><h3>Danh sách loại sản phẩm</h3></div><div id="list"></div></div>';

        function refresh() {
            var cats = CB.catalog.categories({ includeHidden: true });
            CBA.$('#list', main).innerHTML = CBA.table(['Tên loại', 'Mô tả', 'Số sản phẩm', 'Trạng thái', 'Thao tác'], cats.map(function (c) {
                return '<tr><td>' + esc(c.name) + '</td><td>' + esc(c.description || '') + '</td><td>' + CB.catalog.productCountByCategory(c.id) + '</td>' +
                    '<td>' + CBA.badge(c.hidden ? 'Đang ẩn' : 'Hiển thị', c.hidden ? 'inactive' : 'active') + '</td>' +
                    '<td><div class="action-buttons">' + CBA.iconBtn('edit', c.id, '✏️', 'Sửa loại ' + c.name) +
                    CBA.iconBtn('hide', c.id, c.hidden ? '👁' : '🙈', (c.hidden ? 'Hiện loại ' : 'Ẩn loại ') + c.name) +
                    CBA.iconBtn('delete', c.id, '🗑', 'Xóa loại ' + c.name) + '</div></td></tr>';
            }), 'Chưa có loại sản phẩm nào.');
        }
        function form(cat) {
            var m = CBA.modal({
                title: cat ? 'Sửa loại sản phẩm' : 'Thêm loại sản phẩm',
                body: '<form id="catForm" novalidate><p class="form-error field-error" hidden></p>' +
                    CBA.field('Tên loại <span class="req">*</span>', 'name', cat ? cat.name : '', 'maxlength="60"') +
                    '<div class="form-group"><label for="f-description">Mô tả</label><textarea id="f-description" name="description" rows="3" maxlength="300">' + esc(cat ? cat.description : '') + '</textarea></div></form>',
                buttons: [
                    { label: 'Hủy', cls: 'btn-cancel' },
                    { label: 'Lưu', cls: 'btn-primary', id: 'saveCategory', onClick: function (m) {
                        var f = CBA.$('#catForm', m.el);
                        var r = CB.catalog.saveCategory({ id: cat ? cat.id : undefined, name: f.elements.name.value, description: f.elements.description.value });
                        if (!r.ok) { CBA.showResultError(m.el, r); return false; }
                        CBA.toast(cat ? 'Đã cập nhật loại sản phẩm.' : 'Đã thêm loại sản phẩm.');
                        refresh();
                    } }
                ]
            });
            CBA.$('#catForm', m.el).addEventListener('submit', function (e) { e.preventDefault(); CBA.$('#saveCategory', m.el).click(); });
        }
        CBA.$('#addCategory', main).addEventListener('click', function () { form(null); });
        CBA.onAct(main, {
            edit: function (id) { form(CB.catalog.categoryById(id)); },
            hide: function (id) {
                var c = CB.catalog.categoryById(id);
                var hide = !c.hidden;
                if (hide && !CBA.confirm('Ẩn loại "' + c.name + '"? Các sản phẩm thuộc loại này cũng sẽ không hiển thị với khách hàng.')) return;
                CB.catalog.setCategoryHidden(id, hide);
                CBA.toast(hide ? 'Đã ẩn loại ' + c.name : 'Đã hiển thị lại loại ' + c.name);
                refresh();
            },
            'delete': function (id) {
                var c = CB.catalog.categoryById(id);
                if (!CBA.confirm('Xóa loại "' + c.name + '"? Thao tác này không thể hoàn tác.')) return;
                var r = CB.catalog.deleteCategory(id);
                if (!r.ok) return CBA.message('Không thể xóa loại sản phẩm', '<p>' + esc(r.error) + '</p>');
                CBA.toast('Đã xóa loại ' + c.name);
                refresh();
            }
        });
        refresh();
    };

    /* ===================== Sản phẩm ===================== */
    /* Đọc ảnh người dùng chọn, thu nhỏ còn tối đa 800px rồi mã hóa thành dataURL để lưu được trong localStorage */
    function readImage(file) {
        return new Promise(function (resolve, reject) {
            if (!/^image\//.test(file.type)) return reject(new Error('Tệp được chọn không phải là ảnh.'));
            if (file.size > 8 * 1024 * 1024) return reject(new Error('Ảnh quá lớn (tối đa 8MB).'));
            var fr = new FileReader();
            fr.onerror = function () { reject(new Error('Không đọc được tệp ảnh.')); };
            fr.onload = function () {
                var img = new Image();
                img.onerror = function () { reject(new Error('Ảnh không hợp lệ.')); };
                img.onload = function () {
                    var max = 800, w = img.width, h = img.height;
                    if (w > max || h > max) { var s = max / Math.max(w, h); w = Math.round(w * s); h = Math.round(h * s); }
                    var c = document.createElement('canvas');
                    c.width = w; c.height = h;
                    c.getContext('2d').drawImage(img, 0, 0, w, h);
                    resolve(c.toDataURL('image/jpeg', 0.82));
                };
                img.src = fr.result;
            };
            fr.readAsDataURL(file);
        });
    }

    CBA.views.products = function (main) {
        var st = { q: '', cat: '', status: '' };
        main.innerHTML =
            '<div class="content-header"><h1 class="content-title">Quản lý sản phẩm</h1><button class="btn-primary" id="addProduct" type="button">+ Thêm sản phẩm</button></div>' +
            '<div class="table-container"><div class="table-header"><h3>Danh sách sản phẩm</h3><div class="search-box">' +
            '<input type="text" id="prodSearch" placeholder="Tìm theo mã hoặc tên..." aria-label="Tìm sản phẩm" />' +
            '<select id="prodCat" aria-label="Lọc theo loại">' + CBA.categoryOptions('', true) + '</select>' +
            '<select id="prodStatus" aria-label="Lọc trạng thái"><option value="">Mọi trạng thái</option><option value="shown">Đang hiển thị</option><option value="hidden">Đang ẩn</option></select></div></div>' +
            '<div id="list"></div></div>';

        function refresh() {
            var q = U.norm(st.q);
            var list = CB.catalog.products({ includeHidden: true }).filter(function (p) {
                if (st.cat && p.categoryId !== st.cat) return false;
                if (st.status === 'shown' && p.hidden) return false;
                if (st.status === 'hidden' && !p.hidden) return false;
                return !q || U.norm(p.code + ' ' + p.name).indexOf(q) !== -1;
            }).sort(function (a, b) { return a.code.localeCompare(b.code); });
            CBA.$('#list', main).innerHTML = CBA.table(['Ảnh', 'Mã', 'Tên sản phẩm', 'Loại', 'Giá bán', 'Tồn kho', 'Trạng thái', 'Thao tác'], list.map(function (p) {
                var v = CB.catalog.view(p);
                return '<tr><td><img src="' + esc(p.image) + '" alt="" style="width:44px;height:44px;object-fit:cover;border-radius:6px;" /></td>' +
                    '<td>' + esc(p.code) + '</td><td>' + esc(p.name) + '</td><td>' + esc(v.categoryName) + '</td>' +
                    '<td>' + (v.price === null ? '<em>Chưa có giá</em>' : CBA.money(v.price)) + '</td><td>' + v.stock + '</td>' +
                    '<td>' + CBA.badge(p.hidden ? 'Đang ẩn' : 'Đang bán', p.hidden ? 'inactive' : 'active') + '</td>' +
                    '<td><div class="action-buttons">' + CBA.iconBtn('edit', p.id, '✏️', 'Sửa ' + p.name) +
                    CBA.iconBtn('hide', p.id, p.hidden ? '👁' : '🙈', (p.hidden ? 'Hiện ' : 'Ẩn ') + p.name) +
                    CBA.iconBtn('delete', p.id, '🗑', 'Xóa ' + p.name) + '</div></td></tr>';
            }), 'Không có sản phẩm phù hợp.');
        }

        function form(prod) {
            var newImage = null; // dataURL của ảnh mới chọn
            var m = CBA.modal({
                title: prod ? 'Sửa sản phẩm' : 'Thêm sản phẩm',
                wide: true,
                body: '<form id="prodForm" novalidate><p class="form-error field-error" hidden></p>' +
                    '<div class="form-group"><label for="f-categoryId">Loại sản phẩm <span class="req">*</span></label><select id="f-categoryId" name="categoryId">' +
                    '<option value="">-- Chọn loại --</option>' + CBA.categoryOptions(prod ? prod.categoryId : '', false) + '</select><p class="field-error" data-error-for="categoryId"></p></div>' +
                    CBA.field('Mã sản phẩm <span class="req">*</span>', 'code', prod ? prod.code : '', 'maxlength="20"') +
                    CBA.field('Tên sản phẩm <span class="req">*</span>', 'name', prod ? prod.name : '', 'maxlength="100"') +
                    '<div class="form-group"><label for="f-description">Mô tả</label><textarea id="f-description" name="description" rows="3" maxlength="600">' + esc(prod ? prod.description : '') + '</textarea></div>' +
                    '<div class="form-row">' + CBA.field('Xuất xứ', 'origin', prod ? prod.origin : '', 'maxlength="80"') +
                    CBA.field('Mức độ rang', 'roast', prod ? prod.roast : '', 'maxlength="40"') +
                    CBA.field('Khối lượng', 'weight', prod ? prod.weight : '', 'maxlength="20" placeholder="Ví dụ: 500g"') + '</div>' +
                    '<div class="form-group"><label for="f-image">Hình ảnh</label>' +
                    '<div style="display:flex;gap:16px;align-items:center;"><img id="imgPreview" src="' + esc(prod ? prod.image : CB.catalog.placeholderImage) + '" alt="Xem trước" style="width:96px;height:96px;object-fit:cover;border-radius:8px;border:1px solid #eee;" />' +
                    '<div><input type="file" id="f-image" name="image" accept="image/*" /><small class="form-hint">' + (prod ? 'Để trống nếu muốn giữ ảnh hiện tại.' : 'Nếu không chọn, sản phẩm dùng ảnh mặc định.') + '</small></div></div>' +
                    '<p class="field-error" data-error-for="image"></p></div></form>',
                buttons: [
                    { label: 'Hủy', cls: 'btn-cancel' },
                    { label: 'Lưu', cls: 'btn-primary', id: 'saveProduct', onClick: function (m) {
                        var f = CBA.$('#prodForm', m.el);
                        var r = CB.catalog.saveProduct({
                            id: prod ? prod.id : undefined,
                            code: f.elements.code.value, name: f.elements.name.value, categoryId: f.elements.categoryId.value,
                            description: f.elements.description.value, origin: f.elements.origin.value, roast: f.elements.roast.value, weight: f.elements.weight.value,
                            image: newImage || (prod ? prod.image : '')
                        });
                        if (!r.ok) { CBA.showResultError(m.el, r); return false; }
                        CBA.toast(prod ? 'Đã cập nhật sản phẩm.' : 'Đã thêm sản phẩm.');
                        refresh();
                    } }
                ]
            });
            var file = CBA.$('#f-image', m.el);
            file.addEventListener('change', function () {
                if (!file.files.length) return;
                readImage(file.files[0]).then(function (data) {
                    newImage = data;
                    CBA.$('#imgPreview', m.el).src = data;
                    CBA.setErrors(m.el, {});
                }, function (err) {
                    newImage = null;
                    file.value = '';
                    CBA.setErrors(m.el, { image: err.message });
                });
            });
            CBA.$('#prodForm', m.el).addEventListener('submit', function (e) { e.preventDefault(); CBA.$('#saveProduct', m.el).click(); });
        }

        CBA.$('#addProduct', main).addEventListener('click', function () { form(null); });
        CBA.$('#prodSearch', main).addEventListener('input', function (e) { st.q = e.target.value; refresh(); });
        CBA.$('#prodCat', main).addEventListener('change', function (e) { st.cat = e.target.value; refresh(); });
        CBA.$('#prodStatus', main).addEventListener('change', function (e) { st.status = e.target.value; refresh(); });
        CBA.onAct(main, {
            edit: function (id) { form(CB.catalog.productById(id)); },
            hide: function (id) {
                var p = CB.catalog.productById(id);
                var hide = !p.hidden;
                if (hide && !CBA.confirm('Ẩn sản phẩm "' + p.name + '"? Khách hàng sẽ không còn thấy sản phẩm này.')) return;
                CB.catalog.setProductHidden(id, hide);
                CBA.toast(hide ? 'Đã ẩn ' + p.name : 'Đã hiển thị lại ' + p.name);
                refresh();
            },
            'delete': function (id) {
                var p = CB.catalog.productById(id);
                if (!CBA.confirm('Xóa sản phẩm "' + p.name + '"? Thao tác này không thể hoàn tác.')) return;
                var r = CB.catalog.deleteProduct(id);
                if (!r.ok) return CBA.message('Không thể xóa sản phẩm', '<p>' + esc(r.error) + '</p>');
                CBA.toast('Đã xóa ' + p.name);
                refresh();
            }
        });
        refresh();
    };
})(window);
