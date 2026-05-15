from fastapi import HTTPException
from fastapi.responses import JSONResponse
from app.core.responses import error_response

async def custom_http_exception_handler(request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response(error_msg=exc.detail).model_dump()
    )
