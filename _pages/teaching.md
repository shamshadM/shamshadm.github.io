---
title: "Teaching"
layout: single
permalink: /teaching/
header:
  overlay_image: /header/teaching.jpg
  caption: "Photo by [Alexander Grey]"
  classes: wide 
---

Research plays a central role in my teaching as students improve their analytical skills and master the tools of data analysis through hands-on experience.I have taught undergraduate courses on Plant Breeding and Genetics. I taught the graduate statistics lab for Advanced Topics in Agricultural Data Science, where my work was recognized by the by the Department’s. I am worked instractor various institutions, which help me to develops evidence-based methods for teaching “essential data and computational skills for conducting efficient, open, and reproducible research.”

### General Teaching Materials
{% for post in site.teaching reversed %}
{% if post.collection == 'Genral' %}
  {% include archive-single.html %}
  {% endif %}
{% endfor %}

### Teaching Courses
{% for post in site.teaching reversed %}
{% if post.type == 'Undergraduate Courses' or "Graduate course" %}
  {% include archive-single.html %}
  {% endif %}
{% endfor %}