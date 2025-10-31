import os
import sys

from django.core.wsgi import get_wsgi_application

# === AUTO DETECT PROJECT ROOT ===
# Find the directory that contains 'backend/' (this file's parent)
current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
project_root = os.path.dirname(current_dir)  # /var/www/my_blog or ~/my_blog

# Add to Python path
if project_root not in sys.path:
    sys.path.insert(0, project_root)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

application = get_wsgi_application()
