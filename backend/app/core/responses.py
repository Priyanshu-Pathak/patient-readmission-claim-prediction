from typing import Any, Generic, Optional, TypeVar
from pydantic import BaseModel
from datetime import datetime, timezone

T = TypeVar("T")

class StandardResponse(BaseModel, Generic[T]):
    success: bool
    data: Optional[T] = None
    error: Optional[str] = None
    meta: Optional[dict[str, Any]] = None

def success_response(data: T = None, meta: dict = None) -> StandardResponse[T]:
    metadata = {"timestamp": datetime.now(timezone.utc).isoformat()}
    if meta:
        metadata.update(meta)
    return StandardResponse(success=True, data=data, meta=metadata)

def error_response(error_msg: str, meta: dict = None) -> StandardResponse[Any]:
    metadata = {"timestamp": datetime.now(timezone.utc).isoformat()}
    if meta:
        metadata.update(meta)
    return StandardResponse(success=False, error=error_msg, meta=metadata)
