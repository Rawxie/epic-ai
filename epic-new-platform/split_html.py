import re
from bs4 import BeautifulSoup

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')

step3 = soup.find('div', id='step-custom-builder')
if not step3:
    print("Step 3 not found")
    exit(1)

# Modify IDs to classes for counter and dock
counter = step3.find(id='custom-selected-counter')
if counter:
    del counter['id']
    counter['class'] = counter.get('class', []) + ['custom-selected-counter']

dock = step3.find(id='custom-builder-dock')
if dock:
    del dock['id']
    dock['class'] = dock.get('class', []) + ['custom-builder-dock']

error_div = step3.find(id='custom-builder-error')
if error_div:
    del error_div['id']
    error_div['class'] = error_div.get('class', []) + ['custom-builder-error']

# We don't need the filter tabs or search bar anymore since each section will only show its own modules.
# Wait, actually we can just hardcode the display for each step.
# Let's remove the filter tabs and search bar.
tabs_div = step3.find('div', class_=lambda c: c and 'custom-tab-btn' in c)
if tabs_div:
    tabs_div.parent.decompose() # Remove the whole 'Controls Header: Tabs & Search' block

import copy

# Create 3 clones
step_ei = copy.copy(step3)
step_ei['id'] = 'step-custom-builder-ei'
step_ei.find('h2').string = 'Entrepreneurship Modules'

step_sis = copy.copy(step3)
step_sis['id'] = 'step-custom-builder-sis'
step_sis.find('h2').string = 'Social Impact Modules'

step_dti = copy.copy(step3)
step_dti['id'] = 'step-custom-builder-dti'
step_dti.find('h2').string = 'Design Thinking Modules'

# Filter the cards inside each step
def filter_cards(step, category):
    grid = step.find('div', id='custom-modules-scroll-grid')
    del grid['id']
    grid['class'] = grid.get('class', []) + ['custom-modules-scroll-grid']
    
    cards = grid.find_all('div', class_=lambda c: c and 'signup-module-card' in c)
    for card in cards:
        if card.get('data-category') != category:
            card.decompose()

filter_cards(step_ei, 'ei')
filter_cards(step_sis, 'sis')
filter_cards(step_dti, 'dti')

# Replace original step3 with the three new steps
step3.insert_before(step_ei)
step3.insert_before(step_sis)
step3.insert_before(step_dti)
step3.decompose()

# Now update JS
js = str(soup)

# Update renderCustomDock
js = js.replace(
    "const dock = document.getElementById('custom-builder-dock');\n        if (!dock) return;\n\n        dock.innerHTML = '';",
    """document.querySelectorAll('.custom-builder-dock').forEach(dock => {
        dock.innerHTML = '';"""
)
js = js.replace(
    "            dock.appendChild(chevron);\n          }\n        }",
    "            dock.appendChild(chevron);\n          }\n        }\n      });"
)

# Update toggleCustomModule error handling
js = js.replace(
    "const errorDiv = document.getElementById('custom-builder-error');",
    "const errorDivs = document.querySelectorAll('.custom-builder-error');"
)
js = js.replace(
    "if (errorDiv) {\n              errorDiv.innerText",
    "errorDivs.forEach(errorDiv => {\n              errorDiv.innerText"
)
js = js.replace(
    "setTimeout(() => {\n                errorDiv.classList.add('hidden');\n              }, 3000);\n            }",
    "setTimeout(() => {\n                errorDiv.classList.add('hidden');\n              }, 3000);\n            });"
)

# Update counter
js = js.replace(
    "const counter = document.getElementById('custom-selected-counter');",
    "const counters = document.querySelectorAll('.custom-selected-counter');"
)
js = js.replace(
    "if (counter) {\n          counter.innerText = `Selected: ${answers.customModules.length}/6`;\n        }",
    "counters.forEach(counter => {\n          counter.innerText = `Selected: ${answers.customModules.length}/6`;\n        });"
)

# Update activeSteps array
js = js.replace(
    "activeSteps.push(document.getElementById('step-custom-builder'));",
    "activeSteps.push(document.getElementById('step-custom-builder-ei'));\n          activeSteps.push(document.getElementById('step-custom-builder-sis'));\n          activeSteps.push(document.getElementById('step-custom-builder-dti'));"
)

# Update validateStep
js = js.replace(
    "else if (stepId === 'step-custom-builder') {",
    "else if (stepId.startsWith('step-custom-builder')) {"
)
js = js.replace(
    "const errorDiv = document.getElementById('custom-builder-error');",
    "const errorDiv = activeStep.querySelector('.custom-builder-error');"
)

# Write out
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(js)

print("Done splitting steps")
