> **⚠️ TÀI LIỆU CŨ, KHÔNG CÒN ĐÚNG.** Tệp này được viết khi website còn là giao diện tĩnh, nhiều mô tả như "dữ liệu không lưu", "nút không hoạt động", "chưa có backend/dữ liệu giả" nay đã lạc hậu: dữ liệu hiện được lưu bằng localStorage và các chức năng khách hàng/admin đã hoạt động. Xem `README.md` và `HUONG_DAN_SU_DUNG.md` ở thư mục gốc. Giữ lại chỉ để tham khảo lịch sử.

🚀 QUICK START GUIDE - CÀ PHÊ ĐẬM ĐÀ ADMIN SYSTEM
═══════════════════════════════════════════════════════════════════════════════

👋 CHÀO MỪNG!

Bạn vừa hoàn thành một hệ thống quản trị đầy đủ cho web bán cà phê.
Dưới đây là hướng dẫn bắt đầu nhanh chỉ với 3 bước!

═══════════════════════════════════════════════════════════════════════════════

📋 STEP 1: MỞ TRANG CHỦ
─────────────────────────────────────────────────────────────────────────

1. Mở file: portal.html
   - Cách 1: Double-click file portal.html
   - Cách 2: Right-click → Open with → Browser
   - Cách 3: Kéo vào browser

2. Bạn sẽ thấy trang chủ với 2 lựa chọn:
   ┌─────────────────┬─────────────────┐
   │  👥 Khách hàng  │ ⚙️ Quản trị viên │
   └─────────────────┴─────────────────┘

═══════════════════════════════════════════════════════════════════════════════

🔐 STEP 2: VÀO TRANG QUẢN TRỊ
─────────────────────────────────────────────────────────────────────────

1. Trên trang portal.html, click nút "Vào trang quản trị →"

2. Bạn sẽ được đưa đến trang ĐĂNG NHẬP

3. Nhập thông tin demo:
   ┌──────────────────────────────────┐
   │ Tên đăng nhập: admin             │
   │ Mật khẩu: admin123               │
   └──────────────────────────────────┘

4. Click "Đăng nhập"

5. 🎉 Bạn đã vào DASHBOARD ADMIN!

═══════════════════════════════════════════════════════════════════════════════

⚙️ STEP 3: KHÁM PHÁ 8 CHỨC NĂNG
──────────────────────────────────────────────────────────────────────────

Ở sidebar bên trái, bạn sẽ thấy 8 nút:

1️⃣ 📊 TỔNG QUAN
   └─ Xem thống kê, dashboard overview
   └─ Hiện tại đang ở đây khi vừa login

2️⃣ 👥 QUẢN LÝ NGƯỜI DÙNG
   └─ Xem danh sách khách hàng
   └─ Reset mật khẩu
   └─ Khóa/Mở khóa tài khoản

3️⃣ 📂 LOẠI SẢN PHẨM
   └─ Thêm loại mới (Arabica, Robusta, v.v.)
   └─ Sửa, xóa loại

4️⃣ ☕ SẢN PHẨM
   └─ Thêm sản phẩm mới
   └─ Sửa thông tin sản phẩm
   └─ Xóa sản phẩm

5️⃣ 📥 NHẬP HÀNG
   └─ Tạo phiếu nhập hàng
   └─ Quản lý số lượng nhập
   └─ Hoàn thành phiếu

6️⃣ 💰 GIÁ BÁN
   └─ Đặt tỉ lệ lợi nhuận
   └─ Tra cứu giá sản phẩm
   └─ Tính giá bán tự động

7️⃣ 📦 ĐƠN HÀNG
   └─ Xem danh sách đơn hàng
   └─ Cập nhật trạng thái
   └─ Tìm kiếm & lọc đơn

8️⃣ 📈 TỒN KHO
   └─ Tra cứu số lượng tồn
   └─ Cảnh báo sắp hết hàng
   └─ Xem thống kê nhập/xuất

═══════════════════════════════════════════════════════════════════════════════

🎮 THỬ NGHIỆM TÍNH NĂNG
─────────────────────────────────────────────────────────────────────────

Ví dụ: Quản lý sản phẩm

1. Click nút "☕ SẢN PHẨM" ở sidebar
2. Bạn sẽ thấy danh sách các sản phẩm hiện có
3. Click "+ Thêm sản phẩm" để mở modal form
4. Điền thông tin:
   ├─ Mã sản phẩm: CF001
   ├─ Tên sản phẩm: Cà phê Arabica
   ├─ Loại: Arabica
   ├─ Mô tả: ...
   └─ Upload hình
5. Click "Lưu"
6. Modal sẽ đóng
7. (Ghi chú: Dữ liệu không lưu vì chỉ là prototype)

Các nút trong bảng:
├─ 👁 = Xem chi tiết
├─ ✏️  = Sửa thông tin
└─ 🗑️  = Xóa/Ẩn

═══════════════════════════════════════════════════════════════════════════════

🎨 GIAO DIỆN
────────────────────────────────────────────────────────────────────────────

Header (Trên cùng):
├─ Logo & Tên hệ thống
├─ Tên user hiện tại
└─ Nút Đăng xuất

Sidebar (Bên trái):
├─ 8 menu chính
├─ Highlight button đang dùng
└─ Click để chuyển section

Main Content (Giữa):
├─ Tiêu đề section
├─ Action buttons
├─ Stats cards hoặc Tables
├─ Search/Filter inputs
└─ Modal forms

═══════════════════════════════════════════════════════════════════════════════

🎯 CÁC THAO TÁC CHÍNH
────────────────────────────────────────────────────────────────────────────

NAVIGATION:
├─ Click button ở sidebar → Chuyển section
├─ Active button = Section đang xem
└─ Title thay đổi theo section

MODALS (Pop-up forms):
├─ Click button → Modal mở
├─ Điền form
├─ Click "Lưu" → Gửi (demo)
├─ Click "Hủy" → Đóng
└─ Click ❌ hoặc ngoài modal → Đóng

TABLES:
├─ Hiển thị danh sách
├─ Các nút thao tác ở cột cuối
├─ Search box ở trên bảng
└─ Hover row → Highlight

BADGES:
├─ 🟢 Xanh = Hoạt động/Active
├─ 🔴 Đỏ = Không hoạt động/Inactive
└─ 🟠 Cam = Chờ xử lý/Pending

═══════════════════════════════════════════════════════════════════════════════

⚠️ LƯU Ý QUAN TRỌNG
────────────────────────────────────────────────────────────────────────────

❌ CÁI NÀY KHÔNG HOẠT ĐỘNG (chỉ là demo):
├─ Form submit không lưu dữ liệu
├─ Search/Filter không có kết quả thực
├─ Không thể upload ảnh
├─ Dữ liệu sẽ mất khi refresh
└─ Demo data là sample không thực

✅ CÁI NÀY HOẠT ĐỘNG:
├─ Navigation giữa các sections
├─ Mở/Đóng modals
├─ UI interactions (hover, click)
├─ Responsive design
└─ Login/Logout

💡 Lý do: Đây là PROTOTYPE (giao diện thử nghiệm)
   Để có chức năng thực, cần:
   ├─ Backend API
   ├─ Database
   ├─ Server-side processing
   └─ Deployment

═══════════════════════════════════════════════════════════════════════════════

🔑 CÁC PHÍM TẮT
────────────────────────────────────────────────────────────────────────────

Browser:
├─ F5 = Refresh trang
├─ Ctrl+Shift+I = Dev Tools
├─ Ctrl+K = Search
└─ Alt+←  = Quay lại

Admin:
├─ Click menu = Chuyển section
├─ Click + = Thêm mới
├─ Click ✏️  = Sửa
├─ Click 🗑️  = Xóa
└─ Click Đăng xuất = Logout

═══════════════════════════════════════════════════════════════════════════════

🌈 RESPONSIVE DESIGN
────────────────────────────────────────────────────────────────────────────

Thử mở trên các kích cỡ khác nhau:

💻 DESKTOP (Full size):
   ├─ Sidebar bên trái
   ├─ Content bên phải
   ├─ 4 stats cards
   ├─ Bảng đầy đủ
   └─ Tối ưu

📱 TABLET (iPad):
   ├─ Sidebar hẹp
   ├─ 2 stats cards
   ├─ Bảng thu nhỏ
   └─ Vẫn tốt

📱 MOBILE (Phone):
   ├─ Sidebar ngang
   ├─ 1 stats card
   ├─ Bảng scroll
   └─ Đầy đủ chức năng

═══════════════════════════════════════════════════════════════════════════════

🐛 TROUBLESHOOTING
────────────────────────────────────────────────────────────────────────────

❓ "Không thể đăng nhập"
   → Kiểm tra: admin / admin123
   → Phải đúng hoa/thường

❓ "Không thấy gì sau đăng nhập"
   → Refresh page (F5)
   → Mở developer console (F12)
   → Xem lỗi

❓ "Form không submit"
   → Đúng, đây là prototype!
   → Giao diện chỉ để demo

❓ "Dữ liệu không lưu"
   → Chuẩn, prototype không có backend
   → Dữ liệu reset khi refresh

❓ "Layout lỗi trên mobile"
   → Thử F12 → Toggle device toolbar
   → Nếu vẫn lỗi → Check CSS

═══════════════════════════════════════════════════════════════════════════════

📚 TÌM HIỂU THÊM
────────────────────────────────────────────────────────────────────────────

Các file hữu ích:

1. ADMIN_README.md
   └─ Hướng dẫn chi tiết từng chức năng

2. IMPLEMENTATION_SUMMARY.md
   └─ Tóm tắt toàn bộ hệ thống

3. admin-login.html
   └─ Mã nguồn trang đăng nhập

4. admin-dashboard.html
   └─ Mã nguồn dashboard chính
   └─ HTML + CSS + JavaScript

5. styles/admin-dashboard.css
   └─ Stylesheet chính

═══════════════════════════════════════════════════════════════════════════════

🚀 BƯỚC TIẾP THEO
────────────────────────────────────────────────────────────────────────────

Sau khi test prototype:

1. ✅ Lấy feedback từ stakeholders
   └─ Có thích giao diện?
   └─ Có thiếu chức năng?
   └─ Cần thay đổi gì?

2. ✅ Phát triển backend
   └─ Chọn framework (Node, PHP, Java)
   └─ Tạo database
   └─ Viết API

3. ✅ Connect frontend to API
   └─ Thay thế demo data
   └─ Integrate APIs
   └─ Test integration

4. ✅ Deploy to production
   └─ Hosting
   └─ Domain
   └─ SSL

═══════════════════════════════════════════════════════════════════════════════

✨ VẬY LÀ XONG!
────────────────────────────────────────────────────────────────────────────

Bạn đã có một prototype hoàn chỉnh cho:

✅ Admin system hoàn toàn riêng biệt
✅ 8 modules quản trị đầy đủ
✅ Giao diện đẹp, chuyên nghiệp
✅ Responsive trên mọi thiết bị
✅ Sẵn sàng để present

🎉 Chúc mừng! Bạn đã hoàn thành bước 1!

═══════════════════════════════════════════════════════════════════════════════

📞 CÓ THẮC MẮC?
────────────────────────────────────────────────────────────────────────────

Hãy kiểm tra:
├─ ADMIN_README.md (Chi tiết từng chức năng)
├─ IMPLEMENTATION_SUMMARY.md (Tổng quan hệ thống)
└─ Code comments (Trong HTML files)

Hoặc xem trực tiếp:
├─ admin-login.html
├─ admin-dashboard.html
└─ styles/admin-dashboard.css

═══════════════════════════════════════════════════════════════════════════════

Happy coding! ☕🚀

═══════════════════════════════════════════════════════════════════════════════
