# Hướng dẫn sử dụng

Tài khoản mẫu: `admin / admin123`, `guest1 / guest1123`, `guest2 / guest2123`, `guest3 / guest3123`. Mô tả tổng quan xem `README.md`.

## A. Dành cho khách hàng

### 1. Đăng ký và đăng nhập
1. Bấm **Đăng nhập / Đăng ký** trên header (hoặc mở `register.html`).
2. Tab **Đăng Ký**: nhập họ tên, tên đăng nhập (3-30 ký tự không dấu, số, `.` hoặc `_`), email, số điện thoại (10 số, ví dụ `0901234567`), mật khẩu từ 6 ký tự và xác nhận. Tên đăng nhập và email không được trùng với tài khoản khác.
3. Đăng ký xong, hệ thống chuyển sang tab **Đăng Nhập** với tên đăng nhập đã điền sẵn.
4. Có thể đăng nhập bằng **tên đăng nhập hoặc email**. Tài khoản bị admin khóa sẽ không đăng nhập được.
5. Đăng xuất: menu tài khoản trên header → **Đăng xuất**.

### 2. Hồ sơ cá nhân
`profile.html` (menu tài khoản → Hồ sơ cá nhân):
- **Chỉnh sửa:** họ tên, email, số điện thoại và địa chỉ mặc định (điền đủ 4 ô tỉnh/thành, quận/huyện, phường/xã, số nhà, hoặc để trống cả 4).
- **Đổi mật khẩu:** nhập mật khẩu hiện tại, mật khẩu mới (từ 6 ký tự, khác mật khẩu cũ) và xác nhận. Đây là chức năng minh họa dùng localStorage, không phải xác thực an toàn.

### 3. Tìm và xem sản phẩm
- Menu **Sản phẩm** (Arabica, Robusta, Blend) hoặc `products.html` hiển thị 9 sản phẩm mỗi trang.
- **Tìm cơ bản:** gõ tên vào ô tìm trên header (không phân biệt hoa thường và dấu).
- **Tìm nâng cao:** ở `products.html`, kết hợp tên, phân loại, khoảng giá (giá từ ≤ giá đến) và sắp xếp rồi bấm **Tìm kiếm**; **Xóa bộ lọc** để về mặc định.
- Bấm vào sản phẩm để xem chi tiết (mã, loại, khối lượng, mức rang, xuất xứ, đặc điểm, tồn kho).

### 4. Giỏ hàng và đặt hàng
1. Bấm **Thêm vào giỏ** ở danh sách hoặc trang chi tiết. Chưa đăng nhập thì được chuyển sang trang đăng nhập.
2. `cart.html`: đổi số lượng bằng nút +/- hoặc nhập số; nút ✕ để xóa. Số lượng không vượt quá số còn bán được.
3. **Thanh toán:**
   - Địa chỉ: **dùng địa chỉ trong tài khoản** hoặc **địa chỉ giao hàng khác** (tên người nhận, số điện thoại, tỉnh/thành, quận/huyện, phường/xã, số nhà).
   - Thanh toán: tiền mặt khi nhận hàng (mặc định), chuyển khoản, hoặc trực tuyến (mô phỏng).
4. Bấm **Đặt hàng** để sang trang xác nhận; phí vận chuyển cố định 30.000đ.
5. `order-history.html` liệt kê các đơn của riêng tài khoản; bấm **Xem chi tiết** để xem sản phẩm, địa chỉ và lịch sử trạng thái.

## B. Dành cho admin

Mở `portal.html` → **Admin**, hoặc `admin-login.html`, đăng nhập `admin / admin123`. Menu bên trái có 8 chức năng; địa chỉ có dạng `admin-dashboard.html#products`.

| Chức năng | Cách dùng |
|---|---|
| **Tổng quan** | Số khách hàng, sản phẩm, đơn, doanh thu (đơn đã giao), số sản phẩm sắp hết; 6 đơn gần nhất. |
| **Khách hàng** | Tìm theo tên, tài khoản, email, SĐT; lọc theo trạng thái. 🔑 đặt lại mật khẩu về `123456` (chỉ tài khoản đó đổi); 🔒/🔓 khóa hoặc mở khóa. |
| **Loại sản phẩm** | `+ Thêm loại`; ✏️ sửa; 🙈 ẩn (ẩn luôn các sản phẩm của loại khỏi khách); 🗑 xóa (chỉ khi loại không còn sản phẩm). |
| **Sản phẩm** | `+ Thêm sản phẩm`: loại, mã (không trùng), tên, mô tả, xuất xứ/mức rang/khối lượng, hình (chọn tệp ảnh). ✏️ mở form với dữ liệu hiện có; 🙈 ẩn; 🗑 xóa (đã có phiếu nhập/đơn thì phải dùng Ẩn). Sản phẩm mới chưa có giá cho tới khi có phiếu nhập hoàn thành. |
| **Nhập hàng** | `+ Thêm phiếu nhập`: ngày nhập, các dòng (sản phẩm, số lượng, giá nhập). Phiếu mới ở trạng thái *Chưa hoàn thành*, có thể ✏️ sửa hoặc 🗑 xóa. ✅ **Hoàn thành** sẽ cộng tồn kho, cập nhật giá vốn và khóa phiếu. Lọc theo mã/tên sản phẩm, khoảng ngày, trạng thái. |
| **Giá bán** | Sửa % lợi nhuận của từng **loại** (có xem trước giá mới) hoặc riêng từng **sản phẩm** (để trống = dùng % của loại). Bảng dưới tra cứu giá vốn, %, giá bán. |
| **Đơn hàng** | Lọc theo ngày đặt, tình trạng, mã đơn/khách. 👁 xem chi tiết và chuyển trạng thái: Mới đặt → Đã xử lý → Đã giao, hoặc Hủy. Tồn kho chỉ bị trừ khi **Đã giao**. |
| **Tồn kho** | Bảng cảnh báo theo ngưỡng (chỉnh được); tra cứu tồn cuối một ngày theo loại/sản phẩm; báo cáo nhập - xuất - tồn trong khoảng ngày kèm chi tiết giao dịch của sản phẩm. |

## C. Đặt lại dữ liệu

Mở Console của trình duyệt (F12) và gõ `CB.seed.reset()`, rồi tải lại trang. Thao tác này xóa toàn bộ dữ liệu của website trên trình duyệt đó và tạo lại dữ liệu mẫu (12 sản phẩm, 3 loại, 3 phiếu nhập, 5 đơn, 3 khách hàng, 1 admin).

## D. Lưu ý

- Dữ liệu nằm trong trình duyệt đang dùng và chỉ thấy được ở cùng địa chỉ website. Dùng chế độ ẩn danh hoặc xóa dữ liệu trình duyệt sẽ làm mất dữ liệu.
- Mở website bằng địa chỉ khác (ví dụ `localhost` và trang trên github.io) cho ra hai bộ dữ liệu khác nhau.
- Thanh toán trực tuyến và thông tin chuyển khoản chỉ để minh họa.
