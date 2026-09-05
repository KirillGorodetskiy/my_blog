def auth_payload(user) -> dict:
    authenticated = bool(user.is_authenticated)
    return {
        'isAuthenticated': authenticated,
        'username': user.username if authenticated else None,
        'email': user.email if authenticated else None,
        'isStaff': bool(authenticated and user.is_staff),
        'isSuperuser': bool(
            authenticated and user.is_superuser
        ),
    }
