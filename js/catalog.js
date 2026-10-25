/* CoffeeBeans - Danh mục, sản phẩm và tính giá.
   Giá bán KHÔNG lưu trực tiếp. Luôn tính từ:
   Giá bán = Giá vốn x (1 + Tỷ lệ lợi nhuận / 100)
   - Giá vốn: bình quân gia quyền của các dòng thuộc phiếu nhập ĐÃ HOÀN THÀNH.
   - Tỷ lệ lợi nhuận: của sản phẩm nếu có, nếu không thì của loại sản phẩm. */
(function (g) {
    'use strict';
    var CB = (g.CB = g.CB || {});
    var db = CB.db,
        K = CB.db.KEYS,
        U = CB.util;

    var PLACEHOLDER_IMAGE = 'images/logo.svg';

    function slugify(s) {
        return U.norm(s)
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    function fail(error, field) {
        return { ok: false, error: error, field: field || null };
    }

    /* ---------- Phân trang dùng chung ---------- */
    U.paginate = function (list, page, size) {
        size = size || 9;
        var total = list.length;
        var pages = Math.max(1, Math.ceil(total / size));
        page = parseInt(page, 10);
        if (isNaN(page) || page < 1) page = 1;
        if (page > pages) page = pages;
        var start = (page - 1) * size;
        return { items: list.slice(start, start + size), page: page, pages: pages, total: total, size: size };
    };

    var catalog = {
        placeholderImage: PLACEHOLDER_IMAGE,

        /* ================= Loại sản phẩm ================= */
        categories: function (opts) {
            var all = db.read(K.categories, []);
            if (opts && opts.includeHidden) return all;
            return all.filter(function (c) {
                return !c.hidden;
            });
        },
        categoryById: function (id) {
            var all = db.read(K.categories, []);
            for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
            return null;
        },
        categoryBySlug: function (slug) {
            var all = db.read(K.categories, []);
            for (var i = 0; i < all.length; i++) if (all[i].slug === slug) return all[i];
            return null;
        },
        productCountByCategory: function (categoryId) {
            return db.read(K.products, []).filter(function (p) {
                return p.categoryId === categoryId;
            }).length;
        },
        /* data: {id?, name, description?} */
        saveCategory: function (data) {
            var name = String(data.name || '').trim();
            if (!name) return fail('Vui lòng nhập tên loại sản phẩm.', 'name');
            var all = db.read(K.categories, []);
            var dup = all.some(function (c) {
                return c.id !== data.id && U.norm(c.name) === U.norm(name);
            });
            if (dup) return fail('Tên loại sản phẩm đã tồn tại.', 'name');
            var slug = slugify(name);
            var slugDup = all.some(function (c) {
                return c.id !== data.id && c.slug === slug;
            });
            if (slugDup) slug = slug + '-' + (all.length + 1);

            var cat;
            if (data.id) {
                cat = all.filter(function (c) {
                    return c.id === data.id;
                })[0];
                if (!cat) return fail('Không tìm thấy loại sản phẩm cần sửa.');
                cat.name = name;
                cat.description = String(data.description || '').trim();
                // giữ nguyên slug cũ để đường dẫn không bị đổi khi sửa tên
            } else {
                cat = {
                    id: U.uid('cat'),
                    name: name,
                    slug: slug,
                    description: String(data.description || '').trim(),
                    hidden: false,
                    createdAt: U.nowISO()
                };
                all.push(cat);
            }
            db.write(K.categories, all);
            return { ok: true, category: cat };
        },
        setCategoryHidden: function (id, hidden) {
            var all = db.read(K.categories, []);
            var cat = all.filter(function (c) {
                return c.id === id;
            })[0];
            if (!cat) return fail('Không tìm thấy loại sản phẩm.');
            cat.hidden = !!hidden;
            db.write(K.categories, all);
            return { ok: true, category: cat };
        },
        /* Không xóa loại còn sản phẩm phụ thuộc. */
        deleteCategory: function (id) {
            var count = catalog.productCountByCategory(id);
            if (count > 0)
                return {
                    ok: false,
                    dependent: count,
                    error:
                        'Loại này đang có ' +
                        count +
                        ' sản phẩm. Hãy chuyển hoặc xóa các sản phẩm đó trước, hoặc chọn "Ẩn" loại này.'
                };
            var all = db.read(K.categories, []).filter(function (c) {
                return c.id !== id;
            });
            db.write(K.categories, all);
            var pricing = catalog.pricing();
            delete pricing.categoryMargins[id];
            db.write(K.pricing, pricing);
            return { ok: true };
        },

        /* ================= Sản phẩm ================= */
        /* opts: {includeHidden, categoryId} - mặc định chỉ lấy sản phẩm hiển thị với khách */
        products: function (opts) {
            opts = opts || {};
            var cats = {};
            db.read(K.categories, []).forEach(function (c) {
                cats[c.id] = c;
            });
            return db.read(K.products, []).filter(function (p) {
                if (opts.categoryId && p.categoryId !== opts.categoryId) return false;
                if (opts.includeHidden) return true;
                return !p.hidden && cats[p.categoryId] && !cats[p.categoryId].hidden;
            });
        },
        productById: function (id) {
            var all = db.read(K.products, []);
            for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
            return null;
        },
        /* data: {id?, code, name, categoryId, image?, description?, origin?, roast?, weight?, notes?} */
        saveProduct: function (data) {
            var code = String(data.code || '').trim().toUpperCase();
            var name = String(data.name || '').trim();
            if (!code) return fail('Vui lòng nhập mã sản phẩm.', 'code');
            if (!/^[A-Z0-9_-]{2,20}$/.test(code))
                return fail('Mã sản phẩm chỉ gồm chữ, số, dấu gạch (2-20 ký tự).', 'code');
            if (!name) return fail('Vui lòng nhập tên sản phẩm.', 'name');
            if (!data.categoryId || !catalog.categoryById(data.categoryId))
                return fail('Vui lòng chọn loại sản phẩm hợp lệ.', 'categoryId');
            var all = db.read(K.products, []);
            var dup = all.some(function (p) {
                return p.id !== data.id && p.code.toUpperCase() === code;
            });
            if (dup) return fail('Mã sản phẩm "' + code + '" đã tồn tại.', 'code');

            var fields = {
                code: code,
                name: name,
                categoryId: data.categoryId,
                image: String(data.image || '').trim() || PLACEHOLDER_IMAGE,
                description: String(data.description || '').trim()
            };
            ['origin', 'roast', 'weight'].forEach(function (k) {
                if (data[k] !== undefined) fields[k] = String(data[k] || '').trim();
            });
            if (data.notes !== undefined) fields.notes = data.notes;

            var prod;
            if (data.id) {
                prod = all.filter(function (p) {
                    return p.id === data.id;
                })[0];
                if (!prod) return fail('Không tìm thấy sản phẩm cần sửa.');
                Object.keys(fields).forEach(function (k) {
                    prod[k] = fields[k];
                });
            } else {
                prod = Object.assign({ id: U.uid('sp'), hidden: false, createdAt: U.nowISO() }, fields);
                all.push(prod);
            }
            if (!db.write(K.products, all))
                return fail('Không lưu được dữ liệu (có thể ảnh quá lớn). Hãy chọn ảnh nhỏ hơn.', 'image');
            return { ok: true, product: prod };
        },
        setProductHidden: function (id, hidden) {
            var all = db.read(K.products, []);
            var p = all.filter(function (x) {
                return x.id === id;
            })[0];
            if (!p) return fail('Không tìm thấy sản phẩm.');
            p.hidden = !!hidden;
            db.write(K.products, all);
            return { ok: true, product: p };
        },
        /* Sản phẩm đã có phiếu nhập hoặc đơn hàng thì không xóa được, chỉ ẩn. */
        isProductReferenced: function (id) {
            var inReceipts = db.read(K.receipts, []).some(function (r) {
                return r.lines.some(function (l) {
                    return l.productId === id;
                });
            });
            var inOrders = db.read(K.orders, []).some(function (o) {
                return o.items.some(function (i) {
                    return i.productId === id;
                });
            });
            return inReceipts || inOrders;
        },
        deleteProduct: function (id) {
            if (catalog.isProductReferenced(id))
                return {
                    ok: false,
                    referenced: true,
                    error: 'Sản phẩm đã có phiếu nhập hoặc đơn hàng nên không thể xóa. Hãy chọn "Ẩn" để ngừng bán.'
                };
            var all = db.read(K.products, []).filter(function (p) {
                return p.id !== id;
            });
            db.write(K.products, all);
            var pricing = catalog.pricing();
            delete pricing.productMargins[id];
            db.write(K.pricing, pricing);
            // gỡ khỏi giỏ hàng của mọi tài khoản
            var carts = db.read(K.carts, {});
            Object.keys(carts).forEach(function (uid) {
                carts[uid] = carts[uid].filter(function (i) {
                    return i.productId !== id;
                });
            });
            db.write(K.carts, carts);
            return { ok: true };
        },

        /* ================= Giá vốn, lợi nhuận, giá bán ================= */
        pricing: function () {
            var p = db.read(K.pricing, null) || {};
            p.categoryMargins = p.categoryMargins || {};
            p.productMargins = p.productMargins || {};
            return p;
        },
        setCategoryMargin: function (categoryId, percent) {
            var v = Number(percent);
            if (percent === '' || percent === null || isNaN(v) || v < 0 || v > 1000)
                return fail('Tỷ lệ lợi nhuận phải là số từ 0 đến 1000.');
            if (!catalog.categoryById(categoryId)) return fail('Không tìm thấy loại sản phẩm.');
            var p = catalog.pricing();
            p.categoryMargins[categoryId] = v;
            db.write(K.pricing, p);
            return { ok: true };
        },
        /* percent = null/'' để xóa tỷ lệ riêng, quay về dùng tỷ lệ của loại */
        setProductMargin: function (productId, percent) {
            if (!catalog.productById(productId)) return fail('Không tìm thấy sản phẩm.');
            var p = catalog.pricing();
            if (percent === null || percent === '' || percent === undefined) {
                delete p.productMargins[productId];
            } else {
                var v = Number(percent);
                if (isNaN(v) || v < 0 || v > 1000)
                    return fail('Tỷ lệ lợi nhuận phải là số từ 0 đến 1000.');
                p.productMargins[productId] = v;
            }
            db.write(K.pricing, p);
            return { ok: true };
        },
        /* Giá vốn bình quân gia quyền từ các phiếu nhập đã hoàn thành. null nếu chưa có dữ liệu. */
        cost: function (productId) {
            var qty = 0,
                amount = 0;
            db.read(K.receipts, []).forEach(function (r) {
                if (r.status !== 'completed') return;
                r.lines.forEach(function (l) {
                    if (l.productId === productId) {
                        qty += l.qty;
                        amount += l.qty * l.unitCost;
                    }
                });
            });
            return qty > 0 ? Math.round(amount / qty) : null;
        },
        /* -> {percent, source: 'product' | 'category'} hoặc null */
        margin: function (productId) {
            var p = catalog.pricing();
            if (p.productMargins[productId] !== undefined && p.productMargins[productId] !== null)
                return { percent: p.productMargins[productId], source: 'product' };
            var prod = catalog.productById(productId);
            if (prod && p.categoryMargins[prod.categoryId] !== undefined)
                return { percent: p.categoryMargins[prod.categoryId], source: 'category' };
            return null;
        },
        priceInfo: function (productId) {
            var cost = catalog.cost(productId);
            var m = catalog.margin(productId);
            var price = null;
            if (cost !== null && m) price = Math.round(cost * (1 + m.percent / 100));
            return {
                cost: cost,
                marginPercent: m ? m.percent : null,
                marginSource: m ? m.source : null,
                price: price
            };
        },
        price: function (productId) {
            return catalog.priceInfo(productId).price;
        },

        /* ================= Dạng xem đầy đủ cho giao diện ================= */
        view: function (productOrId) {
            var p = typeof productOrId === 'string' ? catalog.productById(productOrId) : productOrId;
            if (!p) return null;
            var info = catalog.priceInfo(p.id);
            var cat = catalog.categoryById(p.categoryId);
            var stock = CB.inventory ? CB.inventory.stock(p.id) : 0;
            var available = CB.inventory ? CB.inventory.available(p.id) : 0;
            return Object.assign({}, p, {
                category: cat,
                categoryName: cat ? cat.name : '',
                cost: info.cost,
                marginPercent: info.marginPercent,
                marginSource: info.marginSource,
                price: info.price,
                stock: stock,
                available: available,
                visible: !p.hidden && !!cat && !cat.hidden
            });
        },
        /* Tìm kiếm cơ bản và nâng cao cho khách hàng.
           q: tên (không phân biệt dấu), categoryId, min, max (VND), sort. */
        search: function (opts) {
            opts = opts || {};
            var q = U.norm(opts.q || '');
            var min = opts.min === undefined || opts.min === null || opts.min === '' ? null : Number(opts.min);
            var max = opts.max === undefined || opts.max === null || opts.max === '' ? null : Number(opts.max);
            var list = catalog.products().map(catalog.view);
            list = list.filter(function (v) {
                if (q && U.norm(v.name).indexOf(q) === -1) return false;
                if (opts.categoryId && v.categoryId !== opts.categoryId) return false;
                if (min !== null || max !== null) {
                    if (v.price === null) return false;
                    if (min !== null && v.price < min) return false;
                    if (max !== null && v.price > max) return false;
                }
                return true;
            });
            var byName = function (a, b) {
                return a.name.localeCompare(b.name, 'vi');
            };
            switch (opts.sort) {
                case 'price-asc':
                    list.sort(function (a, b) {
                        return (a.price === null ? Infinity : a.price) - (b.price === null ? Infinity : b.price);
                    });
                    break;
                case 'price-desc':
                    list.sort(function (a, b) {
                        return (b.price === null ? -1 : b.price) - (a.price === null ? -1 : a.price);
                    });
                    break;
                case 'name-asc':
                    list.sort(byName);
                    break;
                case 'name-desc':
                    list.sort(function (a, b) {
                        return byName(b, a);
                    });
                    break;
                default:
                    list.sort(function (a, b) {
                        return a.code.localeCompare(b.code);
                    });
            }
            return list;
        }
    };

    CB.catalog = catalog;
})(typeof window !== 'undefined' ? window : globalThis);
