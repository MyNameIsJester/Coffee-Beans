> **⚠️ TÀI LIỆU CŨ, KHÔNG CÒN ĐÚNG.** Tệp này được viết khi website còn là giao diện tĩnh, nhiều mô tả như "dữ liệu không lưu", "nút không hoạt động", "chưa có backend/dữ liệu giả" nay đã lạc hậu: dữ liệu hiện được lưu bằng localStorage và các chức năng khách hàng/admin đã hoạt động. Xem `README.md` và `HUONG_DAN_SU_DUNG.md` ở thư mục gốc. Giữ lại chỉ để tham khảo lịch sử.

═══════════════════════════════════════════════════════════════════════════════
                    HỆ THỐNG QUẢN LÝ BÁN CÀ PHÊ - TÓM TẮT
═══════════════════════════════════════════════════════════════════════════════

📦 TỆPS TẠO MỚI / CẬP NHẬT
────────────────────────────────────────────────────────────────────────────

✅ admin-login.html              [NEW]  Trang đăng nhập Admin riêng biệt
✅ admin-dashboard.html           [NEW]  Dashboard Admin chính
✅ styles/admin-dashboard.css     [NEW]  CSS cho dashboard
✅ portal.html                    [NEW]  Trang chủ chọn Admin/Khách hàng
✅ admin.html                     [UPD]  Redirect đến login
✅ ADMIN_README.md                [NEW]  Hướng dẫn chi tiết

═══════════════════════════════════════════════════════════════════════════════

🗂️ CẤU TRÚC THƯ MỤC
────────────────────────────────────────────────────────────────────────────

CoffeBeans/
├── portal.html                      ← 🎯 Vào đây trước
├── admin-login.html                 ← Đăng nhập Admin
├── admin-dashboard.html             ← Dashboard Admin
├── admin.html                       ← Redirect cũ
├── index2.html                      ← Trang khách hàng (không chỉnh)
├── styles/
│   ├── admin-dashboard.css          ← CSS Admin
│   ├── header.css                   ← CSS chung
│   ├── user.css                     ← CSS user
│   └── admin.css                    ← CSS cũ (không dùng)
└── ADMIN_README.md                  ← Hướng dẫn

═══════════════════════════════════════════════════════════════════════════════

🎯 LUỒNG SỬ DỤNG
────────────────────────────────────────────────────────────────────────────

SCENARIO 1: Khách hàng
─────────────────────
portal.html 
    → Click "Vào trang khách hàng"
    → index2.html (trang bán hàng)

SCENARIO 2: Quản trị viên (Admin)
────────────────────────────────
portal.html 
    → Click "Vào trang quản trị"
    → admin-login.html (đăng nhập)
    → Demo: admin / admin123
    → admin-dashboard.html (8 chức năng)
    → Click Đăng xuất → Quay về admin-login.html

═══════════════════════════════════════════════════════════════════════════════

🔐 PHÂN BIỆT ADMIN & ENDUSER
────────────────────────────────────────────────────────────────────────────

✅ ADMIN (Quản trị viên)
├─ Trang đăng nhập riêng biệt: admin-login.html
├─ Dashboard riêng: admin-dashboard.html
├─ Chức năng: 8 module quản lý
├─ Dữ liệu: Chỉ admin thấy được
├─ URL: Khác hoàn toàn với khách
└─ Bảo mật: localStorage check

✅ ENDUSER (Khách hàng)
├─ Trang shop: index2.html
├─ Chức năng: Mua hàng, xem đơn
├─ Dữ liệu: Chỉ dữ liệu riêng
├─ URL: Hoàn toàn khác
└─ Không truy cập được admin

⚠️ QUAN TRỌNG: Hai hệ thống KHÔNG MẬT gì với nhau!

═══════════════════════════════════════════════════════════════════════════════

📊 8 MODULE QUẢN TRỊ
────────────────────────────────────────────────────────────────────────────

1️⃣ TỔNG QUAN (Dashboard)
   Dashboard overview
   ├─ 4 stat cards: Khách, Sản phẩm, Đơn hàng, Doanh thu
   ├─ Bảng đơn hàng gần đây
   └─ Tìm kiếm nhanh

2️⃣ QUẢN LÝ NGƯỜI DÙNG
   👥 Khách hàng management
   ├─ Danh sách khách hàng
   ├─ Thông tin: Email, SĐT
   ├─ Xem chi tiết (👁)
   ├─ Reset mật khẩu (🔄)
   └─ Khóa/Mở khóa tài khoản (🔒/🔓)

3️⃣ QUẢN LÝ LOẠI SẢN PHẨM
   📂 Categories management
   ├─ Danh sách loại: Arabica, Robusta, Đặc biệt
   ├─ Thêm loại (+ button)
   ├─ Sửa loại (✏️)
   ├─ Xóa/Ẩn loại (🗑️)
   └─ Hiển thị số sản phẩm

4️⃣ QUẢN LÝ SẢN PHẨM
   ☕ Products management
   ├─ Danh sách sản phẩm
   ├─ Thêm: Mã, tên, loại, hình, mô tả
   ├─ Sửa: Thông tin hiển thị sẵn
   ├─ Xóa/Ẩn sản phẩm
   └─ Hiển thị: Giá vốn, giá bán, tồn kho

5️⃣ QUẢN LÝ NHẬP HÀNG
   📥 Receipt management
   ├─ Danh sách phiếu nhập
   ├─ Thêm: Ngày, sản phẩm, SL, giá
   ├─ Sửa (chỉ khi chưa hoàn thành)
   ├─ Hoàn thành phiếu
   └─ Xóa phiếu

6️⃣ QUẢN LÝ GIÁ BÁN
   💰 Pricing management
   ├─ Tỉ lệ % lợi nhuận theo loại
   ├─ Tỉ lệ % lợi nhuận theo sản phẩm
   └─ Tra cứu: Giá vốn → % lợi → Giá bán

7️⃣ QUẢN LÝ ĐƠN HÀNG
   📦 Orders management
   ├─ Danh sách đơn hàng
   ├─ Tìm kiếm theo ID
   ├─ Lọc theo trạng thái
   │  ├─ Mới đặt
   │  ├─ Đã xử lý
   │  ├─ Đã giao
   │  └─ Hủy
   ├─ Xem chi tiết
   └─ Cập nhật trạng thái

8️⃣ QUẢN LÝ TỒN KHO
   📈 Stock management
   ├─ Tra cứu số lượng tồn
   ├─ Cảnh báo sắp hết hàng
   ├─ Thống kê: Nhập - Xuất - Tồn
   ├─ Theo loại sản phẩm
   └─ Theo thời gian

═══════════════════════════════════════════════════════════════════════════════

🎨 THIẾT KẾ & GIAO DIỆN
────────────────────────────────────────────────────────────────────────────

🌈 Màu sắc COFFEE THEME:
├─ Primary: #D2691E (Chocolate)
├─ Secondary: #8B4513 (Saddle Brown)
├─ Background: #F8F7F4 (Cream)
├─ Text Primary: #333333
├─ Text Secondary: #666666
└─ Accents: Green (✓), Red (✗), Orange (⚠)

📐 Layout:
├─ Header
│  ├─ Logo + Brand
│  ├─ User Info
│  └─ Logout Button
├─ Sidebar
│  ├─ 8 Navigation Buttons
│  └─ Active State Highlight
└─ Main Content
   ├─ Title + Action Buttons
   ├─ Stat Cards / Tables / Forms
   └─ Modals for Actions

🎯 Components:
├─ Cards (Stat overview)
├─ Tables (Data list)
├─ Modals (Add/Edit forms)
├─ Status Badges (Active/Inactive/Pending)
├─ Action Buttons (View/Edit/Delete)
└─ Search/Filter Inputs

📱 Responsive:
├─ Desktop (>1024px): Full layout
├─ Tablet (768-1024px): Adjusted columns
└─ Mobile (<768px): Stack layout, scroll tables

═══════════════════════════════════════════════════════════════════════════════

⚡ CHỨC NĂNG HOẠT ĐỘNG
────────────────────────────────────────────────────────────────────────────

✅ LOGIN/LOGOUT
   ├─ Demo account: admin / admin123
   ├─ localStorage storage
   ├─ Auto redirect
   └─ Session check

✅ NAVIGATION
   ├─ Click button → Show section
   ├─ Active button highlight
   └─ Hide other sections

✅ MODALS
   ├─ Open modal
   ├─ Close modal (X, Cancel, outside click)
   ├─ Form inputs
   └─ Submit buttons

✅ UI INTERACTIONS
   ├─ Hover effects
   ├─ Click animations
   ├─ Smooth transitions
   └─ Status indicators

✅ RESPONSIVE
   ├─ Mobile first
   ├─ Grid layouts
   ├─ Flexbox
   └─ Media queries

═══════════════════════════════════════════════════════════════════════════════

❌ CHỨC NĂNG KHÔNG HOẠT ĐỘNG (PROTOTYPE)
────────────────────────────────────────────────────────────────────────────

⚠️ Data Persistence:
   ❌ Không lưu vào database
   ❌ Form submit không thực
   ❌ Search/Filter không có backend
   ❌ Data sẽ mất khi refresh

⚠️ Backend:
   ❌ Không có API
   ❌ Không có server validation
   ❌ Không có database query
   ❌ Không có authentication thực

⚠️ Features:
   ❌ File upload không thực
   ❌ Email notification
   ❌ Payment processing
   ❌ Report generation

🎯 Mục đích: CLICKABLE PROTOTYPE - Thử nghiệm UI/UX

═══════════════════════════════════════════════════════════════════════════════

🚀 HƯỚNG PHÁT TRIỂN
────────────────────────────────────────────────────────────────────────────

Để chuyển từ prototype sang sản phẩm thực:

1️⃣ BACKEND
   ├─ Framework: Node.js/Express, PHP/Laravel, Java/Spring
   ├─ Database: MySQL, PostgreSQL, MongoDB
   ├─ API RESTful
   └─ Authentication: JWT, Session

2️⃣ DATABASE SCHEMA
   ├─ Users (admin & enduser)
   ├─ Products & Categories
   ├─ Orders & Order Items
   ├─ Receipts & Receipt Items
   ├─ Pricing Rules
   └─ Stock History

3️⃣ SECURITY
   ├─ Password hashing (bcrypt)
   ├─ Role-based access (RBAC)
   ├─ Input validation
   ├─ SQL injection prevention
   └─ CORS setup

4️⃣ FEATURES
   ├─ File uploads (ảnh sản phẩm)
   ├─ Email notifications
   ├─ PDF reports
   ├─ Export data (CSV/Excel)
   └─ Real-time updates

5️⃣ DEPLOYMENT
   ├─ Hosting: AWS, Heroku, DigitalOcean
   ├─ SSL/HTTPS
   ├─ CDN for images
   ├─ Backup & versioning
   └─ Monitoring & logging

═══════════════════════════════════════════════════════════════════════════════

💡 TIPS SỬ DỤNG
────────────────────────────────────────────────────────────────────────────

🎯 Bắt đầu demo:
1. Open portal.html in browser
2. Click "Vào trang quản trị"
3. Login: admin / admin123
4. Explore 8 modules
5. Click buttons để test

🔍 Khám phá chi tiết:
├─ Admin & Khách hàng hoàn toàn riêng biệt
├─ Sidebar navigation rất rõ ràng
├─ Mỗi module có form + table
├─ Modal dialogs để action
└─ Responsive design hoạt động tốt

⚠️ Lưu ý quan trọng:
├─ Không có backend thực → data không lưu
├─ Demo account không bảo mật → chỉ dùng demo
├─ Prototype này → chỉ để thử nghiệm UI/UX
└─ Cần backend → khi đưa vào production

═══════════════════════════════════════════════════════════════════════════════

📞 HỖNG TRỢ
────────────────────────────────────────────────────────────────────────────

Tìm thông tin:
├─ Giao diện chi tiết → Mở admin-dashboard.html
├─ Đăng nhập → Xem admin-login.html
├─ CSS styling → Xem styles/admin-dashboard.css
├─ JavaScript logic → Xem <script> tags trong HTML
└─ Hướng dẫn → Đọc ADMIN_README.md

Các file chính:
├─ portal.html .......................... Trang chủ
├─ admin-login.html .................... Đăng nhập
├─ admin-dashboard.html ............... Dashboard chính
└─ styles/admin-dashboard.css ........ Styling

═══════════════════════════════════════════════════════════════════════════════

✨ ĐẶC ĐIỂM NỔI BẬT
────────────────────────────────────────────────────────────────────────────

✅ Giao diện chuyên nghiệp
   └─ Màu sắc coffee theme hài hòa
   └─ Typography rõ ràng
   └─ Spacing consistent
   └─ Shadows & effects đẹp

✅ Trải nghiệm người dùng tốt
   └─ Navigation rõ ràng
   └─ Form inputs dễ dùng
   └─ Status indicators rõ ràng
   └─ Feedback tức thì

✅ Fully responsive
   └─ Desktop optimized
   └─ Tablet friendly
   └─ Mobile ready
   └─ Touch-friendly buttons

✅ Tính năng đầy đủ
   └─ 8 modules quản trị
   └─ 30+ screens
   └─ Modals & forms
   └─ Search & filter

✅ Code cơ bản
   └─ HTML thuần
   └─ CSS grid/flexbox
   └─ JavaScript vanilla
   └─ Không dependencies

═══════════════════════════════════════════════════════════════════════════════

🎉 KẾT LUẬN
────────────────────────────────────────────────────────────────────────────

Bạn đã có:
✅ Prototype hoàn chỉnh cho hệ thống Admin
✅ Giao diện đẹp, chuyên nghiệp
✅ Tách biệt hoàn toàn Admin & Enduser
✅ 8 modules quản lý đầy đủ
✅ Code HTML/CSS/JS cơ bản
✅ Responsive design
✅ Ready to present to stakeholders

Bước tiếp theo:
1. Thử demo → portal.html
2. Lấy feedback từ stakeholders
3. Develop backend
4. Connect frontend to API
5. Deploy to production

═══════════════════════════════════════════════════════════════════════════════

Chúc bạn phát triển thành công! 🚀☕

═══════════════════════════════════════════════════════════════════════════════
