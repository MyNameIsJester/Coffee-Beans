# Cà Phê Đậm Đà – Website bán cà phê (đồ án)

Website bán hạt cà phê được xây dựng bằng **HTML, CSS và JavaScript thuần**, không dùng framework, backend hay cơ sở dữ liệu máy chủ. Website được tổ chức thành 4 trang HTML chính; JavaScript điều hướng các màn hình bằng URL Hash Router. Dữ liệu demo (tài khoản, sản phẩm, giỏ hàng, phiếu nhập, đơn hàng...) được lưu trong `localStorage` của trình duyệt.

> **Phạm vi:** đây là clickable prototype phục vụ học tập và trình diễn. Dữ liệu chỉ nằm trong trình duyệt hiện tại, không đồng bộ giữa máy tính hoặc người dùng. Mật khẩu được lưu trực tiếp trong `localStorage` để đơn giản hóa đồ án; không sử dụng mật khẩu cá nhân thật và không dùng kiến trúc này cho website kinh doanh thực tế.

## Chạy website

Nên chạy bằng một máy chủ tĩnh đơn giản để các trang HTML dùng chung một origin và chia sẻ `localStorage` ổn định:

```bash
python -m http.server 8000
```

Sau đó mở `http://localhost:8000/` bằng Chrome.

Có thể mở từng HTML trực tiếp bằng `file:///`, nhưng trình duyệt không đảm bảo cách chia sẻ `localStorage` giữa các file `file://` giống như website HTTP. Vì vậy, không nên dùng chế độ mở trực tiếp nếu cần kiểm tra luồng đăng nhập → giỏ hàng → thanh toán xuyên qua nhiều file.

Triển khai Internet: xem [`HUONG_DAN_GITHUB_PAGES.md`](HUONG_DAN_GITHUB_PAGES.md). Hướng dẫn thao tác: xem [`HUONG_DAN_SU_DUNG.md`](HUONG_DAN_SU_DUNG.md).

## Bốn trang HTML chính

| File | Khu vực | Các màn hình |
|---|---|---|
| `index.html` | Mua sắm | Trang chủ, danh sách sản phẩm, chi tiết sản phẩm, tìm kiếm/lọc, hướng dẫn |
| `checkout.html` | Đặt hàng | Giỏ hàng, thanh toán, xác nhận đơn hàng |
| `account.html` | Tài khoản khách hàng | Đăng nhập/đăng ký, hồ sơ cá nhân, lịch sử đơn hàng |
| `admin.html` | Quản trị | Đăng nhập Admin và dashboard gồm 8 chức năng |

Các màn hình trong cùng một file được điều hướng bằng URL hash, ví dụ `index.html#/products`, `checkout.html#/cart`, `account.html#/profile` và `admin.html#orders`.

### Cách tổ chức giao diện bằng HTML Template

Bố cục của từng màn hình được khai báo trong các thẻ `<template>` thuộc file HTML tương ứng. `router.js` sao chép template bằng `template.content.cloneNode(true)` vào vùng `#app`; module JavaScript của màn hình chỉ đọc dữ liệu, cập nhật các vùng hiển thị và gắn sự kiện. Khu vực Admin dùng `CBA.mountTemplate()` để nạp template vào vùng nội dung quản trị.

Header và footer của khu vực khách hàng được đặt trực tiếp trong `index.html`, `checkout.html` và `account.html`. `ui.js` chỉ cập nhật các phần thay đổi như danh mục, trạng thái đăng nhập, số lượng giỏ hàng, menu di động và tìm kiếm; không dựng lại toàn bộ header/footer.

Các dòng sản phẩm, dòng bảng, thống kê và dữ liệu danh sách vẫn được tạo động bằng JavaScript vì chúng phụ thuộc dữ liệu trong `localStorage`. Khung trang và cấu trúc biểu mẫu chính đã được đưa về HTML template. Một số nội dung form bên trong modal quản trị vẫn được tạo động trong module quản trị.


## Tài khoản demo

| Vai trò | Tên đăng nhập | Mật khẩu | Trang đăng nhập |
|---|---|---|---|
| Admin | `admin` | `admin123` | `admin.html` |
| Khách hàng | `guest1` | `guest1123` | `account.html#/auth` |
| Khách hàng | `guest2` | `guest2123` | `account.html#/auth` |
| Khách hàng | `guest3` | `guest3123` | `account.html#/auth` |

`guest1` và `guest2` có địa chỉ mẫu trong hồ sơ; `guest3` chưa có địa chỉ để thử nhập địa chỉ giao hàng mới. Admin có thể đặt lại mật khẩu khách hàng về `123456`; khách hàng có thể đổi lại trong Hồ sơ cá nhân.

## Chức năng

### Khách hàng
- Đăng ký, đăng nhập bằng tên đăng nhập hoặc email, đăng xuất; Header hiển thị tài khoản đang đăng nhập.
- Xem và sửa hồ sơ, địa chỉ mặc định, đổi mật khẩu.
- Xem sản phẩm theo loại có phân trang; xem chi tiết sản phẩm.
- Tìm kiếm cơ bản theo tên và tìm nâng cao theo tên, loại, khoảng giá; kết quả có phân trang.
- Giỏ hàng yêu cầu đăng nhập: thêm, bớt, xóa sản phẩm và giới hạn số lượng theo tồn kho có thể bán.
- Thanh toán bằng địa chỉ trong hồ sơ hoặc địa chỉ mới; COD được chọn mặc định, có thêm chuyển khoản và thanh toán trực tuyến mô phỏng.
- Xem xác nhận đơn vừa đặt và lịch sử đơn hàng của tài khoản.

### Admin (`admin.html`)
- Đăng nhập riêng, phiên Admin tách khỏi phiên khách hàng.
- **Tổng quan:** thống kê khách hàng, sản phẩm, đơn hàng, doanh thu và cảnh báo.
- **Khách hàng:** danh sách, tìm kiếm, đặt lại mật khẩu, khóa/mở khóa.
- **Loại sản phẩm:** thêm, sửa, ẩn, xóa theo điều kiện nghiệp vụ.
- **Sản phẩm:** thêm, sửa, ẩn, xóa; lưu hình ảnh sản phẩm.
- **Nhập hàng:** tạo, tìm, sửa phiếu chưa hoàn thành và hoàn thành phiếu.
- **Giá bán:** thiết lập tỷ lệ lợi nhuận theo loại hoặc sản phẩm; tra cứu giá vốn và giá bán.
- **Đơn hàng:** tìm theo ngày/trạng thái, xem chi tiết và cập nhật trạng thái.
- **Tồn kho:** tra cứu tồn, cảnh báo sắp hết hàng và báo cáo nhập – xuất – tồn.

## Quy tắc nghiệp vụ chính

- **Giá bán** = `giá vốn × (1 + % lợi nhuận / 100)`. Giá vốn được tính từ phiếu nhập đã hoàn thành. Sản phẩm chưa có phiếu nhập hoàn thành chưa có giá và chưa thể mua.
- **Tồn kho** = tổng nhập – tổng xuất. Nhập phát sinh khi hoàn thành phiếu nhập; xuất phát sinh khi đơn chuyển sang trạng thái Đã giao. Số lượng trong đơn chưa giao được giữ chỗ.
- Đơn hàng lưu tên và giá tại thời điểm đặt; thay đổi giá sản phẩm không làm đổi đơn cũ.
- Đơn đã giao và đơn hủy là trạng thái cuối.

## Cấu trúc thư mục chính

```text
Coffee-Beans/
├── index.html                 # Trang chủ và khu vực sản phẩm
├── checkout.html              # Giỏ hàng, thanh toán, xác nhận đơn
├── account.html               # Đăng nhập, đăng ký, hồ sơ, lịch sử đơn
├── admin.html                 # Đăng nhập Admin và dashboard
├── 404.html                   # Trang lỗi cho GitHub Pages
├── .nojekyll                  # Cấu hình GitHub Pages
├── styles/
│   ├── base.css               # Nền tảng giao diện, nút, modal, thông báo
│   ├── shop.css               # Giao diện khách hàng
│   └── admin.css              # Giao diện quản trị
├── images/                    # Logo và ảnh sản phẩm
├── js/
│   ├── db.js                  # Lưu trữ localStorage và tiện ích
│   ├── catalog.js             # Danh mục, sản phẩm, giá, tìm kiếm
│   ├── inventory.js           # Phiếu nhập, tồn kho, nhập – xuất – tồn
│   ├── auth.js                # Tài khoản khách hàng và Admin
│   ├── shop.js                # Giỏ hàng và đơn hàng
│   ├── seed.js                # Khởi tạo và chuyển đổi dữ liệu demo
│   ├── ui.js                  # Cập nhật header/menu, thông báo, phân trang
│   ├── router.js              # Hash Router
│   ├── page-*.js              # Logic các màn hình khách hàng
│   └── admin-*.js             # Logic giao diện quản trị
└── docs/                      # Wireframe, tài liệu thiết kế và lưu trữ
```

Thứ tự nạp module nền tảng: `db → catalog → inventory → auth → shop → seed → ui`, sau đó mới nạp router và module giao diện của từng khu vực.

## Dữ liệu và chuyển đổi tài khoản cũ

Dữ liệu được lưu trong `localStorage` với các khóa bắt đầu bằng `cb_`. Dữ liệu trên `localhost`, GitHub Pages và các địa chỉ khác là những vùng lưu trữ riêng.

Khi mở phiên bản này, `seed.js` tự kiểm tra và chuyển đổi tài khoản từ cấu trúc cũ có `passwordHash`/`salt` sang trường `password`:

- Tài khoản đã có `password` dạng chữ được giữ nguyên.
- Tài khoản khách cũ `guest1`, `guest2`, `guest3` thiếu `password` được gán lần lượt `guest1123`, `guest2123`, `guest3123`.
- Tài khoản khách khác chỉ còn hash được gán mật khẩu tạm `123456`.
- Admin tên `admin` chỉ còn hash được gán `admin123`; Admin khác được gán `123456`.
- Bản ghi tài khoản vẫn được giữ; đơn hàng, giỏ hàng, sản phẩm, phiếu nhập và tồn kho không bị reset bởi thao tác chuyển đổi này.

Không thể khôi phục mật khẩu gốc từ hash cũ. Người dùng có mật khẩu đã chuyển đổi cần đăng nhập bằng mật khẩu demo/tạm nêu trên rồi đổi mật khẩu nếu cần.

Muốn chủ động tạo lại toàn bộ dữ liệu mẫu, mở Console (F12), chạy `CB.seed.reset()` rồi tải lại trang. Lệnh này xóa dữ liệu demo của website trên trình duyệt hiện tại trước khi tạo lại dữ liệu mẫu; chỉ sử dụng khi chấp nhận mất các thay đổi và đơn hàng đã tạo ở trình duyệt đó.

## Giới hạn

- Không có backend hoặc cơ sở dữ liệu máy chủ; dữ liệu không đồng bộ giữa các máy tính/người dùng.
- Mật khẩu lưu trực tiếp trong `localStorage` để phục vụ đồ án demo; không dùng mật khẩu cá nhân thật. Đây không phải cơ chế xác thực an toàn.
- Tài khoản Admin và mã JavaScript được tải xuống trình duyệt, do đó không có bảo vệ phía máy chủ.
- Chuyển khoản và thanh toán trực tuyến chỉ là mô phỏng, không phát sinh giao dịch thật.
- Ảnh Admin tải lên được lưu trong `localStorage`, dung lượng bị giới hạn bởi trình duyệt.
- Font và biểu tượng được tải từ Google Fonts và cdnjs, cần Internet để hiển thị đầy đủ.

## Thiết kế giao diện

Wireframe 20 màn hình (khách hàng, Admin, di động và sơ đồ điều hướng) nằm ở `docs/CoffeeBeans_Wireframe.drawio`, kèm PDF và PNG trong `docs/`. File `.drawio` có thể mở bằng diagrams.net. Wireframe được tạo bằng script Python theo định dạng diagrams.net; để có minh chứng thao tác trực tiếp với công cụ đồ họa, hãy mở file bằng diagrams.net và xuất bản PDF/PNG từ công cụ này.
