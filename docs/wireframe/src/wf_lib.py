"""Thư viện dựng wireframe dạng diagrams.net (.drawio) từ các thành phần đơn giản.
Chạy build_wireframe.py để sinh docs/CoffeeBeans_Wireframe.drawio, rồi render_wireframe.py để xuất PNG/PDF."""
from xml.sax.saxutils import escape
import html as _html

INK = '#333333'; GREY = '#E6E6E6'; LGREY = '#F5F5F5'; LINE = '#7F7F7F'
BROWN = '#4B3429'; DARK = '#2A1C16'; GOLD = '#D1A06F'; CREAM = '#F6EFE9'
NOTE_FILL = '#FFF2CC'; NOTE_STROKE = '#D6B656'


def _val(t):
    # nhãn HTML của diagrams.net: escape HTML trước, xuống dòng bằng <br>, rồi escape cho thuộc tính XML
    return escape(_html.escape(t, quote=False).replace('\n', '<br>'), {'"': '&quot;'})


class Page:
    def __init__(self, name, w=1200, h=900):
        self.name, self.w, self.h = name, w, h
        self.fw = w  # chiều rộng khung giao diện (phần còn lại bên phải dành cho ghi chú)
        self.cells = []
        self._n = 1

    def _id(self):
        self._n += 1
        return 'c%d' % self._n

    def add(self, x, y, w, h, text='', style=''):
        cid = self._id()
        self.cells.append(
            '<mxCell id="%s" value="%s" style="html=1;%s" vertex="1" parent="1">'
            '<mxGeometry x="%s" y="%s" width="%s" height="%s" as="geometry"/></mxCell>'
            % (cid, _val(text), style, x, y, w, h))
        return cid

    # ---- thành phần cơ bản ----
    def rect(self, x, y, w, h, text='', fill='#FFFFFF', stroke=LINE, size=12, bold=False, color=INK,
             align='center', valign='middle', rounded=0, dashed=False, sw=1):
        st = 'whiteSpace=wrap;fillColor=%s;strokeColor=%s;strokeWidth=%s;fontColor=%s;fontSize=%s;align=%s;verticalAlign=%s;%s%s%s' % (
            fill, stroke, sw, color, size, align, valign, 'fontStyle=1;' if bold else '',
            'rounded=1;arcSize=%d;' % rounded if rounded else 'rounded=0;', 'dashed=1;' if dashed else '')
        if align == 'left': st += 'spacingLeft=8;'
        if align == 'right': st += 'spacingRight=8;'
        return self.add(x, y, w, h, text, st)

    def text(self, x, y, w, h, text, size=12, bold=False, align='left', color=INK, valign='middle'):
        st = 'text;whiteSpace=wrap;fillColor=none;strokeColor=none;fontColor=%s;fontSize=%s;align=%s;verticalAlign=%s;%s' % (
            color, size, align, valign, 'fontStyle=1;' if bold else '')
        return self.add(x, y, w, h, text, st)

    def button(self, x, y, w, h, text, primary=False, size=12):
        if primary:
            return self.rect(x, y, w, h, text, fill=BROWN, stroke=BROWN, color='#FFFFFF', size=size, bold=True, rounded=20)
        return self.rect(x, y, w, h, text, fill='#FFFFFF', stroke=BROWN, color=BROWN, size=size, bold=True, rounded=20)

    def input(self, x, y, w, h, text='', size=12):
        return self.rect(x, y, w, h, text, fill='#FFFFFF', stroke='#B3B3B3', color='#808080', size=size, align='left', rounded=8)

    def select(self, x, y, w, h, text=''):
        return self.rect(x, y, w, h, text + '   ▾', fill='#FFFFFF', stroke='#B3B3B3', color='#555555', align='left', rounded=8)

    def textarea(self, x, y, w, h, text=''):
        return self.rect(x, y, w, h, text, fill='#FFFFFF', stroke='#B3B3B3', color='#808080', align='left', valign='top', rounded=4)

    def img(self, x, y, w, h, label='Ảnh'):
        return self.rect(x, y, w, h, label, fill=GREY, stroke='#B3B3B3', color='#808080', size=12)

    def chip(self, x, y, w, text):
        return self.rect(x, y, w, 20, text, fill='#EFE3D6', stroke='#EFE3D6', size=10, bold=True, rounded=50)

    def badge(self, x, y, w, text, kind='ok'):
        fill, color = {'ok': ('#E1F3E4', '#1B5E20'), 'wait': ('#FFF3E0', '#E65100'), 'proc': ('#E3F2FD', '#0D47A1'), 'bad': ('#FFEBEE', '#B71C1C')}[kind]
        return self.rect(x, y, w, 22, text, fill=fill, stroke=fill, color=color, size=10, bold=True, rounded=50)

    def cell_badge(self, col, y, w, text, kind='ok'):
        """Đặt nhãn trạng thái vào giữa cột `col` của bảng vừa vẽ (theo toạ độ thật sau khi co giãn)."""
        return self.badge(self.cols_x[col] + (self.cols_w[col] - w) / 2, y, w, text, kind)

    def note(self, x, y, w, h, text):
        """Ghi chú vàng mô tả hành vi/liên kết (không phải thành phần giao diện)."""
        return self.rect(x, y, w, h, text, fill=NOTE_FILL, stroke=NOTE_STROKE, color='#5C4B00', size=11, align='left', valign='top', dashed=False)

    def line(self, x1, y1, x2, y2, color=LINE, arrow=False, dashed=False):
        cid = self._id()
        st = 'endArrow=%s;html=1;strokeColor=%s;strokeWidth=1;%s' % ('classic' if arrow else 'none', color, 'dashed=1;' if dashed else '')
        self.cells.append(
            '<mxCell id="%s" style="%s" edge="1" parent="1"><mxGeometry relative="1" as="geometry">'
            '<mxPoint x="%s" y="%s" as="sourcePoint"/><mxPoint x="%s" y="%s" as="targetPoint"/></mxGeometry></mxCell>'
            % (cid, st, x1, y1, x2, y2))

    def link(self, src, dst, label='', dashed=False):
        """Mũi tên nối hai hình (di chuyển hình thì mũi tên đi theo trong diagrams.net)."""
        cid = self._id()
        st = 'endArrow=classic;html=1;strokeColor=%s;strokeWidth=1.5;fontSize=10;%s' % (BROWN, 'dashed=1;' if dashed else '')
        self.cells.append(
            '<mxCell id="%s" value="%s" style="%s" edge="1" parent="1" source="%s" target="%s">'
            '<mxGeometry relative="1" as="geometry"/></mxCell>' % (cid, _val(label), st, src, dst))

    # ---- thành phần ghép ----
    def table(self, x, y, colw, rows, header=True, rowh=34, size=11, aligns=None, fills=None, fit=None):
        """rows: danh sách hàng, mỗi hàng là danh sách ô (chuỗi). Trả về y cuối bảng.
        fit: ép tổng chiều rộng các cột (co giãn tỉ lệ). Bảng đặt tại x=270 (trong khung admin 260..1176) tự co về 896."""
        if fit is None and x == 270:
            fit = 896
        if fit:
            tot = float(sum(colw)); colw = [int(round(c * fit / tot)) for c in colw]; colw[-1] += fit - sum(colw)
        aligns = aligns or ['left'] * len(colw)
        xs = [x + sum(colw[:i]) for i in range(len(colw))]
        self.cols_x, self.cols_w = xs, list(colw)
        cy = y
        for ri, row in enumerate(rows):
            cx = x
            is_h = header and ri == 0
            for ci, cell in enumerate(row):
                self.rect(cx, cy, colw[ci], rowh, cell, fill=('#F0E6DA' if is_h else '#FFFFFF'), stroke='#CFCFCF',
                          size=size, bold=is_h, align=aligns[ci])
                cx += colw[ci]
            cy += rowh
        return cy

    def modal(self, x, y, w, h, title):
        self.rect(x, y, w, h, '', fill='#FFFFFF', stroke='#444444', sw=2, rounded=2)
        self.rect(x, y, w, 44, title, fill=BROWN, stroke=BROWN, color='#FFFFFF', size=14, bold=True, align='left')
        self.text(x + w - 40, y + 4, 36, 36, '✕', size=14, color='#FFFFFF', align='center')
        return y + 44

    def to_xml(self, did):
        return ('<diagram id="%s" name="%s"><mxGraphModel dx="1200" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" '
                'pageScale="1" pageWidth="%d" pageHeight="%d" math="0" shadow="0"><root><mxCell id="0"/><mxCell id="1" parent="0"/>%s</root></mxGraphModel></diagram>'
                % (did, escape(self.name, {'"': '&quot;'}), self.w, self.h, ''.join(self.cells)))


def write_drawio(pages, path):
    xml = '<mxfile host="app.diagrams.net" agent="CoffeeBeans wireframe generator" version="24.0.0">' + ''.join(
        p.to_xml('page-%02d' % (i + 1)) for i, p in enumerate(pages)) + '</mxfile>'
    open(path, 'w', encoding='utf-8').write(xml)


# ---------- khối giao diện dùng lại ----------
def site_header(p, user=None, cart=0):
    p.rect(0, 0, p.fw, 56, '', fill=DARK, stroke=DARK)
    p.text(24, 10, 220, 36, '☕  Cà Phê Đậm Đà', size=15, bold=True, color='#FFFFFF')
    p.input(270, 12, 260, 32, 'Tìm sản phẩm theo tên...')
    p.text(560, 10, 100, 36, 'Sản phẩm ▾', color='#FFFFFF')
    p.text(660, 10, 90, 36, 'Giới thiệu', color='#FFFFFF')
    p.text(750, 10, 70, 36, 'Lợi ích', color='#FFFFFF')
    p.text(820, 10, 70, 36, 'Liên hệ', color='#FFFFFF')
    p.text(900, 10, 190, 36, ('👤 Chào ' + user + ' ▾') if user else '👤 Đăng nhập / Đăng ký', color='#FFFFFF')
    p.text(p.fw - 110, 10, 100, 36, 'Giỏ hàng' + (' (%d)' % cart if cart else ''), color='#FFFFFF', bold=True)


def site_footer(p, y):
    p.rect(0, y, p.fw, 110, '', fill=DARK, stroke=DARK)
    p.text(40, y + 14, 300, 24, 'Cà Phê Đậm Đà', bold=True, color='#FFFFFF')
    p.text(40, y + 40, 330, 50, 'Hạt cà phê rang xay chất lượng cao.', color='#D9D9D9', size=11, valign='top')
    p.text(460, y + 14, 260, 24, 'Liên hệ', bold=True, color='#FFFFFF')
    p.text(460, y + 40, 300, 50, 'Hotline: 0901 234 567\nEmail: hello@caphedamda.vn', color='#D9D9D9', size=11, valign='top')
    p.text(820, y + 14, 260, 24, 'Địa chỉ', bold=True, color='#FFFFFF')
    p.text(820, y + 40, 300, 50, '123 Phin Street, Quận Caffeine, TP.HCM', color='#D9D9D9', size=11, valign='top')


def product_card(p, x, y, w=340, name='Tên sản phẩm', price='000.000đ', cat='Loại', btn='Thêm vào giỏ'):
    p.rect(x, y, w, 250, '', fill='#FFFFFF', stroke='#B3B3B3', rounded=3)
    p.img(x, y, w, 120, 'Ảnh sản phẩm')
    p.chip(x + 12, y + 130, 70, cat)
    p.text(x + 12, y + 156, w - 24, 22, name, size=12, bold=True)
    p.text(x + 12, y + 178, 140, 22, price, size=12, bold=True, color=BROWN)
    p.button(x + w - 128, y + 204, 116, 30, btn, primary=True, size=11)


def admin_shell(p, active, title):
    w = p.fw
    p.rect(0, 0, w, 60, '', fill='#FFFFFF', stroke='#CFCFCF')
    p.text(24, 12, 320, 36, '☕  Cà Phê Đậm Đà - Admin', size=14, bold=True)
    p.rect(w - 380, 14, 32, 32, 'Q', fill=BROWN, stroke=BROWN, color='#FFFFFF', bold=True, rounded=50)
    p.text(w - 340, 12, 110, 36, 'Quản trị viên')
    p.button(w - 220, 14, 90, 32, '← Quay về', size=11)
    p.button(w - 120, 14, 100, 32, 'Đăng xuất', size=11)
    p.rect(0, 60, 230, p.h - 60, '', fill=LGREY, stroke='#CFCFCF')
    p.text(20, 76, 180, 20, 'QUẢN TRỊ', size=10, bold=True, color='#808080')
    items = ['📊 Tổng quan', '👥 Khách hàng', '📂 Loại sản phẩm', '☕ Sản phẩm', '📥 Nhập hàng', '💰 Giá bán', '📦 Đơn hàng', '📈 Tồn kho']
    for i, it in enumerate(items):
        on = (it.split(' ', 1)[1] == active)
        p.rect(16, 104 + i * 44, 198, 36, it, fill=('#FFE9DC' if on else '#FFFFFF'), stroke=('#D9772A' if on else '#D9D9D9'),
               color=('#B34E00' if on else INK), bold=on, align='left', rounded=6)
    p.text(260, 76, 600, 40, title, size=20, bold=True)
