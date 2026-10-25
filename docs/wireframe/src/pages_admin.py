from wf_lib import *
from pages_customer import new, NX


def admin_page(name, h, active, title):
    p = new(name, h)
    admin_shell(p, active, title)
    return p


def admin_login():
    p = new('11 Admin - Đăng nhập', 720)
    p.rect(0, 0, 1200, 720, '', fill='#F1E4D8', stroke='#BDBDBD')
    p.rect(390, 110, 420, 460, '', fill='#FFFFFF', stroke='#444444', rounded=2)
    p.text(390, 130, 420, 30, '⚙️ Quản trị Cà Phê Đậm Đà', size=18, bold=True, align='center', color=BROWN)
    p.text(390, 164, 420, 22, 'Đăng nhập dành cho quản trị viên', size=11, align='center', color='#808080')
    p.text(420, 210, 360, 18, 'Tên đăng nhập', size=11, bold=True); p.input(420, 232, 360, 38, 'admin')
    p.text(420, 290, 360, 18, 'Mật khẩu', size=11, bold=True); p.input(420, 312, 360, 38, '••••••••')
    p.text(420, 360, 360, 20, 'Thông báo lỗi (đỏ): Tên đăng nhập hoặc mật khẩu admin không đúng.', size=10, color='#C62828')
    p.button(420, 410, 360, 44, 'Đăng nhập', primary=True, size=13)
    p.text(390, 480, 420, 22, '← Quay lại cổng chọn vai trò', size=11, align='center', color='#666666')
    p.note(NX, 110, 250, 130, '① Trang riêng, không dùng chung với khách hàng. Tài khoản khách hàng không vào được. Chưa đăng nhập mà mở trang quản trị sẽ về đây.')
    p.note(NX, 254, 250, 90, '② Tài khoản mẫu: admin / admin123. Phiên admin tách khỏi phiên khách hàng.')
    return p


def overview():
    p = admin_page('12 Admin - Tổng quan', 760, 'Tổng quan', 'Tổng quan')
    stats = [('👥', 'Khách hàng', '3'), ('☕', 'Sản phẩm', '12'), ('📦', 'Tổng số đơn hàng', '5 (1 mới đặt)'), ('💰', 'Doanh thu (đơn đã giao)', '1.300.000đ'), ('⚠️', 'Sản phẩm sắp hết hàng', '1')]
    for i, (ic, lab, v) in enumerate(stats):
        x = 260 + (i % 3) * 308; y = 130 + (i // 3) * 124
        p.rect(x, y, 290, 106, '', fill='#FFFFFF', stroke='#CFCFCF', rounded=6)
        p.rect(x + 16, y + 14, 40, 40, ic, fill='#FFE9DC', stroke='#FFE9DC', rounded=8)
        p.text(x + 16, y + 58, 260, 18, lab, size=11, color='#666666'); p.text(x + 16, y + 76, 260, 26, v, size=16, bold=True)
    p.text(260, 388, 500, 28, 'Đơn hàng gần đây', size=14, bold=True)
    p.table(260, 420, [160, 170, 130, 140, 150, 166], [['Mã đơn', 'Khách hàng', 'Ngày đặt', 'Tổng tiền', 'Trạng thái', 'Thao tác'],
            ['DH20261012-0005', 'Khách hàng 1', '12/10/2026', '295.000đ', '', '👁'], ['DH20261005-0004', 'Khách hàng 1', '05/10/2026', '550.000đ', '', '👁'], ['DH20260920-0002', 'Khách hàng 2', '20/09/2026', '340.000đ', '', '👁']], rowh=40)
    p.cell_badge(4, 469, 90, 'Mới đặt', 'wait'); p.cell_badge(4, 509, 90, 'Đã xử lý', 'proc'); p.cell_badge(4, 549, 90, 'Đã giao', 'ok')
    p.note(NX, 130, 250, 120, '① Số liệu tính từ dữ liệu thật: doanh thu chỉ tính đơn "Đã giao"; sản phẩm sắp hết theo ngưỡng cảnh báo.')
    p.note(NX, 264, 250, 100, '② Sidebar 8 chức năng; địa chỉ có dạng admin-dashboard.html#products.')
    p.note(NX, 378, 250, 80, '③ 👁 mở hộp thoại chi tiết đơn.')
    return p


def users():
    p = admin_page('13 Admin - Khách hàng', 700, 'Khách hàng', 'Quản lý khách hàng')
    p.rect(260, 130, 916, 330, '', fill='#FFFFFF', stroke='#CFCFCF', rounded=4)
    p.text(280, 140, 300, 30, 'Danh sách khách hàng', size=14, bold=True)
    p.input(640, 140, 330, 32, 'Tìm theo tên, tài khoản, email, SĐT...'); p.select(980, 140, 180, 32, 'Mọi trạng thái')
    p.table(270, 184, [120, 100, 150, 100, 170, 90, 90, 86], [['Họ tên', 'Tài khoản', 'Email', 'SĐT', 'Địa chỉ', 'Ngày ĐK', 'Trạng thái', 'Thao tác'],
            ['Khách hàng 1', 'guest1', 'guest1@example.com', '0901000001', '12 Nguyễn Huệ...', '10/08/2026', '', '🔑 🔒'], ['Khách hàng 2', 'guest2', 'guest2@example.com', '0901000002', '25 Hoàng Diệu...', '20/08/2026', '', '🔑 🔒'], ['Khách hàng 3', 'guest3', 'guest3@example.com', '0901000003', 'Chưa cập nhật', '01/09/2026', '', '🔑 🔒']], rowh=50, size=10)
    for i in range(3): p.cell_badge(6, 234 + 14 + i * 50, 82, 'Hoạt động', 'ok')
    y = p.modal(260, 490, 560, 190, 'Đã đặt lại mật khẩu')
    p.text(280, y + 12, 520, 70, 'Mật khẩu của Khách hàng 2 (guest2) đã được đặt lại thành 123456.\nChỉ tài khoản này bị thay đổi. Khách có thể tự đổi lại trong Hồ sơ cá nhân.', size=11, valign='top')
    p.button(700, y + 100, 100, 32, 'Đóng', primary=True, size=11)
    p.note(NX, 130, 250, 130, '① 🔑 Đặt lại mật khẩu về 123456 (có hộp xác nhận trước). 🔒/🔓 Khóa hoặc mở khóa tài khoản; tài khoản bị khóa không đăng nhập được.')
    p.note(NX, 274, 250, 90, '② Tìm kiếm và lọc trạng thái cập nhật bảng ngay khi gõ.')
    return p


def categories():
    p = admin_page('14 Admin - Loại sản phẩm', 780, 'Loại sản phẩm', 'Quản lý loại sản phẩm')
    p.button(1010, 72, 166, 38, '+ Thêm loại', primary=True, size=12)
    p.rect(260, 130, 916, 220, '', fill='#FFFFFF', stroke='#CFCFCF', rounded=4)
    p.text(280, 140, 400, 28, 'Danh sách loại sản phẩm', size=14, bold=True)
    p.table(270, 176, [160, 330, 100, 120, 186], [['Tên loại', 'Mô tả', 'Số sản phẩm', 'Trạng thái', 'Thao tác'], ['Arabica', 'Hạt Arabica hương thơm tinh tế...', '7', '', '✏️  🙈  🗑'], ['Robusta', 'Hạt Robusta đậm vị, ít chua...', '4', '', '✏️  🙈  🗑'], ['Blend', 'Hỗn hợp phối trộn cân bằng...', '2', '', '✏️  🙈  🗑']], rowh=40, size=10)
    for i in range(3): p.cell_badge(3, 216 + 9 + i * 40, 100, 'Hiển thị', 'ok')
    y = p.modal(260, 380, 480, 330, 'Thêm / sửa loại sản phẩm')
    p.text(280, y + 10, 300, 18, 'Tên loại *', size=11, bold=True); p.input(280, y + 30, 440, 36, 'Ví dụ: Cold Brew')
    p.text(280, y + 78, 300, 18, 'Mô tả', size=11, bold=True); p.textarea(280, y + 98, 440, 80, '')
    p.text(280, y + 184, 440, 18, 'Lỗi (đỏ): Tên loại sản phẩm đã tồn tại.', size=10, color='#C62828')
    p.button(540, y + 230, 80, 36, 'Hủy', size=11); p.button(630, y + 230, 90, 36, 'Lưu', primary=True, size=11)
    y2 = p.modal(770, 380, 406, 190, 'Không thể xóa loại sản phẩm')
    p.text(790, y2 + 12, 370, 60, 'Loại này đang có 7 sản phẩm. Hãy chuyển hoặc xóa các sản phẩm đó trước, hoặc chọn "Ẩn" loại này.', size=11, valign='top')
    p.button(1070, y2 + 90, 90, 32, 'Đóng', primary=True, size=11)
    p.note(NX, 130, 250, 150, '① Thêm, sửa, ẩn, xóa. Trùng tên (không phân biệt hoa thường) bị từ chối. Ẩn loại sẽ ẩn luôn các sản phẩm thuộc loại khỏi khách hàng.')
    p.note(NX, 294, 250, 100, '② Loại còn sản phẩm không xóa được: hiện thông báo như hộp thoại bên trái.')
    return p


def products():
    p = admin_page('15 Admin - Sản phẩm', 1160, 'Sản phẩm', 'Quản lý sản phẩm')
    p.button(990, 72, 186, 38, '+ Thêm sản phẩm', primary=True, size=12)
    p.rect(260, 130, 916, 300, '', fill='#FFFFFF', stroke='#CFCFCF', rounded=4)
    p.text(280, 140, 300, 28, 'Danh sách sản phẩm', size=14, bold=True)
    p.input(560, 140, 230, 32, 'Tìm theo mã hoặc tên...'); p.select(800, 140, 170, 32, 'Tất cả loại'); p.select(980, 140, 180, 32, 'Mọi trạng thái')
    p.table(270, 184, [60, 70, 230, 90, 110, 80, 100, 166], [['Ảnh', 'Mã', 'Tên sản phẩm', 'Loại', 'Giá bán', 'Tồn kho', 'Trạng thái', 'Thao tác'],
            ['', 'CF001', 'Arabica Premium 250g', 'Arabica', '135.000đ', '118', '', '✏️  🙈  🗑'], ['', 'CF002', 'Robusta Bold 500g', 'Robusta', '129.000đ', '100', '', '✏️  🙈  🗑'], ['', 'CF100', 'Cà phê mới (chưa nhập hàng)', 'Arabica', 'Chưa có giá', '0', '', '✏️  🙈  🗑']], rowh=56, size=10)
    for i in range(3):
        p.img(274, 244 + i * 56 + 6, 44, 44, '');
        p.cell_badge(6, 240 + i * 56 + 17, 88, 'Đang bán', 'ok')
    y = p.modal(260, 460, 760, 680, 'Thêm / sửa sản phẩm')
    p.text(280, y + 8, 300, 18, 'Loại sản phẩm *', size=11, bold=True); p.select(280, y + 28, 720, 34, '-- Chọn loại --')
    p.text(280, y + 72, 300, 18, 'Mã sản phẩm *', size=11, bold=True); p.input(280, y + 92, 720, 34, 'CF100')
    p.text(280, y + 136, 300, 18, 'Tên sản phẩm *', size=11, bold=True); p.input(280, y + 156, 720, 34, '')
    p.text(280, y + 200, 300, 18, 'Mô tả', size=11, bold=True); p.textarea(280, y + 220, 720, 80, '')
    for i, a in enumerate(['Xuất xứ', 'Mức độ rang', 'Khối lượng']):
        p.text(280 + i * 246, y + 310, 220, 18, a, size=11, bold=True); p.input(280 + i * 246, y + 330, 228, 34, '')
    p.text(280, y + 376, 300, 18, 'Hình ảnh', size=11, bold=True)
    p.img(280, y + 398, 96, 96, 'Xem trước'); p.rect(396, y + 420, 260, 34, '[Chọn tệp ảnh]  chưa chọn tệp', fill='#FFFFFF', stroke='#B3B3B3', size=11, align='left')
    p.text(396, y + 458, 330, 36, 'Sửa: để trống nếu giữ ảnh hiện tại. Không chọn khi thêm mới: dùng ảnh mặc định.', size=10, color='#808080', valign='top')
    p.text(280, y + 506, 720, 18, 'Lỗi (đỏ): Mã sản phẩm "CF001" đã tồn tại. / Tệp được chọn không phải là ảnh.', size=10, color='#C62828')
    p.button(790, y + 560, 100, 38, 'Hủy', size=11); p.button(900, y + 560, 100, 38, 'Lưu', primary=True, size=11)
    p.note(NX, 130, 250, 140, '① Sửa mở form với đúng dữ liệu hiện có (loại, mã, tên, mô tả, xuất xứ, rang, khối lượng, ảnh). 🙈 ẩn/hiện; 🗑 xóa.')
    p.note(NX, 284, 250, 120, '② Sản phẩm đã có phiếu nhập hoặc đơn hàng không xóa được (chỉ ẩn). Sản phẩm mới chưa có giá cho tới khi có phiếu nhập hoàn thành.')
    p.note(NX, 418, 250, 100, '③ Ảnh được thu nhỏ (tối đa 800px) trước khi lưu trong localStorage.')
    return p


def receipts():
    p = admin_page('16 Admin - Nhập hàng', 1220, 'Nhập hàng', 'Quản lý nhập hàng')
    p.button(990, 72, 186, 38, '+ Thêm phiếu nhập', primary=True, size=12)
    p.rect(260, 130, 916, 150, '', fill='#FFFFFF', stroke='#CFCFCF', rounded=4)
    for i, (lab, ph, w) in enumerate([('Mã phiếu hoặc tên sản phẩm', 'Ví dụ: PN001 hoặc Arabica', 320), ('Từ ngày', 'mm/dd/yyyy', 170), ('Đến ngày', 'mm/dd/yyyy', 170), ('Trạng thái', 'Tất cả', 190)]):
        x = 276 + [0, 336, 522, 708][i]
        p.text(x, 140, w, 18, lab, size=11, bold=True); p.input(x, 160, w, 34, ph)
    p.button(276, 222, 130, 36, 'Tìm kiếm', primary=True, size=11); p.button(418, 222, 130, 36, 'Xóa bộ lọc', size=11)
    p.rect(260, 300, 916, 240, '', fill='#FFFFFF', stroke='#CFCFCF', rounded=4)
    p.text(280, 308, 300, 28, 'Danh sách phiếu nhập', size=14, bold=True)
    p.table(270, 344, [90, 100, 290, 130, 136, 150], [['Mã phiếu', 'Ngày nhập', 'Sản phẩm', 'Tổng giá trị', 'Trạng thái', 'Thao tác'], ['PN003', '14/10/2026', 'Ethiopia (30), Colombian (30)', '7.200.000đ', '', '👁  ✏️  ✅  🗑'], ['PN002', '10/09/2026', 'Arabica (40), Vietnam Robusta (60)...', '14.320.000đ', '', '👁'], ['PN001', '01/08/2026', '12 sản phẩm', '88.016.000đ', '', '👁']], rowh=44, size=10)
    p.cell_badge(4, 399, 124, 'Chưa hoàn thành', 'wait'); p.cell_badge(4, 443, 124, 'Đã hoàn thành', 'ok'); p.cell_badge(4, 487, 124, 'Đã hoàn thành', 'ok')
    y = p.modal(260, 570, 916, 620, 'Thêm / sửa phiếu nhập hàng')
    p.text(280, y + 8, 200, 18, 'Ngày nhập *', size=11, bold=True); p.input(280, y + 28, 420, 34, 'mm/dd/yyyy')
    p.text(720, y + 8, 200, 18, 'Ghi chú', size=11, bold=True); p.input(720, y + 28, 436, 34, '')
    p.table(280, y + 82, [330, 120, 170, 170, 86], [['Sản phẩm', 'Số lượng', 'Giá nhập (đ)', 'Thành tiền', ''], ['CF001 - Arabica Premium 250g ▾', '10', '108000', '1.080.000đ', '✕'], ['-- Chọn sản phẩm -- ▾', '', '', '0đ', '✕']], rowh=44, size=11)
    p.button(280, y + 232, 220, 36, '+ Thêm dòng sản phẩm', size=11)
    p.text(280, y + 290, 600, 26, 'Tổng giá trị phiếu: 1.080.000đ', size=14, bold=True)
    p.text(280, y + 322, 876, 40, 'Phiếu chỉ cộng vào tồn kho và giá vốn sau khi được hoàn thành. Phiếu đã hoàn thành không thể sửa.', size=11, color='#B07A00')
    p.text(280, y + 366, 876, 18, 'Lỗi (đỏ): Dòng 2: vui lòng chọn sản phẩm. / số lượng phải là số nguyên lớn hơn 0. / sản phẩm bị trùng trong cùng phiếu.', size=10, color='#C62828')
    p.button(950, y + 440, 100, 38, 'Hủy', size=11); p.button(1060, y + 440, 100, 38, 'Lưu phiếu', primary=True, size=11)
    p.note(NX, 130, 250, 130, '① Tìm theo mã phiếu hoặc tên sản phẩm, khoảng ngày nhập, trạng thái. Khoảng ngày sai (từ > đến) báo lỗi.')
    p.note(NX, 274, 250, 150, '② Phiếu nhập nhiều sản phẩm, không quản lý nhà cung cấp. Chỉ sửa/xóa được phiếu chưa hoàn thành.')
    p.note(NX, 438, 250, 150, '③ ✅ Hoàn thành: cộng tồn kho đúng một lần, cập nhật giá vốn bình quân và khóa phiếu.')
    return p


def pricing():
    p = admin_page('17 Admin - Giá bán', 1180, 'Giá bán', 'Quản lý giá bán')
    p.text(260, 112, 916, 40, 'Giá bán = Giá vốn × (1 + % lợi nhuận). Giá vốn là bình quân gia quyền các phiếu nhập đã hoàn thành. Sản phẩm có % riêng thì dùng %, ngược lại dùng % của loại.', size=11, color='#B07A00', valign='top')
    p.rect(260, 162, 916, 190, '', fill='#FFFFFF', stroke='#CFCFCF', rounded=4)
    p.text(280, 170, 400, 28, 'Tỉ lệ lợi nhuận theo loại', size=14, bold=True)
    p.table(270, 206, [330, 190, 190, 196], [['Loại sản phẩm', '% lợi nhuận', 'Số sản phẩm', 'Thao tác'], ['Arabica', '25%', '7', '✏️'], ['Robusta', '25%', '4', '✏️'], ['Blend', '25%', '2', '✏️']], rowh=34, size=11)
    p.rect(260, 372, 916, 300, '', fill='#FFFFFF', stroke='#CFCFCF', rounded=4)
    p.text(280, 380, 520, 28, 'Tra cứu giá và tỉ lệ lợi nhuận theo sản phẩm', size=14, bold=True)
    p.input(830, 380, 190, 32, 'Tìm theo mã hoặc tên...'); p.select(1030, 380, 136, 32, 'Tất cả loại')
    p.table(270, 420, [70, 220, 90, 110, 160, 110, 146], [['Mã', 'Tên sản phẩm', 'Loại', 'Giá vốn', '% lợi nhuận', 'Giá bán', 'Thao tác'], ['CF001', 'Arabica Premium 250g', 'Arabica', '108.000đ', '25% (theo loại)', '135.000đ', '✏️'], ['CF009', 'Premium Espresso Blend 1kg', 'Blend', '200.000đ', '40% (riêng)', '280.000đ', '✏️'], ['CF100', 'Cà phê mới', 'Arabica', 'Chưa nhập hàng', 'Chưa đặt', '—', '✏️']], rowh=40, size=10)
    y = p.modal(260, 700, 520, 440, 'Sửa % lợi nhuận loại Robusta')
    p.text(280, y + 8, 300, 18, '% lợi nhuận *', size=11, bold=True); p.input(280, y + 28, 480, 34, '30')
    p.text(280, y + 70, 480, 36, '1 sản phẩm có % riêng sẽ không bị ảnh hưởng.', size=11, color='#B07A00')
    p.text(280, y + 106, 480, 22, 'Giá bán sau khi áp dụng (xem trước)', bold=True)
    p.table(280, y + 134, [220, 130, 130], [['Sản phẩm', 'Giá hiện tại', 'Giá mới'], ['Robusta Bold 500g', '129.000đ', '134.160đ'], ['Dark Roast Supreme 750g', '148.000đ', '153.920đ']], rowh=34, size=10)
    p.button(560, y + 270, 90, 36, 'Hủy', size=11); p.button(660, y + 270, 100, 36, 'Lưu', primary=True, size=11)
    y2 = p.modal(800, 700, 376, 320, 'Sửa % lợi nhuận: sản phẩm')
    p.text(820, y2 + 8, 340, 40, 'Giá vốn: 200.000đ   % của loại: 25%', size=11)
    p.text(820, y2 + 52, 340, 18, '% lợi nhuận riêng', size=11, bold=True); p.input(820, y2 + 72, 336, 34, '40')
    p.text(820, y2 + 108, 340, 18, 'Để trống để dùng % của loại.', size=10, color='#808080')
    p.text(820, y2 + 138, 340, 24, 'Giá bán sau khi áp dụng: 280.000đ', bold=True)
    p.button(820, y2 + 190, 156, 34, 'Dùng % của loại', size=10); p.button(986, y2 + 190, 70, 34, 'Hủy', size=10); p.button(1066, y2 + 190, 90, 34, 'Lưu', primary=True, size=10)
    p.note(NX, 162, 250, 130, '① Đặt % theo loại và/hoặc riêng từng sản phẩm; có xem trước giá mới trước khi lưu. % phải từ 0 đến 1000.')
    p.note(NX, 306, 250, 130, '② Bảng tra cứu hiển thị giá vốn, % (riêng/theo loại) và giá bán; thay đổi áp dụng ngay cho phía khách hàng, đơn cũ giữ nguyên giá.')
    return p


def orders():
    p = admin_page('18 Admin - Đơn hàng', 1280, 'Đơn hàng', 'Quản lý đơn hàng')
    p.rect(260, 130, 916, 150, '', fill='#FFFFFF', stroke='#CFCFCF', rounded=4)
    for i, (lab, ph, w) in enumerate([('Mã đơn hoặc khách hàng', 'Ví dụ: DH2026 hoặc guest1', 280), ('Ngày đặt từ', 'mm/dd/yyyy', 190), ('Ngày đặt đến', 'mm/dd/yyyy', 190), ('Tình trạng', 'Tất cả', 190)]):
        x = 276 + [0, 296, 502, 708][i]
        p.text(x, 140, w, 18, lab, size=11, bold=True); p.input(x, 160, w, 34, ph)
    p.button(276, 222, 130, 36, 'Tìm kiếm', primary=True, size=11); p.button(418, 222, 130, 36, 'Xóa bộ lọc', size=11)
    p.rect(260, 300, 916, 270, '', fill='#FFFFFF', stroke='#CFCFCF', rounded=4)
    p.text(280, 308, 300, 28, 'Danh sách đơn hàng', size=14, bold=True); p.text(1000, 308, 160, 28, '5 đơn hàng', align='right')
    p.table(270, 344, [150, 140, 100, 110, 180, 120, 96], [['Mã đơn', 'Khách hàng', 'Ngày đặt', 'Tổng tiền', 'Thanh toán', 'Trạng thái', 'Thao tác'], ['DH20261012-0005', 'Khách hàng 1', '12/10/2026', '295.000đ', 'Tiền mặt khi nhận', '', '👁'], ['DH20261005-0004', 'Khách hàng 1', '05/10/2026', '550.000đ', 'Chuyển khoản', '', '👁'], ['DH20260920-0002', 'Khách hàng 2', '20/09/2026', '340.000đ', 'Chuyển khoản', '', '👁']], rowh=44, size=10)
    p.cell_badge(5, 399, 100, 'Mới đặt', 'wait'); p.cell_badge(5, 443, 100, 'Đã xử lý', 'proc'); p.cell_badge(5, 487, 100, 'Đã giao', 'ok')
    y = p.modal(260, 600, 916, 650, 'Đơn hàng DH20261012-0005')
    p.text(280, y + 8, 880, 22, 'Trạng thái hiện tại: [Mới đặt]     Ngày đặt: 05:00 12/10/2026', bold=True)
    p.rect(280, y + 40, 436, 88, 'KHÁCH HÀNG\nKhách hàng 1 (guest1)\n0901000001 · guest1@example.com', fill='#F7FAFC', stroke='#E8E8E8', align='left', valign='top', size=11)
    p.rect(724, y + 40, 432, 88, 'GIAO HÀNG\nKhách hàng 1 - 0901000001\n12 Nguyễn Huệ, P. Bến Nghé, Quận 1, TP. HCM', fill='#F7FAFC', stroke='#E8E8E8', align='left', valign='top', size=11)
    p.table(280, y + 142, [376, 180, 120, 200], [['Sản phẩm', 'Đơn giá', 'Số lượng', 'Thành tiền'], ['Signature Blend 1kg (CF003)', '265.000đ', '1', '265.000đ']], rowh=34, size=11)
    p.text(280, y + 216, 880, 24, 'Tạm tính: 265.000đ    Phí vận chuyển: 30.000đ    Tổng cộng: 295.000đ', bold=True)
    p.text(280, y + 244, 880, 22, 'Thanh toán: Thanh toán tiền mặt khi nhận hàng', size=11)
    p.text(280, y + 274, 400, 22, 'Lịch sử trạng thái', bold=True); p.text(280, y + 298, 880, 22, '05:00 12/10/2026 - [Mới đặt]', size=11)
    p.text(280, y + 336, 400, 18, 'Cập nhật trạng thái', size=11, bold=True); p.select(280, y + 358, 876, 36, '-- Chọn trạng thái mới --')
    p.text(280, y + 398, 876, 20, 'Chỉ hiện các bước hợp lệ: Mới đặt → Đã xử lý / Hủy;  Đã xử lý → Đã giao / Hủy.  Tồn kho chỉ bị trừ khi "Đã giao".', size=10, color='#808080')
    p.button(900, y + 470, 100, 38, 'Đóng', size=11); p.button(1010, y + 470, 150, 38, 'Cập nhật trạng thái', primary=True, size=11)
    p.note(NX, 130, 250, 140, '① Tra cứu theo khoảng ngày đặt và tình trạng (kết hợp được); khoảng ngày sai báo lỗi.')
    p.note(NX, 284, 250, 150, '② 👁 xem chi tiết đơn và cập nhật tình trạng: Mới đặt, Đã xử lý, Đã giao, Hủy. Đơn Đã giao/Hủy là trạng thái cuối, hộp thoại không còn ô chọn.')
    return p


def stock():
    p = admin_page('19 Admin - Tồn kho', 1240, 'Tồn kho', 'Quản lý tồn kho')
    p.rect(260, 130, 916, 190, '', fill='#FFFFFF', stroke='#CFCFCF', rounded=4)
    p.text(280, 140, 400, 28, 'Cảnh báo sắp hết hàng', size=14, bold=True)
    p.text(760, 140, 190, 28, 'Ngưỡng cảnh báo (tồn ≤)', size=11, align='right'); p.input(960, 140, 90, 30, '10'); p.button(1060, 140, 106, 30, 'Lưu ngưỡng', size=10)
    p.table(270, 182, [130, 360, 140, 276], [['Mã', 'Tên sản phẩm', 'Tồn kho', 'Mức cảnh báo'], ['CF011', 'Kenyan AA Grade 350g', '8', '']], rowh=36, size=11)
    p.cell_badge(3, 225, 110, 'Sắp hết hàng', 'wait')
    p.text(280, 264, 880, 40, 'Không có sản phẩm nào sắp hết hàng → hiện thông báo trống. Ngưỡng âm báo lỗi.', size=10, color='#808080')
    p.rect(260, 340, 916, 150, '', fill='#FFFFFF', stroke='#CFCFCF', rounded=4)
    p.text(280, 348, 600, 28, 'Tra cứu tồn kho tại một thời điểm', size=14, bold=True)
    for i, (lab, ph, w) in enumerate([('Tồn tại cuối ngày', 'mm/dd/yyyy', 250), ('Loại sản phẩm', 'Tất cả loại', 280), ('Sản phẩm', 'Tất cả sản phẩm', 300)]):
        x = 276 + [0, 280, 590][i]; p.text(x, 380, w, 18, lab, size=11, bold=True); p.input(x, 400, w, 34, ph)
    p.button(276, 446, 120, 34, 'Tra cứu', primary=True, size=11)
    p.rect(260, 510, 916, 200, '', fill='#FFFFFF', stroke='#CFCFCF', rounded=4)
    p.text(280, 516, 600, 28, 'Tồn kho cuối ngày 18/10/2026', size=14, bold=True)
    p.table(270, 552, [90, 270, 130, 130, 150, 136], [['Mã', 'Tên sản phẩm', 'Loại', 'Tồn kho', 'Còn bán được', 'Cảnh báo'], ['CF001', 'Arabica Premium 250g', 'Arabica', '118', '118', ''], ['CF011', 'Kenyan AA Grade 350g', 'Arabica', '8', '8', 'Sắp hết hàng']], rowh=34, size=10)
    p.text(280, 650, 880, 40, '"Còn bán được" = tồn kho trừ số lượng đang giữ cho đơn chưa giao (chỉ hiện khi tra cứu ngày hiện tại).', size=10, color='#808080')
    p.rect(260, 730, 916, 140, '', fill='#FFFFFF', stroke='#CFCFCF', rounded=4)
    p.text(280, 738, 700, 28, 'Báo cáo nhập - xuất - tồn trong khoảng thời gian', size=14, bold=True)
    for i, (lab, ph, w) in enumerate([('Sản phẩm', 'Tất cả sản phẩm', 380), ('Từ ngày', 'mm/dd/yyyy', 220), ('Đến ngày', 'mm/dd/yyyy', 220)]):
        x = 276 + [0, 400, 640][i]; p.text(x, 770, w, 18, lab, size=11, bold=True); p.input(x, 790, w, 34, ph)
    p.button(276, 832, 150, 28, 'Xem báo cáo', primary=True, size=10)
    p.rect(260, 890, 916, 340, '', fill='#FFFFFF', stroke='#CFCFCF', rounded=4)
    p.text(280, 898, 700, 28, 'Nhập - xuất - tồn từ 01/09/2026 đến 30/09/2026', size=14, bold=True)
    p.table(270, 934, [90, 270, 130, 100, 100, 226], [['Mã', 'Tên sản phẩm', 'Tồn đầu kỳ', 'Nhập', 'Xuất', 'Tồn cuối kỳ'], ['CF001', 'Arabica Premium 250g', '80', '40', '2', '118'], ['CF007', 'Vietnam Robusta 500g', '120', '60', '0', '180']], rowh=34, size=10)
    p.text(280, 1050, 800, 26, 'Chọn một sản phẩm → thêm bảng "Chi tiết giao dịch kho"', size=11, bold=True)
    p.table(270, 1080, [150, 130, 130, 506], [['Ngày', 'Loại', 'Số lượng', 'Nội dung'], ['10/09/2026', 'Nhập', '40', 'Nhập hàng theo phiếu PN002'], ['17/09/2026', 'Xuất', '2', 'Xuất kho giao đơn DH20260915-0001']], rowh=34, size=10)
    p.note(NX, 130, 250, 120, '① Cảnh báo theo ngưỡng chỉnh được (mặc định 10). Tồn thực tế = tổng nhập − tổng xuất.')
    p.note(NX, 264, 250, 100, '② Tra cứu tồn một sản phẩm hoặc theo loại tại cuối ngày bất kỳ.')
    p.note(NX, 378, 250, 130, '③ Báo cáo nhập - xuất - tồn cho một sản phẩm hoặc tất cả trong khoảng thời gian, kèm chi tiết từng giao dịch kho.')
    return p
