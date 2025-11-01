import markdown
from django import template
from django.template.defaultfilters import stringfilter
from django.utils.safestring import mark_safe

register = template.Library()


@register.filter
@stringfilter
def render_markdown(value):
    # convert Markdown to HTML
    html = markdown.markdown(
        value,
        extensions=["fenced_code", "tables"]
    )
    return mark_safe(html)
