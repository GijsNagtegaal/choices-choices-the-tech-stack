---
layout: layouts/base.njk
pagination:
  data: citiesApi
  size: 1
---
<main>
  <p><a href="/">← All cities</a></p>
  {% set city = pagination.items[0] %}
  <h1>{{ city.name }}</h1>

  {% if city.latitude and city.longitude %}
  <p>Coordinates: {{ city.latitude }}, {{ city.longitude }}</p>
  {% endif %}
</main>
