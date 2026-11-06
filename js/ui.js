/* CoffeeBeans - Thành phần giao diện dùng chung: header, footer, thông báo, phân trang.
   File: js/ui.js
*/
(function (g) {
    'use strict';
    var CB = (g.CB = g.CB || {});
    var U = CB.util;
    var doc = g.document;

    var ui = {
        /* Đọc query param từ hash trước (VD: #/products?cat=arabica), rồi mới tới location.search */
        param: function (name) {
            try {
                var h = (g.location && g.location.hash) ? g.location.hash : '';
                var qIdx = h.indexOf('?');
                if (qIdx !== -1) {
                    var val = new URLSearchParams(h.substring(qIdx)).get(name);
                    if (val !== null) return val;
                }
                return new URLSearchParams(g.location.search).get(name);
            } catch (e) {
                return null;
            }
        },

        /* Thông báo nổi nhỏ. type: 'success' | 'error' | 'info' | 'warning' */
        toast: function (message, type) {
            if (!doc) return;
            var container = doc.getElementById('toastContainer');
            if (!container) {
                container = doc.createElement('div');
                container.id = 'toastContainer';
                container.className = 'cb-toast-container';
                doc.body.appendChild(container);
            }
            var el = doc.createElement('div');
            el.className = 'cb-toast cb-toast-' + (type || 'success');
            el.setAttribute('role', 'status');
            el.textContent = message;
            container.appendChild(el);
            g.setTimeout(function () {
                el.classList.add('hide');
                g.setTimeout(function () {
                    if (el.parentNode) el.parentNode.removeChild(el);
                }, 300);
            }, 2600);
        },

        /* Phân trang: container nhận nút Trước / số trang / Sau. onPage(page) được gọi khi bấm. */
        renderPagination: function (container, state, onPage) {
            if (!container) return;
            container.innerHTML = '';
            if (state.pages <= 1) return;
            var wrap = doc.createElement('div');
            wrap.className = 'pagination';
            function btn(label, page, opts) {
                var b = doc.createElement('button');
                b.type = 'button';
                b.textContent = label;
                b.className = 'page-btn' + (opts && opts.active ? ' active' : '');
                if (opts && opts.disabled) b.disabled = true;
                if (opts && opts.active) b.setAttribute('aria-current', 'page');
                b.addEventListener('click', function () {
                    onPage(page);
                });
                wrap.appendChild(b);
            }
            btn('← Trước', state.page - 1, { disabled: state.page <= 1 });
            for (var i = 1; i <= state.pages; i++) btn(String(i), i, { active: i === state.page });
            btn('Sau →', state.page + 1, { disabled: state.page >= state.pages });
            container.appendChild(wrap);
        },

        /* Nhãn trạng thái đơn hàng có màu. */
        statusBadge: function (status) {
            var cls = { 'Mới đặt': 'status-pending', 'Đã xử lý': 'status-delivering', 'Đã giao': 'status-delivered', 'Hủy': 'status-cancelled' }[status] || 'status-pending';
            return '<span class="status-badge ' + cls + '">' + U.esc(status) + '</span>';
        },

        logout: function () {
            CB.auth.logout();
            ui.toast('Đã đăng xuất thành công.');
            ui.mountHeader();
            if (CB.router && typeof CB.router.reload === 'function') {
                CB.router.reload();
            }
            g.setTimeout(function () {
                var p = g.location.pathname || '';
                if (p.endsWith('index.html') || p === '/' || p.endsWith('/')) {
                    g.location.hash = '#/home';
                    g.location.reload();
                } else {
                    g.location.href = 'index.html#/home';
                }
            }, 200);
        },

        refreshBadge: function () {
            var user = CB.auth.current();
            var accountArea = doc.getElementById('headerAccountArea');
            var hasMenu = Boolean(accountArea && accountArea.querySelector('#accountMenu'));
            if (accountArea && Boolean(user) !== hasMenu) {
                ui.mountHeader();
                return;
            }
            var badge = doc.getElementById('cart-badge');
            if (badge) {
                var count = (CB.cart && typeof CB.cart.count === 'function') ? CB.cart.count() : 0;
                badge.textContent = String(count);
                badge.style.display = count > 0 ? 'flex' : 'none';
            }
            var accountText = doc.getElementById('accountText');
            if (accountText && user) accountText.textContent = 'Chào ' + user.fullName;
        },

        /* Header và footer được khai báo trực tiếp trong HTML; JavaScript chỉ cập nhật dữ liệu thay đổi. */
        mountHeader: function () {
            var host = doc.getElementById('siteHeader');
            if (!host) return;
            if (ui.param('logout') === '1') {
                CB.auth.logout();
                var clean = g.location.href.replace(/[?&]logout=1/, '');
                if (g.history && g.history.replaceState) g.history.replaceState(null, '', clean);
            }
            var user = CB.auth.current();
            var categoryHost = doc.getElementById('headerCategoryLinks');
            var mobileCategoryHost = doc.getElementById('mobileCategoryLinks');
            var accountHost = doc.getElementById('headerAccountArea');
            var mobileAccountHost = doc.getElementById('mobileAccountLinks');
            var cats = CB.catalog ? CB.catalog.categories() : [];

            function addCategoryLinks(target) {
                if (!target) return;
                target.replaceChildren();
                cats.forEach(function (category) {
                    var link = doc.createElement('a');
                    link.href = 'index.html#/products?cat=' + encodeURIComponent(category.slug);
                    link.textContent = category.name;
                    target.appendChild(link);
                });
            }
            addCategoryLinks(categoryHost);
            addCategoryLinks(mobileCategoryHost);

            if (accountHost) {
                accountHost.replaceChildren();
                if (user) {
                    var menu = doc.createElement('div');
                    menu.className = 'account-menu';
                    menu.id = 'accountMenu';
                    var toggle = doc.createElement('div');
                    toggle.className = 'account-toggle';
                    toggle.setAttribute('role', 'button');
                    toggle.setAttribute('tabindex', '0');
                    toggle.setAttribute('aria-expanded', 'false');
                    var userIcon = doc.createElement('i');
                    userIcon.className = 'fa fa-user';
                    var label = doc.createElement('span');
                    label.id = 'accountText';
                    label.textContent = 'Chào ' + user.fullName;
                    var caret = doc.createElement('i');
                    caret.className = 'fa fa-caret-down';
                    toggle.append(userIcon, label, caret);
                    var list = doc.createElement('ul');
                    list.className = 'account-dropdown';
                    list.id = 'accountDropdown';
                    list.setAttribute('aria-hidden', 'true');
                    [
                        ['account.html#/profile', 'fa fa-user-circle', 'Hồ sơ cá nhân'],
                        ['account.html#/orders', 'fa fa-shopping-bag', 'Đơn hàng của tôi']
                    ].forEach(function (item) {
                        var li = doc.createElement('li');
                        var a = doc.createElement('a');
                        a.href = item[0];
                        a.className = 'menu-link';
                        var icon = doc.createElement('i');
                        icon.className = item[1];
                        a.append(icon, doc.createTextNode(' ' + item[2]));
                        li.appendChild(a);
                        list.appendChild(li);
                    });
                    var logoutLi = doc.createElement('li');
                    var logoutLink = doc.createElement('a');
                    logoutLink.href = '#';
                    logoutLink.id = 'logoutLink';
                    logoutLink.className = 'menu-link';
                    logoutLink.textContent = 'Đăng xuất';
                    logoutLi.appendChild(logoutLink);
                    list.appendChild(logoutLi);
                    menu.append(toggle, list);
                    accountHost.appendChild(menu);
                } else {
                    var login = doc.createElement('a');
                    login.href = CB.auth.loginUrl();
                    login.className = 'account-link';
                    login.textContent = 'Đăng nhập / Đăng ký';
                    accountHost.appendChild(login);
                }
            }

            if (mobileAccountHost) {
                mobileAccountHost.replaceChildren();
                var mobileItems = user
                    ? [['account.html#/profile', 'Hồ sơ cá nhân'], ['account.html#/orders', 'Đơn hàng của tôi'], ['checkout.html#/cart', 'Giỏ hàng']]
                    : [[CB.auth.loginUrl(), 'Đăng nhập / Đăng ký']];
                mobileItems.forEach(function (item) {
                    var link = doc.createElement('a');
                    link.href = item[0];
                    link.textContent = item[1];
                    mobileAccountHost.appendChild(link);
                });
                if (user) {
                    var logout = doc.createElement('a');
                    logout.href = '#';
                    logout.id = 'logoutLinkMobile';
                    logout.textContent = 'Đăng xuất';
                    mobileAccountHost.appendChild(logout);
                }
            }

            var searchInput = doc.getElementById('searchInput');
            if (searchInput) searchInput.value = ui.param('q') || '';
            var searchForm = doc.getElementById('headerSearchForm');
            if (searchForm && !searchForm.dataset.bound) {
                searchForm.dataset.bound = '1';
                searchForm.addEventListener('submit', function (e) {
                    e.preventDefault();
                    var value = searchInput ? searchInput.value.trim() : '';
                    g.location.href = 'index.html#/products' + (value ? '?q=' + encodeURIComponent(value) : '');
                });
            }

            var menuBtn = doc.getElementById('menuBtn');
            var mobileMenu = doc.getElementById('mobileMenu');
            if (menuBtn && mobileMenu && !menuBtn.dataset.bound) {
                menuBtn.dataset.bound = '1';
                menuBtn.addEventListener('click', function () {
                    var open = mobileMenu.hasAttribute('hidden');
                    if (open) mobileMenu.removeAttribute('hidden');
                    else mobileMenu.setAttribute('hidden', '');
                    menuBtn.setAttribute('aria-expanded', String(open));
                });
            }

            ['logoutLink', 'logoutLinkMobile'].forEach(function (id) {
                var element = doc.getElementById(id);
                if (element && !element.dataset.bound) {
                    element.dataset.bound = '1';
                    element.addEventListener('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        ui.logout();
                    });
                }
            });

            var toggleEl = doc.querySelector('.account-toggle');
            var dropdown = doc.getElementById('accountDropdown');
            if (toggleEl && dropdown && !toggleEl.dataset.bound) {
                toggleEl.dataset.bound = '1';
                var setOpen = function (open) {
                    dropdown.classList.toggle('show', open);
                    toggleEl.setAttribute('aria-expanded', String(open));
                    dropdown.setAttribute('aria-hidden', String(!open));
                };
                toggleEl.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpen(!dropdown.classList.contains('show'));
                });
                toggleEl.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpen(!dropdown.classList.contains('show'));
                    }
                });
                doc.addEventListener('click', function (e) {
                    if (!e.target.closest('.account-menu')) setOpen(false);
                });
            }
            ui.refreshBadge();
        },

        mountFooter: function () {
            /* Footer là HTML tĩnh, không cần dựng lại bằng JavaScript. */
        }
    };

    CB.ui = ui;
    if (doc) {
        if (doc.readyState === 'loading') {
            doc.addEventListener('DOMContentLoaded', function () {
                ui.mountHeader();
                ui.mountFooter();
            });
        } else {
            ui.mountHeader();
            ui.mountFooter();
        }
    }
})(typeof window !== 'undefined' ? window : globalThis);
