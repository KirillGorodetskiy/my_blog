import markdown
from django import template
from django.template.defaultfilters import stringfilter
from django.utils.safestring import mark_safe

register = template.Library()


@register.filter
@stringfilter
def render_markdown(value):
    # convert Markdown to HTML
    extensions = ['fenced_code', 'tables', 'codehilite', 'toc', 'smarty']
    html = markdown.markdown(
        value,
        extensions=extensions
    )
    return mark_safe(html)
