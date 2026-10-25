import re, sys
from playwright.sync_api import sync_playwright
BASE = 'http://127.0.0.1:8765/'
FA = '/tmp/fa/node_modules/@fortawesome/fontawesome-free/'
SHOTS = '/tmp/shots/'
results = {'pass': 0, 'fail': 0}
fails = []

def check(cond, name, extra=None):
    if cond:
        results['pass'] += 1; print('  PASS', name)
    else:
        results['fail'] += 1; fails.append(name); print('  FAIL', name, '->', extra if extra is not None else '')

def setup_context(browser, width=1366, height=900, mobile=False):
    ctx = browser.new_context(viewport={'width': width, 'height': height}, is_mobile=mobile, has_touch=mobile, device_scale_factor=1, accept_downloads=True)
    logs = []
    def route(r):
        url = r.request.url
        m = re.match(r'https://cdnjs\.cloudflare\.com/ajax/libs/font-awesome/6\.4\.0/(.*)', url)
        if m:
            path = FA + m.group(1).split('?')[0]
            try:
                body = open(path, 'rb').read()
                ct = 'text/css' if path.endswith('.css') else 'font/woff2' if path.endswith('woff2') else 'application/octet-stream'
                return r.fulfill(status=200, body=body, headers={'Content-Type': ct, 'Access-Control-Allow-Origin': '*'})
            except Exception:
                return r.abort()
        if not url.startswith(BASE) and not url.startswith('data:'):
            return r.abort()
        r.continue_()
    ctx.route('**/*', route)
    return ctx, logs

def watch(page, logs):
    def on_console(m):
        if m.type == 'error' and 'net::ERR_FAILED' not in m.text and 'Failed to load resource' not in m.text:
            logs.append('console.error: ' + m.text)
    page.on('console', on_console)
    page.on('pageerror', lambda e: logs.append('pageerror: ' + str(e)))

def summary():
    print('\nKết quả: %d đạt, %d lỗi' % (results['pass'], results['fail']))
    if fails: print('LỖI:', fails)
    return results['fail']
