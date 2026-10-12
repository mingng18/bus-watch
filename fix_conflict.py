import re

with open(".jules/palette.md", "r") as f:
    content = f.read()

fixed = re.sub(r'<<<<<<< HEAD\n(.*?)\n=======\n(.*?)\n>>>>>>> 7b4a8f2 \(🎨 Palette: Add centered text alignment to DeparturesTowardView empty state\)\n', r'\1\n\2\n', content, flags=re.DOTALL)

with open(".jules/palette.md", "w") as f:
    f.write(fixed)
