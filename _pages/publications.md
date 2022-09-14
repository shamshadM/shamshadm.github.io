---
layout: single
title: "Publications"
permalink: /publications/
author_profile: true
header:
    overlay_image: /header/pub.jpg
    caption: "Photo by [Joel Filipe](https://unsplash.com/@joelfilip) on [Unsplash](https://unsplash.com)"
page_excerpts: true
classes: wide
redirect_from: 
  - /files/reasearch/
---

****
### Pre-prints 

****
Comming soon


<hr>

{% if site.author.googlescholar %}
  You can also find my articles on <u><a href="{{site.author.googlescholar}}">my Google Scholar profile</a>.</u>
{% endif %}

{% include base_path %}

<hr>

<h2>Peer-Reviewed Publications</h2> 
{% for post in site.publications reversed %}
  {% if post.pubtype == 'journal' %}
      {% include archive-single.html %}
  {% endif %}
{% endfor %}

<!-- <h2>Conference Papers</h2>-->
{% for post in site.publications reversed %}
  {% if post.pubtype == 'conference' %}
      {% include archive-single.html %}
  {% endif %}
{% endfor %}

<h2>Books and Book chapters</h2>
{% for post in site.publications reversed %}
  {% if post.pubtype == 'book' %}
      {% include archive-single.html %}
  {% endif %}
{% endfor %}

<!-- <h2>Academic</h2>
{% for post in site.publications reversed %}
  {% if post.pubtype == 'academic' %}
      {% include archive-single.html %}
  {% endif %}
{% endfor %} -->



