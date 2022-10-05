---
layout: single
title: "Publications"
permalink: /publications/
author_profile: true
header:
    overlay_image: /header/pub.webp
    og_image: /images/favicon/shamshad.webp
page_excerpts: true
classes: wide
---

<hr>
<h2><img src="/images/pub/Publications.webp" height="40" width="40"> Pre-prints </h2>
<hr>
Comming soon


<hr>

{% if site.author.googlescholar %}
 I have collaborated to manuscripts published in high quality peer-reviewed scientific journals. 
 <a href="{{site.author.googlescholar}}">you can see my Google Scholar profile</a>.
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



