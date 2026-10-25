# Cà Phê Đậm Đà - Website bán cà phê (đồ án)

Website bán hạt cà phê viết bằng **HTML, CSS và JavaScript thuần**, không dùng framework và không có máy chủ. Toàn bộ dữ liệu (tài khoản, sản phẩm, phiếu nhập, đơn hàng...) được lưu trong **`localStorage` của trình duyệt**, nên thao tác ở phía khách hàng và phía admin dùng chung một bộ dữ liệu và còn nguyên sau khi tải lại trang.

> **Phạm vi:** đây là sản phẩm trình diễn cho đồ án. Dữ liệu chỉ nằm trong trình duyệt đang dùng (không đồng bộ giữa máy hoặc giữa người dùng), và việc xác thực chỉ ở mức minh họa. Xem mục [Giới hạn](#giới-hạn).

## Chạy thử

Cần máy chủ tĩnh đơn giản (mở trực tiếp bằng `file://` vẫn chạy nhưng nên dùng máy chủ):

```bash
python -m http.server 8000      # rồi mở http://localhost:8000/
```

Triển khai lên Internet: xem [`HUONG_DAN_GITHUB_PAGES.md`](HUONG_DAN_GITHUB_PAGES.md). Cách dùng từng chức năng: xem [`HUONG_DAN_SU_DUNG.md`](HUONG_DAN_SU_DUNG.md).

## Tài khoản mẫu

| Vai trò | Tên đăng nhập | Mật khẩu | Trang đăng nhập |
|---|---|---|---|
| Admin | `admin` | `admin123` | `admin-login.html` |
| Khách hàng | `guest1` | `guest1123` | `register.html` |
| Khách hàng | `guest2` | `guest2123` | `register.html` |
| Khách hàng | `guest3` | `guest3123` | `register.html` |

`guest1` và `guest2` có địa chỉ trong hồ sơ, `guest3` chưa có địa chỉ (để thử nhập địa chỉ giao hàng mới). Admin bấm "Đặt lại mật khẩu" sẽ đưa mật khẩu khách về `123456`; khách có thể đổi lại trong Hồ sơ cá nhân.

## Chức năng

### Khách hàng
- Đăng ký, đăng nhập (bằng tên đăng nhập hoặc email), đăng xuất; header hiện tên tài khoản.
- Xem và sửa thông tin cá nhân, địa chỉ mặc định; tự đổi mật khẩu.
- Xem sản phẩm theo loại có phân trang; chi tiết sản phẩm.
- Tìm cơ bản theo tên (thanh tìm trên header) và tìm nâng cao (tên + loại + khoảng giá, kết quả có phân trang).
- Giỏ hàng (chỉ dùng được khi đã đăng nhập): thêm, bớt, xóa, giới hạn theo tồn kho.
- Thanh toán: chọn địa chỉ trong tài khoản hoặc nhập địa chỉ mới; tiền mặt (mặc định), chuyển khoản, thanh toán trực tuyến (**mô phỏng**, không có giao dịch thật).
- Xem lại đơn vừa đặt và lịch sử đơn hàng.

### Admin (`admin-login.html` → `admin-dashboard.html`)
- Đăng nhập riêng, tách phiên khỏi khách hàng; menu 8 chức năng.
- **Khách hàng:** danh sách, tìm kiếm, đặt lại mật khẩu, khóa/mở khóa.
- **Loại sản phẩm:** thêm, sửa, ẩn, xóa (loại còn sản phẩm thì không xóa được).
- **Sản phẩm:** thêm (mã, tên, loại, mô tả, hình), sửa, ẩn, xóa (đã có phiếu nhập/đơn thì chỉ ẩn).
- **Nhập hàng:** phiếu nhập nhiều sản phẩm, tìm theo mã/tên/ngày/trạng thái; chỉ sửa phiếu chưa hoàn thành; hoàn thành phiếu thì cộng tồn đúng một lần.
- **Giá bán:** % lợi nhuận theo loại và theo từng sản phẩm; tra cứu giá vốn, %, giá bán.
- **Đơn hàng:** lọc theo khoảng ngày đặt và tình trạng, xem chi tiết, cập nhật trạng thái (Mới đặt → Đã xử lý → Đã giao, hoặc Hủy).
- **Tồn kho:** tra cứu tồn tại một thời điểm, cảnh báo sắp hết hàng (ngưỡng chỉnh được), báo cáo nhập - xuất - tồn theo khoảng thời gian.

## Quy tắc nghiệp vụ chính

- **Giá bán** không lưu cố định mà luôn tính: `giá vốn × (1 + % lợi nhuận / 100)`. Giá vốn là bình quân gia quyền các dòng thuộc phiếu nhập **đã hoàn thành**. Sản phẩm có % riêng thì dùng %, ngược lại dùng % của loại. Sản phẩm chưa có phiếu nhập hoàn thành thì chưa có giá và chưa mua được.
- **Tồn kho** = tổng nhập - tổng xuất. Nhập phát sinh khi hoàn thành phiếu nhập; xuất phát sinh khi đơn chuyển sang "Đã giao". Số lượng đang nằm trong đơn chưa giao được giữ lại, nên khách không đặt vượt số còn bán được.
- Đơn hàng lưu sẵn tên và giá tại lúc đặt; đổi giá sau đó không làm đổi đơn cũ.
- Đơn "Đã giao" và "Hủy" là trạng thái cuối, không đổi tiếp được.

## Cấu trúc thư mục

```
index.html, products.html, product-detail.html, cart.html, checkout.html,
order-confirmation.html, order-history.html, profile.html, register.html   Trang khách hàng
portal.html, admin-login.html, admin-dashboard.html, admin.html            Cổng và trang admin
index2.html, arabica.html          Trang chuyển hướng giữ cho liên kết cũ không hỏng
404.html, .nojekyll                Dành cho GitHub Pages
documentation.html                 Hướng dẫn sử dụng dạng trang web
styles/                            user.css, header.css (dùng chung), admin.css, admin-dashboard.css
images/                            Ảnh sản phẩm và logo
js/db.js          Lưu trữ localStorage, tiện ích dùng chung
js/catalog.js     Loại, sản phẩm, giá vốn, % lợi nhuận, giá bán, tìm kiếm
js/inventory.js   Phiếu nhập, tồn kho, nhập - xuất - tồn
js/auth.js        Tài khoản khách hàng, đổi mật khẩu, tài khoản admin
js/shop.js        Giỏ hàng, đặt hàng, trạng thái đơn
js/seed.js        Dữ liệu mẫu (tạo qua chính các hàm nghiệp vụ nên luôn nhất quán)
js/ui.js          Header dùng chung, thông báo, phân trang
js/page-*.js      Logic riêng của từng trang khách hàng
js/admin-*.js     Giao diện và logic trang admin
tests/            Bộ kiểm thử (xem bên dưới)
docs/             Wireframe (CoffeeBeans_Wireframe.drawio) và tài liệu cũ lưu trữ (docs/archive)
tools/legacy/     Script cũ không còn dùng
```

Thứ tự nạp script trong mọi trang: `db → catalog → inventory → auth → shop → seed → ui`. Dữ liệu mẫu chỉ được tạo cho phần chưa có trong `localStorage`.

## Dữ liệu và đặt lại dữ liệu mẫu

Các khóa `localStorage` đều bắt đầu bằng `cb_` (người dùng, sản phẩm, phiếu nhập, đơn hàng, giỏ hàng...). Dữ liệu tách riêng theo **địa chỉ website** (localhost, file, github.io là các kho khác nhau).

Để về lại dữ liệu mẫu ban đầu: mở công cụ nhà phát triển của trình duyệt (F12) → Console → gõ `CB.seed.reset()` rồi tải lại trang. Hoặc xóa dữ liệu trang (Application → Local Storage → Clear).

## Kiểm thử

```bash
node tests/logic-test.js                                  # logic nghiệp vụ (không cần trình duyệt)
cd tests/ui && npm install && npm test                    # giao diện bằng jsdom
# Trình duyệt thật (Chromium qua Playwright): xem tests/browser/README.md
```

Kiểm thử trình duyệt thật (`tests/browser/`) cần cài Playwright; các bài này **chưa** chạy trên Firefox, Safari hay thiết bị di động thật.

## Giới hạn

- Không có máy chủ hay cơ sở dữ liệu: dữ liệu chỉ nằm trong trình duyệt, xóa dữ liệu trình duyệt là mất.
- Mật khẩu được băm bằng hàm đơn giản ngay trong trình duyệt để minh họa, **không phải cơ chế xác thực an toàn** cho website thương mại điện tử thực tế. Tài khoản admin cũng nằm trong mã nguồn.
- Thanh toán trực tuyến và thông tin chuyển khoản chỉ là minh họa.
- Ảnh sản phẩm admin tải lên được thu nhỏ rồi lưu trong `localStorage` (dung lượng giới hạn vài MB).
- Giao diện admin dùng được trên điện thoại nhưng được thiết kế chủ yếu cho máy tính.
- Font chữ và biểu tượng nạp từ Google Fonts và cdnjs, cần Internet.

## Thiết kế giao diện

Wireframe 20 trang (khách hàng, admin, di động, sơ đồ điều hướng) nằm ở `docs/CoffeeBeans_Wireframe.drawio`, kèm `docs/CoffeeBeans_Wireframe.pdf` và `docs/wireframe/png/`. File `.drawio` mở và chỉnh sửa được bằng diagrams.net; PNG/PDF đi kèm do script của dự án xuất từ chính file đó. Website **không** được thiết kế bằng Figma. Chi tiết: `docs/wireframe/README.md`.
