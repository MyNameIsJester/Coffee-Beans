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
            var hasMenu = Boolean(doc.getElementById('accountMenu'));
            // Tự động đồng bộ header khi trạng thái đăng nhập thay đổi
            if (Boolean(user) !== hasMenu) {
                ui.mountHeader();
                return;
            }

            var b = doc.getElementById('cart-badge');
            if (b) {
                var n = (CB.cart && typeof CB.cart.count === 'function') ? CB.cart.count() : 0;
                b.textContent = n;
                b.style.display = n > 0 ? 'flex' : 'none';
            }

            var accText = doc.getElementById('accountText');
            if (accText && user) {
                accText.textContent = 'Chào ' + user.fullName;
            }
        },

        /* Vẽ header dùng chung vào <div id="siteHeader"></div> */
        mountHeader: function () {
            var host = doc.getElementById('siteHeader');
            if (!host) return;
            if (ui.param('logout') === '1') {
                CB.auth.logout();
                var clean = g.location.href.replace(/[?&]logout=1/, '');
                if (g.history && g.history.replaceState) g.history.replaceState(null, '', clean);
            }
            var user = CB.auth.current();
            var cats = CB.catalog ? CB.catalog.categories() : [];
            var catLinks = cats
                .map(function (c) {
                    return '<a href="index.html#/products?cat=' + encodeURIComponent(c.slug) + '">' + U.esc(c.name) + '</a>';
                })
                .join('');
            var q = ui.param('q') || '';

            var account = user
                ? '<div class="account-menu" id="accountMenu">' +
                  '<div class="account-toggle" role="button" tabindex="0" aria-expanded="false">' +
                  '<i class="fa fa-user"></i><span id="accountText">Chào ' + U.esc(user.fullName) + '</span>' +
                  '<i class="fa fa-caret-down"></i></div>' +
                  '<ul class="account-dropdown" id="accountDropdown" aria-hidden="true">' +
                  '<li><a href="account.html#/profile" class="menu-link"><i class="fa fa-user-circle"></i> Hồ sơ cá nhân</a></li>' +
                  '<li><a href="account.html#/orders" class="menu-link"><i class="fa fa-shopping-bag"></i> Đơn hàng của tôi</a></li>' +
                  '<li><a href="#" id="logoutLink" class="menu-link"><i class="fa fa-sign-out"></i> Đăng xuất</a></li>' +
                  '</ul></div>'
                : '<a href="' + CB.auth.loginUrl() + '" class="account-link"><i class="fa fa-user"></i><span>Đăng nhập / Đăng ký</span></a>';

            host.innerHTML =
                '<header class="header"><div class="container nav">' +
                '<div class="brand"><a href="index.html#/home"><img src="images/logo.svg" alt="Logo Cà Phê Đậm Đà" class="brand-logo" />' +
                '<span class="brand-name">Cà Phê Đậm Đà</span></a></div>' +
                '<form class="search-bar" role="search" id="headerSearchForm" action="index.html" method="GET">' +
                '<button class="search-btn" type="submit" aria-label="Tìm kiếm">🔍</button>' +
                '<input type="text" name="q" id="searchInput" placeholder="Tìm sản phẩm theo tên..." aria-label="Tìm kiếm" value="' + U.esc(q) + '" />' +
                '</form>' +
                '<nav class="menu" aria-label="Chính">' +
                '<div class="dropdown"><a href="index.html#/products">Sản phẩm</a><div class="dropdown-content">' + catLinks + '</div></div>' +
                '<a href="index.html#/home?to=ve-chung-toi">Giới thiệu</a>' +
                '<a href="index.html#/home?to=loi-ich">Lợi ích</a>' +
                '<a href="index.html#/home?to=lien-he">Liên hệ</a>' +
                account +
                '<a href="checkout.html#/cart" class="badge" aria-label="Giỏ hàng">Giỏ hàng<span id="cart-badge" class="badge-count">0</span></a>' +
                '</nav>' +
                '<button id="menuBtn" class="mobile-toggle" aria-expanded="false" aria-controls="mobileMenu">Menu</button>' +
                '</div></header>' +
                '<nav id="mobileMenu" hidden class="mobile-menu">' +
                '<a href="index.html#/home">Trang chủ</a><a href="index.html#/products">Tất cả sản phẩm</a>' + catLinks +
                '<a href="index.html#/home?to=ve-chung-toi">Giới thiệu</a><a href="index.html#/home?to=lien-he">Liên hệ</a>' +
                (user
                    ? '<a href="account.html#/profile">Hồ sơ cá nhân</a><a href="account.html#/orders">Đơn hàng của tôi</a><a href="checkout.html#/cart">Giỏ hàng</a><a href="#" id="logoutLinkMobile">Đăng xuất</a>'
                    : '<a href="' + CB.auth.loginUrl() + '">Đăng nhập / Đăng ký</a>') +
                '</nav>';

            ui.refreshBadge();

            // Search form handler
            var searchForm = doc.getElementById('headerSearchForm');
            if (searchForm) {
                searchForm.addEventListener('submit', function (e) {
                    e.preventDefault();
                    var searchInput = doc.getElementById('searchInput');
                    var val = searchInput ? searchInput.value.trim() : '';
                    g.location.href = 'index.html#/products' + (val ? '?q=' + encodeURIComponent(val) : '');
                });
            }

            var menuBtn = doc.getElementById('menuBtn');
            var mobileMenu = doc.getElementById('mobileMenu');
            if (menuBtn && mobileMenu) {
                menuBtn.addEventListener('click', function () {
                    var open = mobileMenu.hasAttribute('hidden');
                    if (open) mobileMenu.removeAttribute('hidden');
                    else mobileMenu.setAttribute('hidden', '');
                    menuBtn.setAttribute('aria-expanded', String(open));
                });
            }

            // Logout listeners
            ['logoutLink', 'logoutLinkMobile'].forEach(function (id) {
                var el = doc.getElementById(id);
                if (el) {
                    el.addEventListener('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        ui.logout();
                    });
                }
            });

            // Account dropdown click and keyboard toggle
            var toggle = doc.querySelector('.account-toggle');
            var dropdown = doc.getElementById('accountDropdown');
            if (toggle && dropdown) {
                var setOpen = function (open) {
                    dropdown.classList.toggle('show', open);
                    toggle.setAttribute('aria-expanded', String(open));
                    dropdown.setAttribute('aria-hidden', String(!open));
                };
                toggle.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpen(!dropdown.classList.contains('show'));
                });
                toggle.addEventListener('keydown', function (e) {
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
        },

        /* Vẽ footer dùng chung vào <footer id="lien-he"></footer> */
        mountFooter: function () {
            var host = doc.getElementById('lien-he');
            if (!host) return;
            host.className = 'footer';
            host.innerHTML =
                '<div class="container foot">' +
                '<div>' +
                '<h4>Cà Phê Đậm Đà</h4>' +
                '<p>Hạt cà phê rang xay chất lượng cao. Đồng hành cùng ly cà phê ngon mỗi ngày.</p>' +
                '</div>' +
                '<div>' +
                '<h4>Liên kết nhanh</h4>' +
                '<p>' +
                '<a href="index.html#/home" style="color:#ddd;text-decoration:none;">Trang chủ</a> · ' +
                '<a href="index.html#/products" style="color:#ddd;text-decoration:none;">Sản phẩm</a> · ' +
                '<a href="index.html#/guide" style="color:#ddd;text-decoration:none;">Hướng dẫn</a> · ' +
                '<a href="checkout.html#/cart" style="color:#ddd;text-decoration:none;">Giỏ hàng</a> · ' +
                '<a href="admin.html" style="color:#d1a06f;text-decoration:none;">Quản trị</a>' +
                '</p>' +
                '</div>' +
                '<div>' +
                '<h4>Liên hệ</h4>' +
                '<p>Hotline: 0901 234 567<br />Email: hello@caphedamda.vn<br />123 Phin Street, Quận Caffeine, TP.HCM</p>' +
                '</div>' +
                '</div>' +
                '<div class="container copyright">' +
                '© 2026 Cà Phê Đậm Đà. All rights reserved.' +
                '</div>';
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
