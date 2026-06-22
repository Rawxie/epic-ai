import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove OK button from Step 2
step2_pattern = r'(<!-- Step 2: Pathway Interest -->.*?)<!-- Inline Navigation Controls -->\s*<div class="flex items-center gap-md mt-lg w-full">\s*<button type="button" class="signup-next-inline-btn bg-primary text-on-primary-container px-lg py-sm rounded-lg font-label-caps text-label-caps hover:brightness-95 transition-all flex items-center gap-sm shadow-minimal-stack border border-outline/15 uppercase font-bold outline-none">\s*<span>OK</span>\s*<span class="material-symbols-outlined text-\[16px\]">check</span>\s*</button>'
content = re.sub(step2_pattern, r'\1<!-- Inline Navigation Controls -->\n          <div class="flex items-center gap-md mt-lg w-full">', content, flags=re.DOTALL)

with open('index.html.tmp', 'w', encoding='utf-8') as f:
    f.write(content)
print("Step 1 done")
