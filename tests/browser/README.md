# Kiểm thử trên trình duyệt thật (Chromium qua Playwright)

Các script chạy website bằng máy chủ cục bộ rồi điều khiển Chromium thật.

```
pip install playwright && python -m playwright install chromium
npm install @fortawesome/fontawesome-free@6.4.0        # để biểu tượng hiển thị khi chạy không có mạng
cd <thư mục CoffeeBeans> && python -m http.server 8765 --bind 127.0.0.1 &
python tests/browser/cross_flow.py       # luồng khách hàng + tác động của admin lên khách hàng
python tests/browser/admin_flow.py       # toàn bộ chức năng admin
python tests/browser/password_flow.py    # đổi mật khẩu khách hàng
python tests/browser/hero_flow.py        # slider trang chủ (không còn dải xám)
python tests/browser/responsive.py       # bố cục ở 390 / 768 / 1366 px (khách hàng và admin)
python tests/browser/hero_diag.py        # in số đo các lớp hero (dùng để chẩn đoán)
```

`subpath_flow.py` kiểm tra website chạy dưới đường dẫn con `/CoffeeBeans/` như GitHub Pages dạng project; cần phục vụ **thư mục cha** của dự án ở cổng 8766:

```
cd <thư mục cha của CoffeeBeans> && python -m http.server 8766 --bind 127.0.0.1 &
python CoffeeBeans/tests/browser/subpath_flow.py
```

Trong `common.py`, `FA` trỏ tới thư mục Font Awesome đã cài và `SHOTS` là nơi lưu ảnh chụp; sửa cho phù hợp máy của bạn.
`admin_flow.py` tự tạo hai tệp mẫu `/tmp/test_img.png` và `/tmp/not_image.txt`.
Các bài này chỉ chạy trên Chromium; chưa kiểm tra trên Firefox, Safari hay thiết bị di động thật.
