from django import template
import logging

register = template.Library()
logger = logging.getLogger(__name__)


@register.filter
def enumerate(value):
    try:
        # Ensure value is a list or tuple
        if not isinstance(value, (list, tuple)):
            logger.error(f"enumerate filter received non-iterable: {type(value)}")
            return []
        return list(enumerate(value))
    except Exception as e:
        logger.error(f"Error in enumerate filter: {e}")
        return []
