from pathlib import Path

SQL_SUFFIXES = ('.sql', '.sql.gz', '.dump', '.backup')
FIXTURE_SUFFIXES = ('.json',)
SUPPORTED_SUFFIXES = SQL_SUFFIXES + FIXTURE_SUFFIXES


def is_supported_dump(path: Path) -> bool:
    name = path.name.lower()
    return name.endswith(SUPPORTED_SUFFIXES)


def list_dump_files(directory: Path) -> list[Path]:
    if not directory.is_dir():
        return []

    files = [
        path
        for path in directory.iterdir()
        if path.is_file() and is_supported_dump(path)
    ]
    return sorted(files, key=lambda path: path.name.lower())


def postgres_restore_files(directory: Path) -> list[Path]:
    return [
        path
        for path in list_dump_files(directory)
        if path.name.lower().endswith(SQL_SUFFIXES)
    ]


def fixture_files(directory: Path) -> list[Path]:
    return [
        path
        for path in list_dump_files(directory)
        if path.name.lower().endswith(FIXTURE_SUFFIXES)
    ]
