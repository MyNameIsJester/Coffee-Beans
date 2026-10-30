/* CoffeeBeans - Lớp dữ liệu dùng chung (localStorage).
   Mọi trang khách hàng và admin đều đọc/ghi dữ liệu qua file này. */
(function (g) {
    'use strict';
    var CB = (g.CB = g.CB || {});

    var KEYS = {
        users: 'cb_users',
        admins: 'cb_admins',
        categories: 'cb_categories',
        products: 'cb_products',
        pricing: 'cb_pricing',
        receipts: 'cb_receipts',
        stockTx: 'cb_stock_tx',
        carts: 'cb_carts',
        orders: 'cb_orders',
        settings: 'cb_settings',
        counters: 'cb_counters',
        customerSession: 'cb_session_customer',
        adminSession: 'cb_session_admin'
    };

    /* ---------- Lưu trữ: localStorage, tự chuyển sang bộ nhớ tạm nếu bị chặn ---------- */
    var memory = {};
    var LS = null;
    try {
        LS = g.localStorage;
        LS.setItem('__cb_test__', '1');
        LS.removeItem('__cb_test__');
    } catch (e) {
        LS = null;
    }

    function rawGet(key) {
        if (LS) return LS.getItem(key);
        return Object.prototype.hasOwnProperty.call(memory, key) ? memory[key] : null;
    }
    function rawSet(key, text) {
        if (LS) LS.setItem(key, text);
        else memory[key] = text;
    }

    var db = {
        KEYS: KEYS,
        persistent: !!LS,
        has: function (key) {
            return rawGet(key) !== null;
        },
        read: function (key, fallback) {
            var text = rawGet(key);
            if (text === null) return fallback;
            try {
                return JSON.parse(text);
            } catch (e) {
                return fallback;
            }
        },
        write: function (key, value) {
            try {
                rawSet(key, JSON.stringify(value));
                return true;
            } catch (e) {
                // thường do vượt dung lượng localStorage
                return false;
            }
        },
        remove: function (key) {
            if (LS) LS.removeItem(key);
            else delete memory[key];
        },
        /* Bộ đếm tăng dần, dùng cho mã phiếu nhập, mã đơn hàng,... */
        nextCounter: function (name) {
            var counters = db.read(KEYS.counters, {});
            counters[name] = (counters[name] || 0) + 1;
            db.write(KEYS.counters, counters);
            return counters[name];
        },
        settings: function () {
            return db.read(KEYS.settings, { lowStockThreshold: 10, shippingFee: 30000 });
        }
    };

    /* ---------- Tiện ích chung ---------- */
    function pad(n, len) {
        var s = String(n);
        while (s.length < len) s = '0' + s;
        return s;
    }

    var util = {
        pad: pad,
        dateStr: function (d) {
            d = d || new Date();
            return d.getFullYear() + '-' + pad(d.getMonth() + 1, 2) + '-' + pad(d.getDate(), 2);
        },
        today: function () {
            return util.dateStr(new Date());
        },
        nowISO: function () {
            return new Date().toISOString();
        },
        uid: function (prefix) {
            return (
                (prefix || 'id') +
                '-' +
                Date.now().toString(36) +
                Math.random().toString(36).slice(2, 7)
            );
        },
        fmtVND: function (n) {
            if (n === null || n === undefined || isNaN(n)) return '—';
            return Math.round(n).toLocaleString('vi-VN') + 'đ';
        },
        /* Chuẩn hóa ngày tháng */
        fmtDate: function (s) {
            if (!s) return '';
            var d = String(s).slice(0, 10).split('-');
            if (d.length !== 3) return s;
            return d[2] + '/' + d[1] + '/' + d[0];
        },
        fmtDateTime: function (iso) {
            if (!iso) return '';
            var d = new Date(iso);
            if (isNaN(d)) return iso;
            return (
                pad(d.getHours(), 2) + ':' + pad(d.getMinutes(), 2) + ' ' + util.fmtDate(util.dateStr(d))
            );
        },
        esc: function (s) {
            return String(s === null || s === undefined ? '' : s)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        },
        /* Chuẩn hóa để tìm kiếm không phân biệt hoa/thường và dấu tiếng Việt */
        norm: function (s) {
            return String(s === null || s === undefined ? '' : s)
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd')
                .replace(/Đ/g, 'd')
                .toLowerCase()
                .trim();
        },
        /* Băm mật khẩu */
        hashPassword: function (password, salt) {
            var str = salt + ':' + password;
            var h1 = 0xdeadbeef,
                h2 = 0x41c6ce57;
            for (var i = 0, ch; i < str.length; i++) {
                ch = str.charCodeAt(i);
                h1 = Math.imul(h1 ^ ch, 2654435761);
                h2 = Math.imul(h2 ^ ch, 1597334677);
            }
            h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
            h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
            return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
        },
        isEmail: function (s) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
        },
        isPhone: function (s) {
            return /^(0|\+84)\d{9}$/.test(String(s).replace(/[\s.-]/g, ''));
        },
        isDate: function (s) {
            return /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(new Date(s + 'T00:00:00'));
        }
    };

    CB.db = db;
    CB.util = util;
})(typeof window !== 'undefined' ? window : globalThis);
