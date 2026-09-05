from blog.reading import reading_time_minutes


def test_reading_time_is_deterministic():
    body = 'word ' * 225
    assert reading_time_minutes(body) == 1
    assert reading_time_minutes('word ' * 450) == 2


def test_empty_body_is_one_minute():
    assert reading_time_minutes('') == 1
