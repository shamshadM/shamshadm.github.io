---
layout: single
title: "Publications"
permalink: /publications/
author_profile: true
classes: wide
header:
    overlay_image: /header/publications.jpeg
    og_image: /images/favicon/shamshad.webp
page_excerpts: true
---

<hr>
<i class="ai ai-ideas-repec ai-2x"> Pre-prints
<hr>
Comming soon


<hr>

{% if site.author.googlescholar %}
<a href="{{site.author.googlescholar}}"><i class="ai ai-google-scholar ai-2x" ></i></a>
{% endif %}
I have collaborated to manuscripts published in high quality peer-reviewed scientific journals.


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

<hr>


<sup>*</sup> Equal authorship



