# Triển khai Coffee Beans lên GitHub Pages

Dự án là website tĩnh HTML/CSS/JavaScript. Trang vào mặc định `index.html` nằm ở thư mục gốc; các liên kết, ảnh, CSS và JavaScript trong website sử dụng đường dẫn tương đối để hoạt động trong repository GitHub Pages dạng Project site.

Repository hiện tại:

```text
https://github.com/MyNameIsJester/Coffee-Beans
```

Website:

```text
https://mynameisjester.github.io/Coffee-Beans/
```

Với Project site này, đường dẫn gốc khi được triển khai là `/Coffee-Beans/` (có dấu gạch nối). Không dùng `/CoffeeBeans/`.

## 1. Cập nhật repository

1. Mở thư mục dự án `Coffee-Beans` trên máy tính.
2. Nếu bạn tải ZIP để chép vào repository hiện có, hãy chép các file dự án vào thư mục repository và **giữ nguyên thư mục `.git`** trên máy.
3. Kiểm tra thay đổi:

   ```bash
   git status
   ```

4. Đưa thay đổi lên GitHub:

   ```bash
   git add -A
   git commit -m "Update Coffee Beans website"
   git push origin main
   ```

## 2. Cấu hình GitHub Pages

1. Trên GitHub, mở repository `MyNameIsJester/Coffee-Beans`.
2. Chọn **Settings → Pages**.
3. Trong **Build and deployment**, chọn **Deploy from a branch**.
4. Chọn branch `main`, thư mục `/(root)`, sau đó nhấn **Save**.
5. Đợi GitHub Pages triển khai xong. Mở URL được hiển thị ở phần Pages; URL dự kiến là `https://mynameisjester.github.io/Coffee-Beans/`.

## 3. Cấu trúc và điều hướng website

Bốn trang HTML chính:

- `index.html`: trang chủ, danh sách sản phẩm, chi tiết sản phẩm và hướng dẫn.
- `checkout.html`: giỏ hàng, thanh toán và xác nhận đơn.
- `account.html`: đăng nhập/đăng ký, hồ sơ và lịch sử đơn hàng.
- `admin.html`: đăng nhập Admin và dashboard quản trị.

Các màn hình bên trong từng trang dùng URL Hash, ví dụ:

```text
/Coffee-Beans/index.html#/home
/Coffee-Beans/index.html#/products
/Coffee-Beans/checkout.html#/cart
/Coffee-Beans/checkout.html#/checkout
/Coffee-Beans/account.html#/auth
/Coffee-Beans/account.html#/orders
/Coffee-Beans/admin.html#orders
```

Không xóa dấu gạch nối trong `Coffee-Beans`. GitHub Pages phân biệt chữ hoa/thường và tên đường dẫn.

## 4. Kiểm tra sau khi triển khai

- Mở `https://mynameisjester.github.io/Coffee-Beans/` bằng Chrome.
- Kiểm tra logo, ảnh banner và ba danh mục sản phẩm.
- Mở danh sách sản phẩm, tìm kiếm, lọc và xem chi tiết.
- Đăng nhập bằng `guest1 / guest1123`, thêm sản phẩm vào giỏ và thử đặt hàng.
- Mở `admin.html`, đăng nhập `admin / admin123`; kiểm tra đơn vừa đặt và các chức năng quản trị.
- Mở DevTools (F12), kiểm tra Console và Network để phát hiện lỗi JavaScript hoặc tài nguyên 404.
- Thử mở trực tiếp các URL hash được liệt kê ở trên và tải lại trang để kiểm tra router.

## 5. Dữ liệu trình duyệt

- Dữ liệu `localStorage` trên GitHub Pages tách biệt với `localhost` và các địa chỉ khác.
- Dữ liệu demo được lưu riêng trong trình duyệt của mỗi người dùng; Admin trên máy này không tự động thấy dữ liệu trong trình duyệt/máy khác.
- Muốn tạo lại dữ liệu mẫu trên trình duyệt hiện tại, mở Console và chạy `CB.seed.reset()`. Lệnh này xóa dữ liệu demo hiện có của website trên trình duyệt đó trước khi khởi tạo lại; chỉ chạy khi đã chấp nhận mất các thay đổi hiện tại.
- Sau khi Push, nếu website chưa cập nhật, tải cứng bằng `Ctrl + F5` sau khi GitHub Pages triển khai xong.
- Google Fonts và Font Awesome lấy từ CDN nên cần Internet để tải font và biểu tượng.

## 6. Lưu ý về chạy local

Để các trang HTML chia sẻ `localStorage` ổn định khi kiểm tra luồng nhiều trang, nên chạy máy chủ tĩnh:

```bash
python -m http.server 8000
```

Sau đó mở `http://localhost:8000/`. Khi mở trực tiếp các file bằng `file:///`, hành vi lưu trữ giữa các file phụ thuộc trình duyệt và không được bảo đảm giống HTTP.
