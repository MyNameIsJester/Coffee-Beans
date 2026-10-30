/* CoffeeBeans - Dữ liệu mẫu trình diễn.
   Chỉ khởi tạo phần dữ liệu nào chưa tồn tại trong localStorage.
   Dữ liệu mẫu được tạo qua chính các hàm nghiệp vụ (phiếu nhập, đặt hàng, đổi trạng thái)
   nên giá vốn, % lợi nhuận, giá bán, tồn kho và đơn hàng luôn nhất quán với nhau.

   Tài khoản mẫu:  admin / admin123   |   guest1 / guest1123   |   guest2 / guest2123   |   guest3 / guest3123 */
(function (g) {
    'use strict';
    var CB = (g.CB = g.CB || {});
    var db = CB.db,
        K = CB.db.KEYS,
        U = CB.util;

    var CATEGORIES = [
        { id: 'cat-arabica', name: 'Arabica', slug: 'arabica', description: 'Hạt Arabica hương thơm tinh tế, vị chua thanh và hậu ngọt.' },
        { id: 'cat-robusta', name: 'Robusta', slug: 'robusta', description: 'Hạt Robusta đậm vị, ít chua, nhiều caffeine, hợp pha phin.' },
        { id: 'cat-blend', name: 'Blend', slug: 'blend', description: 'Hỗn hợp phối trộn cân bằng giữa các dòng hạt, ổn định hương vị.' }
    ];

    /* margin: tỷ lệ lợi nhuận riêng của sản phẩm (nếu không có thì dùng tỷ lệ của loại)
       cost: giá nhập mẫu. Giá bán = cost x (1 + %) trùng đúng giá đang hiển thị trên website. */
    var PRODUCTS = [
        { id: 'arabica-premium', code: 'CF001', name: 'Arabica Premium 250g', cat: 'cat-arabica', image: 'images/arabica-premium.jpg', origin: 'Ethiopia và Colombia', roast: 'Rang vừa', weight: '250g', notes: ['Vị chua nhẹ, ngọt cân bằng', 'Hương hoa và trái cây', 'Hậu vị dịu'], description: 'Hạt Arabica tuyển chọn từ vùng cao Ethiopia và Colombia, rang tại Việt Nam để giữ trọn hương vị. Hương thơm nhẹ nhàng, vị chua thanh và độ ngọt tự nhiên.', cost: 108000 },
        { id: 'robusta-bold', code: 'CF002', name: 'Robusta Bold 500g', cat: 'cat-robusta', image: 'images/robusta-bold.jpg', origin: 'Tây Nguyên, Việt Nam', roast: 'Rang đậm', weight: '500g', notes: ['Vị đắng đậm, body dày', 'Hương cacao, hạt dẻ', 'Crema dày khi pha máy'], description: 'Robusta rang đậm từ Tây Nguyên, vị mạnh và đắng đặc trưng, phù hợp pha phin và cà phê sữa.', cost: 103200 },
        { id: 'signature-blend', code: 'CF003', name: 'Signature Blend 1kg', cat: 'cat-blend', image: 'images/signature-blend.jpg', origin: 'Phối trộn Arabica và Robusta', roast: 'Rang vừa đậm', weight: '1kg', notes: ['Cân bằng giữa đậm và thơm', 'Hậu vị ngọt caramel'], description: 'Công thức phối trộn riêng của Cà Phê Đậm Đà, cân bằng độ đậm của Robusta và hương thơm của Arabica. Dùng được cho phin, máy pha và moka pot.', cost: 212000 },
        { id: 'ethiopia-yirgacheffe', code: 'CF004', name: 'Ethiopia Yirgacheffe 300g', cat: 'cat-arabica', image: 'images/ethiopia-new.jpg', origin: 'Yirgacheffe, Ethiopia', roast: 'Rang nhạt', weight: '300g', notes: ['Hương hoa nhài, chanh', 'Vị chua sáng, thanh', 'Hậu vị trà'], description: 'Arabica vùng Yirgacheffe nổi tiếng với hương hoa và trái cây, vị chua thanh sáng. Hợp pha pour over.', cost: 116000 },
        { id: 'colombian-supremo', code: 'CF005', name: 'Colombian Supremo 400g', cat: 'cat-arabica', image: 'images/colombian-new.jpg', origin: 'Huila, Colombia', roast: 'Rang vừa', weight: '400g', notes: ['Vị ngọt caramel', 'Hương hạt dẻ, chocolate sữa', 'Body vừa'], description: 'Hạt Supremo cỡ lớn từ Colombia, vị ngọt tròn đầy với hương caramel và hạt dẻ.', cost: 124000 },
        { id: 'brazilian-arabica', code: 'CF006', name: 'Brazilian Arabica 500g', cat: 'cat-arabica', image: 'images/brazilian.jpg', origin: 'Minas Gerais, Brazil', roast: 'Rang vừa', weight: '500g', notes: ['Vị ngọt, ít chua', 'Hương chocolate, hạt', 'Body dày'], description: 'Arabica Brazil vị ngọt dịu, ít chua, body dày. Lựa chọn dễ uống cho dùng hằng ngày.', cost: 120000, margin: 15 },
        { id: 'vietnam-robusta', code: 'CF007', name: 'Vietnam Robusta 500g', cat: 'cat-robusta', image: 'images/vietnam-new.jpg', origin: 'Đắk Lắk, Việt Nam', roast: 'Rang đậm', weight: '500g', notes: ['Đắng mạnh, hậu đậm', 'Hương socola đen'], description: 'Robusta nguyên chất từ Đắk Lắk, rang đậm kiểu truyền thống Việt Nam cho ly cà phê phin đúng vị.', cost: 100000 },
        { id: 'indonesian-sumatra', code: 'CF008', name: 'Indonesian Sumatra 600g', cat: 'cat-robusta', image: 'images/indonesia-new.jpg', origin: 'Sumatra, Indonesia', roast: 'Rang đậm', weight: '600g', notes: ['Hương đất, gỗ, gia vị', 'Body rất dày', 'Ít chua'], description: 'Hạt Sumatra rang đậm, body dày với hương đất và gia vị đặc trưng, ít chua.', cost: 108000 },
        { id: 'premium-espresso-blend', code: 'CF009', name: 'Premium Espresso Blend 1kg', cat: 'cat-blend', image: 'images/espresso.jpg', origin: 'Phối trộn nhiều vùng', roast: 'Rang đậm', weight: '1kg', notes: ['Crema dày, bền', 'Vị đậm, hậu ngọt chocolate'], description: 'Blend dành riêng cho máy espresso, crema dày và vị đậm cân bằng. Phù hợp quán cà phê và nhu cầu dùng nhiều.', cost: 200000, margin: 40 },
        { id: 'dark-roast-supreme', code: 'CF010', name: 'Dark Roast Supreme 750g', cat: 'cat-robusta', image: 'images/dark-roast.jpg', origin: 'Tây Nguyên, Việt Nam', roast: 'Rang rất đậm', weight: '750g', notes: ['Đắng đậm, hương khói', 'Body nặng'], description: 'Robusta rang rất đậm cho người thích vị mạnh, hương khói và đắng sâu.', cost: 118400 },
        { id: 'kenyan-aa-grade', code: 'CF011', name: 'Kenyan AA Grade 350g', cat: 'cat-arabica', image: 'images/kenyan.jpg', origin: 'Nyeri, Kenya', roast: 'Rang vừa nhạt', weight: '350g', notes: ['Vị chua sáng như nho đen', 'Hương trái cây đỏ', 'Hậu vị rượu vang'], description: 'Kenya AA hạt cỡ lớn, vị chua sáng, hương trái cây đỏ rõ nét. Dành cho người thích cà phê đặc sản.', cost: 132000 },
        { id: 'costa-rica-tarazu', code: 'CF012', name: 'Costa Rica Tarazu 400g', cat: 'cat-arabica', image: 'images/costarica-new.jpg', origin: 'Tarrazú, Costa Rica', roast: 'Rang vừa', weight: '400g', notes: ['Vị chua tươi, sạch', 'Hương cam, mật ong', 'Hậu vị ngọt'], description: 'Arabica vùng Tarrazú vị sạch và sáng, hương cam và mật ong, hậu ngọt kéo dài.', cost: 126400 }
    ];

    /* Phiếu nhập mẫu */
    var KENYAN_STOCK = 12; // cảnh báo sắp hết hàng
    var QTY = { 'arabica-premium': 80, 'robusta-bold': 100, 'signature-blend': 40, 'ethiopia-yirgacheffe': 60, 'colombian-supremo': 60, 'brazilian-arabica': 70, 'vietnam-robusta': 120, 'indonesian-sumatra': 50, 'premium-espresso-blend': 30, 'dark-roast-supreme': 60, 'kenyan-aa-grade': KENYAN_STOCK, 'costa-rica-tarazu': 45 };

    function seedUsers() {
        var addr1 = { province: 'TP. Hồ Chí Minh', district: 'Quận 1', ward: 'Phường Bến Nghé', detail: '12 Nguyễn Huệ' };
        var addr2 = { province: 'Hà Nội', district: 'Quận Ba Đình', ward: 'Phường Điện Biên', detail: '25 Hoàng Diệu' };
        var list = [
            CB.auth.makeUser({ id: 'u-guest1', username: 'guest1', email: 'guest1@example.com', fullName: 'Khách hàng 1', phone: '0901000001', password: 'guest1123', address: addr1, createdAt: '2026-08-10T03:00:00.000Z' }),
            CB.auth.makeUser({ id: 'u-guest2', username: 'guest2', email: 'guest2@example.com', fullName: 'Khách hàng 2', phone: '0901000002', password: 'guest2123', address: addr2, createdAt: '2026-08-20T03:00:00.000Z' }),
            CB.auth.makeUser({ id: 'u-guest3', username: 'guest3', email: 'guest3@example.com', fullName: 'Khách hàng 3', phone: '0901000003', password: 'guest3123', createdAt: '2026-09-01T03:00:00.000Z' })
        ];
        db.write(K.users, list);
    }

    function seedAdmins() {
        var u = CB.auth.makeUser({ id: 'admin-1', username: 'admin', email: 'admin@caphedamda.vn', fullName: 'Quản trị viên', phone: '0901234567', password: 'admin123' });
        db.write(K.admins, [{ id: u.id, username: u.username, fullName: u.fullName, password: u.password }]);
    }

    function seedReceipts() {
        db.write(K.receipts, []);
        var costOf = {};
        PRODUCTS.forEach(function (p) { costOf[p.id] = p.cost; });
        function make(date, ids, qtyFn, complete) {
            var r = CB.inventory.saveReceipt({
                date: date,
                lines: ids.map(function (id) { return { productId: id, qty: qtyFn(id), unitCost: costOf[id] }; })
            });
            if (r.ok && complete) CB.inventory.completeReceipt(r.receipt.id);
        }
        make('2026-08-01', PRODUCTS.map(function (p) { return p.id; }), function (id) { return QTY[id]; }, true);
        make('2026-09-10', ['arabica-premium', 'vietnam-robusta', 'signature-blend'], function (id) { return { 'arabica-premium': 40, 'vietnam-robusta': 60, 'signature-blend': 20 }[id]; }, true);
        make('2026-10-14', ['ethiopia-yirgacheffe', 'colombian-supremo'], function () { return 30; }, false);
    }

    function seedOrders() {
        db.write(K.orders, []);
        function order(userId, date, items, path, method) {
            var u = CB.auth.userById(userId);
            var lines = items.map(function (it) {
                var p = CB.catalog.productById(it[0]);
                return { productId: p.id, code: p.code, name: p.name, image: p.image, unitPrice: CB.catalog.price(p.id), qty: it[1] };
            });
            var subtotal = lines.reduce(function (s, l) { return s + l.unitPrice * l.qty; }, 0);
            var fee = db.settings().shippingFee;
            var at = date + 'T05:00:00.000Z';
            var all = db.read(K.orders, []);
            var o = {
                id: U.uid('dh'),
                code: 'DH' + date.replace(/-/g, '') + '-' + U.pad(db.nextCounter('order'), 4),
                checkoutToken: null,
                userId: u.id,
                customer: { username: u.username, fullName: u.fullName, phone: u.phone, email: u.email },
                createdAt: at,
                date: date,
                items: lines,
                shipping: { source: 'account', fullName: u.fullName, phone: u.phone, province: u.address.province, district: u.address.district, ward: u.address.ward, detail: u.address.detail },
                payment: { method: method || 'cod', label: CB.orders.PAYMENTS[method || 'cod'], simulated: false },
                note: '',
                subtotal: subtotal,
                shippingFee: fee,
                total: subtotal + fee,
                status: CB.orders.STATUS.NEW,
                statusHistory: [{ status: CB.orders.STATUS.NEW, at: at }],
                stockDeducted: false
            };
            all.push(o);
            db.write(K.orders, all);
            path.forEach(function (step, i) {
                // mỗi bước lùi vài ngày để lịch sử trạng thái có thứ tự thời gian
                var d = new Date(at);
                d.setDate(d.getDate() + i + 1);
                CB.orders.setStatus(o.id, step, { at: d.toISOString() });
            });
        }
        var S = CB.orders.STATUS;
        order('u-guest1', '2026-09-15', [['arabica-premium', 2], ['kenyan-aa-grade', 4]], [S.PROCESSED, S.DELIVERED], 'cod');
        order('u-guest2', '2026-09-20', [['colombian-supremo', 2]], [S.PROCESSED, S.DELIVERED], 'bank');
        order('u-guest1', '2026-09-28', [['premium-espresso-blend', 1]], [S.CANCELED], 'cod');
        order('u-guest1', '2026-10-05', [['vietnam-robusta', 3], ['ethiopia-yirgacheffe', 1]], [S.PROCESSED], 'bank');
        order('u-guest1', '2026-10-12', [['signature-blend', 1]], [], 'cod');
    }

    function ensure() {
        if (!db.has(K.settings)) db.write(K.settings, { lowStockThreshold: 10, shippingFee: 30000 });
        if (!db.has(K.categories))
            db.write(K.categories, CATEGORIES.map(function (c) { return Object.assign({ hidden: false, createdAt: '2026-08-01T00:00:00.000Z' }, c); }));
        if (!db.has(K.products))
            db.write(K.products, PRODUCTS.map(function (p) {
                return { id: p.id, code: p.code, name: p.name, categoryId: p.cat, image: p.image, description: p.description, origin: p.origin, roast: p.roast, weight: p.weight, notes: p.notes, hidden: false, createdAt: '2026-08-01T00:00:00.000Z' };
            }));
        if (!db.has(K.pricing)) {
            var pm = {};
            PRODUCTS.forEach(function (p) { if (p.margin !== undefined) pm[p.id] = p.margin; });
            db.write(K.pricing, { categoryMargins: { 'cat-arabica': 25, 'cat-robusta': 25, 'cat-blend': 25 }, productMargins: pm });
        }
        if (!db.has(K.users)) seedUsers();
        if (!db.has(K.admins)) seedAdmins();
        if (!db.has(K.carts)) db.write(K.carts, {});
        if (!db.has(K.stockTx)) db.write(K.stockTx, []);
        if (!db.has(K.receipts)) seedReceipts();
        if (!db.has(K.orders)) seedOrders();
    }

    /* Xóa toàn bộ dữ liệu cửa hàng rồi tạo lại dữ liệu mẫu. */
    function reset() {
        Object.keys(K).forEach(function (k) { db.remove(K[k]); });
        ensure();
    }

    CB.seed = { ensure: ensure, reset: reset, PRODUCTS: PRODUCTS };
    ensure();
})(typeof window !== 'undefined' ? window : globalThis);
