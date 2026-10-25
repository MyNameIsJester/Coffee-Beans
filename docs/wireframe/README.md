# Wireframe Cà Phê Đậm Đà

| Tệp | Nội dung |
|---|---|
| `../CoffeeBeans_Wireframe.drawio` | **File nguồn chỉnh sửa được**, mở bằng diagrams.net (app.diagrams.net hoặc ứng dụng desktop). 20 trang (tab). |
| `../CoffeeBeans_Wireframe.pdf` | Bản PDF 20 trang, có mục lục (bookmark) theo từng trang. |
| `png/` | Mỗi trang một ảnh PNG (độ phân giải 1,5×). |
| `src/` | Script sinh file `.drawio` và xuất PNG/PDF (để tái tạo khi cần). |

## Các trang trong file `.drawio`

| Tab | Giao diện |
|---|---|
| 00 | Sơ đồ điều hướng khách hàng và admin |
| 01 | Trang chủ |
| 02 | Danh sách sản phẩm (tìm nâng cao, phân trang) |
| 03 | Chi tiết sản phẩm |
| 04 | Giỏ hàng |
| 05 | Thanh toán |
| 06 | Xác nhận đơn hàng |
| 07 | Lịch sử đơn hàng |
| 08 | Đăng nhập / Đăng ký |
| 09 | Hồ sơ cá nhân (sửa thông tin, đổi mật khẩu) |
| 10 | Giao diện di động (menu, danh sách, giỏ hàng) |
| 11 | Admin: đăng nhập |
| 12 | Admin: tổng quan |
| 13 | Admin: khách hàng |
| 14 | Admin: loại sản phẩm |
| 15 | Admin: sản phẩm |
| 16 | Admin: nhập hàng |
| 17 | Admin: giá bán |
| 18 | Admin: đơn hàng |
| 19 | Admin: tồn kho |

Ô vàng bên phải mỗi trang là **ghi chú hành vi** (không thuộc giao diện): liên kết, điều kiện đăng nhập, quy tắc kiểm tra dữ liệu.

## Lưu ý trung thực về công cụ

- Wireframe được **sinh bằng script Python** theo cấu trúc file diagrams.net (XML `mxfile`), bám theo giao diện thực tế của website. Mình chưa mở file trong diagrams.net để xác nhận hiển thị; file đã được kiểm tra là XML hợp lệ, mọi mũi tên nối đúng hình.
- Bản PNG/PDF do **bộ render đơn giản của dự án** (Chromium) xuất từ chính file `.drawio`, **không phải bản xuất của diagrams.net**, nên có thể lệch nhẹ về font và khoảng cách. Khi nộp, nên mở file `.drawio` trong diagrams.net, tinh chỉnh rồi dùng *File → Export as → PDF/PNG* để có bản chuẩn.
- Website **không** được thiết kế bằng Figma; công cụ thiết kế layout ở đây là diagrams.net.

## Tạo lại tài liệu

```bash
pip install playwright pypdf && python -m playwright install chromium
python docs/wireframe/src/build_wireframe.py     # ghi docs/CoffeeBeans_Wireframe.drawio
python docs/wireframe/src/render_wireframe.py    # xuất PNG và PDF từ file .drawio
```

Chỉnh sửa trực tiếp trong diagrams.net sẽ không được script giữ lại: nếu chạy lại `build_wireframe.py` file `.drawio` sẽ bị ghi đè.
