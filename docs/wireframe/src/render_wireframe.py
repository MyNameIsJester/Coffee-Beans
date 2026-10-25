"""Xuất PNG/PDF từ CHÍNH file docs/CoffeeBeans_Wireframe.drawio (không dựng lại từ dữ liệu khác).
Dùng Chromium (Playwright). Đây là bộ render đơn giản của dự án, KHÔNG phải diagrams.net: hình có thể lệch nhẹ so với
khi mở trong diagrams.net. Muốn bản chuẩn, hãy mở file .drawio và dùng File > Export as.
Chạy:  python docs/wireframe/src/render_wireframe.py"""
import html, io, os, re, sys, unicodedata
import xml.etree.ElementTree as ET
from playwright.sync_api import sync_playwright
from pypdf import PdfReader, PdfWriter

HERE = os.path.dirname(os.path.abspath(__file__))
DRAWIO = os.path.join(HERE, '..', '..', 'CoffeeBeans_Wireframe.drawio')
PNG_DIR = os.path.join(HERE, '..', 'png')
PDF_OUT = os.path.join(HERE, '..', '..', 'CoffeeBeans_Wireframe.pdf')


def style_dict(s):
    d = {}
    for part in (s or '').split(';'):
        if not part: continue
        k, _, v = part.partition('=')
        d[k] = v
    return d


def slug(s):
    s = unicodedata.normalize('NFD', s).replace('đ', 'd').replace('Đ', 'D')
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^A-Za-z0-9]+', '-', s).strip('-').lower()


def clip(c, o, w, h):
    """Điểm giao của đoạn từ tâm (c) tới điểm o với biên hình chữ nhật w×h có tâm c."""
    dx, dy = o[0] - c[0], o[1] - c[1]
    if dx == 0 and dy == 0: return c
    t = min((w / 2) / abs(dx) if dx else 1e9, (h / 2) / abs(dy) if dy else 1e9)
    return (c[0] + dx * t, c[1] + dy * t)


def page_html(diagram):
    model = diagram.find('mxGraphModel')
    W, H = int(float(model.get('pageWidth'))), int(float(model.get('pageHeight')))
    cells = model.find('root').findall('mxCell')
    boxes, out_v, out_e = {}, [], []
    for c in cells:
        g = c.find('mxGeometry')
        if c.get('vertex') == '1' and g is not None:
            boxes[c.get('id')] = (float(g.get('x')), float(g.get('y')), float(g.get('width')), float(g.get('height')))
    for c in cells:
        st = style_dict(c.get('style'))
        g = c.find('mxGeometry')
        if c.get('vertex') == '1' and g is not None:
            x, y, w, h = boxes[c.get('id')]
            label = c.get('value') or ''
            is_text = 'text' in st
            fill = st.get('fillColor', 'none'); stroke = st.get('strokeColor', 'none')
            css = ['left:%spx' % x, 'top:%spx' % y, 'width:%spx' % w, 'height:%spx' % h]
            if fill != 'none': css.append('background:%s' % fill)
            if stroke != 'none':
                css.append('border:%spx %s %s' % (st.get('strokeWidth', '1'), 'dashed' if st.get('dashed') == '1' else 'solid', stroke))
            if st.get('rounded') == '1':
                css.append('border-radius:%spx' % (min(w, h) * float(st.get('arcSize', '15')) / 100))
            css.append('color:%s' % st.get('fontColor', '#000000'))
            css.append('font-size:%spx' % st.get('fontSize', '12'))
            if st.get('fontStyle') == '1': css.append('font-weight:700')
            al = st.get('align', 'center'); va = st.get('verticalAlign', 'middle')
            css.append('text-align:%s' % al)
            css.append('justify-content:%s' % {'left': 'flex-start', 'right': 'flex-end'}.get(al, 'center'))
            css.append('align-items:%s' % {'top': 'flex-start', 'bottom': 'flex-end'}.get(va, 'center'))
            pl = float(st.get('spacingLeft', 0)) + (2 if is_text else 0); pr = float(st.get('spacingRight', 0))
            css.append('padding:0 %spx 0 %spx' % (pr, pl))
            if va == 'top': css.append('padding-top:6px')
            out_v.append('<div class="v" style="%s"><span>%s</span></div>' % (';'.join(css), label))  # label đã là HTML hợp lệ (có <br>)
        elif c.get('edge') == '1':
            col = st.get('strokeColor', '#7F7F7F'); sw = st.get('strokeWidth', '1'); dash = ' stroke-dasharray="6 4"' if st.get('dashed') == '1' else ''
            arrow = st.get('endArrow', 'classic') != 'none'
            if c.get('source') and c.get('target') and c.get('source') in boxes and c.get('target') in boxes:
                a, b = boxes[c.get('source')], boxes[c.get('target')]
                ca, cb = (a[0] + a[2] / 2, a[1] + a[3] / 2), (b[0] + b[2] / 2, b[1] + b[3] / 2)
                p1, p2 = clip(ca, cb, a[2], a[3]), clip(cb, ca, b[2], b[3])
            else:
                sp = g.find("mxPoint[@as='sourcePoint']"); tp = g.find("mxPoint[@as='targetPoint']")
                p1, p2 = (float(sp.get('x')), float(sp.get('y'))), (float(tp.get('x')), float(tp.get('y')))
            out_e.append(('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" stroke-width="%s"%s%s/>' % (
                p1[0], p1[1], p2[0], p2[1], col, sw, dash, ' marker-end="url(#ah)"' if arrow else ''), c.get('value') or '', p1, p2))
    labels = ''
    for _, lab, p1, p2 in out_e:
        if lab:
            mx, my = (p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2
            labels += '<div class="el" style="left:%.1fpx;top:%.1fpx">%s</div>' % (mx, my, lab)
    svg = ('<svg width="%d" height="%d" style="position:absolute;left:0;top:0;overflow:visible"><defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">'
           '<path d="M0,0 L10,5 L0,10 z" fill="#4B3429"/></marker></defs>%s</svg>' % (W, H, ''.join(e[0] for e in out_e)))
    doc = ('<!DOCTYPE html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:#fff}'
           '#pg{position:relative;width:%dpx;height:%dpx;background:#fff;font-family:"Liberation Sans",Arial,Helvetica,sans-serif;overflow:hidden}'
           '.v{position:absolute;box-sizing:border-box;display:flex;line-height:1.25}.v span{display:block;max-width:100%%}'
           '.el{position:absolute;transform:translate(-50%%,-50%%);background:#fff;font-size:10px;color:#4B3429;padding:1px 4px;white-space:nowrap;border-radius:3px}'
           '</style></head><body><div id="pg">%s%s%s</div></body></html>' % (W, H, ''.join(out_v), svg, labels))
    return doc, W, H


def main():
    tree = ET.parse(DRAWIO)
    diagrams = tree.getroot().findall('diagram')
    os.makedirs(PNG_DIR, exist_ok=True)
    for f in os.listdir(PNG_DIR):
        if f.endswith('.png'): os.remove(os.path.join(PNG_DIR, f))
    parts = []
    with sync_playwright() as p:
        b = p.chromium.launch()
        for i, d in enumerate(diagrams):
            name = d.get('name'); doc, W, H = page_html(d)
            ctx = b.new_context(viewport={'width': W, 'height': H}, device_scale_factor=1.5)
            pg = ctx.new_page(); pg.set_content(doc); pg.wait_for_timeout(150)
            png = os.path.join(PNG_DIR, '%02d-%s.png' % (i, slug(re.sub(r'^\d+\s*', '', name))))
            pg.locator('#pg').screenshot(path=png)
            pdf = pg.pdf(width='%dpx' % W, height='%dpx' % H, print_background=True, page_ranges='1')
            parts.append((name, pdf)); ctx.close()
        b.close()
    w = PdfWriter()
    for name, pdf in parts:
        r = PdfReader(io.BytesIO(pdf)); n0 = len(w.pages); w.add_page(r.pages[0]); w.add_outline_item(name, n0)
    w.add_metadata({'/Title': 'Cà Phê Đậm Đà - Wireframe'})
    with open(PDF_OUT, 'wb') as fh: w.write(fh)
    print('PNG:', len(parts), 'trang ->', os.path.abspath(PNG_DIR)); print('PDF ->', os.path.abspath(PDF_OUT))


if __name__ == '__main__':
    main()
