import os
import re

# Mapping Unsplash URLs to local images
url_mapping = {
    r'https://images\.unsplash\.com/photo-1514432324607-a09d9b4aefdd[^"]*': 'images/arabica-premium.jpg',
    r'https://images\.unsplash\.com/photo-1497935586351-b67a49e012bf[^"]*': 'images/robusta-bold.jpg',
    r'https://images\.unsplash\.com/photo-1442550528053-c431ecb55509[^"]*': 'images/signature-blend.jpg',
    r'https://images\.unsplash\.com/photo-1447933601403-0c6688de566e[^"]*': 'images/dark-roast.jpg',
    r'https://images\.unsplash\.com/photo-1495474472287-4d71bcdd2085[^"]*': 'images/espresso.jpg',
    r'https://images\.unsplash\.com/photo-1511537190424-bbbab87ac5eb[^"]*': 'images/signature-blend.jpg',
    r'https://images\.unsplash\.com/photo-1485808191679-5f86510681a2[^"]*': 'images/dark-roast.jpg',
}

# Files to update
files_to_update = [
    'index2.html',
    'arabica.html', 
    'cart.html',
    'product-detail.html',
    'styles/user.css'
]

for file_path in files_to_update:
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        for url_pattern, local_path in url_mapping.items():
            content = re.sub(url_pattern, local_path, content)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ {file_path}")
    else:
        print(f"⚠️  {file_path} not found")

print("\n✅ Hoàn tất cập nhật tất cả files!")
