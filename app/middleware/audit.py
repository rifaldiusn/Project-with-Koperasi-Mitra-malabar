from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from app.services.audit import write_log, resolve_user_from_token

SKIP_PREFIXES = ("/docs", "/redoc", "/openapi.json", "/uploads")
SKIP_EXACT = {"/docs", "/redoc", "/openapi.json"}


def _should_skip(path: str, method: str) -> bool:
    if path in SKIP_EXACT:
        return True
    if any(path.startswith(prefix) for prefix in SKIP_PREFIXES):
        return True
    if method == "GET" and path.startswith("/log"):
        return True
    return False


class AuditLogMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        response = await call_next(request)

        path = request.url.path
        method = request.method

        if _should_skip(path, method):
            return response

        id_akun, role = resolve_user_from_token(request.headers.get("authorization"))
        ip_address = request.client.host if request.client else None

        write_log(
            method=method,
            path=path,
            status_code=response.status_code,
            id_akun=id_akun,
            role=role,
            ip_address=ip_address,
        )

        return response
