/* CoffeeBeans - View: Guide / Documentation (Hướng dẫn sử dụng)
   File: js/page-guide.js
*/
(function (g) {
    'use strict';
    var CB = (g.CB = g.CB || {});
    CB.views = CB.views || {};

    CB.views.guide = {
        mount: function (root, params) {
            root.innerHTML =
                '<div class="container" style="padding:40px 20px;max-width:900px;">' +
                '  <div style="background:#fff;padding:36px;border-radius:12px;box-shadow:var(--shadow);">' +
                '    <h1 style="font-size:28px;color:var(--coffee-900);margin-bottom:16px;font-family:\'Playfair Display\', serif;">Hướng Dẫn Sử Dụng & Tài Liệu Đồ Án</h1>' +
                '    <p style="color:#666;margin-bottom:28px;line-height:1.7;">Hệ thống website thương mại điện tử thuần Vanilla HTML/CSS/JavaScript lưu trữ dữ liệu tại trình duyệt (localStorage). Dưới đây là thông tin hướng dẫn và tài khoản thử nghiệm.</p>' +

                '    <h3 style="font-size:20px;color:var(--coffee);margin-bottom:12px;border-bottom:2px solid var(--cream);padding-bottom:8px;">1. Tài khoản thử nghiệm</h3>' +
                '    <table style="width:100%;border-collapse:collapse;margin-bottom:28px;font-size:14px;">' +
                '      <thead><tr style="background:#f8f9fa;text-align:left;"><th style="padding:10px;border:1px solid #ddd;">Phân hệ</th><th style="padding:10px;border:1px solid #ddd;">Tên đăng nhập</th><th style="padding:10px;border:1px solid #ddd;">Mật khẩu</th><th style="padding:10px;border:1px solid #ddd;">Ghi chú</th></tr></thead>' +
                '      <tbody>' +
                '        <tr><td style="padding:10px;border:1px solid #ddd;"><strong>Khách hàng 1</strong></td><td style="padding:10px;border:1px solid #ddd;"><code>guest1</code></td><td style="padding:10px;border:1px solid #ddd;"><code>guest1123</code></td><td style="padding:10px;border:1px solid #ddd;">Có sẵn đơn hàng mẫu</td></tr>' +
                '        <tr><td style="padding:10px;border:1px solid #ddd;"><strong>Khách hàng 2</strong></td><td style="padding:10px;border:1px solid #ddd;"><code>guest2</code></td><td style="padding:10px;border:1px solid #ddd;"><code>guest2123</code></td><td style="padding:10px;border:1px solid #ddd;">Tài khoản khách thường</td></tr>' +
                '        <tr><td style="padding:10px;border:1px solid #ddd;"><strong>Quản trị viên</strong></td><td style="padding:10px;border:1px solid #ddd;"><code>admin</code></td><td style="padding:10px;border:1px solid #ddd;"><code>admin123</code></td><td style="padding:10px;border:1px solid #ddd;">Toàn quyền hệ thống</td></tr>' +
                '      </tbody>' +
                '    </table>' +

                '    <h3 style="font-size:20px;color:var(--coffee);margin-bottom:12px;border-bottom:2px solid var(--cream);padding-bottom:8px;">2. Các luồng trải nghiệm chính</h3>' +
                '    <ul style="padding-left:20px;line-height:1.8;color:#444;margin-bottom:28px;">' +
                '      <li><strong>Luồng Mua Hàng:</strong> Trang chủ → Danh sách sản phẩm (tìm kiếm / lọc theo giá / sắp xếp) → Chi tiết sản phẩm → Thêm vào giỏ → Đăng nhập nếu chưa đăng nhập → Thanh toán (nhập địa chỉ, chọn phương thức) → Xác nhận đơn.</li>' +
                '      <li><strong>Luồng Khách Hàng:</strong> Đăng ký tài khoản mới hoặc đăng nhập → Quản lý thông tin hồ sơ và địa chỉ mặc định → Xem danh sách lịch sử đơn hàng và trạng thái đơn.</li>' +
                '      <li><strong>Luồng Quản Trị (Admin):</strong> Đăng nhập quản trị tại <code>admin.html</code> → Dashboard xem thống kê doanh thu, đơn hàng, khách hàng → Quản lý danh mục & sản phẩm → Nhập hàng thêm tồn kho → Đổi trạng thái đơn hàng thành "Đã giao" (hệ thống tự động trừ tồn kho xuất).</li>' +
                '    </ul>' +

                '    <h3 style="font-size:20px;color:var(--coffee);margin-bottom:12px;border-bottom:2px solid var(--cream);padding-bottom:8px;">3. Phím tắt</h3>' +
                '    <ul style="padding-left:20px;line-height:1.8;color:#444;">' +
                '      <li><code>← Phím Mũi Tên Trái / Phải →</code>: Chuyển slide banner trên trang chủ (khi không gõ trong ô nhập).</li>' +
                '      <li><code>Phím Escape</code>: Đóng nhanh các cửa sổ Modal thông báo hoặc hộp thoại.</li>' +
                '    </ul>' +
                '  </div>' +
                '</div>';
        },
        unmount: function () {}
    };
})(typeof window !== 'undefined' ? window : globalThis);
