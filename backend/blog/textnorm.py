import re
import unicodedata


_PUNCT_RE = re.compile(r'[\W_]+', re.UNICODE)
_SPACE_RE = re.compile(r'\s+')
_URL_RE = re.compile(
    r'https?://[^\s]+|www\.[^\s]+',
    re.IGNORECASE,
)


def normalize_for_match(value: str) -> str:
    folded = unicodedata.normalize('NFKC', value).casefold()
    compact = _PUNCT_RE.sub(' ', folded)
    return _SPACE_RE.sub(' ', compact).strip()


def normalize_duplicate(value: str) -> str:
    folded = unicodedata.normalize('NFKC', value).casefold()
    return _SPACE_RE.sub(' ', folded).strip()


def count_urls(value: str) -> int:
    return len(_URL_RE.findall(value))
