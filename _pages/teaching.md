---
title: "Teaching"
layout: single
permalink: /teaching/
published: true
header:
  overlay_image: /header/teaching.jpeg
  og_image: /images/favicon/shamshad.webp
classes: wide
---

Research plays a central role in my teaching as students improve their analytical skills and master the tools of data analysis through hands-on experience.I have taught undergraduate courses on Plant Breeding and Genetics. I taught the graduate statistics lab for Advanced Topics in Agricultural Data Science, where my work was recognized by the by the Department’s. I am worked instructor various institutions, which help me to develops evidence-based methods for teaching “essential data and computational skills for conducting efficient, open, and reproducible research.”

### General Teaching Materials
<div class="stat">
<a href="/teaching/summary" class="btn btn-outline-primary"><i class="fas fa-square-root-alt"></i> Static Summary</a>

<br>

<a href="/teaching/designs" class="btn btn-outline-primary"><i class="fas fa-sitemap"></i> Field Experiments Analysis</a> 
<br>

</div>
{% for post in site.teaching reversed %}
{% if post.type == 'Bioinformatics' %}
  {% include archive-single.html %}
  {% endif %}
{% endfor %}
{% include paginator.html %}

### Teaching Courses

{% for post in site.teaching reversed %}
{% if post.type == 'Undergraduate Courses' %}
  {% include archive-single.html %}
  {% elsif post.type == "Graduate course" %}
  {% include archive-single.html %}
  {% endif %}
{% endfor %}