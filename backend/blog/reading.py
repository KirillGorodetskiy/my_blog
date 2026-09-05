from django.conf import settings


def reading_time_minutes(body: str) -> int:
    words = [part for part in body.split() if part]
    if not words:
        return 1
    pace = getattr(settings, 'WORDS_PER_MINUTE', 225)
    return max(1, round(len(words) / pace))
