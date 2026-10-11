with open('.jules/palette.md', 'r') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if line.startswith('<<<<<<< HEAD') or line.startswith('=======') or line.startswith('>>>>>>> c9177c0'):
        continue
    new_lines.append(line)

with open('.jules/palette.md', 'w') as f:
    f.writelines(new_lines)

with open('watch-app/BusWatch/Views/ManualPickerView.swift', 'r') as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    if line.startswith('<<<<<<< HEAD'):
        skip = True
        continue
    if line.startswith('======='):
        skip = False
        continue
    if line.startswith('>>>>>>> c9177c0'):
        continue
    if skip:
        continue
    new_lines.append(line)

with open('watch-app/BusWatch/Views/ManualPickerView.swift', 'w') as f:
    f.writelines(new_lines)
