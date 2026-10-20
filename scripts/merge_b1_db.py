# -*- coding: utf-8 -*-
"""
Merger Script for Grammar Plus B1
Merges all 40 units exercises, audio transcripts, and appendices into:
- data/exercises_db.json (v2.0.0)
- js/data_units.js
"""
import json
import os
import sys

sys.path.append(os.path.dirname(__file__))

import b1_units_part1 as p1
import b1_units_part2 as p2
import b1_units_part3 as p3
import b1_units_part4 as p4
from b1_audio_transcripts import B1_AUDIO_TRANSCRIPTS

db_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'exercises_db.json')
with open(db_path, 'r', encoding='utf-8') as f:
    db = json.load(f)

unit_map = {
    4: p1.U4_EXERCISES,
    5: p1.U5_EXERCISES,
    6: p1.U6_EXERCISES,
    7: p1.U7_EXERCISES,
    8: p1.U8_EXERCISES,
    9: p1.U9_EXERCISES,
    10: p1.U10_EXERCISES,
    11: p1.U11_EXERCISES,
    12: p1.U12_EXERCISES,
    13: p2.U13_EXERCISES,
    14: p2.U14_EXERCISES,
    15: p2.U15_EXERCISES,
    16: p2.U16_EXERCISES,
    17: p2.U17_EXERCISES,
    18: p2.U18_EXERCISES,
    19: p2.U19_EXERCISES,
    20: p2.U20_EXERCISES,
    21: p2.U21_EXERCISES,
    22: p3.U22_EXERCISES,
    23: p3.U23_EXERCISES,
    24: p3.U24_EXERCISES,
    25: p3.U25_EXERCISES,
    26: p3.U26_EXERCISES,
    27: p3.U27_EXERCISES,
    28: p3.U28_EXERCISES,
    29: p3.U29_EXERCISES,
    30: p3.U30_EXERCISES,
    31: p4.U31_EXERCISES,
    32: p4.U32_EXERCISES,
    33: p4.U33_EXERCISES,
    34: p4.U34_EXERCISES,
    35: p4.U35_EXERCISES,
    36: p4.U36_EXERCISES,
    37: p4.U37_EXERCISES,
    38: p4.U38_EXERCISES,
    39: p4.U39_EXERCISES,
    40: p4.U40_EXERCISES
}

for u in db['units']:
    uid = u['id']
    if uid in unit_map:
        u['exercises'] = unit_map[uid]

total_exercises = sum(len(u.get('exercises', [])) for u in db['units'])
total_questions = sum(sum(len(e.get('questions', [])) for e in u.get('exercises', [])) for u in db['units'])
print(f"Grammar Plus B1: Total units: {len(db['units'])}, Total exercises: {total_exercises}, Total questions: {total_questions}")

# Update transcripts and version
db['version'] = '2.0.0'
db['audio_transcripts'] = B1_AUDIO_TRANSCRIPTS

# Save updated JSON
with open(db_path, 'w', encoding='utf-8') as f:
    json.dump(db, f, indent=2, ensure_ascii=False)
print("Saved data/exercises_db.json successfully!")

# Build updated js/data_units.js
js_path = os.path.join(os.path.dirname(__file__), '..', 'js', 'data_units.js')
with open(js_path, 'r', encoding='utf-8') as f:
    content = f.read()

idx_units_start = content.find('const GRAMMAR_UNITS = ') + len('const GRAMMAR_UNITS = ')
idx_units_end = content.find(';\n\nconst LAMPIRAN_A')
if idx_units_end == -1:
    idx_units_end = content.find(';\nconst LAMPIRAN_A')

new_units_json = json.dumps(db['units'], indent=2, ensure_ascii=False)
content = content[:idx_units_start] + new_units_json + content[idx_units_end:]

# Update AUDIO_TRANSCRIPTS in js
idx_t_start = content.find('const AUDIO_TRANSCRIPTS = ') + len('const AUDIO_TRANSCRIPTS = ')
idx_t_end = content.find(';\n\n// Expose globally', idx_t_start)
if idx_t_end == -1:
    idx_t_end = content.find(';\n// Expose globally', idx_t_start)

new_t_json = json.dumps(B1_AUDIO_TRANSCRIPTS, indent=2, ensure_ascii=False)
content = content[:idx_t_start] + new_t_json + content[idx_t_end:]

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Updated js/data_units.js successfully! Length: {len(content)} bytes")
