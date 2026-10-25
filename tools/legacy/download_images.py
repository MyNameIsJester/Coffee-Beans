import os
import requests
from PIL import Image
from io import BytesIO
import time

# Tạo thư mục images nếu chưa có
images_dir = "images"
if not os.path.exists(images_dir):
    os.makedirs(images_dir)

# Danh sách sản phẩm cà phê cần tải ảnh
products = [
    {"name": "arabica-premium", "query": "arabica coffee beans 200x200", "size": (200, 200)},
    {"name": "robusta-bold", "query": "robusta coffee beans dark roast", "size": (200, 200)},
    {"name": "signature-blend", "query": "coffee blend premium", "size": (200, 200)},
    {"name": "ethiopia", "query": "ethiopia yirgacheffe coffee", "size": (200, 200)},
    {"name": "colombian", "query": "colombian coffee beans", "size": (200, 200)},
    {"name": "brazilian", "query": "brazilian coffee arabica", "size": (200, 200)},
    {"name": "vietnam", "query": "vietnam robusta coffee", "size": (200, 200)},
    {"name": "indonesia", "query": "indonesian sumatra coffee", "size": (200, 200)},
    {"name": "espresso", "query": "espresso coffee blend dark", "size": (200, 200)},
    {"name": "dark-roast", "query": "dark roast coffee premium", "size": (200, 200)},
    {"name": "kenyan", "query": "kenyan AA coffee beans", "size": (200, 200)},
    {"name": "costarica", "query": "costa rica coffee tarazu", "size": (200, 200)},
    {"name": "mocha-java", "query": "mocha java coffee blend", "size": (200, 200)},
]

# Đây là những link Bing Image Search mẫu (thay bằng ảnh thực tế)
# CÁCH THỰ CÔNG: 
# 1. Mở https://www.bing.com/images
# 2. Tìm kiếm từng sản phẩm
# 3. Click vào ảnh → "Mở liên kết" → Save As vào thư mục images/
# 4. Đặt tên file theo tên sản phẩm (.jpg hoặc .png)

# HOẶC sử dụng link trực tiếp từ các trang cà phê uy tín

print("=" * 60)
print("HƯỚNG DẪN TẢI ẢNH CÀ PHÊ")
print("=" * 60)
print("\nCách 1: TẢI BẰNG BING IMAGES (NHANH & AN TOÀN)")
print("-" * 60)
for product in products:
    print(f"\n📌 {product['name'].upper()}")
    print(f"   Tìm kiếm: {product['query']}")
    print(f"   Kích thước: {product['size'][0]}x{product['size'][1]}px")
    print(f"   Lưu vào: images/{product['name']}.jpg")

print("\n\nBước thực hiện:")
print("1. Mở https://www.bing.com/images")
print("2. Tìm kiếm từng sản phẩm (xem tên ở trên)")
print("3. Chọn ảnh đẹp nhất")
print("4. Click chuột phải → 'Lưu ảnh thành'")
print("5. Lưu vào thư mục: images/")
print("6. Đặt tên: [product-name].jpg (ví dụ: arabica-premium.jpg)")
print("\n" + "=" * 60)
print("\nCách 2: DÙNG SCRIPT PYTHON (CẦN GỌIAPI)")
print("-" * 60)
print("Nếu bạn muốn script tự động download, cần:")
print("- pip install requests pillow")
print("- Dùng API từ Unsplash/Pexels/Pixabay")
print("- Hoặc dùng web scraping (có thể chậm)")
print("\n" + "=" * 60)

# Hàm resize ảnh (sẽ dùng khi ảnh đã tải)
def resize_image(input_path, output_path, size=(200, 200)):
    """Resize ảnh và lưu"""
    try:
        img = Image.open(input_path)
        # Resize với giữ tỷ lệ
        img.thumbnail(size, Image.Resampling.LANCZOS)
        
        # Tạo ảnh nền trắng nếu kích thước không khớp
        new_img = Image.new('RGB', size, (255, 255, 255))
        offset = ((size[0] - img.size[0]) // 2, (size[1] - img.size[1]) // 2)
        new_img.paste(img, offset)
        
        new_img.save(output_path, "JPEG", quality=85)
        print(f"✅ Đã resize: {output_path}")
        return True
    except Exception as e:
        print(f"❌ Lỗi resize {input_path}: {e}")
        return False

print("\n\n📝 LỆNH RESIZE SAU KHI CÓ ẢNH:")
print("-" * 60)
print("Khi đã tải tất cả ảnh vào thư mục images/, chạy:")
print("python download_images.py resize")
print("\n" + "=" * 60)

# Nếu có argument "resize" thì resize tất cả ảnh
import sys
if len(sys.argv) > 1 and sys.argv[1] == "resize":
    print("\n🔄 Bắt đầu resize ảnh...")
    for product in products:
        input_file = f"images/{product['name']}.jpg"
        output_file = f"images/{product['name']}-thumb.jpg"
        
        if os.path.exists(input_file):
            resize_image(input_file, output_file, product['size'])
        else:
            print(f"⚠️  Không tìm thấy: {input_file}")
    print("\n✅ Hoàn thành resize!")

print("\n\nGhi chú:")
print("- Ảnh jpg/png cần là các ảnh cà phê thực tế")
print("- Kích thước tối thiểu 200x200px")
print("- Nên chọn ảnh có chất lượng cao")
print("- Sau khi tải xong, chạy script để resize")
