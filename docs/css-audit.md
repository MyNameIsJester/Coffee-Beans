# Bảng Kiểm Kê & Phân Tích CSS Trùng Lặp (CSS Audit)

- **Ngày kiểm kê:** 2026-11-03
- **Tổng số lượt khai báo CSS:** 858
- **Tổng số selector duy nhất:** 569
- **Số lượng selector bị trùng lặp / xuất hiện nhiều nơi:** 168

## 1. Phân loại xử lý tổng quan

| Nhóm phân loại | Tiêu chuẩn | Hướng giải quyết |
|---|---|---|
| **GIỮ 1** | Các bản khai báo giống hệt nhau hoặc lặp nguyên khối giữa `header.css` và `user.css` | Giữ duy nhất 1 bản chuẩn trong `base.css` hoặc `shop.css`, xóa bản lặp |
| **GỘP** | Cùng selector, thuộc tính bổ sung cho nhau không xung đột | Hợp nhất các thuộc tính vào một rule duy nhất trong `base.css` |
| **ĐỔI TÊN / GIỚI HẠN PHẠM VI** | Cùng tên class nhưng phong cách khác nhau giữa Admin và Khách hàng (`.btn-primary`, `.form-group`, `.status-badge`, `.modal`, `:root`, `body`, `*`) | Đưa class admin vào `styles/admin.css` hoặc đặt scope `[data-view="..."]` / `.admin-root` |
| **XÓA** | Thuộc về mã chết chưa từng được trang nào nạp (`styles/admin.css`, `styles/admin-dashboard.css`) hoặc khối style tạm | Loại bỏ hoàn toàn sau khi đối chiếu |

## 2. Chi tiết từng Selector trùng lặp

| STT | Selector | Số lần | Các nguồn xuất hiện | Phân loại nội dung | Quyết định |
|:---:|---|:---:|---|---|---|
| 1 | `body` | 12 | 404.html<br>admin-dashboard.html<br>admin-login.html<br>admin.html<br>documentation.html<br>portal.html<br>profile.html<br>register.html<br>styles\admin-dashboard.css<br>styles\admin.css<br>styles\header.css<br>styles\user.css | 11 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 2 | `*` | 9 | admin-dashboard.html<br>admin-login.html<br>documentation.html<br>portal.html<br>profile.html<br>register.html<br>styles\admin-dashboard.css<br>styles\admin.css<br>styles\user.css | 2 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 3 | `.form-group` | 8 | admin-dashboard.html<br>admin-login.html<br>checkout.html<br>index.html<br>profile.html<br>register.html<br>styles\admin-dashboard.css | 4 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 4 | `to` | 8 | admin-dashboard.html<br>checkout.html<br>register.html<br>styles\user.css | 4 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 5 | `.btn` | 7 | admin.html<br>portal.html<br>profile.html<br>styles\admin.css<br>styles\user.css | 7 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 6 | `.action-buttons` | 7 | admin-dashboard.html<br>order-confirmation.html<br>product-detail.html<br>profile.html | 6 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 7 | `.form-group label` | 6 | admin-dashboard.html<br>admin-login.html<br>checkout.html<br>index.html<br>register.html<br>styles\admin-dashboard.css | 6 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 8 | `.form-group input` | 6 | admin-dashboard.html<br>admin-login.html<br>index.html<br>register.html<br>styles\admin-dashboard.css | 6 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 9 | `.sidebar` | 6 | admin-dashboard.html<br>styles\admin.css | 6 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 10 | `} @media (max-width: 640px)` | 6 | checkout.html<br>product-detail.html<br>products.html<br>styles\admin.css<br>styles\header.css<br>styles\user.css | 6 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 11 | `:root` | 5 | documentation.html<br>profile.html<br>styles\admin-dashboard.css<br>styles\admin.css<br>styles\user.css | 5 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 12 | `.btn-primary` | 5 | admin-dashboard.html<br>order-confirmation.html<br>profile.html<br>styles\admin-dashboard.css<br>styles\admin.css | 5 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 13 | `.status-badge` | 5 | admin-dashboard.html<br>order-confirmation.html<br>order-history.html<br>styles\admin-dashboard.css | 3 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 14 | `table` | 5 | admin-dashboard.html<br>documentation.html<br>styles\admin-dashboard.css | 3 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 15 | `.form-group input:focus` | 5 | admin-dashboard.html<br>admin-login.html<br>index.html<br>register.html<br>styles\admin-dashboard.css | 4 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 16 | `.btn-primary:hover` | 4 | admin-dashboard.html<br>order-confirmation.html<br>profile.html<br>styles\admin-dashboard.css | 3 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 17 | `th` | 4 | admin-dashboard.html<br>documentation.html<br>styles\admin-dashboard.css | 4 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 18 | `.form-group textarea` | 4 | admin-dashboard.html<br>styles\admin-dashboard.css | 3 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 19 | `.stats-grid` | 4 | admin-dashboard.html<br>styles\admin-dashboard.css | 3 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 20 | `a` | 4 | 404.html<br>documentation.html<br>styles\admin.css<br>styles\user.css | 4 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 21 | `.container` | 4 | admin.html<br>portal.html<br>styles\admin.css<br>styles\user.css | 3 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 22 | `.grid-3` | 4 | styles\admin.css<br>styles\user.css | 3 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 23 | `.mobile-toggle` | 4 | styles\header.css<br>styles\user.css | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 24 | `.search-bar` | 4 | styles\header.css<br>styles\user.css | 4 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 25 | `.card` | 4 | portal.html<br>styles\user.css | 4 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 26 | `.login-header h1` | 4 | admin-login.html<br>register.html | 4 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 27 | `h1` | 3 | 404.html<br>styles\admin-dashboard.css<br>styles\admin.css | 3 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 28 | `h2` | 3 | documentation.html<br>styles\admin-dashboard.css<br>styles\admin.css | 3 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 29 | `.btn-secondary` | 3 | admin-dashboard.html<br>order-confirmation.html<br>styles\admin-dashboard.css | 3 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 30 | `.btn-secondary:hover` | 3 | admin-dashboard.html<br>order-confirmation.html<br>styles\admin-dashboard.css | 2 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 31 | `.status-pending` | 3 | admin-dashboard.html<br>order-history.html<br>styles\admin-dashboard.css | 3 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 32 | `td` | 3 | admin-dashboard.html<br>documentation.html<br>styles\admin-dashboard.css | 3 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 33 | `.table-container` | 3 | admin-dashboard.html<br>styles\admin-dashboard.css | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 34 | `.sidebar button` | 3 | admin-dashboard.html<br>styles\admin.css | 3 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 35 | `.row` | 3 | styles\admin.css<br>styles\user.css | 3 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 36 | `.table th` | 3 | styles\admin.css | File chưa nạp | **XÓA** (Mã chết từ 2 file admin cũ chưa từng nạp) |
| 37 | `.table td` | 3 | styles\admin.css | File chưa nạp | **XÓA** (Mã chết từ 2 file admin cũ chưa từng nạp) |
| 38 | `.badge` | 3 | styles\admin.css<br>styles\header.css<br>styles\user.css | 2 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 39 | `.header` | 3 | portal.html<br>styles\header.css<br>styles\user.css | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 40 | `.cart-summary` | 3 | styles\header.css | 3 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 41 | `.cart-table td` | 3 | cart.html<br>styles\header.css | 3 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 42 | `.btn:hover` | 3 | admin.html<br>portal.html<br>styles\user.css | 2 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 43 | `.testi` | 3 | styles\user.css | 3 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 44 | `.foot` | 3 | styles\user.css | 3 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 45 | `.modal` | 3 | admin-dashboard.html<br>index.html | 3 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 46 | `.modal-content` | 3 | admin-dashboard.html<br>index.html | 3 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 47 | `.modal-header h2` | 3 | admin-dashboard.html | 3 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 48 | `.modal-footer` | 3 | admin-dashboard.html | 3 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 49 | `.status-processing` | 3 | admin-dashboard.html<br>order-confirmation.html<br>order-history.html | 2 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 50 | `.checkout-section` | 3 | checkout.html | 3 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 51 | `.back-to-top:hover` | 3 | index.html<br>product-detail.html<br>products.html | Đồng nhất 100% | **GIỮ 1** (Nội dung giống hệt nhau, đưa vào `base.css` hoặc `shop.css`) |
| 52 | `.back-to-top.show` | 3 | index.html<br>product-detail.html<br>products.html | Đồng nhất 100% | **GIỮ 1** (Nội dung giống hệt nhau, đưa vào `base.css` hoặc `shop.css`) |
| 53 | `.product-title` | 3 | product-detail.html | 3 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 54 | `.related-grid` | 3 | product-detail.html | 3 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 55 | `.filter-panel` | 3 | products.html | 3 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 56 | `h3` | 2 | styles\admin-dashboard.css<br>styles\admin.css | File chưa nạp | **XÓA** (Mã chết từ 2 file admin cũ chưa từng nạp) |
| 57 | `.btn-icon` | 2 | admin-dashboard.html<br>styles\admin-dashboard.css | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 58 | `.btn-icon:hover` | 2 | admin-dashboard.html<br>styles\admin-dashboard.css | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 59 | `.status-active` | 2 | admin-dashboard.html<br>styles\admin-dashboard.css | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 60 | `.status-inactive` | 2 | admin-dashboard.html<br>styles\admin-dashboard.css | Đồng nhất 100% | **GIỮ 1** (Nội dung giống hệt nhau, đưa vào `base.css` hoặc `shop.css`) |
| 61 | `thead` | 2 | admin-dashboard.html<br>styles\admin-dashboard.css | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 62 | `tbody tr:hover` | 2 | admin-dashboard.html<br>styles\admin-dashboard.css | Đồng nhất 100% | **GIỮ 1** (Nội dung giống hệt nhau, đưa vào `base.css` hoặc `shop.css`) |
| 63 | `.form-group select` | 2 | admin-dashboard.html<br>styles\admin-dashboard.css | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 64 | `.form-group textarea:focus` | 2 | admin-dashboard.html<br>styles\admin-dashboard.css | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 65 | `.form-group select:focus` | 2 | admin-dashboard.html<br>styles\admin-dashboard.css | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 66 | `.stat-card` | 2 | admin-dashboard.html<br>styles\admin-dashboard.css | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 67 | `.stat-card:hover` | 2 | admin-dashboard.html<br>styles\admin-dashboard.css | Đồng nhất 100% | **GIỮ 1** (Nội dung giống hệt nhau, đưa vào `base.css` hoặc `shop.css`) |
| 68 | `.stat-card-icon` | 2 | admin-dashboard.html<br>styles\admin-dashboard.css | Đồng nhất 100% | **GIỮ 1** (Nội dung giống hệt nhau, đưa vào `base.css` hoặc `shop.css`) |
| 69 | `.stat-card-label` | 2 | admin-dashboard.html<br>styles\admin-dashboard.css | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 70 | `.stat-card-value` | 2 | admin-dashboard.html<br>styles\admin-dashboard.css | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 71 | `} @media (max-width: 768px)` | 2 | admin-dashboard.html<br>styles\admin-dashboard.css | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 72 | `html` | 2 | styles\admin.css<br>styles\user.css | Đồng nhất 100% | **GIỮ 1** (Nội dung giống hệt nhau, đưa vào `base.css` hoặc `shop.css`) |
| 73 | `.admin-header` | 2 | admin-dashboard.html<br>styles\admin.css | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 74 | `.admin-nav` | 2 | styles\admin.css | File chưa nạp | **XÓA** (Mã chết từ 2 file admin cũ chưa từng nạp) |
| 75 | `.admin-layout` | 2 | admin-dashboard.html<br>styles\admin.css | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 76 | `.sidebar button.active` | 2 | admin-dashboard.html<br>styles\admin.css | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 77 | `.panel` | 2 | styles\admin.css | File chưa nạp | **XÓA** (Mã chết từ 2 file admin cũ chưa từng nạp) |
| 78 | `.grid-2` | 2 | styles\admin.css | File chưa nạp | **XÓA** (Mã chết từ 2 file admin cũ chưa từng nạp) |
| 79 | `label` | 2 | profile.html<br>styles\admin.css | 2 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 80 | `input` | 2 | profile.html<br>styles\admin.css | 2 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 81 | `textarea` | 2 | styles\admin.css | File chưa nạp | **XÓA** (Mã chết từ 2 file admin cũ chưa từng nạp) |
| 82 | `input:focus` | 2 | profile.html<br>styles\admin.css | 2 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 83 | `.btn-danger` | 2 | profile.html<br>styles\admin.css | 2 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 84 | `.table-wrap` | 2 | styles\admin.css | File chưa nạp | **XÓA** (Mã chết từ 2 file admin cũ chưa từng nạp) |
| 85 | `.table` | 2 | styles\admin.css | File chưa nạp | **XÓA** (Mã chết từ 2 file admin cũ chưa từng nạp) |
| 86 | `.table tbody tr:hover` | 2 | styles\admin.css | File chưa nạp | **XÓA** (Mã chết từ 2 file admin cũ chưa từng nạp) |
| 87 | `.nav` | 2 | styles\header.css<br>styles\user.css | Đồng nhất 100% | **GIỮ 1** (Nội dung giống hệt nhau, đưa vào `base.css` hoặc `shop.css`) |
| 88 | `.brand a` | 2 | styles\header.css<br>styles\user.css | Đồng nhất 100% | **GIỮ 1** (Nội dung giống hệt nhau, đưa vào `base.css` hoặc `shop.css`) |
| 89 | `.brand-logo` | 2 | styles\header.css<br>styles\user.css | Đồng nhất 100% | **GIỮ 1** (Nội dung giống hệt nhau, đưa vào `base.css` hoặc `shop.css`) |
| 90 | `.brand-name` | 2 | styles\header.css<br>styles\user.css | Đồng nhất 100% | **GIỮ 1** (Nội dung giống hệt nhau, đưa vào `base.css` hoặc `shop.css`) |
| 91 | `.menu` | 2 | styles\header.css<br>styles\user.css | Đồng nhất 100% | **GIỮ 1** (Nội dung giống hệt nhau, đưa vào `base.css` hoặc `shop.css`) |
| 92 | `.menu a` | 2 | styles\header.css<br>styles\user.css | Đồng nhất 100% | **GIỮ 1** (Nội dung giống hệt nhau, đưa vào `base.css` hoặc `shop.css`) |
| 93 | `.menu a:hover` | 2 | styles\header.css<br>styles\user.css | Đồng nhất 100% | **GIỮ 1** (Nội dung giống hệt nhau, đưa vào `base.css` hoặc `shop.css`) |
| 94 | `.badge-count` | 2 | styles\header.css<br>styles\user.css | Đồng nhất 100% | **GIỮ 1** (Nội dung giống hệt nhau, đưa vào `base.css` hoặc `shop.css`) |
| 95 | `.dropdown` | 2 | styles\header.css<br>styles\user.css | Đồng nhất 100% | **GIỮ 1** (Nội dung giống hệt nhau, đưa vào `base.css` hoặc `shop.css`) |
| 96 | `.dropdown-content` | 2 | styles\header.css<br>styles\user.css | Đồng nhất 100% | **GIỮ 1** (Nội dung giống hệt nhau, đưa vào `base.css` hoặc `shop.css`) |
| 97 | `.dropdown:hover .dropdown-content` | 2 | styles\header.css<br>styles\user.css | Đồng nhất 100% | **GIỮ 1** (Nội dung giống hệt nhau, đưa vào `base.css` hoặc `shop.css`) |
| 98 | `.dropdown-content a` | 2 | styles\header.css<br>styles\user.css | Đồng nhất 100% | **GIỮ 1** (Nội dung giống hệt nhau, đưa vào `base.css` hoặc `shop.css`) |
| 99 | `.dropdown-content a:hover` | 2 | styles\header.css<br>styles\user.css | Đồng nhất 100% | **GIỮ 1** (Nội dung giống hệt nhau, đưa vào `base.css` hoặc `shop.css`) |
| 100 | `.dropdown > a::after` | 2 | styles\header.css<br>styles\user.css | Đồng nhất 100% | **GIỮ 1** (Nội dung giống hệt nhau, đưa vào `base.css` hoặc `shop.css`) |
| 101 | `.search-bar input` | 2 | styles\header.css<br>styles\user.css | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 102 | `.search-btn` | 2 | styles\header.css<br>styles\user.css | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 103 | `.account-link:hover` | 2 | index.html<br>styles\header.css | Đồng nhất 100% | **GIỮ 1** (Nội dung giống hệt nhau, đưa vào `base.css` hoặc `shop.css`) |
| 104 | `.cb-toast` | 2 | admin-dashboard.html<br>styles\header.css | 2 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 105 | `.cb-toast-error` | 2 | admin-dashboard.html<br>styles\header.css | Đồng nhất 100% | **GIỮ 1** (Nội dung giống hệt nhau, đưa vào `base.css` hoặc `shop.css`) |
| 106 | `.cb-toast-info` | 2 | admin-dashboard.html<br>styles\header.css | Đồng nhất 100% | **GIỮ 1** (Nội dung giống hệt nhau, đưa vào `base.css` hoặc `shop.css`) |
| 107 | `.cb-toast.hide` | 2 | admin-dashboard.html<br>styles\header.css | Đồng nhất 100% | **GIỮ 1** (Nội dung giống hệt nhau, đưa vào `base.css` hoặc `shop.css`) |
| 108 | `.cart-items` | 2 | styles\header.css | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 109 | `.cart-table th` | 2 | cart.html<br>styles\header.css | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 110 | `.hero-media` | 2 | styles\user.css | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 111 | `.section-title` | 2 | checkout.html<br>styles\user.css | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 112 | `.add` | 2 | styles\user.css | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 113 | `.buy-now` | 2 | styles\user.css | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 114 | `.add:hover` | 2 | styles\user.css | Đồng nhất 100% | **GIỮ 1** (Nội dung giống hệt nhau, đưa vào `base.css` hoặc `shop.css`) |
| 115 | `.about` | 2 | styles\user.css | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 116 | `.card:hover` | 2 | portal.html<br>styles\user.css | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 117 | `.header-content` | 2 | admin-dashboard.html | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 118 | `.header-right` | 2 | admin-dashboard.html | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 119 | `.user-avatar` | 2 | admin-dashboard.html<br>profile.html | 2 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 120 | `.search-box` | 2 | admin-dashboard.html<br>products.html | 2 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 121 | `.search-box input` | 2 | admin-dashboard.html<br>products.html | 2 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 122 | `.search-box input:focus` | 2 | admin-dashboard.html<br>products.html | 2 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 123 | `} .modal-header` | 2 | admin-dashboard.html | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 124 | `.modal-body` | 2 | admin-dashboard.html | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 125 | `.close-btn` | 2 | admin-dashboard.html<br>index.html | 2 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 126 | `.btn-cancel` | 2 | admin-dashboard.html<br>order-history.html | 2 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 127 | `.btn-cancel:hover` | 2 | admin-dashboard.html<br>order-history.html | 2 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 128 | `.advanced-search-panel` | 2 | admin-dashboard.html | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 129 | `.empty-state` | 2 | admin-dashboard.html<br>order-history.html | 2 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 130 | `.modal-body h4` | 2 | admin-dashboard.html | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 131 | `.login-container` | 2 | admin-login.html<br>register.html | 2 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 132 | `.logo` | 2 | admin-login.html<br>portal.html | 2 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 133 | `.login-header p` | 2 | admin-login.html<br>register.html | 2 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 134 | `.form-group input::placeholder` | 2 | admin-login.html<br>register.html | 2 biến thể (Khách hàng vs Admin) | **ĐỔI TÊN / PHẠM VI** (Tách Admin riêng vào `styles/admin.css`) |
| 135 | `} .loading` | 2 | checkout.html | Đồng nhất 100% | **GIỮ 1** (Nội dung giống hệt nhau, đưa vào `base.css` hoặc `shop.css`) |
| 136 | `.loading::after` | 2 | checkout.html | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 137 | `.btn-checkout` | 2 | checkout.html | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 138 | `.btn-checkout:disabled` | 2 | checkout.html | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 139 | `.cart-item` | 2 | checkout.html | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 140 | `.payment-option` | 2 | checkout.html | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 141 | `.payment-option.selected` | 2 | checkout.html | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 142 | `.order-total` | 2 | checkout.html<br>order-history.html | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 143 | `.cart-item img` | 2 | checkout.html | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 144 | `.cart-item-quantity` | 2 | checkout.html | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 145 | `.quantity-btn` | 2 | checkout.html<br>product-detail.html | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 146 | `.quantity-btn:hover` | 2 | checkout.html<br>product-detail.html | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 147 | `.quantity-input` | 2 | checkout.html<br>product-detail.html | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 148 | `} .back-to-top` | 2 | index.html<br>product-detail.html | Đồng nhất 100% | **GIỮ 1** (Nội dung giống hệt nhau, đưa vào `base.css` hoặc `shop.css`) |
| 149 | `.success-title` | 2 | order-confirmation.html | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 150 | `.order-id` | 2 | order-confirmation.html<br>order-history.html | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 151 | `.info-label` | 2 | order-confirmation.html<br>order-history.html | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 152 | `.info-value` | 2 | order-confirmation.html<br>order-history.html | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 153 | `.items-table th` | 2 | order-confirmation.html | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 154 | `.items-table td` | 2 | order-confirmation.html | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 155 | `.order-card-header` | 2 | order-history.html | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 156 | `.order-actions` | 2 | order-history.html | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 157 | `.cards-grid` | 2 | portal.html | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 158 | `.card-icon` | 2 | portal.html | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 159 | `.card h2` | 2 | portal.html | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 160 | `.product-price` | 2 | product-detail.html | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 161 | `.quantity-section` | 2 | product-detail.html | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 162 | `.add-to-cart-btn` | 2 | product-detail.html | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 163 | `.buy-now-btn` | 2 | product-detail.html | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 164 | `.price-range` | 2 | products.html | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 165 | `.filter-buttons` | 2 | products.html | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 166 | `.filter-buttons button` | 2 | products.html | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 167 | `.profile-card` | 2 | profile.html | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
| 168 | `.edit-form` | 2 | profile.html | 2 biến thể nội dung | **GỘP** (Hợp nhất các thuộc tính vào class chuẩn) |
