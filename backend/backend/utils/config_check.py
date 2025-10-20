import os
from pathlib import Path
import logging

from django.core.exceptions import ImproperlyConfigured

logger = logging.getLogger(__name__)


def check_env_file_existance() -> None:
    '''Check if the .env file exists at the expected location.'''
    env_path = Path(__file__).resolve().parent.parent.parent.parent / '.env'
    if not env_path.exists():
        logger.debug(f'.env file not found at expected location: {env_path}')


def check_required_env_vars(required_vars: tuple) -> None:
    """Check that all required environment variables are set."""
    check_env_file_existance()
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    if missing_vars:
        error_message = f'Missing required environment variables: '\
                        f'{", ".join(missing_vars)}'
        logger.error(error_message)
        raise ImproperlyConfigured(error_message)
    else:
        logger.info('All required environment variables are set.')
