> **⚠️ TÀI LIỆU CŨ, KHÔNG CÒN ĐÚNG.** Tệp này được viết khi website còn là giao diện tĩnh, nhiều mô tả như "dữ liệu không lưu", "nút không hoạt động", "chưa có backend/dữ liệu giả" nay đã lạc hậu: dữ liệu hiện được lưu bằng localStorage và các chức năng khách hàng/admin đã hoạt động. Xem `README.md` và `HUONG_DAN_SU_DUNG.md` ở thư mục gốc. Giữ lại chỉ để tham khảo lịch sử.

📋 HƯỚNG DẪN SỬ DỤNG HỆ THỐNG ADMIN - CÀ PHÊ ĐẬM ĐÀ

═══════════════════════════════════════════════════════════════════════

🚀 BẮT ĐẦU NHANH

1. Mở file: admin-login.html
2. Đăng nhập với thông tin demo:
   - Tên đăng nhập: admin
   - Mật khẩu: admin123

═══════════════════════════════════════════════════════════════════════

📁 CẤU TRÚC CÁC FILE

admin-login.html
└─ Trang đăng nhập riêng biệt cho Admin
   - Form đăng nhập
   - Demo account: admin / admin123
   - Giao diện đẹp với gradient cà phê
   - Lưu trạng thái login vào localStorage

admin-dashboard.html
└─ Dashboard chính của Admin
   - 8 section chức năng khác nhau
   - Sidebar navigation
   - Modal dialogs
   - Đầy đủ các thao tác
   
Chức năng chính:
├─ 📊 Tổng quan - Dashboard overview với các thống kê
├─ 👥 Quản lý người dùng - Danh sách khách hàng, reset mật khẩu, khóa/mở khóa
├─ 📂 Loại sản phẩm - Thêm, sửa, xóa loại sản phẩm
├─ ☕ Sản phẩm - Quản lý toàn bộ sản phẩm
├─ 📥 Nhập hàng - Quản lý phiếu nhập hàng
├─ 💰 Giá bán - Quản lý tỉ lệ lợi nhuận và giá bán
├─ 📦 Đơn hàng - Quản lý và cập nhật trạng thái đơn
└─ 📈 Tồn kho - Tra cứu và cảnh báo tồn kho

═══════════════════════════════════════════════════════════════════════

🎨 THIẾT KẾ

✨ Màu sắc chủ đề:
   - Chính: #D2691E (Chocolate/Cà phê) 
   - Phụ: #8B4513 (Saddle Brown)
   - Nền: #F8F7F4 (Cream nhẹ)
   - Text chính: #333333
   - Text phụ: #666666

✨ Thành phần UI:
   - Header: Logo + User info + Logout button
   - Sidebar: Navigation menu với 8 chức năng
   - Main content: Dynamic sections
   - Modal dialogs: Để thêm/sửa dữ liệu
   - Tables: Hiển thị danh sách
   - Stats cards: Thống kê nhanh

═══════════════════════════════════════════════════════════════════════

💡 CHỨC NĂNG CHI TIẾT

1️⃣ TỔNG QUAN (Dashboard)
   - 4 Stat cards hiển thị:
     • Tổng khách hàng
     • Tổng sản phẩm
     • Đơn hàng tháng này
     • Doanh thu tháng
   - Bảng đơn hàng gần đây
   - Trạng thái tức thời

2️⃣ QUẢN LÝ NGƯỜI DÙNG
   - Danh sách khách hàng
   - Xem thông tin: Tên, Email, SĐT
   - 3 thao tác:
     • 👁 Xem chi tiết
     • 🔄 Reset mật khẩu
     • 🔒 Khóa/🔓 Mở khóa tài khoản

3️⃣ QUẢN LÝ LOẠI SẢN PHẨM
   - Thêm loại mới
   - Sửa thông tin loại
   - Xóa/Ẩn loại
   - Hiển thị số sản phẩm trong loại

4️⃣ QUẢN LÝ SẢN PHẨM
   - Thêm: Mã, tên, loại, hình, mô tả
   - Sửa: Điền sẵn thông tin cũ
   - Xóa/Ẩn
   - Hiển thị: Giá vốn, giá bán, tồn kho

5️⃣ QUẢN LÝ NHẬP HÀNG
   - Danh sách phiếu nhập
   - Thêm phiếu: Ngày, sản phẩm, SL, giá
   - Sửa phiếu (chưa hoàn thành)
   - Hoàn thành phiếu
   - Xóa phiếu

6️⃣ QUẢN LÝ GIÁ BÁN
   - Tỉ lệ % lợi nhuận theo loại
   - Tỉ lệ % lợi nhuận theo sản phẩm
   - Tra cứu: Giá vốn → % lợi → Giá bán

7️⃣ QUẢN LÝ ĐƠN HÀNG
   - Danh sách đơn hàng
   - Tìm kiếm theo ID
   - Lọc theo trạng thái:
     • Mới đặt
     • Đã xử lý
     • Đã giao
     • Hủy
   - Xem chi tiết
   - Cập nhật trạng thái

8️⃣ QUẢN LÝ TỒN KHO
   - Tra cứu số lượng tồn
   - Cảnh báo sắp hết hàng
   - Thống kê: Nhập - Xuất - Tồn
   - Theo loại sản phẩm
   - Theo thời gian

═══════════════════════════════════════════════════════════════════════

🔐 BẢO MẬT (Demo)

Lưu ý: Đây là prototype HTML/CSS/JS thuần, không có backend thực!

✅ Những gì có:
   - Demo login form
   - localStorage để lưu trạng thái
   - Redirect nếu chưa login
   - Logout functionality
   - Modal forms (không lưu vào database)

❌ Những gì không có (vì là prototype):
   - Mã hóa mật khẩu
   - Database thực
   - Session management
   - API calls
   - Data persistence

💡 Khi làm thực tế:
   - Thêm backend (Node/PHP/Java...)
   - Hash passwords
   - Implement JWT/Session
   - Connect to database
   - Add proper validation

═══════════════════════════════════════════════════════════════════════

📱 RESPONSIVE DESIGN

✨ Desktop (> 1024px)
   - Full sidebar + content
   - 4 columns stats grid
   - Bảng đầy đủ

✨ Tablet (768px - 1024px)
   - Sidebar bên trái hẹp
   - 2 columns stats grid
   - Font nhỏ hơn

✨ Mobile (< 768px)
   - Sidebar ngang (flex wrap)
   - 1 column stats grid
   - Bảng scroll ngang
   - Menu buttons full width

═══════════════════════════════════════════════════════════════════════

⌨️ TÍNH NĂNG JAVASCRIPT

✅ Navigation
   - Click button → Show section
   - Highlight active button
   - Hide other sections

✅ Modal Management
   - Open/Close modal
   - Click outside → close
   - X button → close
   - Form reset

✅ Login Flow
   - localStorage check
   - Redirect nếu chưa login
   - Logout clear localStorage
   - Auto redirect khi login

✅ Search & Filter (UI ready)
   - Input fields
   - Select dropdowns
   - Bàn bạc từ server (hiện tại là demo)

═══════════════════════════════════════════════════════════════════════

📊 DỮ LIỆU DEMO

Các dữ liệu hiển thị là sample data:

Khách hàng:
- Nguyễn Văn A, Trần Thị B, Lê Quốc C
- Với email, SĐT tương ứng

Sản phẩm:
- CF001: Arabica Ethiopia | 200k → 350k
- CF002: Robusta Việt Nam | 150k → 280k
- CF003: Đặc biệt Premium | 300k → 500k

Loại:
- Arabica (15 sản phẩm)
- Robusta (12 sản phẩm)
- Đặc biệt (8 sản phẩm)

Đơn hàng:
- ORD001-003 với các trạng thái khác nhau

═══════════════════════════════════════════════════════════════════════

🛠️ CÁC THAO TÁC KHÔNG HOẠT ĐỘNG (DEMO)

⚠️ Những nút/chức năng này là click-through demo:

❌ Thêm/Sửa/Xóa dữ liệu (không lưu vào DB)
❌ Search/Filter (không có backend)
❌ Thay đổi trạng thái (không persistent)
❌ Upload ảnh (chỉ có input)
❌ Các tính toán khác nhau (tỉ lệ lợi nhuận tự động)

✅ Những gì hoạt động:
✅ Login/Logout
✅ Navigation giữa sections
✅ Modal open/close
✅ UI interactions
✅ Responsive design

═══════════════════════════════════════════════════════════════════════

🎯 HƯỚNG PHÁT TRIỂN

Để hoàn thiện hệ thống, cần thêm:

1. Backend API
   - Node.js/Express
   - PHP/Laravel
   - Java/Spring Boot
   - Database (MySQL/PostgreSQL)

2. Authentication
   - JWT tokens
   - Session management
   - Password hashing (bcrypt)

3. Database Schema
   - Users table
   - Products, Categories
   - Orders, Order Details
   - Receipts, Receipt Items
   - Pricing rules

4. API Endpoints
   - /api/auth/login
   - /api/users/*
   - /api/products/*
   - /api/orders/*
   - etc.

5. Frontend Enhancements
   - Form validation
   - Error handling
   - Loading states
   - Pagination
   - Sorting/Filtering

═══════════════════════════════════════════════════════════════════════

📝 LƯU Ý QUAN TRỌNG

⚠️ Bản prototype này:
   - ✅ Đầy đủ giao diện
   - ✅ Có thể click tương tác
   - ✅ Responsive trên mọi thiết bị
   - ✅ Code HTML/CSS/JS cơ bản
   
   - ❌ Không có backend
   - ❌ Dữ liệu không lưu
   - ❌ Không bảo mật
   - ❌ Chỉ là clickable prototype

═══════════════════════════════════════════════════════════════════════

✨ DEMO CREDENTIALS

Username: admin
Password: admin123

Lưu ý: Đây chỉ là demo, khi làm thực tế cần:
- Quản lý user đúng
- Hash password
- Implement proper authentication
- Tách admin từ enduser hoàn toàn

═══════════════════════════════════════════════════════════════════════

📞 HỖ TRỢ

Nếu có câu hỏi về:
- Giao diện: Xem admin-dashboard.html
- Đăng nhập: Xem admin-login.html
- Styling: Xem styles/admin-dashboard.css
- JavaScript: Xem script tags trong HTML files

Chúc bạn phát triển thành công! 🎉
