/* Kiểm thử logic nghiệp vụ (chạy bằng Node, không cần trình duyệt):  node tests/logic-test.js */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function boot() {
    const store = {};
    const ls = {
        getItem: (k) => (k in store ? store[k] : null),
        setItem: (k, v) => { store[k] = String(v); },
        removeItem: (k) => { delete store[k]; }
    };
    const win = { localStorage: ls, location: { href: '', pathname: '/x.html', search: '' } };
    win.window = win;
    const ctx = vm.createContext(win);
    ['db', 'catalog', 'inventory', 'auth', 'shop', 'seed'].forEach((f) => {
        vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'js', f + '.js'), 'utf8'), ctx, { filename: f + '.js' });
    });
    return win.CB;
}

let pass = 0, failN = 0;
function ok(cond, name, extra) {
    if (cond) { pass++; console.log('  PASS ' + name); }
    else { failN++; console.log('  FAIL ' + name + (extra !== undefined ? '  -> ' + JSON.stringify(extra) : '')); }
}
function eq(a, b, name) { ok(JSON.stringify(a) === JSON.stringify(b), name, { got: a, want: b }); }

/* ---------- 1. Giá bán giữ nguyên ---------- */
let CB = boot();
console.log('\n[1] Giá bán sau khi seed phải trùng giá đang hiển thị');
const expected = {
    'arabica-premium': 135000, 'robusta-bold': 129000, 'signature-blend': 265000,
    'ethiopia-yirgacheffe': 145000, 'colombian-supremo': 155000, 'brazilian-arabica': 138000,
    'vietnam-robusta': 125000, 'indonesian-sumatra': 135000, 'premium-espresso-blend': 280000,
    'dark-roast-supreme': 148000, 'kenyan-aa-grade': 165000, 'costa-rica-tarazu': 158000
};
Object.keys(expected).forEach((id) => eq(CB.catalog.price(id), expected[id], 'giá ' + id));
eq(CB.catalog.margin('premium-espresso-blend'), { percent: 40, source: 'product' }, 'ưu tiên % của sản phẩm');
eq(CB.catalog.margin('arabica-premium'), { percent: 25, source: 'category' }, 'dùng % của loại khi không có riêng');

/* ---------- 2. Tồn kho nhất quán ---------- */
console.log('\n[2] Tồn kho từ phiếu nhập và đơn hàng mẫu');
eq(CB.inventory.stock('arabica-premium'), 118, 'arabica-premium = 80 + 40 - 2 (đơn đã giao)');
eq(CB.inventory.stock('kenyan-aa-grade'), 8, 'kenyan = 12 - 4');
eq(CB.inventory.stock('ethiopia-yirgacheffe'), 60, 'phiếu nháp PN003 chưa cộng tồn');
eq(CB.inventory.reserved('vietnam-robusta'), 3, 'đang giữ cho đơn Đã xử lý');
eq(CB.inventory.available('vietnam-robusta'), 177, 'còn bán được = 180 - 3');
eq(CB.inventory.reserved('premium-espresso-blend'), 0, 'đơn hủy không giữ hàng');
eq(CB.inventory.stock('premium-espresso-blend'), 30, 'đơn hủy không trừ kho');
ok(CB.inventory.lowStock().some((x) => x.product.id === 'kenyan-aa-grade'), 'Kenyan nằm trong cảnh báo sắp hết');
eq(CB.inventory.receipts().map((r) => r.code + ':' + r.status).join(','), 'PN001:completed,PN002:completed,PN003:draft', 'trạng thái phiếu mẫu');
eq(CB.inventory.movement('arabica-premium', '2026-09-01', '2026-09-30'), { opening: 80, imports: 40, exports: 2, closing: 118 }, 'nhập-xuất-tồn tháng 9');

/* ---------- 3. Phiếu nhập: hoàn thành chỉ cộng một lần ---------- */
console.log('\n[3] Phiếu nhập');
let r = CB.inventory.saveReceipt({ date: '2026-10-15', lines: [{ productId: 'kenyan-aa-grade', qty: 20, unitCost: 140000 }] });
ok(r.ok, 'tạo phiếu mới');
const rid = r.receipt.id;
eq(CB.inventory.stock('kenyan-aa-grade'), 8, 'phiếu nháp không đổi tồn');
eq(CB.catalog.price('kenyan-aa-grade'), 165000, 'phiếu nháp không đổi giá');
ok(CB.inventory.saveReceipt({ id: rid, date: '2026-10-15', lines: [{ productId: 'kenyan-aa-grade', qty: 25, unitCost: 140000 }] }).ok, 'sửa phiếu nháp');
ok(CB.inventory.completeReceipt(rid).ok, 'hoàn thành phiếu');
eq(CB.inventory.stock('kenyan-aa-grade'), 33, 'tồn = 8 + 25');
ok(!CB.inventory.completeReceipt(rid).ok, 'hoàn thành lần 2 bị từ chối');
eq(CB.inventory.stock('kenyan-aa-grade'), 33, 'tồn không cộng lần 2');
ok(!CB.inventory.saveReceipt({ id: rid, date: '2026-10-15', lines: [{ productId: 'kenyan-aa-grade', qty: 1, unitCost: 1000 }] }).ok, 'không sửa được phiếu đã hoàn thành');
ok(!CB.inventory.deleteReceipt(rid).ok, 'không xóa được phiếu đã hoàn thành');
// giá vốn bình quân: (12*132000 + 25*140000)/37 = 137297
eq(CB.catalog.cost('kenyan-aa-grade'), Math.round((12 * 132000 + 25 * 140000) / 37), 'giá vốn bình quân gia quyền');
eq(CB.catalog.price('kenyan-aa-grade'), Math.round(Math.round((12 * 132000 + 25 * 140000) / 37) * 1.25), 'giá bán cập nhật theo giá vốn mới');
ok(!CB.inventory.saveReceipt({ date: '2026-10-15', lines: [{ productId: 'kenyan-aa-grade', qty: 0, unitCost: 1000 }] }).ok, 'từ chối số lượng 0');
ok(!CB.inventory.saveReceipt({ date: '2026-10-15', lines: [{ productId: 'kenyan-aa-grade', qty: 2, unitCost: -5 }] }).ok, 'từ chối giá nhập âm');
ok(!CB.inventory.saveReceipt({ date: '2026-10-15', lines: [] }).ok, 'từ chối phiếu rỗng');
ok(!CB.inventory.saveReceipt({ date: '2026-10-15', lines: [{ productId: 'kenyan-aa-grade', qty: 1, unitCost: 1 }, { productId: 'kenyan-aa-grade', qty: 1, unitCost: 1 }] }).ok, 'từ chối sản phẩm trùng trong phiếu');

/* ---------- 4. Tài khoản ---------- */
CB = boot();
console.log('\n[4] Tài khoản khách hàng và admin');
ok(!CB.auth.login('guest1', 'sai').ok, 'sai mật khẩu bị từ chối');
ok(CB.auth.login('guest1', 'guest1123').ok, 'đăng nhập guest1 / guest1123');
eq(CB.auth.current().username, 'guest1', 'current() trả đúng user');
ok( !('password' in CB.auth.current()) &&
    !('passwordHash' in CB.auth.current()) &&
    !('salt' in CB.auth.current()),
    'không trả mật khẩu ra thông tin người dùng'
);
CB.auth.logout();
eq(CB.auth.current(), null, 'đăng xuất');
ok(CB.auth.login('GUEST2@example.com', 'guest2123').ok, 'đăng nhập bằng email (không phân biệt hoa thường)');
CB.auth.logout();
ok(!CB.auth.adminCurrent(), 'khách đăng nhập không tạo phiên admin');
ok(CB.auth.adminLogin('admin', 'admin123').ok, 'admin đăng nhập');
ok(!CB.auth.adminLogin('admin', 'guest1123').ok, 'admin sai mật khẩu');
ok(!CB.auth.adminLogin('guest1', 'guest1123').ok, 'tài khoản khách không vào được admin');
let reg = CB.auth.register({ fullName: 'A', username: 'x', email: 'bad', phone: '12', password: '123', confirm: '1' });
ok(!reg.ok && Object.keys(reg.errors).length === 6, 'đăng ký sai: báo đủ 6 lỗi', reg.errors);
reg = CB.auth.register({ fullName: 'Người Mới', username: 'guest1', email: 'new@example.com', phone: '0911222333', password: 'abcdef', confirm: 'abcdef' });
ok(!reg.ok && reg.errors.username, 'trùng tên đăng nhập bị từ chối');
reg = CB.auth.register({ fullName: 'Người Mới', username: 'newuser', email: 'GUEST1@example.com', phone: '0911222333', password: 'abcdef', confirm: 'abcdef' });
ok(!reg.ok && reg.errors.email, 'trùng email bị từ chối');
reg = CB.auth.register({ fullName: 'Người Mới', username: 'newuser', email: 'new@example.com', phone: '0911222333', password: 'abcdef', confirm: 'abcdef' });
ok(reg.ok, 'đăng ký hợp lệ');
ok(CB.auth.login('newuser', 'abcdef').ok, 'đăng nhập tài khoản vừa đăng ký');
CB.auth.logout();
const g1 = CB.auth.customers().filter((u) => u.username === 'guest1')[0];
ok(CB.auth.setLocked(g1.id, true).ok, 'khóa tài khoản');
ok(/khóa/.test(CB.auth.login('guest1', 'guest1123').error || ''), 'tài khoản khóa không đăng nhập được');
CB.auth.setLocked(g1.id, false);
ok(CB.auth.login('guest1', 'guest1123').ok, 'mở khóa rồi đăng nhập lại được');
CB.auth.setLocked(g1.id, true);
eq(CB.auth.current(), null, 'đang đăng nhập mà bị khóa thì mất phiên');
CB.auth.setLocked(g1.id, false);
ok(CB.auth.resetPassword(g1.id).ok && CB.auth.login('guest1', '123456').ok, 'reset mật khẩu về 123456');
CB.auth.logout();
eq(CB.auth.safeRedirect('https://evil.com'), 'index.html', 'chặn chuyển hướng ra ngoài');
eq(CB.auth.safeRedirect('cart.html?x=1'), 'cart.html?x=1', 'cho phép chuyển hướng nội bộ');

/* ---------- 5. Giỏ hàng và đặt hàng ---------- */
CB = boot();
console.log('\n[5] Giỏ hàng và đơn hàng');
let a = CB.cart.add('arabica-premium', 1);
ok(!a.ok && a.code === 'LOGIN_REQUIRED', 'chưa đăng nhập: không dùng được giỏ hàng');
CB.auth.login('guest2', 'guest2123');
ok(CB.cart.add('arabica-premium', 2).ok, 'thêm 2 Arabica Premium');
ok(CB.cart.add('arabica-premium', 1).ok && CB.cart.items()[0].qty === 3, 'thêm tiếp thì cộng dồn');
eq(CB.cart.count(), 3, 'đếm số lượng giỏ');
ok(!CB.cart.add('kenyan-aa-grade', 9).ok, 'vượt tồn khả dụng (8) bị từ chối');
ok(CB.cart.add('kenyan-aa-grade', 8).ok, 'đặt đúng bằng tồn khả dụng');
ok(!CB.cart.setQty('kenyan-aa-grade', 9).ok, 'sửa số lượng vượt tồn bị từ chối');
ok(!CB.cart.setQty('arabica-premium', 0).ok, 'số lượng 0 bị từ chối');
ok(CB.cart.setQty('arabica-premium', 5).ok, 'sửa số lượng hợp lệ');
ok(CB.cart.remove('kenyan-aa-grade').ok && CB.cart.items().length === 1, 'xóa khỏi giỏ');
CB.auth.logout(); CB.auth.login('guest1', 'guest1123');
eq(CB.cart.items().length, 0, 'giỏ hàng tách riêng theo tài khoản');
CB.auth.logout(); CB.auth.login('guest2', 'guest2123');
eq(CB.cart.items().length, 1, 'giỏ hàng của guest2 vẫn còn sau khi đổi tài khoản');
let bad = CB.orders.place({ token: 't1', paymentMethod: 'cod', shipping: { source: 'new', fullName: '', phone: '1', province: '', district: '', ward: '', detail: '' } });
ok(!bad.ok && Object.keys(bad.errors).length === 6, 'địa chỉ mới thiếu thông tin: báo 6 lỗi', bad.errors);
eq(CB.cart.items().length, 1, 'đặt lỗi không làm mất giỏ hàng');
const stockBefore = CB.inventory.stock('arabica-premium');
const res = CB.orders.place({ token: 't1', paymentMethod: 'cod', shipping: { source: 'account' } });
ok(res.ok, 'đặt hàng bằng địa chỉ tài khoản');
eq(res.order.subtotal, 5 * 135000, 'tạm tính');
eq(res.order.total, 5 * 135000 + 30000, 'tổng cộng gồm phí vận chuyển');
eq(res.order.status, 'Mới đặt', 'trạng thái ban đầu');
eq(CB.cart.items().length, 0, 'xóa giỏ sau khi đặt');
eq(CB.inventory.stock('arabica-premium'), stockBefore, 'chưa trừ tồn khi mới đặt');
eq(CB.inventory.available('arabica-premium'), stockBefore - 5, 'đã giữ hàng cho đơn mới');
const dupe = CB.orders.place({ token: 't1', paymentMethod: 'cod', shipping: { source: 'account' } });
ok(dupe.ok && dupe.duplicate && dupe.order.id === res.order.id, 'gửi lại cùng token không tạo đơn thứ hai');
eq(CB.orders.byUser(CB.auth.current().id).length, 2, 'guest2 có đúng 2 đơn (1 mẫu + 1 mới)');
ok(!CB.orders.place({ token: 't2', shipping: { source: 'account' } }).ok, 'giỏ trống không đặt được');
CB.auth.logout(); CB.auth.login('guest3', 'guest3123');
CB.cart.add('robusta-bold', 1);
let noAddr = CB.orders.place({ token: 't3', shipping: { source: 'account' } });
ok(!noAddr.ok && noAddr.code === 'NO_ACCOUNT_ADDRESS', 'tài khoản không có địa chỉ: không dùng được địa chỉ tài khoản');
let newAddr = CB.orders.place({ token: 't3', paymentMethod: 'online', shipping: { source: 'new', fullName: 'Người nhận', phone: '0988777666', province: 'Đà Nẵng', district: 'Hải Châu', ward: 'Thanh Bình', detail: '5 Lê Duẩn' } });
ok(newAddr.ok && newAddr.order.payment.simulated, 'địa chỉ mới + thanh toán trực tuyến (mô phỏng)');
CB.auth.logout();

/* ---------- 6. Trạng thái đơn và trừ kho ---------- */
console.log('\n[6] Trạng thái đơn và tồn kho');
const oid = res.order.id;
ok(!CB.orders.setStatus(oid, 'Đã giao').ok, 'không nhảy cóc Mới đặt -> Đã giao');
ok(CB.orders.setStatus(oid, 'Đã xử lý').ok, 'Mới đặt -> Đã xử lý');
eq(CB.inventory.stock('arabica-premium'), stockBefore, 'Đã xử lý chưa trừ tồn');
ok(CB.orders.setStatus(oid, 'Đã giao').ok, 'Đã xử lý -> Đã giao');
eq(CB.inventory.stock('arabica-premium'), stockBefore - 5, 'Đã giao trừ tồn đúng 1 lần');
ok(!CB.orders.setStatus(oid, 'Đã giao').ok, 'giao lần 2 bị từ chối');
ok(!CB.orders.setStatus(oid, 'Hủy').ok, 'đơn đã giao không hủy được');
eq(CB.inventory.stock('arabica-premium'), stockBefore - 5, 'tồn không đổi sau thao tác bị từ chối');
eq(CB.inventory.reserved('arabica-premium'), 0, 'đơn đã giao không còn giữ hàng');
const o3 = newAddr.order.id;
ok(CB.orders.setStatus(o3, 'Hủy').ok, 'hủy đơn mới đặt');
eq(CB.inventory.stock('robusta-bold'), 100, 'hủy đơn chưa giao không đổi tồn');
eq(CB.inventory.available('robusta-bold'), 100, 'hủy đơn trả lại hàng khả dụng');
ok(!CB.orders.setStatus(o3, 'Đã xử lý').ok, 'đơn đã hủy không mở lại được');
// giá thay đổi không làm đổi đơn cũ
CB.catalog.setProductMargin('arabica-premium', 50);
eq(CB.orders.byId(oid).items[0].unitPrice, 135000, 'đổi % lợi nhuận không đổi giá trên đơn cũ');
eq(CB.catalog.price('arabica-premium'), 162000, 'giá hiện tại đổi theo % mới (108000 x 1.5)');

/* ---------- 7. Tra cứu đơn hàng ---------- */
console.log('\n[7] Tra cứu đơn hàng (admin)');
CB = boot();
eq(CB.orders.search({ status: 'Hủy' }).length, 1, 'lọc theo trạng thái Hủy');
eq(CB.orders.search({ from: '2026-09-01', to: '2026-09-30' }).length, 3, 'lọc theo khoảng ngày (tháng 9)');
eq(CB.orders.search({ from: '2026-09-16', to: '2026-09-20' }).length, 1, 'khoảng ngày gồm cả hai đầu');
eq(CB.orders.search({ from: '2026-09-01', to: '2026-10-31', status: 'Đã giao' }).length, 2, 'kết hợp ngày và trạng thái');
eq(CB.orders.search({ q: 'guest2' }).length, 1, 'tìm theo khách hàng');

/* ---------- 8. Tìm kiếm sản phẩm ---------- */
console.log('\n[8] Tìm kiếm sản phẩm');
eq(CB.catalog.search({}).length, 12, 'không lọc: 12 sản phẩm');
eq(CB.catalog.search({ q: 'ethiopia' }).length, 1, 'tìm theo tên');
eq(CB.catalog.search({ q: 'ARABICA' }).length, 2, 'không phân biệt hoa thường (Arabica Premium, Brazilian Arabica)');
eq(CB.catalog.search({ q: 'ca phe' }).length, 0, 'tên sản phẩm không chứa "ca phe"');
eq(CB.catalog.search({ q: 'Đắk' }).length, 0, 'tìm theo tên chứ không theo xuất xứ');
eq(CB.catalog.search({ q: 'vietnam' }).length, 1, 'tìm "vietnam"');
eq(CB.catalog.search({ categoryId: 'cat-robusta' }).length, 4, 'lọc theo loại Robusta');
eq(CB.catalog.search({ min: 140000, max: 160000 }).map((v) => v.price).sort().join(','), '145000,148000,155000,158000', 'khoảng giá 140k-160k');
eq(CB.catalog.search({ q: 'robusta', categoryId: 'cat-robusta', min: 120000, max: 130000 }).length, 2, 'kết hợp tên + loại + giá (Robusta Bold, Vietnam Robusta)');
eq(CB.catalog.search({ sort: 'price-desc' })[0].id, 'premium-espresso-blend', 'sắp xếp giá giảm dần');
eq(CB.catalog.search({ sort: 'price-asc' })[0].id, 'vietnam-robusta', 'sắp xếp giá tăng dần');
const pg = CB.util.paginate(CB.catalog.search({}), 2, 9);
eq([pg.page, pg.pages, pg.items.length, pg.total], [2, 2, 3, 12], 'phân trang 12 sản phẩm / 9 mỗi trang');
eq(CB.util.paginate([1, 2, 3], 99, 9).page, 1, 'trang vượt quá được đưa về trang hợp lệ');
CB.catalog.setProductHidden('vietnam-robusta', true);
eq(CB.catalog.search({}).length, 11, 'sản phẩm ẩn không hiện với khách');
CB.catalog.setCategoryHidden('cat-blend', true);
eq(CB.catalog.search({}).length, 9, 'ẩn loại thì ẩn các sản phẩm thuộc loại');

/* ---------- 9. Loại & sản phẩm (admin) ---------- */
console.log('\n[9] Quản lý loại và sản phẩm');
CB = boot();
let c = CB.catalog.saveCategory({ name: 'arabica' });
ok(!c.ok, 'trùng tên loại (không phân biệt hoa thường) bị từ chối');
c = CB.catalog.saveCategory({ name: 'Cold Brew' });
ok(c.ok, 'thêm loại mới');
ok(CB.catalog.saveCategory({ id: c.category.id, name: 'Cold Brew Đặc biệt' }).ok, 'sửa loại');
ok(!CB.catalog.deleteCategory('cat-arabica').ok, 'không xóa loại còn sản phẩm');
ok(CB.catalog.deleteCategory(c.category.id).ok, 'xóa loại rỗng');
let p = CB.catalog.saveProduct({ code: 'cf001', name: 'X', categoryId: 'cat-arabica' });
ok(!p.ok && p.field === 'code', 'trùng mã sản phẩm bị từ chối');
p = CB.catalog.saveProduct({ code: 'CF100', name: '', categoryId: 'cat-arabica' });
ok(!p.ok && p.field === 'name', 'thiếu tên bị từ chối');
p = CB.catalog.saveProduct({ code: 'CF100', name: 'Cà phê thử', categoryId: 'khong-ton-tai' });
ok(!p.ok && p.field === 'categoryId', 'loại không tồn tại bị từ chối');
p = CB.catalog.saveProduct({ code: 'CF100', name: 'Cà phê thử', categoryId: 'cat-arabica', description: 'abc' });
ok(p.ok && p.product.image === CB.catalog.placeholderImage, 'thêm sản phẩm, ảnh mặc định khi bỏ trống');
eq(CB.catalog.price(p.product.id), null, 'sản phẩm mới chưa nhập hàng thì chưa có giá');
eq(CB.cart.add(p.product.id, 1).ok, false, 'không thêm được sản phẩm chưa có giá (và chưa đăng nhập)');
ok(CB.catalog.saveProduct({ id: p.product.id, code: 'CF100', name: 'Cà phê thử 2', categoryId: 'cat-robusta' }).ok, 'sửa sản phẩm');
ok(CB.catalog.deleteProduct(p.product.id).ok, 'xóa sản phẩm chưa phát sinh dữ liệu');
ok(!CB.catalog.deleteProduct('arabica-premium').ok, 'sản phẩm đã có phiếu nhập/đơn: không xóa, chỉ ẩn');

/* ---------- 10. Seed không ghi đè dữ liệu ---------- */
console.log('\n[10] Seed');
CB = boot();
CB.catalog.setProductMargin('robusta-bold', 99);
CB.seed.ensure();
eq(CB.catalog.margin('robusta-bold').percent, 99, 'chạy seed lần nữa không ghi đè dữ liệu đã sửa');
CB.seed.reset();
eq(CB.catalog.price('robusta-bold'), 129000, 'reset khôi phục dữ liệu mẫu');
eq(CB.orders.all().length, 5, 'có 5 đơn mẫu');

/* ---------- 11. Khách hàng tự đổi mật khẩu ---------- */
console.log('\n[11] Đổi mật khẩu');
CB = boot();
const uid1 = CB.auth.customers().filter((u) => u.username === 'guest1')[0].id;
const before = JSON.parse(JSON.stringify(CB.db.read(CB.db.KEYS.users, [])));
let cp = CB.auth.changePassword(uid1, '', 'newpass1', 'newpass1');
ok(!cp.ok && cp.errors.currentPassword, 'mật khẩu hiện tại để trống: báo lỗi');
cp = CB.auth.changePassword(uid1, 'sai-mat-khau', 'newpass1', 'newpass1');
ok(!cp.ok && /không đúng/.test(cp.errors.currentPassword), 'mật khẩu hiện tại sai: báo lỗi');
cp = CB.auth.changePassword(uid1, 'guest1123', '12345', '12345');
ok(!cp.ok && /ít nhất 6/.test(cp.errors.newPassword), 'mật khẩu mới ngắn hơn 6 ký tự: báo lỗi');
cp = CB.auth.changePassword(uid1, 'guest1123', '', '');
ok(!cp.ok && cp.errors.newPassword, 'mật khẩu mới để trống: báo lỗi');
cp = CB.auth.changePassword(uid1, 'guest1123', 'guest1123', 'guest1123');
ok(!cp.ok && /khác mật khẩu hiện tại/.test(cp.errors.newPassword), 'mật khẩu mới trùng mật khẩu cũ: báo lỗi');
cp = CB.auth.changePassword(uid1, 'guest1123', 'newpass1', 'newpass2');
ok(!cp.ok && /không khớp/.test(cp.errors.confirmPassword), 'xác nhận không khớp: báo lỗi');
cp = CB.auth.changePassword(uid1, 'sai', '123', 'abc');
ok(!cp.ok && Object.keys(cp.errors).sort().join() === 'currentPassword,newPassword', 'nhiều lỗi cùng lúc: báo mật khẩu hiện tại sai và mật khẩu mới ngắn (không báo thêm lỗi xác nhận)');
cp = CB.auth.changePassword('khong-ton-tai', 'a', 'newpass1', 'newpass1');
ok(!cp.ok, 'tài khoản không tồn tại: báo lỗi');
eq(JSON.stringify(CB.db.read(CB.db.KEYS.users, [])), JSON.stringify(before), 'mọi lần đổi thất bại không làm thay đổi dữ liệu tài khoản');
ok(CB.auth.login('guest1', 'guest1123').ok, 'sau các lần thất bại, mật khẩu cũ vẫn đăng nhập được'); CB.auth.logout();
const oldRec = CB.db.read(CB.db.KEYS.users, []).filter((u) => u.id === uid1)[0];
cp = CB.auth.changePassword(uid1, 'guest1123', 'newpass1', 'newpass1');
ok(cp.ok && !cp.errors, 'đổi mật khẩu hợp lệ thành công');
const newRec = CB.db.read(CB.db.KEYS.users, []).filter((u) => u.id === uid1)[0];
ok( newRec.password === 'newpass1' && !('salt' in newRec) && !('passwordHash' in newRec), 'mật khẩu mới được lưu trực tiếp');
ok( JSON.stringify(newRec).indexOf('newpass1') !== -1, 'mật khẩu mới tồn tại trong dữ liệu demo');
ok(!CB.auth.login('guest1', 'guest1123').ok, 'mật khẩu cũ không còn đăng nhập được');
ok(CB.auth.login('guest1', 'newpass1').ok, 'đăng nhập lại bằng mật khẩu mới');
CB.auth.logout();
ok(CB.auth.login('guest2', 'guest2123').ok && CB.auth.login('guest3', 'guest3123').ok, 'tài khoản khác không bị ảnh hưởng'); CB.auth.logout();
// admin reset rồi khách đổi lại
CB.auth.resetPassword(uid1);
ok(CB.auth.login('guest1', '123456').ok, 'admin reset về 123456 rồi vẫn đăng nhập được'); CB.auth.logout();
ok(CB.auth.changePassword(uid1, '123456', 'matkhaumoi', 'matkhaumoi').ok && CB.auth.login('guest1', 'matkhaumoi').ok, 'khách đổi từ 123456 sang mật khẩu riêng thành công'); CB.auth.logout();
ok(!/console\./.test(require('fs').readFileSync(path.join(__dirname, '..', 'js', 'auth.js'), 'utf8')), 'auth.js không ghi gì ra console');

console.log('\nKết quả: ' + pass + ' đạt, ' + failN + ' lỗi');
process.exit(failN ? 1 : 0);
