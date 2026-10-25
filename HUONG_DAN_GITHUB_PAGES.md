# Triển khai lên GitHub Pages

Thư mục dự án đã sẵn sàng để chạy như một website tĩnh: `index.html` nằm ở **thư mục gốc**, mọi liên kết, ảnh, CSS và JavaScript dùng đường dẫn **tương đối**, không có đường dẫn tuyệt đối hay tệp phụ thuộc vào Node/máy chủ. Đã kiểm tra tên tệp phân biệt hoa/thường (GitHub Pages chạy trên Linux) và đã chạy thử dưới đường dẫn con `/CoffeeBeans/`, giống dạng địa chỉ `https://<tài-khoản>.github.io/CoffeeBeans/`.

> Mình chưa push hay bật Pages thay bạn; các bước dưới đây bạn tự thực hiện từ tài khoản của mình, rồi kiểm tra theo danh sách ở cuối.

## 1. Cập nhật repository

Repo hiện có trỏ tới `https://github.com/khanh123bo123/CoffeeBeans.git`, nhánh `main`.

1. Giải nén file zip bàn giao và **chép đè** vào thư mục repo trên máy bạn (giữ nguyên thư mục `.git`). Các tệp cũ đã được thay hoặc chuyển vào `docs/archive/` và `tools/legacy/`.
2. Kiểm tra thay đổi:
   ```bash
   git status
   ```
   Nên thấy: các tệp `js/*`, `tests/*`, `docs/*`, `tools/*`, `404.html`, `.nojekyll`, `.gitignore`, `README.md`... mới hoặc sửa; các tệp tài liệu cũ ở thư mục gốc bị "xóa" (đã chuyển sang `docs/archive/`).
3. Đưa lên GitHub:
   ```bash
   git add -A
   git commit -m "Hoàn thiện website: dữ liệu localStorage, khách hàng, admin, tài liệu"
   git push origin main
   ```

## 2. Bật GitHub Pages

1. Trên GitHub, mở repo → **Settings** → **Pages**.
2. Mục **Build and deployment** → **Source**: chọn **Deploy from a branch**.
3. **Branch**: chọn `main`, thư mục `/ (root)` → **Save**.
4. Đợi khoảng 1-2 phút. Địa chỉ website hiện ở đầu trang Pages, dự kiến có dạng `https://khanh123bo123.github.io/CoffeeBeans/` (hãy dùng đúng địa chỉ GitHub hiển thị).

Lưu ý: repo riêng tư (private) chỉ dùng được Pages với một số gói GitHub trả phí; nếu không thấy mục Pages, hãy đặt repo ở chế độ Public.

## 3. Kiểm tra sau khi triển khai

Mở địa chỉ Pages (nên dùng cửa sổ ẩn danh để có dữ liệu mẫu sạch), rồi kiểm tra:

- [ ] Trang chủ hiện đủ ảnh slider, logo, ảnh 3 danh mục; slider tự chuyển slide.
- [ ] `products.html`: 9 sản phẩm ở trang 1, 3 ở trang 2; tìm nâng cao hoạt động.
- [ ] Đăng nhập `guest1 / guest1123`; thêm sản phẩm vào giỏ, thanh toán bằng địa chỉ tài khoản, xem xác nhận và lịch sử đơn.
- [ ] Hồ sơ cá nhân: sửa thông tin, đổi mật khẩu rồi đăng nhập lại bằng mật khẩu mới.
- [ ] `admin-login.html`: đăng nhập `admin / admin123`; đơn vừa đặt xuất hiện ở **Đơn hàng**; chuyển trạng thái thành **Đã giao** và kiểm tra tồn kho giảm.
- [ ] Mở Console (F12): không có dòng lỗi màu đỏ; tab Network không có tài nguyên 404.
- [ ] Mở thử trên điện thoại: menu "Menu", giỏ hàng và thanh toán hiển thị gọn.
- [ ] Gõ một đường dẫn sai (ví dụ `/khong-ton-tai`): hiện trang 404 của website.

## 4. Lưu ý khi chạy trên Pages

- Dữ liệu lưu trong `localStorage` **của từng trình duyệt và từng địa chỉ website**: dữ liệu trên `github.io` tách riêng với dữ liệu trên `localhost`, và người dùng khác không thấy đơn hàng của bạn.
- Các project Pages cùng tài khoản dùng chung tên miền `<tài-khoản>.github.io`, nhưng khóa dữ liệu của website này đều bắt đầu bằng `cb_` nên không lẫn với dự án khác.
- Muốn về lại dữ liệu mẫu: Console → `CB.seed.reset()` rồi tải lại trang.
- Nếu đã mở bản cũ trên cùng địa chỉ trước đây và thấy dữ liệu lạ, hãy xóa dữ liệu trang (Application → Local Storage → Clear) hoặc mở cửa sổ ẩn danh.
- Sau khi push, nếu trang chưa đổi, đợi vài phút rồi tải cứng (Ctrl+F5); GitHub Pages có bộ nhớ đệm.
- Font chữ và biểu tượng nạp từ Google Fonts và cdnjs, nên cần có Internet.

## 5. Nếu gặp lỗi

| Hiện tượng | Cách xử lý |
|---|---|
| Trang 404 ngay cả với `index.html` | Kiểm tra Pages đang trỏ đúng nhánh `main` và `/ (root)`; đợi workflow "pages build and deployment" ở tab Actions chạy xong. |
| Mất ảnh hoặc CSS | Mở Network xem tệp nào 404; GitHub Pages phân biệt hoa/thường nên tên tệp phải khớp từng ký tự. |
| Đăng nhập xong không giữ phiên | Trình duyệt đang chặn `localStorage` (chế độ riêng tư nghiêm ngặt); thử cửa sổ thường. |
| Dữ liệu cũ lạ | Xóa dữ liệu trang hoặc `CB.seed.reset()`. |
