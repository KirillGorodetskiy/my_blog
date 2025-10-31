import os
import sys
from django.core.wsgi import get_wsgi_application

# --- AUTO-FIND PROJECT ROOT ---
project_root = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    )

# Add to Python path
if project_root not in sys.path:
    sys.path.insert(0, project_root)

# Now 'backend' refers to /var/www/my_blog/backend/
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.backend.settings')

application = get_wsgi_application()