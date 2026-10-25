const { JSDOM, VirtualConsole, requestInterceptor } = require('jsdom');
const fs = require('fs');
const path = require('path');
const http = require('http');

const ROOT = path.resolve(__dirname, '..', '..');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png' };

let server, port;
async function start() {
    server = http.createServer((req, res) => {
        const u = decodeURIComponent(req.url.split('?')[0]);
        const f = path.join(ROOT, u === '/' ? 'index.html' : u);
        if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.statusCode = 404; return res.end('nf'); }
        res.setHeader('Content-Type', MIME[path.extname(f)] || 'application/octet-stream');
        res.end(fs.readFileSync(f));
    });
    await new Promise((r) => server.listen(0, '127.0.0.1', r));
    port = server.address().port;
}
function stop() { server.close(); }

const RESOURCES = {
    interceptors: [
        requestInterceptor((request) => {
            if (!request.url.startsWith('http://127.0.0.1')) {
                // bỏ qua font/CDN bên ngoài (môi trường kiểm thử không có mạng)
                return new Response('', { status: 200, headers: { 'Content-Type': 'text/plain' } });
            }
        })
    ]
};

/* Mở một trang, giữ localStorage từ lần trước (mô phỏng điều hướng giữa các trang). */
async function visit(pathAndQuery, storage, opts) {
    opts = opts || {};
    const errors = [];
    const vc = new VirtualConsole();
    vc.on('jsdomError', (e) => /Not implemented: navigation/.test(e.message || '') ? null : errors.push('jsdomError: ' + (e.detail && e.detail.message || e.message)));
    vc.on('error', (m) => errors.push('console.error: ' + m));
    const dom = await JSDOM.fromURL('http://127.0.0.1:' + port + '/' + pathAndQuery, {
        runScripts: 'dangerously',
        resources: RESOURCES,
        pretendToBeVisual: true,
        virtualConsole: vc,
        beforeParse(w) {
            if (storage) Object.keys(storage).forEach((k) => w.localStorage.setItem(k, storage[k]));
            w.scrollTo = () => {};
            // jsdom không có IntersectionObserver (trình duyệt thật có): dựng bản giả đơn giản
            w.IntersectionObserver = class { constructor() {} observe(el) { el.classList.add('visible'); } unobserve() {} disconnect() {} };
            if (opts.beforeParse) opts.beforeParse(w);
        }
    });
    const w = dom.window;
    if (w.document.readyState !== 'complete') await new Promise((r) => w.addEventListener('load', r));
    await new Promise((r) => setTimeout(r, opts.wait || 80));
    const snap = () => { const o = {}; for (let i = 0; i < w.localStorage.length; i++) { const k = w.localStorage.key(i); o[k] = w.localStorage.getItem(k); } return o; };
    return { dom, w, d: w.document, errors, snap };
}

let pass = 0, failN = 0;
function ok(c, n, extra) { if (c) { pass++; console.log('  PASS ' + n); } else { failN++; console.log('  FAIL ' + n + (extra !== undefined ? '  -> ' + JSON.stringify(extra) : '')); } }
function eq(a, b, n) { ok(JSON.stringify(a) === JSON.stringify(b), n, { got: a, want: b }); }
function summary() { console.log('\nKết quả: ' + pass + ' đạt, ' + failN + ' lỗi'); return failN; }

module.exports = { start, stop, visit, ok, eq, summary, getPort: () => port };
