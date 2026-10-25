"""Sinh docs/CoffeeBeans_Wireframe.drawio. Chạy:  python docs/wireframe/src/build_wireframe.py"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from wf_lib import write_drawio
import pages_customer as c
import pages_admin as a

pages = [c.sitemap(), c.home(), c.products(), c.detail(), c.cart(), c.checkout(), c.confirm(), c.history(), c.login(), c.profile(), c.mobile(),
         a.admin_login(), a.overview(), a.users(), a.categories(), a.products(), a.receipts(), a.pricing(), a.orders(), a.stock()]
out = os.path.join(os.path.dirname(__file__), '..', '..', 'CoffeeBeans_Wireframe.drawio')
write_drawio(pages, out)
print('Đã ghi', os.path.abspath(out), '-', len(pages), 'trang')
