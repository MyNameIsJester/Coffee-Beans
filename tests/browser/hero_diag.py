import sys, json; sys.path.insert(0, '/tmp/e2e')
from common import *
JS = """(() => {
 const q = s => document.querySelector(s);
 const info = (el) => { if(!el) return null; const r = el.getBoundingClientRect(), c = getComputedStyle(el);
   return {tag: el.tagName+'.'+el.className, top: Math.round(r.top+scrollY), h: Math.round(r.height), w: Math.round(r.width), padding: c.padding, margin: c.margin, position: c.position, bg: c.backgroundColor.slice(0,30)} };
 return { hero: info(q('.hero')), media: info(q('.hero-media')), slider: info(q('.hero-slider')), slide: info(q('.hero-slide')), overlay: info(q('.hero-overlay')), content: info(q('.hero-content')),
   heroChildren: [...q('.hero').children].map(e=>e.tagName+'.'+e.className) };
})()"""
with sync_playwright() as p:
    b = p.chromium.launch()
    for label, w, h, mob in [('desktop', 1366, 900, False), ('mobile', 390, 844, True)]:
        ctx, logs = setup_context(b, w, h, mob); pg = ctx.new_page()
        pg.goto(BASE + 'index.html'); pg.wait_for_load_state('networkidle'); pg.wait_for_timeout(800)
        pg.screenshot(path=SHOTS + 'hero_before_%s.png' % label, clip={'x':0,'y':0,'width':w,'height':h})
        print(label); print(json.dumps(pg.evaluate(JS), ensure_ascii=False, indent=1))
        ctx.close()
    b.close()
