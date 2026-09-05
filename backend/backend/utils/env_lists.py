INTERNAL_HOSTS = ('backend',)
LOCAL_ORIGINS = (
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
)


def with_local_origins(origins: list[str]) -> list[str]:
    merged = list(origins)
    for origin in LOCAL_ORIGINS:
        if origin not in merged:
            merged.append(origin)
    return merged


def with_internal_hosts(hosts: list[str]) -> list[str]:
    merged = list(hosts)
    for host in INTERNAL_HOSTS:
        if host not in merged:
            merged.append(host)
    return merged


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
