from wf_lib import *

NX = 1230  # cột ghi chú bên phải khung 1200px


def new(name, h, w=1500):
    p = Page(name, w, h)
    p.fw = 1200
    p.rect(0, 0, 1200, h, '', fill='#FFFFFF', stroke='#BDBDBD')  # khung trang
    return p


def sitemap():
    p = Page('00 Sơ đồ điều hướng', 1480, 960)
    p.text(30, 14, 900, 36, 'Sơ đồ điều hướng website Cà Phê Đậm Đà', size=20, bold=True)
    p.text(30, 48, 1000, 24, 'Mũi tên liền: liên kết trực tiếp. Chữ nhỏ cho biết điều kiện hoặc hành động kích hoạt.', size=11, color='#666666')

    def node(x, y, title, file, admin=False):
        return p.rect(x, y, 230, 58, title + '\n' + file, fill=('#E8F0FE' if admin else '#FFF8F0'), stroke=(BROWN if not admin else '#3B6EC8'), size=11, bold=False, rounded=10, sw=2)

    p.text(40, 88, 300, 24, 'KHÁCH HÀNG', size=12, bold=True, color=BROWN)
    home = node(480, 120, 'Trang chủ', 'index.html')
    reg = node(60, 250, 'Đăng nhập / Đăng ký', 'register.html')
    prod = node(480, 250, 'Danh sách sản phẩm', 'products.html')
    prof = node(880, 250, 'Hồ sơ cá nhân', 'profile.html')
    det = node(820, 390, 'Chi tiết sản phẩm', 'product-detail.html')
    cart = node(480, 530, 'Giỏ hàng', 'cart.html')
    chk = node(480, 670, 'Thanh toán', 'checkout.html')
    cf = node(480, 810, 'Xác nhận đơn hàng', 'order-confirmation.html')
    hist = node(880, 810, 'Lịch sử đơn hàng', 'order-history.html')
    p.link(home, prod, 'Menu Sản phẩm / ô tìm kiếm')
    p.link(home, reg, 'Đăng nhập / Đăng ký')
    p.link(home, prof, 'Menu tài khoản')
    p.link(prod, det, 'Bấm sản phẩm')
    p.link(prod, cart, 'Thêm vào giỏ (cần đăng nhập)')
    p.link(det, cart, 'Thêm vào giỏ (cần đăng nhập)')
    p.link(cart, chk, 'Thanh toán')
    p.link(chk, cf, 'Đặt hàng')
    p.link(cf, hist, 'Lịch sử đơn hàng')

    p.text(1170, 88, 300, 24, 'ADMIN', size=12, bold=True, color='#3B6EC8')
    portal = node(1190, 120, 'Cổng chọn vai trò', 'portal.html', True)
    alog = node(1190, 230, 'Đăng nhập admin', 'admin-login.html', True)
    dash = node(1190, 340, 'Bảng quản trị', 'admin-dashboard.html', True)
    p.link(portal, alog, 'Vào trang quản trị')
    p.link(alog, dash, 'admin / admin123')
    mods = ['Tổng quan', 'Khách hàng', 'Loại sản phẩm', 'Sản phẩm', 'Nhập hàng', 'Giá bán', 'Đơn hàng', 'Tồn kho']
    box = p.rect(1150, 450, 320, 270, '', fill='#F5F8FF', stroke='#3B6EC8', dashed=True)
    p.text(1160, 456, 300, 22, 'Menu 8 chức năng quản trị', size=11, bold=True, color='#3B6EC8')
    for i, m in enumerate(mods):
        p.rect(1162 + (i % 2) * 152, 490 + (i // 2) * 56, 140, 42, m, fill='#FFFFFF', stroke='#3B6EC8', size=11, rounded=8)
    p.link(dash, box, 'Chọn chức năng ở sidebar')
    p.note(40, 130, 330, 82, 'Giỏ hàng, thanh toán, hồ sơ và lịch sử đơn chỉ dùng được khi đã đăng nhập.\nChưa đăng nhập: tự chuyển sang register.html; đăng nhập xong quay lại trang đang xem.')
    p.note(1170, 760, 290, 96, 'Phiên khách hàng và phiên admin tách biệt nhưng dùng chung một bộ dữ liệu (localStorage).\nindex2.html và arabica.html chỉ là trang chuyển hướng cho liên kết cũ.')
    return p


def home():
    p = new('01 Trang chủ', 1440)
    site_header(p)
    p.img(24, 76, 1152, 380, '')
    p.text(300, 170, 600, 50, 'Cà Phê Đậm Đà', size=32, bold=True, align='center')
    p.text(300, 224, 600, 30, 'Hương vị đặc trưng từ những hạt cà phê thương hạng', size=14, align='center')
    p.button(500, 280, 200, 44, 'KHÁM PHÁ SẢN PHẨM', primary=True)
    for i in range(5):
        p.rect(560 + i * 20, 424, 10, 10, '', fill=('#333333' if i == 0 else '#FFFFFF'), stroke='#666666', rounded=50)
    p.text(24, 480, 600, 34, 'Danh mục sản phẩm', size=20, bold=True)
    for i, (n, pr, c) in enumerate([('Arabica Premium 250g', '135.000đ', 'Arabica'), ('Robusta Bold 500g', '129.000đ', 'Robusta'), ('Signature Blend 1kg', '265.000đ', 'Blend')]):
        product_card(p, 24 + i * 392, 530, 368, n, pr, c, 'Thêm')
    p.text(24, 810, 600, 34, 'Về chúng tôi', size=20, bold=True)
    p.rect(24, 856, 560, 220, 'Đoạn giới thiệu cửa hàng\n(tiêu đề, mô tả, câu chuyện thương hiệu)', fill='#FFFFFF', stroke='#CFCFCF', color='#808080')
    p.img(616, 856, 560, 220, 'Ảnh cửa hàng')
    p.text(24, 1100, 600, 34, 'Lợi ích', size=20, bold=True)
    for i, t in enumerate(['Rang xay tươi mới', 'Nguồn gốc rõ ràng', 'Giao hàng nhanh']):
        p.rect(24 + i * 392, 1146, 368, 110, '', fill='#FFFFFF', stroke='#CFCFCF', rounded=4)
        p.rect(44 + i * 392, 1166, 46, 46, '', fill=GREY, stroke='#B3B3B3', rounded=50)
        p.text(104 + i * 392, 1166, 250, 26, t, bold=True)
        p.text(104 + i * 392, 1194, 250, 50, 'Mô tả ngắn về lợi ích', size=11, color='#666666', valign='top')
    site_footer(p, 1330)
    p.note(NX, 76, 250, 120, '① Header dùng chung (js/ui.js): logo, ô tìm kiếm, menu loại, tài khoản, giỏ hàng.\nChưa đăng nhập hiện "Đăng nhập / Đăng ký".')
    p.note(NX, 210, 250, 90, '② Slider tự chuyển slide mỗi 4 giây; bấm chấm để chọn slide; nút dẫn tới products.html.')
    p.note(NX, 314, 250, 120, '③ Mỗi loại sản phẩm hiển thị 1 sản phẩm đại diện lấy từ dữ liệu. Ảnh dẫn tới danh sách của loại; nút "Thêm" cần đăng nhập.')
    p.note(NX, 448, 250, 70, '④ "Giới thiệu", "Lợi ích", "Liên hệ" cuộn tới phần tương ứng.')
    return p


def products():
    p = new('02 Danh sách sản phẩm', 1180)
    site_header(p, 'Khách hàng 1', 2)
    p.text(24, 70, 700, 40, '📦  Cà Phê Chất Lượng Cao', size=24, bold=True)
    p.text(24, 108, 800, 24, 'Khám phá bộ sưu tập cà phê rang xay tươi mới từ các vùng trồng tốt nhất', size=12, color='#808080')
    p.rect(24, 142, 1152, 220, '', fill='#FFFFFF', stroke='#B3B3B3', rounded=2)
    p.input(48, 158, 1104, 40, '🔍 Tìm theo tên sản phẩm')
    for x, lab in ((48, 'PHÂN LOẠI'), (420, 'KHOẢNG GIÁ (ĐỒNG)'), (792, 'SẮP XẾP')):
        p.text(x, 210, 300, 20, lab, size=10, bold=True)
    p.select(48, 232, 350, 36, 'Tất cả')
    p.input(420, 232, 170, 36, 'Từ'); p.input(600, 232, 170, 36, 'Đến')
    p.select(792, 232, 360, 36, 'Mặc định')
    p.text(48, 272, 600, 18, 'Giá từ không được lớn hơn giá đến (hiện lỗi đỏ nếu sai)', size=10, color='#C62828')
    p.button(48, 304, 540, 40, '✓ TÌM KIẾM', primary=True); p.button(612, 304, 540, 40, 'XÓA BỘ LỌC')
    p.text(24, 372, 400, 24, 'Hiển thị 12 sản phẩm', size=12, color='#666666')
    names = [('Arabica Premium 250g', '135.000đ', 'Arabica'), ('Robusta Bold 500g', '129.000đ', 'Robusta'), ('Signature Blend 1kg', '265.000đ', 'Blend'),
             ('Ethiopia Yirgacheffe 300g', '145.000đ', 'Arabica'), ('Colombian Supremo 400g', '155.000đ', 'Arabica'), ('Brazilian Arabica 500g', '138.000đ', 'Arabica')]
    for i, (n, pr, c) in enumerate(names):
        product_card(p, 24 + (i % 3) * 392, 404 + (i // 3) * 270, 368, n, pr, c)
    p.text(24, 944, 1152, 20, '… (trang 1 có 9 sản phẩm, xếp 3 cột × 3 hàng)', size=11, color='#808080', align='center')
    for i, t in enumerate(['← Trước', '1', '2', 'Sau →']):
        p.rect(470 + i * 70, 976, 60, 34, t, fill=(BROWN if t == '1' else '#FFFFFF'), stroke='#B3B3B3', color=('#FFFFFF' if t == '1' else INK), size=11, rounded=6)
    site_footer(p, 1060)
    p.note(NX, 142, 250, 150, '① Tìm cơ bản: ô tìm trên header gửi ?q= sang trang này.\nTìm nâng cao: kết hợp tên + loại + khoảng giá + sắp xếp trong một lần tìm. Trạng thái lọc nằm trên URL.')
    p.note(NX, 306, 250, 90, '② Menu Sản phẩm → loại mở trang này với ?cat=arabica | robusta | blend.')
    p.note(NX, 410, 250, 130, '③ Thẻ sản phẩm: ảnh/tên dẫn tới chi tiết. Nút "Thêm vào giỏ" cần đăng nhập; hiện "Sắp hết hàng: còn N" hoặc "Hết hàng" (nút bị khóa).')
    p.note(NX, 554, 250, 90, '④ Phân trang 9 sản phẩm/trang; kết quả tìm kiếm cũng phân trang. Không có kết quả: hiện thông báo và nút "Xóa bộ lọc".')
    return p


def detail():
    p = new('03 Chi tiết sản phẩm', 1150)
    site_header(p, 'Khách hàng 1', 2)
    p.text(24, 70, 800, 24, 'Trang chủ  ›  Sản phẩm  ›  Arabica  ›  Ethiopia Yirgacheffe 300g', size=11, color='#666666')
    p.img(24, 110, 560, 460, 'Ảnh sản phẩm')
    p.chip(620, 112, 90, 'Arabica')
    p.text(620, 140, 556, 40, 'Ethiopia Yirgacheffe 300g', size=24, bold=True)
    p.text(620, 182, 300, 36, '145.000đ', size=22, bold=True, color=BROWN)
    p.text(620, 220, 400, 24, '✔ Còn hàng (59 sản phẩm)', size=12, bold=True, color='#2E7D32')
    p.text(620, 252, 556, 56, 'Mô tả sản phẩm: Arabica vùng Yirgacheffe nổi tiếng với hương hoa và trái cây, vị chua thanh sáng.', size=12, color='#555555', valign='top')
    p.table(620, 316, [180, 376], [['Mã sản phẩm', 'CF004'], ['Loại cà phê', 'Arabica'], ['Khối lượng', '300g'], ['Mức độ rang', 'Rang nhạt'], ['Xuất xứ', 'Yirgacheffe, Ethiopia']], header=False, rowh=30)
    p.rect(620, 476, 556, 92, '', fill='#FFFAF5', stroke='#E8D5C4', rounded=2)
    p.text(634, 482, 300, 22, 'Đặc điểm nổi bật', bold=True)
    p.text(634, 506, 520, 60, '✓ Hương hoa nhài, chanh\n✓ Vị chua sáng, thanh', size=11, valign='top')
    p.rect(620, 590, 40, 40, '−', fill=LGREY, stroke='#B3B3B3', size=16, rounded=4)
    p.rect(662, 590, 60, 40, '1', fill='#FFFFFF', stroke='#B3B3B3', size=14)
    p.rect(724, 590, 40, 40, '+', fill=LGREY, stroke='#B3B3B3', size=16, rounded=4)
    p.button(790, 590, 386, 40, '🛒  Thêm vào giỏ', primary=True, size=13)
    p.text(24, 660, 500, 34, 'Sản phẩm liên quan', size=20, bold=True)
    for i, (n, pr, c) in enumerate([('Arabica Premium 250g', '135.000đ', 'Arabica'), ('Colombian Supremo 400g', '155.000đ', 'Arabica'), ('Brazilian Arabica 500g', '138.000đ', 'Arabica')]):
        product_card(p, 24 + i * 392, 706, 368, n, pr, c, 'Xem chi tiết')
    site_footer(p, 1000)
    p.note(NX, 110, 250, 120, '① Trang động: product-detail.html?id=<mã định danh>. Id sai hoặc sản phẩm đã ẩn: hiện "Không tìm thấy sản phẩm".')
    p.note(NX, 244, 250, 110, '② Giá và số lượng còn bán lấy từ dữ liệu (giá vốn × (1 + % lợi nhuận); tồn kho trừ hàng đang giữ cho đơn chưa giao).')
    p.note(NX, 368, 250, 130, '③ Số lượng giới hạn 1…tồn khả dụng; thêm vượt tồn bị từ chối kèm thông báo "Chỉ còn N". Chưa đăng nhập: chuyển sang đăng nhập.')
    return p


def cart():
    p = new('04 Giỏ hàng', 780)
    site_header(p, 'Khách hàng 1', 4)
    p.text(24, 70, 500, 40, 'Giỏ hàng của bạn', size=24, bold=True)
    p.rect(24, 124, 700, 340, '', fill='#FFFFFF', stroke='#CFCFCF', rounded=2)
    cols = [236, 150, 110, 110, 70]
    y = p.table(36, 136, cols, [['Sản phẩm', 'Số lượng', 'Giá', 'Thành tiền', ''],
                                ['', '', '135.000đ', '270.000đ', '✕'], ['', '', '165.000đ', '165.000đ', '✕']], rowh=80, aligns=['left', 'center', 'right', 'right', 'center'])
    for i, nm in enumerate(['Arabica Premium 250g', 'Kenyan AA Grade 350g']):
        p.img(44, 226 + i * 80 - 50 + 50, 52, 52, 'Ảnh')
        p.text(104, 232 + i * 80, 180, 36, nm + '\nLoại: Arabica', size=11, valign='middle')
        p.rect(282, 240 + i * 80, 30, 30, '−', fill=LGREY, stroke='#B3B3B3', rounded=4); p.rect(318, 240 + i * 80, 56, 30, str(2 - i), fill='#FFFFFF', stroke='#B3B3B3')
        p.rect(380, 240 + i * 80, 30, 30, '+', fill=LGREY, stroke='#B3B3B3', rounded=4)
    p.text(36, 430, 300, 24, 'Xóa toàn bộ giỏ hàng', size=11, color='#808080')
    p.rect(750, 124, 426, 280, '', fill='#FFFFFF', stroke='#CFCFCF', rounded=2)
    p.text(770, 136, 380, 30, 'Tổng kết', size=16, bold=True)
    for i, (a, b) in enumerate([('Tạm tính', '435.000đ'), ('Phí vận chuyển', '30.000đ')]):
        p.text(770, 180 + i * 34, 200, 26, a, color='#666666'); p.text(980, 180 + i * 34, 170, 26, b, bold=True, align='right')
    p.line(770, 254, 1156, 254)
    p.text(770, 262, 200, 30, 'Tổng tiền', bold=True, size=14); p.text(960, 262, 190, 30, '465.000đ', bold=True, size=16, align='right', color=BROWN)
    p.button(770, 320, 180, 44, 'Tiếp tục mua'); p.button(966, 320, 190, 44, 'Thanh toán', primary=True)
    p.rect(24, 490, 1152, 90, 'Giỏ hàng đang trống.   ← Tiếp tục mua sắm', fill='#FFFFFF', stroke='#B3B3B3', color='#808080', dashed=True)
    p.text(24, 586, 700, 20, 'Trạng thái giỏ trống (khi chưa có sản phẩm)', size=10, color='#808080')
    site_footer(p, 640)
    p.note(NX, 124, 250, 120, '① Chỉ dùng được khi đã đăng nhập (chưa đăng nhập tự chuyển sang trang đăng nhập). Giỏ lưu riêng theo từng tài khoản.')
    p.note(NX, 258, 250, 120, '② Đổi số lượng bằng −/+ hoặc nhập số (nguyên ≥ 1, không vượt tồn). Dòng có sản phẩm hết hàng/ngừng bán hiện cảnh báo và khóa nút Thanh toán.')
    p.note(NX, 392, 250, 90, '③ Màn hình hẹp (<640px): mỗi sản phẩm thành một khối dọc, tổng kết nằm dưới.')
    return p


def checkout():
    p = new('05 Thanh toán', 1090)
    site_header(p, 'Khách hàng 1', 4)
    p.text(24, 70, 600, 40, '🛍  Thanh toán đơn hàng', size=22, bold=True)
    p.rect(24, 120, 740, 940, '', fill='#FFFFFF', stroke='#CFCFCF', rounded=2)
    p.text(44, 130, 400, 28, 'Thông tin khách hàng', size=14, bold=True)
    for i, (lab, v) in enumerate([('Họ và tên', 'Khách hàng 1'), ('Số điện thoại', '0901000001'), ('Email', 'guest1@example.com')]):
        p.text(44, 164 + i * 56, 300, 18, lab, size=10, color='#666666'); p.rect(44, 182 + i * 56, 700, 30, v, fill=LGREY, stroke='#E0E0E0', align='left', rounded=4, color='#555555')
    p.text(44, 340, 400, 28, 'Địa chỉ nhận hàng', size=14, bold=True)
    p.text(44, 374, 400, 24, '◉  Dùng địa chỉ trong tài khoản')
    p.rect(70, 402, 674, 62, 'Khách hàng 1\n📞 0901000001   📍 12 Nguyễn Huệ, P. Bến Nghé, Quận 1, TP. Hồ Chí Minh', fill='#F7FAFC', stroke='#E2E8F0', align='left', size=11)
    p.text(44, 478, 400, 24, '○  Dùng địa chỉ giao hàng khác')
    fields = [('Tên người nhận *', 'Họ và tên người nhận'), ('Số điện thoại *', 'Ví dụ: 0901234567'), ('Tỉnh / Thành phố *', 'Chọn hoặc nhập'), ('Quận / Huyện *', 'Ví dụ: Quận 1'),
              ('Phường / Xã *', 'Ví dụ: Phường Bến Nghé'), ('Số nhà, tên đường *', 'Ví dụ: 12 Nguyễn Huệ')]
    for i, (lab, ph) in enumerate(fields):
        fx = 70 + (i % 2) * 340; fy = 510 + (i // 2) * 62
        p.text(fx, fy, 320, 18, lab, size=10, color='#666666'); p.input(fx, fy + 18, 320, 32, ph)
    p.text(44, 710, 400, 28, 'Phương thức thanh toán', size=14, bold=True)
    for i, (t, d, on) in enumerate([('◉  Thanh toán tiền mặt khi nhận hàng (COD)', 'Mặc định', True), ('○  Chuyển khoản ngân hàng', 'Thông tin chuyển khoản hiện sau khi đặt hàng', False), ('○  Thanh toán trực tuyến (mô phỏng)', 'Chức năng minh họa, không có giao dịch thật', False)]):
        p.rect(44, 746 + i * 64, 700, 54, t + '\n' + d, fill=('#FFFAF5' if on else '#FFFFFF'), stroke=(BROWN if on else '#CFCFCF'), align='left', size=11, rounded=6)
    p.text(44, 944, 300, 18, 'Ghi chú đơn hàng', size=10, color='#666666'); p.textarea(44, 962, 700, 80, 'Ghi chú về đơn hàng, thời gian nhận hàng...')
    p.rect(790, 120, 386, 330, '', fill='#FFFFFF', stroke='#CFCFCF', rounded=2)
    p.text(810, 130, 340, 28, 'Đơn hàng của bạn', size=14, bold=True)
    p.rect(810, 168, 346, 186, '', fill='#F7FAFC', stroke='#E8E8E8')
    p.text(822, 176, 200, 22, 'Arabica Premium 250g × 2', size=11); p.text(1010, 176, 134, 22, '270.000đ', size=11, align='right')
    p.text(822, 200, 200, 22, 'Kenyan AA Grade 350g × 1', size=11); p.text(1010, 200, 134, 22, '165.000đ', size=11, align='right')
    p.line(822, 230, 1144, 230)
    p.text(822, 236, 200, 22, 'Tạm tính', size=11); p.text(1010, 236, 134, 22, '435.000đ', size=11, align='right')
    p.text(822, 260, 200, 22, 'Phí vận chuyển', size=11); p.text(1010, 260, 134, 22, '30.000đ', size=11, align='right')
    p.line(822, 290, 1144, 290)
    p.text(822, 300, 200, 30, 'Tổng cộng', bold=True, size=14); p.text(1000, 300, 144, 30, '465.000đ', bold=True, size=15, align='right', color=BROWN)
    p.button(810, 372, 346, 44, 'Đặt hàng', primary=True, size=14)
    p.text(810, 420, 346, 20, '← Quay lại giỏ hàng', size=11, align='center', color='#666666')
    p.note(NX, 120, 250, 130, '① Địa chỉ: chọn địa chỉ trong tài khoản (khóa nếu tài khoản chưa có địa chỉ đầy đủ) hoặc nhập địa chỉ khác; ô địa chỉ mới chỉ hiện khi chọn "địa chỉ khác".')
    p.note(NX, 264, 250, 110, '② Mặc định chọn tiền mặt. Chuyển khoản và trực tuyến chỉ là minh họa, không có giao dịch thật.')
    p.note(NX, 388, 250, 130, '③ Đặt hàng: kiểm tra từng ô, báo lỗi dưới ô sai; kiểm tra lại tồn kho; bấm nhiều lần chỉ tạo một đơn; thành công thì xóa giỏ và sang trang xác nhận.')
    return p


def confirm():
    p = new('06 Xác nhận đơn hàng', 1180)
    site_header(p, 'Khách hàng 1')
    p.text(0, 76, 1200, 60, '✓', size=40, bold=True, align='center', color='#4CAF50')
    p.text(0, 136, 1200, 36, 'Đặt hàng thành công!', size=24, bold=True, align='center')
    p.text(0, 172, 1200, 24, 'Cảm ơn bạn đã mua hàng tại Cà Phê Đậm Đà', size=12, align='center', color='#666666')
    p.rect(300, 212, 600, 62, 'MÃ ĐƠN HÀNG\nDH20261018-0006', fill='#F5F9FC', stroke='#E0E6EB', size=14, bold=True)
    secs = [('Thông tin khách hàng', 'Họ và tên · Số điện thoại · Email · Ngày đặt'), ('Thông tin giao hàng', 'Người nhận · Số điện thoại · Địa chỉ · Phương thức vận chuyển'),
            ('Chi tiết đơn hàng', 'Bảng: Sản phẩm | Số lượng | Giá | Thành tiền   +   Tạm tính / Phí vận chuyển / Tổng cộng'),
            ('Thông tin thanh toán', 'Phương thức · Tổng tiền · Trạng thái đơn [Mới đặt] (+ hướng dẫn chuyển khoản nếu chọn)'), ('Lịch sử trạng thái', 'Thời gian - Trạng thái (từng bước)')]
    y = 296
    for t, d in secs:
        p.rect(300, y, 600, 120 if 'Chi tiết' in t else 84, '', fill='#FFFFFF', stroke='#CFCFCF', rounded=3)
        p.text(316, y + 8, 560, 24, t, bold=True); p.text(316, y + 36, 568, 40, d, size=11, color='#666666', valign='top')
        y += (128 if 'Chi tiết' in t else 92)
    p.button(300, y + 4, 290, 44, '🏠 Quay về trang chủ', primary=True); p.button(610, y + 4, 290, 44, '📋 Xem lịch sử đơn hàng')
    p.note(NX, 212, 250, 130, '① Xem lại đơn ngay sau khi đặt (?new=1) hoặc mở lại từ lịch sử (hiển thị "Chi tiết đơn hàng"). Chỉ xem được đơn của chính mình.')
    return p


def history():
    p = new('07 Lịch sử đơn hàng', 900)
    site_header(p, 'Khách hàng 1')
    p.text(24, 74, 600, 40, '🕘  Lịch sử đơn hàng', size=24, bold=True)
    for i, (code, st, kind, items, tot) in enumerate([('DH20261012-0005', 'Mới đặt', 'proc', 'Signature Blend 1kg (x1)', '295.000đ'), ('DH20260915-0001', 'Đã giao', 'ok', 'Arabica Premium 250g (x2), Kenyan AA Grade 350g (x4)', '960.000đ')]):
        y = 130 + i * 250
        p.rect(240, y, 720, 230, '', fill='#FFFFFF', stroke='#CFCFCF', rounded=2)
        p.text(260, y + 10, 200, 20, 'Đơn hàng', bold=True, size=12); p.text(260, y + 30, 300, 20, code, size=12, color=BROWN, bold=True)
        p.badge(840, y + 16, 100, st, kind)
        p.line(260, y + 62, 940, y + 62)
        labs = [('NGÀY ĐẶT', '12/10/2026'), ('SỐ SẢN PHẨM', '1 sản phẩm'), ('TỔNG TIỀN', tot)] if i == 0 else [('NGÀY ĐẶT', '15/09/2026'), ('NGÀY GIAO', '17/09/2026'), ('SỐ SẢN PHẨM', '6 sản phẩm'), ('TỔNG TIỀN', tot)]
        w = 220 if len(labs) == 3 else 165
        for j, (a, b) in enumerate(labs):
            p.rect(260 + j * (w + 8), y + 74, w, 52, a + '\n' + b, fill='#F7FAFC', stroke='#EEF2F5', size=11, align='left')
        p.rect(260, y + 138, 680, 34, '📦 ' + items, fill='#F7FAFC', stroke='#EEF2F5', size=10, align='left')
        p.button(260, y + 182, 680, 34, '👁 Xem chi tiết', primary=True, size=11)
    p.text(0, 640, 1200, 24, '(Phân trang 5 đơn mỗi trang nếu có nhiều đơn)  ·  Chưa có đơn: "Bạn chưa có đơn hàng nào. Bắt đầu mua sắm →"', size=11, color='#808080', align='center')
    site_footer(p, 700)
    p.note(NX, 130, 250, 110, '① Chỉ hiện đơn của tài khoản đang đăng nhập. Nhãn trạng thái: Mới đặt, Đã xử lý, Đã giao, Hủy (do admin cập nhật).')
    p.note(NX, 254, 250, 80, '② "Xem chi tiết" mở trang chi tiết đơn (sản phẩm, địa chỉ, lịch sử trạng thái).')
    return p


def login():
    p = new('08 Đăng nhập - Đăng ký', 760)
    p.rect(0, 0, 1200, 760, '', fill='#8C8C8C', stroke='#BDBDBD')
    for i, (title, tab) in enumerate([('Đăng nhập', 0), ('Đăng ký', 1)]):
        x = 80 + i * 560
        p.rect(x, 50, 480, 660 if tab else 480, '', fill='#FFFFFF', stroke='#444444', rounded=2)
        p.text(x, 66, 480, 36, '☕ Cà Phê Đậm Đà', size=20, bold=True, align='center', color=BROWN)
        p.text(x, 100, 480, 22, 'Đăng nhập để tiếp tục mua sắm', size=11, color='#808080', align='center')
        p.rect(x + 30, 136, 210, 36, 'Đăng Nhập', fill=(BROWN if not tab else LGREY), stroke='#B3B3B3', color=('#FFFFFF' if not tab else INK), bold=True, rounded=6)
        p.rect(x + 240, 136, 210, 36, 'Đăng Ký', fill=(BROWN if tab else LGREY), stroke='#B3B3B3', color=('#FFFFFF' if tab else INK), bold=True, rounded=6)
        flds = [('Tên đăng nhập hoặc email', 'Ví dụ: guest1'), ('Mật khẩu', '••••••')] if not tab else [('Họ và tên', ''), ('Tên đăng nhập', 'Chữ không dấu, số, . hoặc _'), ('Email', ''), ('Số điện thoại', '0901234567'), ('Mật khẩu', 'Ít nhất 6 ký tự'), ('Xác nhận mật khẩu', '')]
        for j, (a, b) in enumerate(flds):
            p.text(x + 30, 188 + j * 66, 400, 20, a, size=11, bold=True); p.input(x + 30, 210 + j * 66, 420, 34, b)
        by = 188 + len(flds) * 66 + 6
        p.button(x + 30, by, 420, 42, 'Đăng Nhập' if not tab else 'Đăng Ký', primary=True, size=13)
        if not tab:
            p.text(x + 30, by + 52, 420, 20, 'Tài khoản mẫu: guest1 / guest1123', size=10, color='#808080', align='center')
    p.text(80, 724, 400, 24, '← Quay lại trang chủ', size=11, color='#FFFFFF')
    p.note(NX, 50, 250, 140, '① Một trang, hai tab. Đăng nhập bằng tên đăng nhập hoặc email. Sai thông tin hiện thông báo; tài khoản bị khóa không vào được.')
    p.note(NX, 204, 250, 130, '② Đăng ký: kiểm tra từng ô (tên đăng nhập/email không trùng, SĐT 10 số, mật khẩu ≥ 6, xác nhận khớp); thành công chuyển về tab Đăng nhập.')
    p.note(NX, 348, 250, 90, '③ ?redirect= đưa khách quay lại trang đang xem sau khi đăng nhập (chỉ trang nội bộ).')
    return p


def profile():
    p = new('09 Hồ sơ cá nhân', 1000)
    site_header(p, 'Khách hàng 1', 1)
    p.rect(24, 76, 560, 440, '', fill='#FFFFFF', stroke='#CFCFCF', rounded=2)
    p.rect(264, 92, 80, 80, '👤', fill='#F7FAFC', stroke=BROWN, size=26, rounded=50, sw=2)
    p.text(24, 180, 560, 30, 'Hồ sơ cá nhân', size=18, bold=True, align='center'); p.text(24, 208, 560, 20, '@guest1', size=11, color='#808080', align='center')
    p.line(48, 236, 560, 236)
    p.rect(48, 250, 512, 100, 'THÔNG TIN CÁ NHÂN\nHọ và tên: Khách hàng 1\nTên đăng nhập: guest1  ·  Email: guest1@example.com', fill='#F7FAFC', stroke='#E8E8E8', align='left', valign='top', size=11)
    p.rect(48, 362, 512, 90, 'LIÊN HỆ\nSố điện thoại: 0901000001\nĐịa chỉ: 12 Nguyễn Huệ, P. Bến Nghé, Quận 1, TP. HCM', fill='#F7FAFC', stroke='#E8E8E8', align='left', valign='top', size=11)
    p.button(48, 464, 150, 40, '✎ Chỉnh sửa', primary=True, size=11); p.button(210, 464, 170, 40, '🔑 Đổi mật khẩu', size=11); p.button(392, 464, 168, 40, '⎋ Đăng xuất', size=11)
    p.rect(616, 76, 560, 440, '', fill='#FFFFFF', stroke='#CFCFCF', rounded=2)
    p.text(636, 86, 400, 30, 'Chỉnh sửa thông tin', size=16, bold=True)
    for i, (a, b) in enumerate([('Họ và tên', 'Khách hàng 1'), ('Email', 'guest1@example.com'), ('Số điện thoại', '0901000001'), ('Tỉnh / Thành phố', 'TP. Hồ Chí Minh'), ('Quận / Huyện', 'Quận 1'), ('Phường / Xã', 'Phường Bến Nghé'), ('Số nhà, tên đường', '12 Nguyễn Huệ')]):
        col = i % 2 if i > 2 else 0
        p.text(636, 122 + i * 48, 300, 16, a, size=10, bold=True); p.input(636, 138 + i * 48, 520, 28, b)
    p.button(636, 468, 130, 36, 'Lưu', primary=True, size=11); p.button(778, 468, 130, 36, 'Hủy', size=11)
    p.rect(24, 540, 560, 400, '', fill='#FFFFFF', stroke='#CFCFCF', rounded=2)
    p.text(44, 550, 400, 30, 'Đổi mật khẩu', size=16, bold=True)
    for i, (a, b) in enumerate([('Mật khẩu hiện tại', ''), ('Mật khẩu mới', 'Ít nhất 6 ký tự, khác mật khẩu hiện tại'), ('Xác nhận mật khẩu mới', '')]):
        p.text(44, 590 + i * 70, 400, 18, a, size=11, bold=True); p.input(44, 610 + i * 70, 520, 34, '••••••' if not b else b)
    p.text(44, 802, 520, 40, 'Chức năng minh họa: mật khẩu lưu trong localStorage của trình duyệt, không phải xác thực an toàn.', size=10, color='#666666', valign='top')
    p.button(44, 860, 170, 40, 'Đổi mật khẩu', primary=True, size=11); p.button(226, 860, 120, 40, 'Hủy', size=11)
    p.note(NX, 76, 250, 120, '① Xem thông tin cá nhân và địa chỉ mặc định (dùng cho thanh toán).')
    p.note(NX, 210, 250, 130, '② Chỉnh sửa: kiểm tra email không trùng tài khoản khác, SĐT hợp lệ; địa chỉ điền đủ 4 ô hoặc để trống cả 4 ô.')
    p.note(NX, 354, 250, 120, '③ Đổi mật khẩu: nhập mật khẩu hiện tại, mật khẩu mới (≥ 6 ký tự, khác cũ) và xác nhận; lỗi hiện dưới từng ô.')
    return p


def mobile():
    p = Page('10 Giao diện di động (390px)', 1360, 880)
    p.text(30, 12, 900, 34, 'Giao diện trên điện thoại (màn hình rộng ~390px)', size=18, bold=True)
    for k in range(3):
        p.rect(40 + k * 440, 60, 390, 780, '', fill='#FFFFFF', stroke='#444444', rounded=6, sw=2)
        p.rect(40 + k * 440, 60, 390, 56, '', fill=DARK, stroke=DARK)
        p.rect(58 + k * 440, 72, 36, 32, '☕', fill='#FFFFFF', stroke='#FFFFFF', rounded=50)
        p.input(104 + k * 440, 72, 220, 32, 'Tìm sản phẩm theo tên...')
        p.rect(336 + k * 440, 72, 80, 32, 'Menu', fill=DARK, stroke='#FFFFFF', color='#FFFFFF', size=11, rounded=6)
    # A: trang chủ + menu mở
    x = 40
    p.img(x + 14, 128, 362, 220, 'Banner')
    p.text(x + 14, 360, 362, 28, 'Danh mục sản phẩm', size=14, bold=True)
    product_card(p, x + 14, 394, 362, 'Arabica Premium 250g', '135.000đ', 'Arabica', 'Thêm')
    p.rect(x + 20, 122, 350, 250, '', fill=DARK, stroke='#FFFFFF', rounded=14)
    for i, t in enumerate(['Trang chủ', 'Tất cả sản phẩm', 'Arabica', 'Robusta', 'Blend', 'Giới thiệu', 'Liên hệ', 'Đăng nhập / Đăng ký']):
        p.text(x + 36, 132 + i * 29, 300, 26, t, color='#FFFFFF', size=12)
    p.text(x, 700, 390, 40, 'A. Trang chủ với menu mở\n(nút "Menu" hiện menu dọc)', size=11, align='center', color='#666666')
    # B: danh sách sản phẩm
    x = 480
    p.text(x + 14, 126, 362, 28, 'Cà Phê Chất Lượng Cao', size=15, bold=True)
    p.rect(x + 14, 158, 362, 230, '', fill='#FFFFFF', stroke='#B3B3B3', rounded=4)
    p.input(x + 26, 168, 338, 32, '🔍 Tìm theo tên sản phẩm'); p.select(x + 26, 208, 338, 30, 'Phân loại: Tất cả'); p.input(x + 26, 246, 160, 30, 'Giá từ'); p.input(x + 204, 246, 160, 30, 'Giá đến')
    p.button(x + 26, 290, 338, 34, 'TÌM KIẾM', primary=True, size=11); p.button(x + 26, 332, 338, 34, 'XÓA BỘ LỌC', size=11)
    product_card(p, x + 14, 404, 362, 'Robusta Bold 500g', '129.000đ', 'Robusta')
    p.text(x, 700, 390, 40, 'B. Danh sách sản phẩm 1 cột\n(bộ lọc xếp dọc)', size=11, align='center', color='#666666')
    # C: giỏ hàng
    x = 920
    p.text(x + 14, 126, 362, 28, 'Giỏ hàng của bạn', size=15, bold=True)
    p.rect(x + 14, 160, 362, 330, '', fill='#FFFFFF', stroke='#CFCFCF', rounded=4)
    for i, nm in enumerate(['Arabica Premium 250g', 'Kenyan AA Grade 350g']):
        yy = 172 + i * 156
        p.img(x + 26, yy, 60, 60, 'Ảnh'); p.text(x + 96, yy + 4, 230, 24, nm, size=12, bold=True); p.text(x + 96, yy + 28, 230, 18, 'Loại: Arabica', size=10, color='#808080'); p.text(x + 340, yy, 30, 24, '✕', color='#C62828')
        p.text(x + 26, yy + 74, 150, 22, 'Số lượng', size=11, color='#777777'); p.rect(x + 250, yy + 70, 28, 26, '−', fill=LGREY, stroke='#B3B3B3'); p.rect(x + 282, yy + 70, 46, 26, ['2', '1'][i], fill='#FFFFFF', stroke='#B3B3B3'); p.rect(x + 332, yy + 70, 28, 26, '+', fill=LGREY, stroke='#B3B3B3')
        p.text(x + 26, yy + 100, 150, 22, 'Thành tiền', size=11, color='#777777'); p.text(x + 220, yy + 100, 140, 22, ['270.000đ', '165.000đ'][i], size=12, bold=True, align='right')
    p.rect(x + 14, 500, 362, 170, '', fill='#FFFFFF', stroke='#CFCFCF', rounded=4)
    p.text(x + 26, 510, 300, 26, 'Tổng kết', size=14, bold=True)
    p.text(x + 26, 540, 160, 22, 'Tạm tính', size=11); p.text(x + 220, 540, 140, 22, '435.000đ', size=11, bold=True, align='right')
    p.text(x + 26, 564, 160, 22, 'Tổng tiền', size=12, bold=True); p.text(x + 220, 564, 140, 22, '465.000đ', size=14, bold=True, align='right', color=BROWN)
    p.button(x + 26, 604, 160, 40, 'Tiếp tục mua', size=11); p.button(x + 200, 604, 160, 40, 'Thanh toán', primary=True, size=11)
    p.text(x, 700, 390, 40, 'C. Giỏ hàng: mỗi sản phẩm là một khối,\ntổng kết nằm dưới', size=11, align='center', color='#666666')
    return p
