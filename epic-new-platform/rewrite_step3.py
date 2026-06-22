import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Remove OK button from Step 2
step2_pattern = r'(<!-- Step 2: Pathway Interest -->.*?)<!-- Inline Navigation Controls -->\s*<div class="flex items-center gap-md mt-lg w-full">\s*<button type="button" class="signup-next-inline-btn bg-primary text-on-primary-container px-lg py-sm rounded-lg font-label-caps text-label-caps hover:brightness-95 transition-all flex items-center gap-sm shadow-minimal-stack border border-outline/15 uppercase font-bold outline-none">\s*<span>OK</span>\s*<span class="material-symbols-outlined text-\[16px\]">check</span>\s*</button>'
html = re.sub(step2_pattern, r'\1<!-- Inline Navigation Controls -->\n          <div class="flex items-center gap-md mt-lg w-full">', html, flags=re.DOTALL)


# Grab step 3 block
match = re.search(r'(<!-- Step 3: Custom Pathway Builder -->\n\s*<div class="signup-step [^"]*" data-step="3" id="step-custom-builder">.*?)(?=<!-- Step 4: What do you want to build or work on\? -->)', html, flags=re.DOTALL)
if not match:
    print("Could not find step 3")
    exit(1)

step3_full = match.group(1)

# Modify the JS for active steps
js_active_steps_old = "activeSteps.push(document.getElementById('step-custom-builder'));"
js_active_steps_new = """activeSteps.push(document.getElementById('step-custom-builder-ei'));
          activeSteps.push(document.getElementById('step-custom-builder-sis'));
          activeSteps.push(document.getElementById('step-custom-builder-dti'));"""

# Modify the JS for rendering custom dock
js_dock_old = """      function renderCustomDock() {
        const dock = document.getElementById('custom-builder-dock');
        if (!dock) return;

        dock.innerHTML = '';"""
js_dock_new = """      function renderCustomDock() {
        document.querySelectorAll('.custom-builder-dock').forEach(dock => {
        dock.innerHTML = '';"""

js_dock_close_old = """            dock.appendChild(chevron);
          }
        }
      }"""
js_dock_close_new = """            dock.appendChild(chevron);
          }
        });
      }"""

# Modify JS for validateStep
js_validate_old = "} else if (stepId === 'step-custom-builder') {"
js_validate_new = "} else if (stepId.startsWith('step-custom-builder')) {"

js_validate_error_old = "const errorDiv = document.getElementById('custom-builder-error');"
js_validate_error_new = "const errorDiv = activeStep.querySelector('.custom-builder-error');"

js_toggle_error_old = "const errorDiv = document.getElementById('custom-builder-error');"
js_toggle_error_new = "const errorDivs = document.querySelectorAll('.custom-builder-error');"

js_toggle_error_action_old = """            if (errorDiv) {
              errorDiv.innerText = "You can select up to 6 custom modules.";
              errorDiv.classList.remove('hidden');
              setTimeout(() => {
                errorDiv.classList.add('hidden');
              }, 3000);
            }"""
js_toggle_error_action_new = """            errorDivs.forEach(errorDiv => {
              errorDiv.innerText = "You can select up to 6 custom modules.";
              errorDiv.classList.remove('hidden');
              setTimeout(() => {
                errorDiv.classList.add('hidden');
              }, 3000);
            });"""

# Counter
js_counter_old = """        const counter = document.getElementById('custom-selected-counter');
        if (counter) {
          counter.innerText = `Selected: ${answers.customModules.length}/6`;
        }"""
js_counter_new = """        document.querySelectorAll('.custom-selected-counter').forEach(counter => {
          counter.innerText = `Selected: ${answers.customModules.length}/6`;
        });"""

# Now build the 3 steps
def make_step(step_id, title, category_match_start, category_match_end, show_back):
    # Base step structure
    # Extract the header
    header_end = step3_full.find('<!-- Modules Scrollable Grid -->')
    header_part = step3_full[:header_end]
    header_part = header_part.replace('id="step-custom-builder"', f'id="{step_id}"')
    header_part = header_part.replace('Mix & Match Modules', title)
    
    # Fix ID to Class conversion correctly!
    header_part = header_part.replace(' id="custom-selected-counter"', '')
    header_part = header_part.replace('shadow-sm"', 'shadow-sm custom-selected-counter"')
    
    header_part = header_part.replace(' id="custom-builder-dock"', '')
    header_part = header_part.replace('shadow-sm select-none"', 'shadow-sm select-none custom-builder-dock"')
    
    header_part = header_part.replace(' id="custom-builder-error"', '')
    header_part = header_part.replace('tracking-widest hidden mt-1"', 'tracking-widest hidden mt-1 custom-builder-error"')
    
    # Remove the tabs and search
    tabs_start = header_part.find('<!-- Controls Header: Tabs & Search -->')
    if tabs_start != -1:
        # also remove the div that contains it
        header_part = header_part[:tabs_start]

    # Grab the grid
    grid_start = step3_full.find('<div class="grid grid-cols-1 md:grid-cols-2 gap-xs">')
    grid_end = step3_full.find('</div>\n          </div>\n\n          <!-- Inline Navigation Controls -->')
    grid_content = step3_full[grid_start:grid_end]
    
    # Extract specific category
    cat_start = grid_content.find(category_match_start)
    cat_end = grid_content.find(category_match_end) if category_match_end else len(grid_content)
    cat_content = grid_content[cat_start:cat_end]

    # Footer
    footer = step3_full[grid_end:]
    # If not the last step (dti), replace OK with NEXT
    if step_id != 'step-custom-builder-dti':
        footer = footer.replace('<span>OK</span>', '<span>NEXT</span>')
    
    return header_part + '          <!-- Modules Scrollable Grid -->\n          <div class="w-full max-h-[400px] overflow-y-auto border border-outline/15 rounded-xl p-xs bg-surface-container-low custom-scrollbar">\n            <div class="grid grid-cols-1 md:grid-cols-2 gap-xs">\n' + cat_content + '            </div>\n          </div>\n\n' + footer

step_ei = make_step('step-custom-builder-ei', 'Entrepreneurship Modules', '<!-- E&I Modules', '<!-- SIS Modules', True)
step_sis = make_step('step-custom-builder-sis', 'Social Impact Modules', '<!-- SIS Modules', '<!-- DTI Modules', True)
step_dti = make_step('step-custom-builder-dti', 'Design Thinking Modules', '<!-- DTI Modules', None, True)

html = html.replace(step3_full, step_ei + '\n' + step_sis + '\n' + step_dti + '\n')

# JS replacements
html = html.replace(js_active_steps_old, js_active_steps_new)
html = html.replace(js_dock_old, js_dock_new)
html = html.replace(js_dock_close_old, js_dock_close_new)
html = html.replace(js_validate_old, js_validate_new)
html = html.replace(js_validate_error_old, js_validate_error_new)
html = html.replace(js_toggle_error_old, js_toggle_error_new)
html = html.replace(js_toggle_error_action_old, js_toggle_error_action_new)
html = html.replace(js_counter_old, js_counter_new)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Split success")
