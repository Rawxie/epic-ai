import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

new_logic = """      function calculateRouting() {
        let pathway = answers.pathway;
        const stage = answers.journeyStage;
        const hours = answers.weeklyHours;
        const builds = answers.buildType || [];
        const supports = answers.supportNeed || [];

        // Rule 1: Pathway interest comes first
        if (!pathway || pathway === 'not_sure') {
          if (builds.includes('startup')) {
            pathway = 'entrepreneurship';
          } else if (builds.includes('social_impact') || builds.includes('sustainability')) {
            pathway = 'social_impact';
          } else if (builds.includes('creative_project')) {
            pathway = 'design_thinking';
          } else {
            pathway = 'entrepreneurship'; // Fallback
          }
        }

        // 2. Determine Learner Type based on stage & goals
        let learnerType = 'Explorer';
        if (stage === 'exploring') {
          learnerType = 'Explorer';
        } else if (stage === 'rough_idea') {
          learnerType = 'Problem Finder';
          if (supports.includes('project_plan')) learnerType = 'Idea Builder';
        } else if (stage === 'know_what') {
          learnerType = 'Idea Builder';
        } else if (stage === 'working_on') {
          learnerType = 'Prototype Maker';
        } else if (stage === 'invited') {
          learnerType = 'Explorer'; // Overridden later potentially
        }

        if (builds.includes('startup')) {
          learnerType = 'Founder';
        } else if (builds.includes('social_impact') || builds.includes('sustainability') || pathway === 'social_impact') {
          learnerType = 'Changemaker';
        } else if (builds.includes('creative_project') || pathway === 'design_thinking') {
          learnerType = 'Creative Innovator';
        }
        if (pathway === 'entrepreneurship' && (stage === 'working_on' || builds.includes('startup'))) {
          learnerType = 'Founder';
        }

        // Rule 2 & 3: Journey stage and Weekly time decides credential level
        let level = 'discovery'; 
        let planName = '';

        if (pathway === 'custom') {
          if (hours === 'more_5h') level = 'micro';
          else if (hours === '3_5h' || hours === '1_3h') level = 'build';
          else level = 'discovery';
          planName = 'Custom Pathway (Mix & Match)';
        } else {
          // Rule 4: Program invitation overrides
          if (stage === 'invited') {
             level = 'assigned'; 
          } else if (hours === 'more_5h') {
             level = 'micro';
          } else if (hours === '3_5h') {
             if (stage === 'exploring') level = 'discovery';
             else level = 'build';
          } else if (hours === '1_3h') {
             if (stage === 'working_on' || stage === 'know_what') level = 'build';
             else level = 'discovery';
          } else if (hours === 'less_1h') {
             level = 'discovery'; // Mini challenge
          }
        }

        // 4. Map calculated Archetype and Plan
        let spaceUrl = 'https://epic-ai.mn.co/spaces/explorer-studio';
        let spaceName = 'Explorer Studio';
        
        let displayPathwayName = '';
        let firstChallenge = '';
        let coach = '';
        let mIndices = [];

        // Apply Pathway Map by Learner Type and Credential Level
        if (pathway === 'entrepreneurship') {
          if (level === 'micro') {
             planName = 'Entrepreneurship & Innovation Micro Plan';
             spaceName = 'Founder Track, Idea Builder Studio, Prototype Lab';
             mIndices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
             coach = 'C.A.S.E. Coach, Problem Validation Coach, Pitch Coach, etc.';
             firstChallenge = 'Complete your venture snapshot and pitch';
          } else if (level === 'build') {
             planName = 'Venture Concept & Prototyping Nano Plan';
             spaceName = 'Idea Builder Studio, Prototype Lab';
             mIndices = [4, 5, 6];
             coach = 'Venture Concept Coach, Prototype Coach';
             firstChallenge = 'Build one testable prototype';
          } else {
             planName = 'Problem Discovery & Validation Nano Plan';
             spaceName = 'Explorer Studio, Problem Validation Lab';
             mIndices = [1, 2, 3];
             coach = 'C.A.S.E. Coach, Problem Validation Coach';
             firstChallenge = 'Find 3 problems worth exploring';
          }
          displayPathwayName = 'Entrepreneurship & Innovation';
        } else if (pathway === 'social_impact') {
          if (level === 'micro') {
             planName = 'Social Impact & Sustainability Micro Plan';
             spaceName = 'Impact Studio';
             mIndices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
             coach = 'Social Problem Framing Coach, SDG Mapping Chatbot, etc.';
             firstChallenge = 'Complete your impact pitch and implementation plan';
          } else if (level === 'build') {
             planName = 'Impact Model & Pilot Design Nano Plan';
             spaceName = 'Impact Studio, Prototype Lab';
             mIndices = [4, 5, 6];
             coach = 'SDG Mapping Chatbot, Impact Measurement Coach';
             firstChallenge = 'Design a social business or intervention pilot';
          } else {
             planName = 'Social Problem & Systems Discovery Nano Plan';
             spaceName = 'Explorer Studio, Impact Studio';
             mIndices = [1, 2, 3];
             coach = 'Social Problem Framing Coach, Systems Mapping Coach';
             firstChallenge = 'Map the people, systems, and constraints around your issue';
          }
          displayPathwayName = 'Social Impact & Sustainability';
        } else if (pathway === 'design_thinking') {
          if (level === 'micro') {
             planName = 'Design Thinking for Innovation Micro Plan';
             spaceName = 'Creative Innovation Studio, Prototype Lab';
             mIndices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
             coach = 'Design Challenge Framing Coach, Ideation Coach, etc.';
             firstChallenge = 'Complete your innovation portfolio';
          } else if (level === 'build') {
             planName = 'Ideation, Prototyping & Testing Nano Plan';
             spaceName = 'Creative Innovation Studio, Prototype Lab';
             mIndices = [4, 5, 6];
             coach = 'Ideation Coach, Concept Selection Coach';
             firstChallenge = 'Generate and test ideas';
          } else {
             planName = 'Human-Centered Discovery Nano Plan';
             spaceName = 'Explorer Studio, Creative Innovation Studio';
             mIndices = [1, 2, 3];
             coach = 'Design Challenge Framing Coach, Empathy Research Coach';
             firstChallenge = 'Frame one problem as a design challenge';
          }
          displayPathwayName = 'Design Thinking for Innovation';
        } else if (pathway === 'custom') {
          displayPathwayName = 'Custom Pathway (Mix & Match)';
          planName = displayPathwayName;
          firstChallenge = 'Synthesize your custom modules into a milestone plan';
          coach = 'Strategy Coach';
          spaceName = 'Explorer Studio'; // default
        }

        if (stage === 'invited') {
           planName = 'Assigned Program Cohort Pathway';
        }

        // Select Unlocked Modules list
        let unlockedModules = [];
        if (pathway === 'custom') {
          unlockedModules = answers.customModules.map(mId => ALL_MODULES[mId]);
        } else {
          const prefix = pathway === 'entrepreneurship' ? 'ei' : (pathway === 'social_impact' ? 'sis' : 'dti');
          unlockedModules = mIndices.map(idx => ALL_MODULES[`${prefix}-${idx}`]);
        }

        return {
          pathwayName: displayPathwayName,
          planName: planName,
          learnerType: learnerType,
          credentialLevel: level === 'discovery' ? 'Discovery Nano' : (level === 'build' ? 'Build Nano' : (level === 'micro' ? 'Full Micro-Credential' : 'Program Assigned')),
          spaceName: spaceName,
          spaceUrl: spaceUrl,
          unlockedModules: unlockedModules,
          firstChallenge: firstChallenge,
          coach: coach
        };
      }

      function showPathwayPreview() {
        const result = calculateRouting();

        // Welcome / title updates
        const successTitle = document.querySelector('#signup-success-screen h2');
        if (successTitle) {
          successTitle.innerText = `Your EPIC pathway is ready, ${answers.name}`;
        }

        document.getElementById('preview-pathway').innerText = result.planName;
        document.getElementById('preview-learner-type').innerText = result.learnerType;
        document.getElementById('preview-credential').innerText = result.credentialLevel;
        document.getElementById('preview-first-step').innerText = result.firstChallenge;
        document.getElementById('preview-coach').innerText = result.coach;
        document.getElementById('preview-community').innerText = result.spaceName;

        let paceName = "1–3 hours/week";
        if (answers.weeklyHours) {
          if (answers.weeklyHours === 'less_1h') paceName = "< 1 hour/week";
          else if (answers.weeklyHours === '1_3h') paceName = "1–3 hours/week";
          else if (answers.weeklyHours === '3_5h') paceName = "3–5 hours/week";
          else if (answers.weeklyHours === 'more_5h') paceName = "5+ hours/week";
        }
        document.getElementById('preview-pace').innerText = paceName;

        // Populate unlocked modules list
        const modulesContainer = document.getElementById('preview-modules');
        if (modulesContainer) {
          modulesContainer.innerHTML = '';
          result.unlockedModules.forEach(mod => {
            if (!mod) return;
            const badge = document.createElement('div');
            badge.className = 'flex items-center gap-1 bg-surface-container border border-outline/10 px-2 py-0.5 rounded text-[10px] text-on-surface font-medium mb-1 mr-1 select-none';
            badge.innerHTML = `<span class="bg-primary/20 text-primary font-mono text-[9px] px-1 rounded font-bold">${mod.code}</span> <span>${mod.name}</span>`;
            modulesContainer.appendChild(badge);
          });
        }

        // Update redirect button link
        const redirectBtn = document.getElementById('signup-mighty-redirect-btn');
        if (redirectBtn) {
          redirectBtn.href = result.spaceUrl;
        }

        const success = document.getElementById('signup-success-screen');
        success.classList.remove('opacity-0', 'pointer-events-none');
        success.classList.add('opacity-100');
      }"""

# regex replace from the first `function calculateRouting() {` to the `success.classList.add('opacity-100');\n      }`
pattern = re.compile(r'      function calculateRouting\(\) \{.*?success\.classList\.add\(\'opacity-100\'\);\n      \}', re.DOTALL)
html = pattern.sub(new_logic, html, count=1)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
