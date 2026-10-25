import sys; sys.path.insert(0, '/tmp/e2e')
from common import *
CUSTOMER = [('index','index.html'),('products','products.html'),('products_cat','products.html?cat=robusta'),('detail','product-detail.html?id=kenyan-aa-grade'),('register','register.html'),('cart','cart.html'),('checkout','checkout.html'),('confirm','order-confirmation.html?order=%ORDER%'),('history','order-history.html'),('profile','profile.html')]
ADMIN = ['dashboard','users','categories','products','receipts','pricing','orders','stock']
JS_OFF = """[...document.querySelectorAll('a,button,input,select')].filter(e=>{const r=e.getBoundingClientRect(); if(!(r.width>0 && (r.right>window.innerWidth+1 || r.left<-1))) return false; let p=e.parentElement; while(p && p!==document.body){ const o=getComputedStyle(p).overflowX; if(o!=='visible') return false; p=p.parentElement } return true}).map(e=>e.tagName+'.'+e.className).slice(0,5)"""
with sync_playwright() as p:
    browser = p.chromium.launch()
    for label, w, h, mobile in [('m', 390, 844, True), ('t', 768, 1024, False), ('d', 1366, 900, False)]:
        print('\n[Viewport %s %dx%d]' % (label, w, h))
        ctx, logs = setup_context(browser, w, h, mobile)
        page = ctx.new_page(); watch(page, logs); page.set_default_timeout(8000)
        page.goto(BASE + 'register.html'); page.wait_for_load_state('networkidle')
        page.evaluate("CB.auth.login('guest1','guest1123'); CB.cart.clear(); CB.cart.add('arabica-premium',2); CB.cart.add('kenyan-aa-grade',1);")
        order_id = page.evaluate("CB.orders.byUser(CB.auth.current().id)[0].id")
        for name, url in CUSTOMER:
            page.goto(BASE + url.replace('%ORDER%', order_id)); page.wait_for_load_state('networkidle'); page.wait_for_timeout(900)
            page.screenshot(path=SHOTS + '%s_%s.png' % (label, name), full_page=True)
            page.evaluate("window.scrollTo(80, 0)"); sx = page.evaluate("window.scrollX"); page.evaluate("window.scrollTo(0,0)")
            check(sx == 0, 'khách/%s: không cuộn ngang được' % name, sx)
            bad = page.evaluate("[...document.images].filter(i=>i.complete && i.naturalWidth===0).map(i=>i.getAttribute('src'))")
            check(bad == [], 'khách/%s: ảnh tải được' % name, bad)
            if name != 'register':
                off = page.evaluate(JS_OFF); check(off == [], 'khách/%s: không có điều khiển ngoài màn hình' % name, off)
        if mobile:
            page.goto(BASE + 'index.html'); page.wait_for_load_state('networkidle')
            check(page.locator('.menu').first.is_hidden() and page.locator('#menuBtn').is_visible(), 'mobile: menu ngang ẩn, nút Menu hiện')
            page.click('#menuBtn'); page.wait_for_timeout(200)
            check(page.locator('#mobileMenu').is_visible() and page.locator('#mobileMenu a').count() >= 8, 'mobile: bấm Menu hiện menu dọc đủ liên kết')
        # admin
        page.evaluate("CB.auth.adminLogin('admin','admin123')")
        for v in ADMIN:
            page.goto(BASE + 'admin-dashboard.html#' + v); page.wait_for_load_state('networkidle'); page.wait_for_timeout(500)
            page.screenshot(path=SHOTS + '%s_admin_%s.png' % (label, v), full_page=True)
            page.evaluate("window.scrollTo(80, 0)"); sx = page.evaluate("window.scrollX"); page.evaluate("window.scrollTo(0,0)")
            tw = page.evaluate("document.documentElement.scrollWidth"); 
            check(sx == 0, 'admin/%s: không cuộn ngang được toàn trang (scrollWidth %d)' % (v, tw), (sx, tw))
        check(logs == [], '%s: không lỗi console' % label, logs)
        ctx.close()
    browser.close()
sys.exit(1 if summary() else 0)
