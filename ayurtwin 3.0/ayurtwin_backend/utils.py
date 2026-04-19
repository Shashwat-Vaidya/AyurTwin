import logging
from logging import Logger

_LOGGERS: dict[str, Logger] = {}


def get_logger(name: str | None = None) -> Logger:
    """
    Simple shared logger factory.

    - Configures a basic formatter on first use.
    - Returns the same named logger instance on subsequent calls.
    """
    global _LOGGERS

    if name is None:
        name = "ayurtwin"

    if name in _LOGGERS:
        return _LOGGERS[name]

    logger = logging.getLogger(name)
    if not logger.handlers:
        logger.setLevel(logging.INFO)
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            "[%(asctime)s] [%(levelname)s] %(name)s - %(message)s"
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)

    _LOGGERS[name] = logger
    return logger

