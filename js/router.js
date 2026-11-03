/* CoffeeBeans - Client-side Hash Router
   File: js/router.js
   Syntax: page.html#/view-name?param1=val1&param2=val2
*/
(function (g) {
    'use strict';
    var CB = (g.CB = g.CB || {});
    var doc = g.document;
    CB.views = CB.views || {};

    var currentViewName = null;
    var currentViewInstance = null;
    var defaultViewName = 'home';
    var resolveTimer = null;

    var titles = {
        home: 'Cà Phê Đậm Đà - Hạt cà phê rang xay',
        products: 'Sản phẩm - Cà Phê Đậm Đà',
        product: 'Chi tiết sản phẩm - Cà Phê Đậm Đà',
        guide: 'Hướng dẫn sử dụng - Cà Phê Đậm Đà',
        cart: 'Giỏ hàng - Cà Phê Đậm Đà',
        checkout: 'Thanh toán - Cà Phê Đậm Đà',
        confirmation: 'Xác nhận đơn hàng - Cà Phê Đậm Đà',
        auth: 'Đăng Nhập / Đăng Ký - Cà Phê Đậm Đà',
        profile: 'Thông tin cá nhân - Cà Phê Đậm Đà',
        orders: 'Lịch sử đơn hàng - Cà Phê Đậm Đà',
        login: 'Đăng nhập Quản trị - Cà Phê Đậm Đà',
        dashboard: 'Quản trị hệ thống - Cà Phê Đậm Đà'
    };

    function parseHash() {
        var raw = (g.location && g.location.hash ? g.location.hash : '').replace(/^#\/?/, '');
        var qIdx = raw.indexOf('?');
        var viewName = qIdx !== -1 ? raw.substring(0, qIdx) : raw;
        var search = qIdx !== -1 ? raw.substring(qIdx + 1) : '';
        var params = {};
        if (search) {
            try {
                new URLSearchParams(search).forEach(function (v, k) {
                    params[k] = v;
                });
            } catch (e) {}
        }
        return { viewName: viewName.trim(), params: params };
    }

    function resolve() {
        var app = doc.getElementById('app');
        if (!app) return;

        var parsed = parseHash();
        var viewName = parsed.viewName || defaultViewName;

        // If viewName is empty or redundant, map to defaultViewName
        if (!viewName || viewName === 'index' || viewName === 'index.html') {
            viewName = defaultViewName;
        }

        var view = CB.views[viewName];
        if (!view && viewName !== defaultViewName) {
            viewName = defaultViewName;
            view = CB.views[viewName];
        }

        // If view is not yet registered, retry once after scripts finish loading
        if (!view) {
            if (resolveTimer) g.clearTimeout(resolveTimer);
            resolveTimer = g.setTimeout(function () {
                var v = CB.views[viewName] || CB.views[defaultViewName];
                if (v) {
                    resolve();
                } else {
                    app.innerHTML = '<div class="container" style="padding:60px 20px;"><div class="cb-empty"><p>Không tìm thấy nội dung yêu cầu.</p><a href="index.html#/home" class="btn btn-primary">Về trang chủ</a></div></div>';
                }
            }, 60);
            return;
        }

        // Unmount previous view
        if (currentViewInstance && typeof currentViewInstance.unmount === 'function') {
            try { currentViewInstance.unmount(); } catch (e) { console.error(e); }
        }
        currentViewInstance = null;

        currentViewName = viewName;
        currentViewInstance = view;
        app.setAttribute('data-view', viewName);

        if (titles[viewName]) {
            doc.title = titles[viewName];
        }

        app.innerHTML = '';
        try {
            view.mount(app, parsed.params);
        } catch (err) {
            console.error('Error mounting view ' + viewName, err);
        }

        if (parsed.params.to) {
            var targetEl = doc.getElementById(parsed.params.to);
            if (targetEl) {
                g.setTimeout(function () {
                    targetEl.scrollIntoView({ behavior: 'smooth' });
                }, 120);
            }
        } else {
            g.scrollTo({ top: 0, behavior: 'smooth' });
        }

        if (CB.ui && typeof CB.ui.refreshBadge === 'function') CB.ui.refreshBadge();
    }

    CB.router = {
        init: function (defView) {
            if (defView) defaultViewName = defView;
            g.addEventListener('hashchange', resolve);
            resolve();
        },
        navigate: function (path, replace) {
            var target = path.startsWith('#') ? path : '#/' + path;
            if (replace) {
                var url = g.location.pathname + target;
                g.history.replaceState(null, '', url);
                resolve();
            } else {
                g.location.hash = target;
            }
        },
        current: function () {
            return currentViewName;
        },
        reload: function () {
            resolve();
        }
    };

    // Auto-init: queue to next macro-task so all following <script> tags register their views first
    if (doc) {
        var autoStart = function () {
            g.setTimeout(function () {
                var app = doc.getElementById('app');
                if (app) {
                    var def = app.getAttribute('data-default-view') || 'home';
                    CB.router.init(def);
                }

                // Global Back to Top handler
                var backBtn = doc.getElementById('backToTop');
                if (backBtn) {
                    g.addEventListener('scroll', function () {
                        if (g.pageYOffset > 300) backBtn.classList.add('show');
                        else backBtn.classList.remove('show');
                    });
                    backBtn.addEventListener('click', function () {
                        g.scrollTo({ top: 0, behavior: 'smooth' });
                    });
                }
            }, 0);
        };

        if (doc.readyState === 'loading') {
            doc.addEventListener('DOMContentLoaded', autoStart);
        } else {
            autoStart();
        }
    }
})(typeof window !== 'undefined' ? window : globalThis);
