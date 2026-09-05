import re

from blog.project_descriptions import PROJECT_SLUGS, PROJECTS

PICTOGRAPHIC = re.compile(
    '['
    '\U0001F300-\U0001FAFF'
    '\u2600-\u27BF'
    '\uFE0F'
    ']'
)
HEADING_OR_LIST = re.compile(r'(?m)^(#{1,6}\s|[-*+]\s|\d+\.\s)')


def test_project_keys_match_known_slugs():
    assert tuple(PROJECTS) == PROJECT_SLUGS


def test_descriptions_are_short_summaries():
    for slug, body in PROJECTS.items():
        assert HEADING_OR_LIST.search(body) is None, slug
        sentences = [
            part for part in re.split(r'[.!?]+', body)
            if part.strip()
        ]
        assert 1 <= len(sentences) <= 3, slug


def test_descriptions_have_no_pictographic_emoji():
    for slug, body in PROJECTS.items():
        match = PICTOGRAPHIC.search(body)
        assert match is None, (slug, match.group())
