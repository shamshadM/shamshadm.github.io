---
layout: single
title: "Research"
permalink: /research/
author_profile: true
header:
  overlay_image: /header/ux-indonesia.jpg 
  caption: "Photo by [Joel Filipe](https://unsplash.com/@gabiontheroad) on [Unsplash](https://unsplash.com)"
  classes: wide
---


<nbsp>

{% include base_path %}

{% assign ordered_pages = site.research | sort:"order_number" %}

{% for post in ordered_pages %}
  {% include archive-single.html type="grid" %}
{% endfor %}
