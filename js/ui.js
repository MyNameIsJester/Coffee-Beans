/* CoffeeBeans - Thành phần giao diện dùng chung: header, thông báo, phân trang. */
(function (g) {
    'use strict';
    var CB = (g.CB = g.CB || {});
    var U = CB.util;
    var doc = g.document;

    var ui = {
        param: function (name) {
            try {
                return new URLSearchParams(g.location.search).get(name);
            } catch (e) {
                return null;
            }
        },

        /* Thông báo nổi nhỏ. type: 'success' | 'error' | 'info' */
        toast: function (message, type) {
            if (!doc) return;
            var el = doc.createElement('div');
            el.className = 'cb-toast cb-toast-' + (type || 'success');
            el.setAttribute('role', 'status');
            el.textContent = message;
            doc.body.appendChild(el);
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
            wrap.className = 'cb-pagination';
            function btn(label, page, opts) {
                var b = doc.createElement('button');
                b.type = 'button';
                b.textContent = label;
                b.className = 'cb-page-btn' + (opts && opts.active ? ' active' : '');
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
            var cls = { 'Mới đặt': 'new', 'Đã xử lý': 'processed', 'Đã giao': 'delivered', 'Hủy': 'canceled' }[status] || 'new';
            return '<span class="cb-status cb-status-' + cls + '">' + U.esc(status) + '</span>';
        },

        logout: function () {
            CB.auth.logout();
            g.location.href = 'index.html';
        },

        refreshBadge: function () {
            var b = doc.getElementById('cart-badge');
            if (!b) return;
            var n = CB.cart.count();
            b.textContent = n;
            b.style.display = n > 0 ? 'flex' : 'none';
        },

        /* Vẽ header dùng chung vào <div id="siteHeader"></div>. */
        mountHeader: function () {
            var host = doc.getElementById('siteHeader');
            if (!host) return;
            var user = CB.auth.current();
            var onIndex = /(^|\/)(index\.html)?$/.test(g.location.pathname);
            var home = function (hash) {
                return onIndex ? hash : 'index.html' + hash;
            };
            var cats = CB.catalog.categories();
            var catLinks = cats
                .map(function (c) {
                    return '<a href="products.html?cat=' + encodeURIComponent(c.slug) + '">' + U.esc(c.name) + '</a>';
                })
                .join('');
            var q = ui.param('q') || '';

            var account = user
                ? '<div class="account-menu" id="accountMenu">' +
                  '<div class="account-toggle" role="button" tabindex="0" aria-expanded="false">' +
                  '<i class="fa fa-user"></i><span id="accountText">Chào ' + U.esc(user.fullName) + '</span>' +
                  '<i class="fa fa-caret-down"></i></div>' +
                  '<ul class="account-dropdown" id="accountDropdown" aria-hidden="true">' +
                  '<li><a href="profile.html" class="menu-link"><i class="fa fa-user-circle"></i> Hồ sơ cá nhân</a></li>' +
                  '<li><a href="order-history.html" class="menu-link"><i class="fa fa-shopping-bag"></i> Đơn hàng của tôi</a></li>' +
                  '<li><a href="#" id="logoutLink" class="menu-link"><i class="fa fa-sign-out"></i> Đăng xuất</a></li>' +
                  '</ul></div>'
                : '<a href="' + CB.auth.loginUrl() + '" class="account-link"><i class="fa fa-user"></i><span>Đăng nhập / Đăng ký</span></a>';

            host.innerHTML =
                '<header class="header"><div class="container nav">' +
                '<div class="brand"><a href="index.html"><img src="images/logo.svg" alt="Logo Cà Phê Đậm Đà" class="brand-logo" />' +
                '<span class="brand-name">Cà Phê Đậm Đà</span></a></div>' +
                '<form class="search-bar" role="search" action="products.html" method="GET">' +
                '<button class="search-btn" type="submit" aria-label="Tìm kiếm">🔍</button>' +
                '<input type="text" name="q" id="searchInput" placeholder="Tìm sản phẩm theo tên..." aria-label="Tìm kiếm" value="' + U.esc(q) + '" />' +
                '</form>' +
                '<nav class="menu" aria-label="Chính">' +
                '<div class="dropdown"><a href="products.html">Sản phẩm</a><div class="dropdown-content">' + catLinks + '</div></div>' +
                '<a href="' + home('#ve-chung-toi') + '">Giới thiệu</a>' +
                '<a href="' + home('#loi-ich') + '">Lợi ích</a>' +
                '<a href="' + home('#lien-he') + '">Liên hệ</a>' +
                account +
                '<a href="cart.html" class="badge" aria-label="Giỏ hàng">Giỏ hàng<span id="cart-badge" class="badge-count">0</span></a>' +
                '</nav>' +
                '<button id="menuBtn" class="mobile-toggle" aria-expanded="false" aria-controls="mobileMenu">Menu</button>' +
                '</div></header>' +
                '<nav id="mobileMenu" hidden class="mobile-menu">' +
                '<a href="index.html">Trang chủ</a><a href="products.html">Tất cả sản phẩm</a>' + catLinks +
                '<a href="' + home('#ve-chung-toi') + '">Giới thiệu</a><a href="' + home('#lien-he') + '">Liên hệ</a>' +
                (user
                    ? '<a href="profile.html">Hồ sơ cá nhân</a><a href="order-history.html">Đơn hàng của tôi</a><a href="cart.html">Giỏ hàng</a><a href="#" id="logoutLinkMobile">Đăng xuất</a>'
                    : '<a href="' + CB.auth.loginUrl() + '">Đăng nhập / Đăng ký</a>') +
                '</nav>';

            ui.refreshBadge();

            var menuBtn = doc.getElementById('menuBtn');
            var mobileMenu = doc.getElementById('mobileMenu');
            menuBtn.addEventListener('click', function () {
                var open = mobileMenu.hasAttribute('hidden');
                if (open) mobileMenu.removeAttribute('hidden');
                else mobileMenu.setAttribute('hidden', '');
                menuBtn.setAttribute('aria-expanded', String(open));
            });

            ['logoutLink', 'logoutLinkMobile'].forEach(function (id) {
                var el = doc.getElementById(id);
                if (el)
                    el.addEventListener('click', function (e) {
                        e.preventDefault();
                        ui.logout();
                    });
            });

            var toggle = doc.querySelector('.account-toggle');
            var dropdown = doc.getElementById('accountDropdown');
            if (toggle && dropdown) {
                var setOpen = function (open) {
                    dropdown.classList.toggle('show', open);
                    toggle.setAttribute('aria-expanded', String(open));
                    dropdown.setAttribute('aria-hidden', String(!open));
                };
                toggle.addEventListener('click', function () {
                    setOpen(!dropdown.classList.contains('show'));
                });
                toggle.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setOpen(!dropdown.classList.contains('show'));
                    }
                });
                doc.addEventListener('click', function (e) {
                    if (!e.target.closest('.account-menu')) setOpen(false);
                });
            }
        }
    };

    CB.ui = ui;
    if (doc) {
        if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', ui.mountHeader);
        else ui.mountHeader();
    }
})(typeof window !== 'undefined' ? window : globalThis);
