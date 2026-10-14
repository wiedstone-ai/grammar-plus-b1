# -*- coding: utf-8 -*-
"""
Builder to generate index_standalone.html from index.html + styles.css + data_units.js + exercises_store.js + app.js
"""
import re

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

with open("css/styles.css", "r", encoding="utf-8") as f:
    css = f.read()

with open("js/data_units.js", "r", encoding="utf-8") as f:
    data_units = f.read()

with open("js/exercises_store.js", "r", encoding="utf-8") as f:
    exercises_store = f.read()

with open("js/app.js", "r", encoding="utf-8") as f:
    app_js = f.read()

# Replace css link with style
html_standalone = re.sub(
    r'<link rel="stylesheet" href="css/styles\.css[^"]*">',
    lambda m: f'<style>\n{css}\n</style>',
    html
)

# Replace script tags with inlined scripts
script_pattern = r'<!-- Scripts -->[\s\S]*?<script src="js/app\.js[^"]*"></script>'
inlined_scripts = f"""<!-- Inlined Modular Scripts -->
  <script>
{data_units}
  </script>
  <script>
{exercises_store}
  </script>
  <script>
{app_js}
  </script>"""

html_standalone = re.sub(script_pattern, lambda m: inlined_scripts, html_standalone)

with open("index_standalone.html", "w", encoding="utf-8") as f:
    f.write(html_standalone)

print("index_standalone.html successfully generated! Size:", len(html_standalone), "bytes")
