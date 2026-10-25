import sys, json; sys.path.insert(0, '/tmp/e2e')
from common import *
JS = """(() => { const r = s => { const b=document.querySelector(s).getBoundingClientRect(); return [Math.round(b.top+scrollY), Math.round(b.height), Math.round(b.left), Math.round(b.width)] };
  return {media: r('.hero-media'), overlay: r('.hero-overlay'), inner: r('.hero-inner'), title: r('.hero-title'), dots: r('.hero-indicators')} })()"""
with sync_playwright() as p:
    b = p.chromium.launch()
    for label, w, h, mob in [('desktop', 1366, 900, False), ('tablet', 768, 1024, False), ('mobile', 390, 844, True)]:
        ctx, logs = setup_context(b, w, h, mob); pg = ctx.new_page(); watch(pg, logs)
        pg.goto(BASE + 'index.html'); pg.wait_for_load_state('networkidle'); pg.wait_for_timeout(800)
        pg.screenshot(path=SHOTS + 'hero_after_%s.png' % label, clip={'x':0,'y':0,'width':w,'height':h})
        g = pg.evaluate(JS); print(label, g)
        check(g['overlay'] == g['media'], '%s: lớp phủ trùng đúng vùng ảnh slider' % label, (g['overlay'], g['media']))
        # tâm tiêu đề vẫn nằm giữa vùng ảnh như trước
        mid_media = g['media'][0] + g['media'][1] / 2; mid_title = g['title'][0] + g['title'][1] / 2
        check(abs(mid_media - mid_title) < 80, '%s: nội dung banner vẫn ở vùng giữa ảnh' % label, (mid_media, mid_title))
        t0 = pg.evaluate("document.querySelector('.hero-slider').style.transform")
        pg.click('.hero-dot:nth-child(3)'); pg.wait_for_timeout(1000)
        t1 = pg.evaluate("document.querySelector('.hero-slider').style.transform")
        check(t1 == 'translateX(-200%)' and pg.locator('.hero-dot.active').count() == 1, '%s: chấm chỉ báo vẫn chuyển slide (%s)' % (label, t1))
        check(pg.locator('.hero-inner a').first.is_visible(), '%s: nút KHÁM PHÁ SẢN PHẨM vẫn hiển thị' % label)
        pg.click('.hero-inner a'); pg.wait_for_url('**/products.html')
        check(True, '%s: nút banner vẫn dẫn tới products.html' % label)
        check(logs == [], '%s: không lỗi console' % label, logs)
        ctx.close()
    b.close()
sys.exit(1 if summary() else 0)
