# BÁO CÁO TÁI CẤU TRÚC 4 FILE HTML – COFFEE BEANS

## 1. Phiên bản nguồn và phạm vi chỉnh sửa

- Nguồn chỉnh sửa: `Coffee-Beans(5).zip` do người dùng cung cấp trong cuộc trò chuyện.
- Giữ nguyên công nghệ HTML, CSS và JavaScript thuần.
- Giữ nguyên bốn trang HTML chính: `index.html`, `checkout.html`, `account.html`, `admin.html`; giữ `404.html` cho GitHub Pages.
- Không commit, push hoặc chỉnh sửa repository GitHub.
- Không chủ động xóa hoặc khởi tạo lại dữ liệu trong `localStorage`/`sessionStorage`.

## 2. Cấu trúc HTML Template sau chỉnh sửa

| File | Template |
|---|---|
| `index.html` | `tpl-home`, `tpl-products`, `tpl-product-detail`, `tpl-product-notfound`, `tpl-guide` |
| `checkout.html` | `tpl-cart-empty`, `tpl-cart`, `tpl-checkout-empty`, `tpl-checkout`, `tpl-confirmation-notfound`, `tpl-confirmation` |
| `account.html` | `tpl-auth`, `tpl-profile`, `tpl-orders`, `tpl-orders-empty` |
| `admin.html` | `tpl-admin-login`, `tpl-admin-shell`, `tpl-admin-modal`, `tpl-admin-dashboard`, `tpl-admin-users`, `tpl-admin-categories`, `tpl-admin-products`, `tpl-admin-receipts`, `tpl-admin-pricing`, `tpl-admin-orders`, `tpl-admin-stock` |

Tổng cộng có **26 template**. Các template trạng thái rỗng/không tìm thấy được tách riêng để màn hình không phải dựng lại toàn bộ bằng chuỗi HTML khi thiếu dữ liệu.

## 3. Những phần đã chỉnh sửa

### HTML

- Đưa bố cục của trang chủ, danh sách sản phẩm, chi tiết sản phẩm, hướng dẫn, giỏ hàng, thanh toán, xác nhận đơn, đăng nhập/đăng ký, hồ sơ, lịch sử đơn và các màn hình Admin vào template tương ứng.
- Đưa markup header và footer khách hàng vào trực tiếp `index.html`, `checkout.html`, `account.html`.
- Giữ các vùng dữ liệu có ID rõ ràng để JavaScript cập nhật nội dung.

### JavaScript

- `js/router.js`: bổ sung `CB.mountTemplate()` sử dụng `template.content.cloneNode(true)`, nạp template vào `#app`, và dựng thông báo route lỗi bằng DOM API thay vì chuỗi HTML toàn trang.
- Các module `page-*.js`: lấy cấu trúc màn hình từ template và chỉ nạp dữ liệu, gắn sự kiện hoặc tạo danh sách/dòng dữ liệu động.
- `js/ui.js`: không còn dựng lại toàn bộ header/footer bằng `innerHTML`; chỉ cập nhật danh mục, tài khoản, số lượng giỏ hàng, menu di động, tìm kiếm và đăng xuất.
- `js/admin-core.js`: thêm `CBA.mountTemplate()`, dùng template cho màn hình đăng nhập, khung Admin và khung modal.
- `js/admin-catalog.js`, `js/admin-operations.js`: dùng các template HTML cho 8 màn hình quản trị; bảng và nội dung dựa trên dữ liệu vẫn được kết xuất động.
- `js/page-cart.js`: dùng template giỏ hàng và trạng thái rỗng; dùng listener ủy quyền trên vùng trang để tránh gắn lặp sự kiện khi render lại.
- `js/page-checkout.js`, `js/page-order-confirmation.js`: sử dụng template tương ứng và tạo các dòng tóm tắt đơn hàng từ dữ liệu.

### CSS và tài liệu

- Bổ sung trạng thái hover cho liên kết footer trong `styles/shop.css`.
- Cập nhật `README.md` để giải thích kiến trúc template và vai trò hiện tại của `ui.js`.

## 4. Những module dữ liệu/nghiệp vụ được giữ nguyên

Không chỉnh sửa nội dung các module sau so với ZIP nguồn:

- `js/db.js`
- `js/catalog.js`
- `js/inventory.js`
- `js/auth.js`
- `js/shop.js`
- `js/seed.js`

Vì vậy, lần tái cấu trúc này không chủ động đổi khóa lưu trữ, cấu trúc bản ghi, tài khoản mẫu, sản phẩm, đơn hàng hoặc logic khởi tạo dữ liệu. Không chạy lệnh reset seed.

## 5. Kết quả kiểm tra đã thực hiện

| Hạng mục | Kết quả |
|---|---|
| Số trang HTML chính | Đủ 4 trang; giữ thêm `404.html` |
| Template | 26 template; ID template không trùng |
| ID trong từng template | Không phát hiện ID trùng trong cùng một template |
| Template được gọi từ JavaScript | Tất cả ID truyền vào `CB.mountTemplate()`/`CBA.mountTemplate()` đều tồn tại trong HTML |
| Cú pháp JavaScript | Tất cả file `js/*.js` qua `node --check` |
| Đường dẫn tài nguyên khai báo trong HTML | Không phát hiện đường dẫn CSS, JS hoặc tài nguyên cục bộ bị thiếu |
| Tham chiếu ảnh dạng đường dẫn tĩnh trong HTML/JS/CSS | Rà soát 18 tham chiếu; không phát hiện đường dẫn ảnh bị thiếu |
| Thư mục `tests/` | Không có trong cây dự án nguồn và không được thêm vào gói bàn giao |
| `.git` trong gói ZIP bàn giao | Được loại khỏi ZIP để tránh gửi lịch sử Git nội bộ |

## 6. Kiểm thử trình duyệt và giới hạn còn lại

Đã thử mở trang bằng Chromium tự động trên môi trường thực thi hiện tại, nhưng môi trường trả về `net::ERR_BLOCKED_BY_ADMINISTRATOR` khi truy cập cả `http://127.0.0.1` và `file:///`. Do đó, **chưa thể xác nhận bằng thao tác trình duyệt** các luồng đăng nhập, đặt hàng, modal, Back/Forward hoặc giao diện thực tế sau khi mount template.

Một số form bên trong modal Admin (ví dụ form danh mục, sản phẩm, phiếu nhập, cập nhật giá và xem chi tiết đơn) vẫn được module Admin tạo nội dung động truyền vào khung `tpl-admin-modal`. Các màn hình Admin cấp cao đã dùng template riêng; nếu yêu cầu chấm bài đòi hỏi tất cả form modal cũng phải có markup nằm trực tiếp trong HTML thì đây là phần còn có thể tiếp tục tách thành các template nhỏ.

Các dòng sản phẩm, dòng bảng, thẻ sản phẩm, số liệu thống kê và dữ liệu đơn hàng vẫn được tạo động bằng JavaScript. Đây là nội dung phụ thuộc dữ liệu, không phải toàn bộ bố cục trang.

## 7. Việc nên kiểm tra thủ công trên máy người dùng

1. Giải nén ZIP vào một thư mục mới, mở thư mục bằng VS Code.
2. Chạy `python -m http.server 8000` trong terminal tại thư mục dự án, sau đó mở `http://localhost:8000/` bằng Chrome.
3. Kiểm tra trang chủ, sản phẩm, chi tiết, hướng dẫn; sau đó đăng nhập `guest1 / guest1123`, thử giỏ hàng, thanh toán và lịch sử đơn.
4. Mở `admin.html`, đăng nhập `admin / admin123`, lần lượt mở 8 màn hình quản trị; thử modal thêm/sửa và nút đóng.
5. Mở DevTools (F12) và kiểm tra Console/Network.

Không chạy `CB.seed.reset()` trong quá trình kiểm tra nếu cần giữ dữ liệu demo đang có.

## 8. Kết luận

Đã chuyển cấu trúc màn hình chính sang HTML Template và tách phần dựng header/footer khỏi `ui.js`. Kiểm tra cú pháp JavaScript, sự tồn tại của template, ID và đường dẫn tài nguyên tĩnh đều đạt. Chưa thể tuyên bố toàn bộ chức năng đã được xác minh trên Chrome do môi trường thực thi chặn Chromium; các form modal Admin cũng vẫn có một phần markup được tạo động bằng JavaScript.
