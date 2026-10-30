/* Trang danh sách sản phẩm: hiển thị theo loại, tìm kiếm cơ bản/nâng cao, phân trang.
   Trạng thái lọc nằm trên URL: ?q=&cat=<slug>&min=&max=&sort=&page= */
(function () {
    'use strict';
    var U = CB.util,
        PAGE_SIZE = 9;
    var $ = function (id) { return document.getElementById(id); };

    var grid = $('productGrid'),
        pagerBox = $('pagination'),
        form = $('filterForm'),
        resultInfo = $('resultInfo'),
        errBox = $('filterError');

    /* ---------- Đọc/ghi bộ lọc từ URL ---------- */
    function readParams() {
        var p = new URLSearchParams(location.search);
        return {
            q: p.get('q') || '',
            cat: p.get('cat') || '',
            min: p.get('min') || '',
            max: p.get('max') || '',
            sort: p.get('sort') || 'default',
            page: parseInt(p.get('page'), 10) || 1
        };
    }
    function writeParams(f, replace) {
        var p = new URLSearchParams();
        if (f.q) p.set('q', f.q);
        if (f.cat) p.set('cat', f.cat);
        if (f.min !== '') p.set('min', f.min);
        if (f.max !== '') p.set('max', f.max);
        if (f.sort && f.sort !== 'default') p.set('sort', f.sort);
        if (f.page > 1) p.set('page', f.page);
        var url = location.pathname.split('/').pop() + (p.toString() ? '?' + p.toString() : '');
        if (replace) history.replaceState(null, '', url);
        else history.pushState(null, '', url);
    }

    /* ---------- Form ---------- */
    function fillCategoryOptions() {
        var sel = $('category');
        CB.catalog.categories().forEach(function (c) {
            var o = document.createElement('option');
            o.value = c.slug;
            o.textContent = c.name;
            sel.appendChild(o);
        });
    }
    function fillForm(f) {
        $('productSearch').value = f.q;
        $('category').value = f.cat;
        $('priceMin').value = f.min;
        $('priceMax').value = f.max;
        $('sort').value = f.sort;
    }
    function showError(msg) {
        errBox.textContent = msg || '';
        errBox.hidden = !msg;
        $('priceMin').classList.toggle('cb-input-error', !!msg);
        $('priceMax').classList.toggle('cb-input-error', !!msg);
    }
    /* Trả về bộ lọc hợp lệ hoặc null */
    function collectForm() {
        var min = $('priceMin').value.trim(),
            max = $('priceMax').value.trim();
        var nMin = min === '' ? null : Number(min),
            nMax = max === '' ? null : Number(max);
        if ((nMin !== null && (isNaN(nMin) || nMin < 0)) || (nMax !== null && (isNaN(nMax) || nMax < 0))) {
            showError('Khoảng giá phải là số không âm.');
            return null;
        }
        if (nMin !== null && nMax !== null && nMin > nMax) {
            showError('Giá tối thiểu không được lớn hơn giá tối đa.');
            return null;
        }
        showError('');
        return {
            q: $('productSearch').value.trim(),
            cat: $('category').value,
            min: min,
            max: max,
            sort: $('sort').value,
            page: 1
        };
    }

    /* ---------- Hiển thị ---------- */
    function card(v) {
        var link = 'product-detail.html?id=' + encodeURIComponent(v.id);
        var stockNote = '';
        var disabled = false,
            label = 'Thêm vào giỏ';
        if (v.price === null) {
            stockNote = '<small class="stock-note out">Chưa có giá bán</small>';
            disabled = true;
            label = 'Chưa có giá';
        } else if (v.available <= 0) {
            stockNote = '<small class="stock-note out">Hết hàng</small>';
            disabled = true;
            label = 'Hết hàng';
        } else if (v.available <= CB.inventory.threshold()) {
            stockNote = '<small class="stock-note low">Sắp hết hàng: còn ' + v.available + '</small>';
        }
        return (
            '<article class="card">' +
            '<a href="' + link + '" style="text-decoration:none;color:inherit;"><img src="' + U.esc(v.image) + '" alt="' + U.esc(v.name) + '" /></a>' +
            '<div class="card-body"><span class="chip">' + U.esc(v.categoryName) + '</span><div class="spacer"></div>' +
            '<div class="prod"><img src="' + U.esc(v.image) + '" alt="" />' +
            '<div><h4><a href="' + link + '" style="text-decoration:none;color:inherit;">' + U.esc(v.name) + '</a></h4>' +
            '<div><span class="price">' + (v.price === null ? '—' : U.fmtVND(v.price)) + '</span></div>' + stockNote + '</div>' +
            '<div class="button-group"><button class="add" data-id="' + U.esc(v.id) + '"' + (disabled ? ' disabled' : '') + '>' + label + '</button></div>' +
            '</div></div></article>'
        );
    }

    function render(f) {
        var cat = f.cat ? CB.catalog.categoryBySlug(f.cat) : null;
        var list = CB.catalog.search({
            q: f.q,
            categoryId: cat ? cat.id : f.cat ? '__none__' : '',
            min: f.min,
            max: f.max,
            sort: f.sort
        });
        var pg = U.paginate(list, f.page, PAGE_SIZE);

        $('pageTitle').textContent = cat ? 'Cà phê ' + cat.name : 'Cà Phê Chất Lượng Cao';
        $('pageDesc').textContent = cat && cat.description
            ? cat.description
            : 'Khám phá bộ sưu tập cà phê rang xay tươi mới từ các vùng trồng tốt nhất';
        document.title = (cat ? cat.name : 'Sản phẩm') + ' - Cà Phê Đậm Đà';

        var filtering = !!(f.q || f.cat || f.min !== '' || f.max !== '');
        resultInfo.textContent = filtering
            ? 'Tìm thấy ' + pg.total + ' sản phẩm phù hợp'
            : 'Hiển thị ' + pg.total + ' sản phẩm';

        if (!pg.total) {
            grid.style.display = 'block';
            grid.innerHTML = '<div class="no-results">Không tìm thấy sản phẩm phù hợp với điều kiện tìm kiếm.<br>' +
                '<button type="button" class="reset-filter" id="clearFromEmpty" style="margin-top:16px;padding:10px 20px;">Xóa bộ lọc</button></div>';
            $('clearFromEmpty').addEventListener('click', clearAll);
            pagerBox.innerHTML = '';
            return;
        }
        grid.style.display = '';
        grid.innerHTML = pg.items.map(card).join('');
        CB.ui.renderPagination(pagerBox, pg, function (page) {
            f.page = page;
            writeParams(f);
            render(f);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        // nếu page trên URL vượt quá số trang, đồng bộ lại URL
        if (pg.page !== f.page) {
            f.page = pg.page;
            writeParams(f, true);
        }
    }

    function clearAll() {
        var f = { q: '', cat: '', min: '', max: '', sort: 'default', page: 1 };
        showError('');
        fillForm(f);
        writeParams(f);
        render(f);
    }

    /* ---------- Sự kiện ---------- */
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var f = collectForm();
        if (!f) return;
        writeParams(f);
        render(f);
    });
    $('resetFilter').addEventListener('click', clearAll);
    $('sort').addEventListener('change', function () {
        var f = collectForm();
        if (!f) return;
        writeParams(f);
        render(f);
    });
    window.addEventListener('popstate', function () {
        var f = readParams();
        fillForm(f);
        render(f);
    });

    grid.addEventListener('click', function (e) {
        var btn = e.target.closest('button.add');
        if (!btn || btn.disabled) return;
        var r = CB.cart.add(btn.getAttribute('data-id'), 1);
        if (r.ok) {
            CB.ui.toast('Đã thêm vào giỏ hàng.');
            CB.ui.refreshBadge();
            render(readParams());
        } else if (r.code === 'LOGIN_REQUIRED') {
            location.href = CB.auth.loginUrl();
        } else {
            CB.ui.toast(r.error, 'error');
        }
    });

    fillCategoryOptions();
    var initial = readParams();
    fillForm(initial);
    render(initial);
})();
