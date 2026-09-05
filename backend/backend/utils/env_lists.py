def hosts_from_env(
    raw: str | None,
    fallback: list[str],
) -> list[str]:
    if raw is None or not raw.strip():
        return fallback

    return [item.strip() for item in raw.split(',') if item.strip()]


def origins_from_env(
    raw: str | None,
    fallback: list[str],
) -> list[str]:
    return hosts_from_env(raw, fallback)
