/* CoffeeBeans - View: Home (Trang chủ)
   File: js/page-index.js
   Khôi phục 100% giao diện, cấu trúc và nội dung gốc của đồ án Cà Phê Đậm Đà
*/
(function (g) {
    'use strict';
    var CB = (g.CB = g.CB || {});
    var U = CB.util;
    CB.views = CB.views || {};

    var sliderTimer = null;
    var keydownHandler = null;
    var observer = null;

    CB.views.home = {
        mount: function (root, params) {
            root.innerHTML =
                '<!-- Hero -->' +
                '<div class="container" style="padding-top: 20px">' +
                '  <section class="hero">' +
                '    <div class="hero-media">' +
                '      <div class="hero-slider">' +
                '        <div class="hero-slide"></div>' +
                '        <div class="hero-slide"></div>' +
                '        <div class="hero-slide"></div>' +
                '        <div class="hero-slide"></div>' +
                '        <div class="hero-slide"></div>' +
                '      </div>' +
                '      <div class="hero-indicators">' +
                '        <span class="hero-dot active" data-index="0"></span>' +
                '        <span class="hero-dot" data-index="1"></span>' +
                '        <span class="hero-dot" data-index="2"></span>' +
                '        <span class="hero-dot" data-index="3"></span>' +
                '        <span class="hero-dot" data-index="4"></span>' +
                '      </div>' +
                '    </div>' +
                '    <div class="hero-overlay"></div>' +
                '    <div class="hero-inner">' +
                '      <div>' +
                '        <h1 class="hero-title">Cà Phê Đậm Đà</h1>' +
                '        <p class="hero-sub">Hương vị đặc trưng từ những hạt cà phê thượng hạng</p>' +
                '        <a href="index.html#/products" class="btn">Khám phá sản phẩm</a>' +
                '      </div>' +
                '    </div>' +
                '  </section>' +
                '</div>' +

                '<!-- Categories -->' +
                '<section id="san-pham" class="fade-in">' +
                '  <div class="container">' +
                '    <h2 class="section-title">Danh mục sản phẩm</h2>' +
                '    <p class="section-sub">Chọn loại hạt phù hợp khẩu vị của bạn</p>' +
                '    <div class="grid grid-3" id="featuredGrid"></div>' +
                '  </div>' +
                '</section>' +

                '<!-- About -->' +
                '<section id="ve-chung-toi" class="fade-in">' +
                '  <div class="container about">' +
                '    <img src="images/dark-roast.jpg" alt="Rang xay thủ công" class="fade-in-left" />' +
                '    <div class="fade-in-right">' +
                '      <h2 class="section-title">Nguồn gốc rõ ràng – Rang xay thủ công</h2>' +
                '      <p class="section-sub">Chúng tôi chọn lọc hạt từ nông trại cao nguyên, rang mẻ nhỏ để giữ trọn hương vị.</p>' +
                '      <ul class="list">' +
                '        <li class="fade-in stagger-1">' +
                '          <span class="chip">100% nguyên chất</span>' +
                '          <span>Không hương liệu, không phụ gia.</span>' +
                '        </li>' +
                '        <li class="fade-in stagger-2">' +
                '          <span class="chip">Rang mới mỗi tuần</span>' +
                '          <span>Đảm bảo độ tươi – thơm hơn khi pha.</span>' +
                '        </li>' +
                '        <li class="fade-in stagger-3">' +
                '          <span class="chip">Tư vấn hương vị</span>' +
                '          <span>Chọn loại hạt phù hợp cách pha của bạn.</span>' +
                '        </li>' +
                '      </ul>' +
                '    </div>' +
                '  </div>' +
                '</section>' +

                '<!-- Benefits -->' +
                '<section id="loi-ich" class="fade-in">' +
                '  <div class="container">' +
                '    <h2 class="section-title">Vì sao chọn Cà Phê Đậm Đà?</h2>' +
                '    <p class="section-sub">Chất lượng tốt, dịch vụ tận tâm, giá luôn hợp lý</p>' +
                '    <div class="grid grid-3">' +
                '      <div class="quote fade-in-scale stagger-1">' +
                '        <strong>Giao nhanh</strong><br />Giao trong 24-48h tại nội thành.' +
                '      </div>' +
                '      <div class="quote fade-in-scale stagger-2">' +
                '        <strong>Đổi trả 7 ngày</strong><br />Không hài lòng, hoàn tiền ngay.' +
                '      </div>' +
                '      <div class="quote fade-in-scale stagger-3">' +
                '        <strong>Ưu đãi thành viên</strong><br />Tích điểm, giảm đến 15%.' +
                '      </div>' +
                '    </div>' +
                '  </div>' +
                '</section>';

            // 1. Featured Products Grid (Exact logic from original page-index.js)
            var grid = root.querySelector('#featuredGrid');

            function card(cat, v, idx) {
                var detail = 'index.html#/product?id=' + encodeURIComponent(v.id);
                var canBuy = v.price !== null && v.available > 0;
                return '<article class="card">' +
                    '<a href="index.html#/products?cat=' + encodeURIComponent(cat.slug) + '" aria-label="Xem tất cả ' + U.esc(cat.name) + '">' +
                    '  <img src="' + U.esc(v.image) + '" alt="Hạt ' + U.esc(cat.name) + '" />' +
                    '</a>' +
                    '<div class="card-body">' +
                    '  <span class="chip">' + U.esc(cat.name) + '</span>' +
                    '  <div class="spacer"></div>' +
                    '  <div class="prod">' +
                    '    <img src="' + U.esc(v.image) + '" alt="' + U.esc(v.name) + '" />' +
                    '    <div>' +
                    '      <h4><a href="' + detail + '" style="text-decoration:none;color:inherit;">' + U.esc(v.name) + '</a></h4>' +
                    '      <div><span class="price">' + (v.price === null ? '—' : U.fmtVND(v.price)) + '</span></div>' +
                    '    </div>' +
                    '  </div>' +
                    '  <div class="button-group">' +
                    '    <button class="add" data-id="' + U.esc(v.id) + '"' + (canBuy ? '' : ' disabled') + '>' + (canBuy ? 'Thêm' : 'Hết hàng') + '</button>' +
                    '  </div>' +
                    '</div></article>';
            }

            function render() {
                if (!grid || !CB.catalog) return;
                var all = CB.catalog.search({});
                var html = CB.catalog.categories().map(function (cat, i) {
                    var first = all.filter(function (v) { return v.categoryId === cat.id; })[0];
                    return first ? card(cat, first, i) : '';
                }).join('');
                grid.innerHTML = html || '<div class="cb-empty">Chưa có sản phẩm nào.</div>';
            }

            if (grid) {
                grid.addEventListener('click', function (e) {
                    var btn = e.target.closest('button.add');
                    if (!btn || btn.disabled) return;
                    var r = CB.cart.add(btn.getAttribute('data-id'), 1);
                    if (r.ok) {
                        CB.ui.toast('Đã thêm vào giỏ hàng.');
                        CB.ui.refreshBadge();
                        render();
                    } else if (r.code === 'LOGIN_REQUIRED') {
                        g.location.href = CB.auth.loginUrl();
                    } else {
                        CB.ui.toast(r.error, 'error');
                    }
                });
                render();
            }

            // 2. Hero Slider (Exact logic from original index.html)
            var currentSlide = 0;
            var slides = root.querySelectorAll('.hero-slide');
            var dots = root.querySelectorAll('.hero-dot');
            var slider = root.querySelector('.hero-slider');
            var heroMedia = root.querySelector('.hero-media');
            var totalSlides = slides.length || 5;

            function updateSlider() {
                if (!slider) return;
                slider.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
                dots.forEach(function (dot, i) {
                    dot.classList.toggle('active', i === currentSlide);
                });
            }

            function nextSlide() {
                currentSlide = (currentSlide + 1) % totalSlides;
                updateSlider();
            }

            function prevSlide() {
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
                updateSlider();
            }

            sliderTimer = g.setInterval(nextSlide, 4000);

            if (heroMedia) {
                heroMedia.addEventListener('mouseenter', function () {
                    if (sliderTimer) g.clearInterval(sliderTimer);
                });
                heroMedia.addEventListener('mouseleave', function () {
                    if (sliderTimer) g.clearInterval(sliderTimer);
                    sliderTimer = g.setInterval(nextSlide, 4000);
                });

                // Touch/swipe support
                var touchStartX = 0;
                var touchEndX = 0;
                heroMedia.addEventListener('touchstart', function (e) {
                    if (e.changedTouches && e.changedTouches[0]) {
                        touchStartX = e.changedTouches[0].screenX;
                    }
                }, { passive: true });

                heroMedia.addEventListener('touchend', function (e) {
                    if (e.changedTouches && e.changedTouches[0]) {
                        touchEndX = e.changedTouches[0].screenX;
                        var diff = touchStartX - touchEndX;
                        if (Math.abs(diff) > 50) {
                            if (diff > 0) nextSlide();
                            else prevSlide();
                        }
                    }
                }, { passive: true });
            }

            dots.forEach(function (dot, i) {
                dot.addEventListener('click', function () {
                    currentSlide = i;
                    updateSlider();
                });
            });

            // Keyboard navigation (disabled when user is typing in inputs)
            keydownHandler = function (e) {
                if (g.document.activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].indexOf(g.document.activeElement.tagName) !== -1) return;
                if (e.key === 'ArrowLeft') prevSlide();
                else if (e.key === 'ArrowRight') nextSlide();
            };
            g.document.addEventListener('keydown', keydownHandler);

            // 3. Scroll-triggered animations (IntersectionObserver)
            var animatedElements = root.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-scale');
            if ('IntersectionObserver' in g) {
                observer = new g.IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                        }
                    });
                }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

                animatedElements.forEach(function (el) {
                    observer.observe(el);
                });
            } else {
                animatedElements.forEach(function (el) {
                    el.classList.add('visible');
                });
            }
        },

        unmount: function () {
            if (sliderTimer) {
                g.clearInterval(sliderTimer);
                sliderTimer = null;
            }
            if (keydownHandler) {
                g.document.removeEventListener('keydown', keydownHandler);
                keydownHandler = null;
            }
            if (observer) {
                observer.disconnect();
                observer = null;
            }
        }
    };
})(typeof window !== 'undefined' ? window : globalThis);
