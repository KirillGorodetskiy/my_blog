from django.conf import settings


def client_ip(request) -> str:
    remote = (request.META.get('REMOTE_ADDR') or '').strip()
    if not getattr(settings, 'BEHIND_PROXY', False):
        return remote or 'unknown'

    forwarded = request.META.get('HTTP_X_FORWARDED_FOR', '')
    if forwarded:
        return forwarded.split(',')[0].strip() or remote or (
            'unknown'
        )
    return remote or 'unknown'
