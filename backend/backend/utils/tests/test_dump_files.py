from pathlib import Path

from backend.utils.dump_files import (
    fixture_files,
    is_supported_dump,
    list_dump_files,
    postgres_restore_files,
)


def test_supported_dump_extensions():
    assert is_supported_dump(Path('old.sql'))
    assert is_supported_dump(Path('old.sql.gz'))
    assert is_supported_dump(Path('old.dump'))
    assert is_supported_dump(Path('old.backup'))
    assert is_supported_dump(Path('posts.json'))
    assert not is_supported_dump(Path('notes.txt'))
    assert not is_supported_dump(Path('.gitkeep'))


def test_lists_restore_and_fixture_files(tmp_path: Path):
    (tmp_path / 'b.sql').write_text('-- b', encoding='utf-8')
    (tmp_path / 'a.dump').write_bytes(b'dump')
    (tmp_path / 'data.json').write_text('[]', encoding='utf-8')
    (tmp_path / '.gitkeep').write_text('', encoding='utf-8')

    found = list_dump_files(tmp_path)

    assert [path.name for path in found] == [
        'a.dump',
        'b.sql',
        'data.json',
    ]
    assert [path.name for path in postgres_restore_files(tmp_path)] == [
        'a.dump',
        'b.sql',
    ]
    assert [path.name for path in fixture_files(tmp_path)] == [
        'data.json',
    ]


def test_missing_dump_directory(tmp_path: Path):
    missing = tmp_path / 'missing'

    assert list_dump_files(missing) == []
