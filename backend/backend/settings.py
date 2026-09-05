from pathlib import Path
import os
import sys
import logging
from dotenv import load_dotenv

from backend.utils.config_check import check_required_env_vars
from backend.utils.env_lists import (
    hosts_from_env,
    origins_from_env,
    with_internal_hosts,
    with_local_origins,
)


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s"
)


BASE_DIR = Path(__file__).resolve().parent.parent

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR, 'django.log'),
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'INFO',  # or DEBUG
            'propagate': True,
        },
    },
}

REQUIRED_ENV_VARS = (
    'DJANGO_SECRET_KEY',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD',
    'DB_HOST',
    'DB_PORT',
)

TEST_ENV_VARS = (
    'TEST_DB_NAME',
    'TEST_DB_USER',
    'TEST_DB_PASSWORD',
    'TEST_DB_HOST',
    'TEST_DB_PORT',
)

load_dotenv(override=False)
check_required_env_vars(REQUIRED_ENV_VARS)

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('DJANGO_DEBUG', '0') == '1'

ALLOWED_HOSTS = with_internal_hosts(
    hosts_from_env(
        os.getenv('DJANGO_ALLOWED_HOSTS'),
        [
            '127.0.0.1',
            '212.227.250.38',
            'localhost',
            'gkablog.com',
            'www.gkablog.com',
        ],
    ),
)

CSRF_TRUSTED_ORIGINS = with_local_origins(
    origins_from_env(
        os.getenv('DJANGO_CSRF_TRUSTED_ORIGINS'),
        [
            'https://gkablog.com',
            'https://www.gkablog.com',
            'http://localhost:3000',
            'http://localhost:8000',
        ],
    ),
)


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'blog',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT'),
        'TEST': {
            'NAME': os.getenv('TEST_DB_NAME'),
        }
    }
}

if any('pytest' in a for a in sys.argv) or os.getenv('DJANGO_TESTING') == '1':
    check_required_env_vars(TEST_ENV_VARS)
    DATABASES['default'].update({
        'USER': os.getenv('TEST_DB_USER'),
        'PASSWORD': os.getenv('TEST_DB_PASSWORD'),
        'HOST': os.getenv('TEST_DB_HOST'),
        'PORT': os.getenv('TEST_DB_PORT'),
    })


AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Europe/London'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = '/static/'

STATICFILES_DIRS = [
    BASE_DIR / 'static',
]

# STATIC_ROOT will be for collectstatic in production
STATIC_ROOT = BASE_DIR / 'staticfiles'
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
STORAGES = {
    'default': {
        'BACKEND': 'django.core.files.storage.FileSystemStorage',
    },
    'staticfiles': {
        'BACKEND': (
            'whitenoise.storage.CompressedStaticFilesStorage'
        ),
    },
}

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

LOGOUT_REDIRECT_URL = '/'
LOGIN_REDIRECT_URL = '/'

POST_COUNT_ON_PAGE = 10
PROJECT_COUNT_ON_PAGE = 10
WORDS_PER_MINUTE = 225
COMMENT_MIN_LENGTH = 3
COMMENT_MAX_LENGTH = 3000
COMMENT_MAX_URLS = 2
COMMENT_DUPLICATE_SECONDS = 600
COMMENT_RATE_PER_MINUTE = int(
    os.getenv('COMMENT_RATE_PER_MINUTE', '3')
)
COMMENT_RATE_PER_10_MINUTES = int(
    os.getenv('COMMENT_RATE_PER_10_MINUTES', '10')
)
COMMENT_RATE_PER_DAY = int(
    os.getenv('COMMENT_RATE_PER_DAY', '30')
)

CACHES = {
    'default': {
        'BACKEND': (
            'django.core.cache.backends.locmem.LocMemCache'
        ),
        'LOCATION': 'blog-cache',
    }
}

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
}

CSRF_COOKIE_HTTPONLY = False
CSRF_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_PATH = '/'
CSRF_COOKIE_PATH = '/'

if os.getenv('DJANGO_BEHIND_PROXY', '0') == '1':
    USE_X_FORWARDED_HOST = True
    SECURE_PROXY_SSL_HEADER = (
        'HTTP_X_FORWARDED_PROTO',
        'https',
    )

if os.getenv('DJANGO_SECURE_COOKIES', '0') == '1':
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
