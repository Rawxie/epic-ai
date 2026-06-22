    // PSQ Radar Chart Initialization
    const ctx = document.getElementById('psqRadarChart').getContext('2d');
    const psqChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Creativity', 'Empathy', 'Critical Thinking', 'Problem Framing', 'Evidence Use', 'Reflection'],
        datasets: [{
          label: 'Sample PSQ Snapshot',
          data: [75, 70, 72, 78, 68, 72],
          fill: true,
          backgroundColor: 'rgba(250, 204, 21, 0.2)',
          borderColor: '#FACC15',
          pointBackgroundColor: '#FACC15',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#FACC15'
        }]
      },
      options: {
        elements: { line: { borderWidth: 3 } },
        scales: {
          r: {
            angleLines: { color: 'rgba(10, 25, 47, 0.1)' },
            grid: { color: 'rgba(10, 25, 47, 0.1)' },
            pointLabels: {
              font: { family: 'Inter', size: 12, weight: 'bold' },
              color: '#0A192F'
            },
            ticks: { display: false, stepSize: 20 },
            suggestedMin: 0,
            suggestedMax: 100
          }
        },
        plugins: { legend: { display: false } }
      }
    });

    // Transcript Simulation
    const transcriptLines = [
      { sender: "AI", text: "Analyzing Artifact #402: 'Social Impact Matrix'..." },
      { sender: "SYSTEM", text: "Checking logical consistency across variables A and B." },
      { sender: "BUILDER", text: "I've updated the iteration loop to include stakeholder feedback from the Lab session." },
      { sender: "AI", text: "Feedback generated. Critical Thinking signal increased in this sample." },
      { sender: "SYSTEM", text: "New badge unlocked: 'Agile Architect'." },
      { sender: "AI", text: "Requesting peer review for artifact feedback..." },
      { sender: "BUILDER", text: "Peer feedback received. Adjusting hypothesis 3." }
    ];

    let currentLineIndex = 0;
    const feed = document.getElementById('transcript-feed');
    const scoreDisplay = document.getElementById('psq-score');
    let baseScore = 72.5;

    function addTranscriptLine() {
      const line = transcriptLines[currentLineIndex];
      const div = document.createElement('div');
      div.className = 'transcript-line mb-3';
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const color = line.sender === 'AI' ? 'text-primary' : (line.sender === 'SYSTEM' ? 'text-gray-400' : 'text-surface');
      div.innerHTML = `<span class="opacity-40">[${timestamp}]</span> <span class="${color} font-bold">${line.sender}:</span> ${line.text}`;
      feed.appendChild(div);
      feed.scrollTop = feed.scrollHeight;

      baseScore = Math.min(95, Math.max(50, baseScore + (Math.random() * 6 - 3)));
      const newChartData = [
        baseScore + 4, baseScore - 3, baseScore + 6, baseScore - 2, baseScore + 1, baseScore - 6
      ].map(val => Math.min(100, Math.max(20, val)));

      psqChart.data.datasets[0].data = newChartData;
      psqChart.update();
      const averageScore = newChartData.reduce((a, b) => a + b, 0) / newChartData.length;
      scoreDisplay.innerText = averageScore.toFixed(1);
      currentLineIndex = (currentLineIndex + 1) % transcriptLines.length;
    }
    setInterval(addTranscriptLine, 3000);

    // Smooth navbar logo transition on scroll
    const navElement = document.querySelector('nav');
    let isScrolled = false;
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (!isScrolled && scrollY > 80) {
        navElement.classList.add('scrolled');
        isScrolled = true;
      } else if (isScrolled && scrollY < 40) {
        navElement.classList.remove('scrolled');
        isScrolled = false;
      }
    }, { passive: true });
    // Signup Experience Controller
    (function () {
      // --- CONFIGURATION ---
      // Webhook URL for Signup completions (especially Custom Pathway)
      // Connects Google Sheets/Zapier to record chosen details.
      const ZAPIER_SIGNUP_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/2874956/43q4iw9/';
      // ---------------------

      const modal = document.getElementById('signup-modal');
      const allSteps = Array.from(document.querySelectorAll('.signup-step'));
      const closeBtn = document.getElementById('signup-close-btn');
      const successCloseBtn = document.getElementById('signup-success-close-btn');
      const progress = document.getElementById('signup-progress');
      const stepCounter = document.getElementById('signup-step-counter');

      let currentStep = 0; // 0-based index in activeSteps
      let activeSteps = [];
      let answers = {
        name: '',
        email: '',
        pathway: '',
        customModules: [],
        buildType: [],
        journeyStage: '',
        supportNeed: [],
        learningStyle: ['ai_conversations'], // preselected locked D
        weeklyHours: ''
      };

      // Module Database
      const ALL_MODULES = {
        'ei-1': { code: 'E&I 1', name: 'Problem Discovery and Definition', desc: 'Explore problem statements and stakeholder discovery.' },
        'ei-2': { code: 'E&I 2', name: 'Problem Validation', desc: 'Test problem assumptions through direct customer discovery.' },
        'ei-3': { code: 'E&I 3', name: 'Stakeholder Research & Systems Mapping', desc: 'Map stakeholders, interests, and system loops.' },
        'ei-4': { code: 'E&I 4', name: 'Creative Opportunity Discovery', desc: 'Translate validation insights into venture opportunities.' },
        'ei-5': { code: 'E&I 5', name: 'Venture Concept Development', desc: 'Formulate unique value propositions and solution architecture.' },
        'ei-6': { code: 'E&I 6', name: 'Prototyping', desc: 'Build low-fidelity landing pages and feature flows.' },
        'ei-7': { code: 'E&I 7', name: 'Business Model / Market Segmentation', desc: 'Select beachhead markets and pricing models.' },
        'ei-8': { code: 'E&I 8', name: 'Brand, Mission, and Story', desc: 'Craft mission-driven branding and narrative.' },
        'ei-9': { code: 'E&I 9', name: 'Finance and Legal 101', desc: 'Understand unit economics, costs, and legal entity setup.' },
        'ei-10': { code: 'E&I 10', name: 'Pitch and Launch', desc: 'Pitch to partners and present venture metrics.' },

        'sis-1': { code: 'SIS 1', name: 'Social Problem Discovery', desc: 'Identify systemic community and societal challenges.' },
        'sis-2': { code: 'SIS 2', name: 'Community Problem Validation', desc: 'Validate community needs through ethical engagements.' },
        'sis-3': { code: 'SIS 3', name: 'Stakeholder & Systems Mapping', desc: 'Map power structures and community dependencies.' },
        'sis-4': { code: 'SIS 4', name: 'SDG & Sustainability Alignment', desc: 'Link projects to UN SDGs and carbon neutrality rules.' },
        'sis-5': { code: 'SIS 5', name: 'Impact Model Design', desc: 'Design a logic model or Theory of Change diagram.' },
        'sis-6': { code: 'SIS 6', name: 'Social Business / Intervention Design', desc: 'Define social venture models or municipal briefs.' },
        'sis-7': { code: 'SIS 7', name: 'Pilot and Partnership Strategy', desc: 'Formulate pilot agreements and civic alignments.' },
        'sis-8': { code: 'SIS 8', name: 'Impact Measurement', desc: 'Track quantitative and qualitative impact metrics.' },
        'sis-9': { code: 'SIS 9', name: 'Sustainability and Scale Strategy', desc: 'Plan financial viability and policy scaling structures.' },
        'sis-10': { code: 'SIS 10', name: 'Impact Pitch and Implementation Plan', desc: 'Create systems-level pitches and implementation steps.' },

        'dti-1': { code: 'DTI 1', name: 'Creative Confidence & Problem Awareness', desc: 'Overcome creative blocks and map human needs.' },
        'dti-2': { code: 'DTI 2', name: 'Empathy and Human-Centered Research', desc: 'Conduct observation, surveys, and deep user interviews.' },
        'dti-3': { code: 'DTI 3', name: 'Insight Synthesis', desc: 'Formulate empathy maps, user personas, and core insights.' },
        'dti-4': { code: 'DTI 4', name: 'Reframing & How Might We Questions', desc: 'Reframe problems and formulate brainstorm springboards.' },
        'dti-5': { code: 'DTI 5', name: 'Ideation and Concept Development', desc: 'Run structured ideation sessions and evaluate concepts.' },
        'dti-6': { code: 'DTI 6', name: 'Prototyping and Testing', desc: 'Build low-fidelity user flow wireframes and mockups.' },
        'dti-7': { code: 'DTI 7', name: 'Feedback, Iteration, & Learning Loops', desc: 'Conduct interactive feedback testing sessions.' },
        'dti-8': { code: 'DTI 8', name: 'Storyboarding & Experience Design', desc: 'Design end-to-end customer journey storyboards.' },
        'dti-9': { code: 'DTI 9', name: 'Innovation Storytelling', desc: 'Frame innovation narratives and pitch decks.' },
        'dti-10': { code: 'DTI 10', name: 'Portfolio & Final Design Challenge', desc: 'Synthesize projects into design thinking portfolios.' }
      };

      function updateActiveSteps() {
        activeSteps = [
          document.getElementById('step-name-email'),
          document.getElementById('step-pathway-interest')
        ];
        if (answers.pathway === 'custom') {
          activeSteps.push(document.getElementById('step-custom-builder-ei'));
          activeSteps.push(document.getElementById('step-custom-builder-sis'));
          activeSteps.push(document.getElementById('step-custom-builder-dti'));
        }
        activeSteps.push(
          document.getElementById('step-what-to-build'),
          document.getElementById('step-journey-stage'),
          document.getElementById('step-support-needs'),
          document.getElementById('step-learning-style'),
          document.getElementById('step-commitment')
        );

        // Update data-step dynamically to correct 1-indexed count
        activeSteps.forEach((step, idx) => {
          if (step) {
            step.setAttribute('data-step', (idx + 1).toString());
            
            // Dynamically update heading number prefix (e.g. "04. Objective" -> "03. Objective")
            const labelEl = step.querySelector('.font-label-caps');
            if (labelEl) {
              const text = labelEl.innerText;
              const dotIdx = text.indexOf('.');
              if (dotIdx !== -1) {
                const rest = text.substring(dotIdx + 1).trim();
                labelEl.innerText = `${(idx + 1).toString().padStart(2, '0')}. ${rest}`;
              }
            }
          }
        });

        const totalCounter = document.getElementById('signup-step-total');
        if (totalCounter) {
          totalCounter.innerText = activeSteps.length.toString();
        }
      }

      function openModal() {
        modal.classList.remove('hidden');
        answers.pathway = ''; // Start fresh
        updateActiveSteps();
        setTimeout(() => {
          modal.classList.remove('opacity-0');
          showStep(0);
        }, 10);
        document.body.classList.add('overflow-hidden');
      }

      function closeModal() {
        modal.classList.add('opacity-0');
        document.body.classList.remove('overflow-hidden');
        setTimeout(() => {
          modal.classList.add('hidden');
          resetForm();
        }, 300);
      }

      document.querySelectorAll('[data-cta-pathway="true"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          openModal();
          // Pre-select custom if they click the Custom Builder button on the main landing
          if (btn.innerText.includes('custom') || btn.innerText.includes('Build your own')) {
            answers.pathway = 'custom';
            const customCard = document.querySelector('.signup-pathway-card[data-value="custom"]');
            if (customCard) {
              customCard.classList.remove('border-outline/20', 'bg-surface-container-lowest');
              customCard.classList.add('border-primary', 'bg-primary/10');
              const checkIcon = customCard.querySelector('.material-symbols-outlined');
              checkIcon.classList.remove('opacity-0');
              checkIcon.classList.add('opacity-100');
            }
            updateActiveSteps();
          }
        });
      });

      closeBtn.addEventListener('click', closeModal);
      successCloseBtn.addEventListener('click', closeModal);

      function showStep(index) {
        currentStep = index;
        
        allSteps.forEach(step => {
          if (step) {
            step.classList.add('opacity-0', 'translate-y-8', 'pointer-events-none');
            step.classList.remove('opacity-100', 'translate-y-0');
            step.querySelectorAll('input, button').forEach(el => el.setAttribute('disabled', 'true'));
          }
        });

        const activeStep = activeSteps[index];
        if (activeStep) {
          activeStep.classList.remove('opacity-0', 'translate-y-8', 'pointer-events-none');
          activeStep.classList.add('opacity-100', 'translate-y-0');
          activeStep.querySelectorAll('input, button').forEach(el => {
            if (el.id !== 'locked-option-d-input') {
              el.removeAttribute('disabled');
            }
          });
        }

        stepCounter.innerText = (index + 1).toString();
        const total = activeSteps.length;
        progress.style.width = `${((index + 1) / total) * 100}%`;

        if (index === 0) {
          setTimeout(() => {
            document.getElementById('signup-name').focus();
          }, 300);
        }
      }

      function navigateNext() {
        if (validateStep(currentStep)) {
          saveStepData(currentStep);
          if (currentStep < activeSteps.length - 1) {
            showStep(currentStep + 1);
          } else {
            submitForm();
          }
        }
      }

      function navigatePrev() {
        if (currentStep > 0) {
          saveStepData(currentStep);
          showStep(currentStep - 1);
        }
      }

      // Bind inline navigation buttons
      modal.querySelectorAll('.signup-next-inline-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          navigateNext();
        });
      });
      modal.querySelectorAll('.signup-prev-inline-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          navigatePrev();
        });
      });

      function validateStep(index) {
        const activeStep = activeSteps[index];
        if (!activeStep) return true;

        const stepId = activeStep.id;
        if (stepId === 'step-name-email') {
          const nameVal = document.getElementById('signup-name').value.trim();
          const emailVal = document.getElementById('signup-email').value.trim();
          const errorDiv = document.getElementById('step-1-error');
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          
          if (!nameVal || !emailRegex.test(emailVal)) {
            errorDiv.classList.remove('hidden');
            return false;
          } else {
            errorDiv.classList.add('hidden');
          }
        } else if (stepId === 'step-pathway-interest') {
          if (!answers.pathway) {
            return false;
          }
        } else if (stepId === 'step-custom-builder-dti') {
          const errorDiv = activeStep.querySelector('.custom-builder-error');
          if (answers.customModules.length === 0) {
            if (errorDiv) {
              errorDiv.innerText = "Please select at least one module (max 6).";
              errorDiv.classList.remove('hidden');
            }
            return false;
          } else {
            if (errorDiv) errorDiv.classList.add('hidden');
          }
        }
        return true;
      }

      function saveStepData(index) {
        const activeStep = activeSteps[index];
        if (!activeStep) return;

        const stepId = activeStep.id;
        if (stepId === 'step-name-email') {
          answers.name = document.getElementById('signup-name').value.trim();
          answers.email = document.getElementById('signup-email').value.trim();
        }
      }

      // Bind pathway interest cards selection
      document.querySelectorAll('.signup-pathway-card').forEach(card => {
        card.addEventListener('click', () => {
          const value = card.getAttribute('data-value');
          answers.pathway = value;
          
          card.closest('.signup-step').querySelectorAll('.signup-pathway-card').forEach(other => {
            other.classList.remove('border-primary', 'bg-primary/10');
            other.classList.add('border-outline/20', 'bg-surface-container-lowest');
            other.querySelector('.material-symbols-outlined').classList.add('opacity-0');
            other.querySelector('.material-symbols-outlined').classList.remove('opacity-100');
          });

          card.classList.remove('border-outline/20', 'bg-surface-container-lowest');
          card.classList.add('border-primary', 'bg-primary/10');
          const checkIcon = card.querySelector('.material-symbols-outlined');
          checkIcon.classList.remove('opacity-0');
          checkIcon.classList.add('opacity-100');

          updateActiveSteps();

          setTimeout(() => {
            navigateNext();
          }, 350);
        });
      });

      function renderCustomDock() {
        document.querySelectorAll('.custom-builder-dock').forEach(dock => {
        dock.innerHTML = '';
        for (let i = 0; i < 6; i++) {
          const modId = answers.customModules[i];
          const slot = document.createElement('div');
          
          if (modId) {
            const mod = ALL_MODULES[modId];
            const prefix = modId.startsWith('ei') ? 'ei' : (modId.startsWith('sis') ? 'sis' : 'dti');
            let colorClasses = '';
            let icon = 'lightbulb';
            if (prefix === 'ei') {
              colorClasses = 'border-primary bg-primary/10 text-on-primary-container';
              icon = 'lightbulb';
            } else if (prefix === 'sis') {
              colorClasses = 'border-secondary bg-secondary/10 text-on-secondary-container';
              icon = 'eco';
            } else {
              colorClasses = 'border-tertiary bg-tertiary/10 text-on-tertiary-container';
              icon = 'palette';
            }

            slot.className = `flex-grow flex items-center justify-between border rounded-full py-1 px-3 text-[10px] font-bold shadow-sm h-8 max-w-[120px] shrink-0 select-none animate-fadeIn transition-all ${colorClasses}`;
            slot.innerHTML = `
              <div class="flex items-center gap-[4px] truncate">
                <span class="material-symbols-outlined text-[12px] shrink-0">${icon}</span>
                <span class="truncate font-mono" title="${mod.name}">${mod.code.toUpperCase()}</span>
              </div>
              <button type="button" class="hover:text-error shrink-0 font-bold text-xs pl-xs outline-none select-none focus:outline-none" data-remove-id="${modId}">×</button>
            `;
            slot.querySelector('button').addEventListener('click', (e) => {
              e.stopPropagation();
              toggleCustomModule(modId);
            });
          } else {
            const ordinal = ["1st Step", "2nd Step", "3rd Step", "4th Step", "5th Step", "6th Step"][i];
            slot.className = "flex-grow flex items-center justify-center gap-[4px] border border-dashed border-outline/30 rounded-full py-1 px-3 text-[10px] font-semibold text-on-surface-variant/40 select-none bg-surface-container-low/20 h-8 max-w-[120px] shrink-0 hover:bg-surface-container-low/50 transition-colors";
            slot.innerHTML = `
              <span class="material-symbols-outlined text-[12px]">add</span>
              <span>${ordinal}</span>
            `;
          }
          dock.appendChild(slot);

          // Add a connector chevron between items, except after the last item
          if (i < 5) {
            const chevron = document.createElement('span');
            chevron.className = "material-symbols-outlined text-[12px] text-outline/30 select-none pointer-events-none shrink-0";
            chevron.innerText = 'chevron_right';
            dock.appendChild(chevron);
          }
        }
        });
      }

      function toggleCustomModule(id) {
        const card = document.querySelector(`.signup-module-card[data-id="${id}"]`);
        const isSelected = answers.customModules.includes(id);
        
        if (isSelected) {
          answers.customModules = answers.customModules.filter(mId => mId !== id);
          if (card) {
            card.classList.remove('border-primary', 'bg-primary/10', 'border-secondary', 'bg-secondary/10', 'border-tertiary', 'bg-tertiary/10');
            card.classList.add('bg-surface-container-lowest');
            card.querySelector('.material-symbols-outlined').classList.add('opacity-0');
            card.querySelector('.material-symbols-outlined').classList.remove('opacity-100');
          }
        } else {
          if (answers.customModules.length >= 6) {
            const errorDiv = activeStep.querySelector('.custom-builder-error');
            if (errorDiv) {
              errorDiv.innerText = "Maximum 6 modules allowed for custom pathway.";
              errorDiv.classList.remove('hidden');
              setTimeout(() => {
                errorDiv.classList.add('hidden');
              }, 3000);
            }
            return;
          }
          answers.customModules.push(id);
          if (card) {
            card.classList.remove('bg-surface-container-lowest');
            const prefix = id.startsWith('ei') ? 'ei' : (id.startsWith('sis') ? 'sis' : 'dti');
            if (prefix === 'ei') card.classList.add('border-primary', 'bg-primary/10');
            else if (prefix === 'sis') card.classList.add('border-secondary', 'bg-secondary/10');
            else card.classList.add('border-tertiary', 'bg-tertiary/10');
            
            const checkIcon = card.querySelector('.material-symbols-outlined');
            checkIcon.classList.remove('opacity-0');
            checkIcon.classList.add('opacity-100');
          }
        }
        
        document.querySelectorAll('.custom-selected-counter').forEach(counter => {
          counter.innerText = `Selected: ${answers.customModules.length}/6`;
        });
        renderCustomDock();
      }

      // Bind custom module card selection
      document.querySelectorAll('.signup-module-card').forEach(card => {
        card.addEventListener('click', () => {
          const id = card.getAttribute('data-id');
          toggleCustomModule(id);
        });
      });

      // Bind Category Filter Tabs
      document.querySelectorAll('.custom-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          btn.closest('.flex').querySelectorAll('.custom-tab-btn').forEach(other => {
            other.classList.remove('bg-surface', 'shadow-sm', 'font-bold');
            other.classList.add('text-on-surface-variant');
          });
          btn.classList.add('bg-surface', 'shadow-sm', 'font-bold');
          btn.classList.remove('text-on-surface-variant');
          filterCustomModules();
        });
      });

      // Bind Search bar filter
      const customSearchInput = document.getElementById('custom-modules-search');
      if (customSearchInput) {
        customSearchInput.addEventListener('input', () => {
          filterCustomModules();
        });
      }

      function filterCustomModules() {
        const activeTab = document.querySelector('.custom-tab-btn.bg-surface');
        const category = activeTab ? activeTab.getAttribute('data-category') : 'all';
        const query = customSearchInput ? customSearchInput.value.toLowerCase().trim() : '';

        document.querySelectorAll('.signup-module-card').forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          const cardText = card.innerText.toLowerCase();
          
          const matchCategory = (category === 'all' || cardCategory === category);
          const matchQuery = (!query || cardText.includes(query));

          if (matchCategory && matchQuery) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      }

      // Bind standard checkboxes
      document.querySelectorAll('.signup-choice').forEach(card => {
        if (card.id === 'locked-option-d') return;

        card.addEventListener('click', () => {
          const value = card.getAttribute('data-value');
          const checkbox = card.querySelector('input[type="checkbox"]');
          const isChecked = !checkbox.checked;
          checkbox.checked = isChecked;
          
          const checkIcon = card.querySelector('.material-symbols-outlined');
          const step = card.closest('.signup-step');
          const stepId = step.id;

          if (isChecked) {
            card.classList.remove('border-outline/20', 'bg-surface-container-lowest');
            card.classList.add('border-primary', 'bg-primary/10');
            checkIcon.classList.remove('opacity-0');
            checkIcon.classList.add('opacity-100');
            
            if (stepId === 'step-what-to-build') answers.buildType.push(value);
            if (stepId === 'step-support-needs') answers.supportNeed.push(value);
            if (stepId === 'step-learning-style') answers.learningStyle.push(value);
          } else {
            card.classList.remove('border-primary', 'bg-primary/10');
            card.classList.add('border-outline/20', 'bg-surface-container-lowest');
            checkIcon.classList.remove('opacity-100');
            checkIcon.classList.add('opacity-0');
            
            if (stepId === 'step-what-to-build') answers.buildType = answers.buildType.filter(item => item !== value);
            if (stepId === 'step-support-needs') answers.supportNeed = answers.supportNeed.filter(item => item !== value);
            if (stepId === 'step-learning-style') answers.learningStyle = answers.learningStyle.filter(item => item !== value);
          }
        });
      });

      // Bind radio options
      document.querySelectorAll('.signup-radio').forEach(card => {
        card.addEventListener('click', () => {
          const value = card.getAttribute('data-value');
          const step = card.closest('.signup-step');
          const stepId = step.id;
          
          step.querySelectorAll('.signup-radio').forEach(other => {
            other.classList.remove('border-primary', 'bg-primary/10');
            other.classList.add('border-outline/20', 'bg-surface-container-lowest');
            other.querySelector('.material-symbols-outlined').classList.add('opacity-0');
            other.querySelector('.material-symbols-outlined').classList.remove('opacity-100');
          });

          card.classList.remove('border-outline/20', 'bg-surface-container-lowest');
          card.classList.add('border-primary', 'bg-primary/10');
          const checkIcon = card.querySelector('.material-symbols-outlined');
          checkIcon.classList.remove('opacity-0');
          checkIcon.classList.add('opacity-100');

          if (stepId === 'step-journey-stage') answers.journeyStage = value;
          if (stepId === 'step-commitment') answers.weeklyHours = value;

          setTimeout(() => {
            navigateNext();
          }, 350);
        });
      });

      function resetForm() {
        currentStep = 0;
        answers = {
          name: '',
          email: '',
          pathway: '',
          customModules: [],
          buildType: [],
          journeyStage: '',
          supportNeed: [],
          learningStyle: ['ai_conversations'],
          weeklyHours: ''
        };
        
        document.getElementById('signup-name').value = '';
        document.getElementById('signup-email').value = '';
        document.getElementById('step-1-error').classList.add('hidden');
        document.querySelectorAll('.custom-builder-error').forEach(err => err.classList.add('hidden'));
        document.getElementById('custom-selected-counter').innerText = 'Selected: 0/6';

        const searchBox = document.getElementById('custom-modules-search');
        if (searchBox) searchBox.value = '';
        
        const allTab = document.querySelector('.custom-tab-btn[data-category="all"]');
        if (allTab) {
          allTab.closest('.flex').querySelectorAll('.custom-tab-btn').forEach(other => {
            other.classList.remove('bg-surface', 'shadow-sm', 'font-bold');
            other.classList.add('text-on-surface-variant');
          });
          allTab.classList.add('bg-surface', 'shadow-sm', 'font-bold');
          allTab.classList.remove('text-on-surface-variant');
        }

        renderCustomDock();

        document.querySelectorAll('.signup-pathway-card').forEach(card => {
          card.classList.remove('border-primary', 'bg-primary/10');
          card.classList.add('border-outline/20', 'bg-surface-container-lowest');
          card.querySelector('.material-symbols-outlined').classList.add('opacity-0');
        });

        document.querySelectorAll('.signup-module-card').forEach(card => {
          card.classList.remove('border-primary', 'bg-primary/10', 'border-secondary', 'bg-secondary/10', 'border-tertiary', 'bg-tertiary/10');
          card.classList.add('bg-surface-container-lowest');
          card.querySelector('.material-symbols-outlined').classList.add('opacity-0');
          card.style.display = 'flex';
        });

        document.querySelectorAll('.signup-choice').forEach(card => {
          if (card.id === 'locked-option-d') return;
          card.classList.remove('border-primary', 'bg-primary/10');
          card.classList.add('border-outline/20', 'bg-surface-container-lowest');
          card.querySelector('input[type="checkbox"]').checked = false;
          card.querySelector('.material-symbols-outlined').classList.add('opacity-0');
        });

        document.querySelectorAll('.signup-radio').forEach(card => {
          card.classList.remove('border-primary', 'bg-primary/10');
          card.classList.add('border-outline/20', 'bg-surface-container-lowest');
          card.querySelector('.material-symbols-outlined').classList.add('opacity-0');
        });

        // Reset loader status items
        for (let i = 1; i <= 5; i++) {
          const item = document.getElementById(`status-${i}`);
          if (item) {
            item.className = 'status-item flex items-center gap-sm text-body-md text-on-surface-variant opacity-25 transition-all duration-300';
            const icon = item.querySelector('.status-icon');
            if (icon) {
              icon.innerText = 'radio_button_unchecked';
              icon.classList.remove('animate-spin', 'text-primary');
            }
          }
        }

        // Hide resend feedback
        document.getElementById('signup-resend-feedback').classList.add('hidden');

        allSteps.forEach(step => {
          if (step) step.classList.remove('opacity-100', 'translate-y-0');
        });
        document.getElementById('signup-loading-screen').classList.remove('opacity-100');
        document.getElementById('signup-loading-screen').classList.add('opacity-0', 'pointer-events-none');
        document.getElementById('signup-success-screen').classList.remove('opacity-100');
        document.getElementById('signup-success-screen').classList.add('opacity-0', 'pointer-events-none');
        
        modal.querySelector('.w-full').style.display = 'block';
        modal.querySelector('.w-full.border-t').style.display = 'flex';
      }

      function sendToZapier() {
        const url = ZAPIER_SIGNUP_WEBHOOK_URL || localStorage.getItem('ZAPIER_SIGNUP_WEBHOOK_URL');
        if (!url) {
          console.warn('[Zapier Signup Webhook] Webhook URL is not set.');
          return;
        }

        const routing = calculateRouting();

        // Map custom module IDs to names/descriptions
        let customModulesDetails = [];
        if (answers.pathway === 'custom' && answers.customModules) {
          customModulesDetails = answers.customModules.map(mId => {
            const mod = ALL_MODULES[mId];
            return mod ? `${mod.code}: ${mod.name}` : mId;
          });
        }

        const payload = {
          name: answers.name,
          email: answers.email,
          pathway: answers.pathway,
          customModules: answers.customModules,
          customModulesDetails: customModulesDetails,
          buildType: answers.buildType,
          journeyStage: answers.journeyStage,
          supportNeed: answers.supportNeed,
          learningStyle: answers.learningStyle,
          weeklyHours: answers.weeklyHours,
          calculatedPathway: routing.pathwayName,
          learnerType: routing.learnerType,
          credentialLevel: routing.credentialLevel,
          spaceName: routing.spaceName,
          firstChallenge: routing.firstChallenge,
          coach: routing.coach,
          timestamp: new Date().toISOString()
        };

        fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
        .then(() => {
          console.log('[Zapier Signup Webhook] Sent successfully:', payload);
        })
        .catch(err => {
          console.error('[Zapier Signup Webhook] Error sending to Zapier:', err);
        });
      }

      function submitForm() {
        const lastStep = activeSteps[activeSteps.length - 1];
        if (lastStep) {
          lastStep.classList.remove('opacity-100', 'translate-y-0');
          lastStep.classList.add('opacity-0', 'translate-y-8', 'pointer-events-none');
        }
        
        const header = modal.querySelector('.w-full');
        const footer = modal.querySelector('.w-full.border-t');
        header.style.display = 'none';
        footer.style.display = 'none';

        const loader = document.getElementById('signup-loading-screen');
        loader.classList.remove('opacity-0', 'pointer-events-none');
        loader.classList.add('opacity-100');

        console.log('EPIC AI - Signup payload:', answers);

        // Send all chosen signup details to Zapier
        sendToZapier();

        // Sequence loader status line animations
        const delayBetweenSteps = 750;

        function animateLoaderStep(stepIdx) {
          if (stepIdx > 5) {
            // All steps complete!
            setTimeout(() => {
              loader.classList.remove('opacity-100');
              loader.classList.add('opacity-0', 'pointer-events-none');
              showPathwayPreview();
            }, 600);
            return;
          }

          const currentItem = document.getElementById(`status-${stepIdx}`);
          if (currentItem) {
            currentItem.classList.remove('opacity-25');
            currentItem.classList.add('opacity-100', 'font-semibold', 'text-on-surface');
            const icon = currentItem.querySelector('.status-icon');
            if (icon) {
              icon.innerText = 'sync';
              icon.classList.add('animate-spin');
            }
          }

          setTimeout(() => {
            if (currentItem) {
              const icon = currentItem.querySelector('.status-icon');
              if (icon) {
                icon.classList.remove('animate-spin');
                icon.innerText = 'check_circle';
                icon.classList.add('text-primary');
              }
            }
            animateLoaderStep(stepIdx + 1);
          }, delayBetweenSteps);
        }

        animateLoaderStep(1);
      }

      function calculateRouting() {
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
      }

      document.getElementById('signup-resend-btn').addEventListener('click', (e) => {
        e.preventDefault();
        const feedbackDiv = document.getElementById('signup-resend-feedback');
        const targetEmail = document.getElementById('resend-email-target');
        
        targetEmail.innerText = answers.email || "your email";
        feedbackDiv.classList.remove('hidden');
        feedbackDiv.style.opacity = '1';
        
        setTimeout(() => {
          feedbackDiv.style.opacity = '0';
          setTimeout(() => {
            feedbackDiv.classList.add('hidden');
          }, 300);
        }, 3500);
      });

      window.addEventListener('keydown', (e) => {
        if (modal.classList.contains('hidden') || modal.classList.contains('opacity-0')) return;

        if (e.key === 'Escape') {
          closeModal();
          return;
        }

        if (e.key === 'Enter') {
          e.preventDefault();
          navigateNext();
          return;
        }

        const currentPanel = activeSteps[currentStep];
        if (!currentPanel) return;

        const activeEl = document.activeElement;
        if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
          return;
        }

        const keyVal = e.key.toUpperCase();
        if (['A', 'B', 'C', 'D', 'E', 'F', 'G'].includes(keyVal)) {
          e.preventDefault();
          const matchCard = currentPanel.querySelector(`[data-key="${keyVal}"]`);
          if (matchCard) {
            matchCard.click();
          }
        }
      });

    })();

    // EPIC Mini Experience Controller
    (function () {
      // --- CONFIGURATION ---
      // Paste your Zapier Catch Webhook URL here to connect Google Sheets (e.g. 'https://hooks.zapier.com/hooks/catch/...')
      const ZAPIER_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/2874956/4beey35/';

      // OPTIONAL: Paste a separate Webhook URL here to trigger summary emails via Zapier
      // (If left empty, we will fall back to ZAPIER_WEBHOOK_URL above)
      const ZAPIER_MAIL_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/2874956/4becz73/';
      // ---------------------

      const modal = document.getElementById('mini-experience-modal');
      const steps = Array.from(document.querySelectorAll('.mini-step'));
      const closeBtn = document.getElementById('mini-close-btn');
      const retryBtn = document.getElementById('mini-retry-btn');
      const sendBtn = document.getElementById('mini-send-btn');
      const progress = document.getElementById('mini-progress');
      const stepCounter = document.getElementById('mini-step-counter');

      const editEmailBtn = document.getElementById('mini-edit-email-btn');
      const saveEmailBtn = document.getElementById('mini-save-email-btn');
      const displayMode = document.getElementById('mini-email-display-mode');
      const editMode = document.getElementById('mini-email-edit-mode');
      const suretyEmailInput = document.getElementById('mini-surety-email-input');
      const currentEmailSpan = document.getElementById('mini-current-email');
      const suretyError = document.getElementById('mini-surety-error');

      let sessionId = '';
      let currentStep = 0; // 0 to 4 (mapped to step panels 1 to 5)
      let answers = {
        experience: '',
        startingPoint: '',
        name: '',
        email: '',
        problemArea: '',
        audience: ''
      };

      function openModal() {
        resetForm();
        modal.classList.remove('hidden');
        setTimeout(() => {
          modal.classList.remove('opacity-0');
          showStep(0);
        }, 10);
        document.body.classList.add('overflow-hidden');
      }

      function closeModal() {
        modal.classList.add('opacity-0');
        document.body.classList.remove('overflow-hidden');
        setTimeout(() => {
          modal.classList.add('hidden');
          resetForm();
        }, 300);
      }

      function sendToZapier(status) {
        let url = '';
        if (status === 'brief_sent') {
          url = ZAPIER_MAIL_WEBHOOK_URL || localStorage.getItem('ZAPIER_MAIL_WEBHOOK_URL') || ZAPIER_WEBHOOK_URL || localStorage.getItem('ZAPIER_WEBHOOK_URL');
        } else {
          url = ZAPIER_WEBHOOK_URL || localStorage.getItem('ZAPIER_WEBHOOK_URL');
        }

        if (!url) {
          console.warn(`[Zapier Webhook] Webhook URL for status "${status}" is not set. Connect Zapier in code or set local storage configuration to test.`);
          return;
        }

        const payload = {
          sessionId: sessionId,
          name: answers.name,
          email: answers.email,
          experience: answers.experience,
          startingPoint: answers.startingPoint,
          problemArea: answers.problemArea || '',
          audience: answers.audience || '',
          status: status,
          timestamp: new Date().toISOString()
        };

        if (status === 'completed' || status === 'brief_sent') {
          payload.briefTitle = document.getElementById('brief-direction')?.innerText || '';
          payload.solution = document.getElementById('brief-solution')?.innerText || '';
          payload.experiment = document.getElementById('brief-experiment')?.innerText || '';
          payload.pathway = document.getElementById('brief-pathway')?.innerText || '';
          payload.coach = document.getElementById('brief-coach')?.innerText || '';
        }

        fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
        .then(() => {
          console.log(`[Zapier Webhook] Sent successfully: ${status}`, payload);
        })
        .catch(err => {
          console.error('[Zapier Webhook] Error sending:', err);
        });
      }

      document.querySelectorAll('[data-cta-demo="true"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          openModal();
        });
      });

      closeBtn.addEventListener('click', closeModal);
      retryBtn.addEventListener('click', () => {
        resetForm();
        showStep(0);
      });

      function showStep(index) {
        currentStep = index;
        
        steps.forEach((step, idx) => {
          if (idx === index) {
            step.classList.remove('opacity-0', 'translate-y-8', 'pointer-events-none');
            step.classList.add('opacity-100', 'translate-y-0');
            step.querySelectorAll('input, textarea, button').forEach(el => el.removeAttribute('disabled'));
          } else {
            step.classList.add('opacity-0', 'translate-y-8', 'pointer-events-none');
            step.classList.remove('opacity-100', 'translate-y-0');
            step.querySelectorAll('input, textarea, button').forEach(el => el.setAttribute('disabled', 'true'));
          }
        });

        stepCounter.innerText = (index + 1).toString();
        progress.style.width = `${((index + 1) / steps.length) * 100}%`;

        if (index === 2) {
          setTimeout(() => {
            document.getElementById('mini-name').focus();
          }, 300);
        } else if (index === 4) {
          setTimeout(() => {
            document.getElementById('mini-audience-input').focus();
          }, 300);
          updateCoachQuestion();
        }
      }

      function updateCoachQuestion() {
        const areaMap = {
          climate: "Climate & Sustainability",
          education: "Education & Learning",
          health: "Health & Well-being",
          campus: "Campus Life & Belonging",
          business: "Local Small Business",
          community: "Community Organizing",
          ai: "AI & Productivity",
          other: "a custom problem area"
        };
        const areaName = areaMap[answers.problemArea] || "your selected area";
        document.getElementById('mini-coach-question').innerText = `Who is affected by this problem in the area of ${areaName}? Tell us in one sentence who feels the pain point most.`;
      }

      function navigateNext() {
        if (validateStep(currentStep)) {
          saveStepData(currentStep);
          
          // Capture and send details immediately to Zapier after Name & Email page is completed
          if (currentStep === 2) {
            sendToZapier('lead_captured');
          }

          if (currentStep < steps.length - 1) {
            showStep(currentStep + 1);
          } else {
            submitForm();
          }
        }
      }

      function navigatePrev() {
        if (currentStep > 0) {
          saveStepData(currentStep);
          showStep(currentStep - 1);
        }
      }

      // Bind inline navigation buttons
      modal.querySelectorAll('.mini-next-inline-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          navigateNext();
        });
      });
      modal.querySelectorAll('.mini-prev-inline-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          navigatePrev();
        });
      });

      function validateStep(index) {
        if (index === 0 && !answers.experience) return false;
        if (index === 1 && !answers.startingPoint) return false;
        
        if (index === 2) {
          const nameVal = document.getElementById('mini-name').value.trim();
          const emailVal = document.getElementById('mini-email').value.trim();
          const errorDiv = document.getElementById('mini-step-3-error');
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          
          if (!nameVal || !emailRegex.test(emailVal)) {
            errorDiv.classList.remove('hidden');
            return false;
          } else {
            errorDiv.classList.add('hidden');
          }
        }
        
        if (index === 3 && !answers.problemArea) return false;
        
        if (index === 4) {
          const audVal = document.getElementById('mini-audience-input').value.trim();
          const errorDiv = document.getElementById('mini-step-5-error');
          if (!audVal || audVal.length < 5) {
            errorDiv.classList.remove('hidden');
            return false;
          } else {
            errorDiv.classList.add('hidden');
          }
        }
        return true;
      }

      function saveStepData(index) {
        if (index === 2) {
          answers.name = document.getElementById('mini-name').value.trim();
          answers.email = document.getElementById('mini-email').value.trim();
        }
        if (index === 4) {
          answers.audience = document.getElementById('mini-audience-input').value.trim();
        }
      }

      // Handle card selections in Screens 1 & 2
      document.querySelectorAll('.mini-radio').forEach(card => {
        card.addEventListener('click', () => {
          const value = card.getAttribute('data-value');
          const step = card.closest('.mini-step');
          const stepNum = parseInt(step.getAttribute('data-step'));
          
          step.querySelectorAll('.mini-radio').forEach(other => {
            other.classList.remove('border-primary', 'ring-2', 'ring-primary/30');
            other.classList.add('border-outline/20');
            const check = other.querySelector('.material-symbols-outlined');
            if (check) {
              check.classList.add('opacity-0');
              check.classList.remove('opacity-100');
            }
          });

          card.classList.remove('border-outline/20');
          card.classList.add('border-primary', 'ring-2', 'ring-primary/30');
          const checkIcon = card.querySelector('.material-symbols-outlined');
          if (checkIcon) {
            checkIcon.classList.remove('opacity-0');
            checkIcon.classList.add('opacity-100');
          }

          if (stepNum === 1) answers.experience = value;
          if (stepNum === 2) answers.startingPoint = value;

          setTimeout(() => {
            navigateNext();
          }, 350);
        });
      });

      // Handle area cards in Screen 4A
      document.querySelectorAll('.mini-area-card').forEach(card => {
        card.addEventListener('click', () => {
          const value = card.getAttribute('data-value');
          const step = card.closest('.mini-step');
          
          step.querySelectorAll('.mini-area-card').forEach(other => {
            other.classList.remove('border-primary', 'ring-2', 'ring-primary/30');
            other.classList.add('border-outline/20');
          });

          card.classList.remove('border-outline/20');
          card.classList.add('border-primary', 'ring-2', 'ring-primary/30');
          answers.problemArea = value;

          setTimeout(() => {
            navigateNext();
          }, 350);
        });
      });

      function resetForm() {
        currentStep = 0;
        sessionId = 'mini_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        answers = {
          experience: '',
          startingPoint: '',
          name: '',
          email: '',
          problemArea: '',
          audience: ''
        };
        
        document.getElementById('mini-name').value = '';
        document.getElementById('mini-email').value = '';
        document.getElementById('mini-audience-input').value = '';
        document.getElementById('mini-step-3-error').classList.add('hidden');
        document.getElementById('mini-step-5-error').classList.add('hidden');

        document.querySelectorAll('.mini-radio').forEach(card => {
          card.classList.remove('border-primary', 'ring-2', 'ring-primary/30');
          card.classList.add('border-outline/20');
          const check = card.querySelector('.material-symbols-outlined');
          if (check) {
            check.classList.add('opacity-0');
            check.classList.remove('opacity-100');
          }
        });

        document.querySelectorAll('.mini-area-card').forEach(card => {
          card.classList.remove('border-primary', 'ring-2', 'ring-primary/30');
          card.classList.add('border-outline/20');
        });

        document.getElementById('mini-send-feedback').classList.add('hidden');

        steps.forEach(step => step.classList.remove('opacity-100', 'translate-y-0'));
        document.getElementById('mini-loading-screen').classList.remove('opacity-100');
        document.getElementById('mini-loading-screen').classList.add('opacity-0', 'pointer-events-none');
        document.getElementById('mini-success-screen').classList.remove('opacity-100');
        document.getElementById('mini-success-screen').classList.add('opacity-0', 'pointer-events-none');
        
        modal.querySelector('.w-full').style.display = 'block';
        modal.querySelector('.w-full.border-t').style.display = 'flex';
      }

      function submitForm() {
        steps[steps.length - 1].classList.remove('opacity-100', 'translate-y-0');
        steps[steps.length - 1].classList.add('opacity-0', 'translate-y-8', 'pointer-events-none');
        
        const header = modal.querySelector('.w-full');
        const footer = modal.querySelector('.w-full.border-t');
        header.style.display = 'none';
        footer.style.display = 'none';

        const loader = document.getElementById('mini-loading-screen');
        loader.classList.remove('opacity-0', 'pointer-events-none');
        loader.classList.add('opacity-100');

        console.log('EPIC Mini - Signup payload:', answers);

        setTimeout(() => {
          loader.classList.remove('opacity-100');
          loader.classList.add('opacity-0', 'pointer-events-none');
          showStarterBrief();
          // Send final concept generation to Zapier
          sendToZapier('completed');
        }, 1500);
      }

      function showStarterBrief() {
        let direction = "";
        let solution = "";
        let experiment = "";
        let pathway = "";
        let coach = "";

        const areaMap = {
          climate: "climate change and sustainability",
          education: "education access and learning",
          health: "mental or physical health",
          campus: "campus life and student belonging",
          business: "local small business operations",
          community: "community organizing and local support",
          ai: "AI automation and personal productivity",
          other: "a specific local challenge"
        };
        const areaText = areaMap[answers.problemArea] || "a local challenge";
        const audience = answers.audience || "people affected by this problem";

        if (answers.experience === 'startup') {
          direction = `Building a commercial venture around ${areaText} for ${audience}`;
          solution = `A localized platform or service designed to address this problem as a sustainable startup model.`;
          experiment = `Interview 5 potential customers in the target group to see if they would pay for this solution.`;
          pathway = "Launch Your First Startup Idea";
          coach = "Venture Coach";
        } else if (answers.experience === 'social_impact') {
          direction = `Helping ${audience} address challenges in ${areaText}`;
          solution = `A community-driven program, non-profit framework, or awareness campaign.`;
          experiment = `Conduct 3 deep interviews with affected individuals to map their primary barriers.`;
          pathway = "Launch Your First Impact Project";
          coach = "Impact Coach";
        } else if (answers.experience === 'ai_app') {
          direction = `Designing an AI-powered concept resolving ${areaText} for ${audience}`;
          solution = `A custom LLM assistant, automated workflow, or lightweight mobile web tool.`;
          experiment = `Build a quick clickable Figma wireframe or text prompt recipe and get feedback from 3 users.`;
          pathway = "Build Your First AI App";
          coach = "App Coach";
        } else {
          direction = `Solving critical pain points in ${areaText} for ${audience}`;
          solution = `A hybrid intervention combining digital tools and direct community outreach.`;
          experiment = `Map out the current process they use to solve this and identify the single biggest friction point.`;
          pathway = "Explore Builder Pathways";
          coach = "Idea Coach";
        }

        document.getElementById('brief-direction').innerText = direction;
        document.getElementById('brief-audience').innerText = audience;
        document.getElementById('brief-solution').innerText = solution;
        document.getElementById('brief-experiment').innerText = experiment;
        document.getElementById('brief-pathway').innerText = pathway;
        document.getElementById('brief-coach').innerText = coach;

        if (currentEmailSpan) currentEmailSpan.innerText = answers.email;
        if (displayMode) displayMode.classList.remove('hidden');
        if (editMode) editMode.classList.add('hidden');
        if (suretyError) suretyError.classList.add('hidden');

        const success = document.getElementById('mini-success-screen');
        success.classList.remove('opacity-0', 'pointer-events-none');
        success.classList.add('opacity-100');
      }

      if (editEmailBtn) {
        editEmailBtn.addEventListener('click', () => {
          if (suretyEmailInput) suretyEmailInput.value = answers.email;
          if (displayMode) displayMode.classList.add('hidden');
          if (editMode) editMode.classList.remove('hidden');
          if (suretyError) suretyError.classList.add('hidden');
          if (suretyEmailInput) suretyEmailInput.focus();
        });
      }

      if (saveEmailBtn) {
        saveEmailBtn.addEventListener('click', () => {
          if (!suretyEmailInput) return;
          const newEmail = suretyEmailInput.value.trim();
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!newEmail || !emailRegex.test(newEmail)) {
            if (suretyError) suretyError.classList.remove('hidden');
            return;
          }
          answers.email = newEmail;
          if (currentEmailSpan) currentEmailSpan.innerText = newEmail;
          if (editMode) editMode.classList.add('hidden');
          if (displayMode) displayMode.classList.remove('hidden');
          if (suretyError) suretyError.classList.add('hidden');
        });
      }

      sendBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const feedback = document.getElementById('mini-send-feedback');
        const target = document.getElementById('mini-email-target');
        
        target.innerText = answers.email || "your email";
        feedback.classList.remove('hidden');
        feedback.style.opacity = '1';
        
        // Update Zapier that user requested email brief
        sendToZapier('brief_sent');

        setTimeout(() => {
          feedback.style.opacity = '0';
          setTimeout(() => {
            feedback.classList.add('hidden');
            closeModal();
          }, 300);
        }, 3000);
      });

      window.addEventListener('keydown', (e) => {
        if (modal.classList.contains('hidden') || modal.classList.contains('opacity-0')) return;

        if (e.key === 'Escape') {
          closeModal();
          return;
        }

        if (e.key === 'Enter') {
          e.preventDefault();
          navigateNext();
          return;
        }

        const currentPanel = steps[currentStep];
        if (!currentPanel) return;

        const activeEl = document.activeElement;
        if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
          return;
        }

        const keyVal = e.key.toUpperCase();
        if (['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].includes(keyVal)) {
          e.preventDefault();
          const matchCard = currentPanel.querySelector(`[data-key="${keyVal}"]`);
          if (matchCard) {
            matchCard.click();
          }
        }
      });

      // Auto-open modal based on URL query parameters
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('demo') === 'true') {
        setTimeout(() => {
          openModal();
          const newUrl = window.location.pathname + window.location.hash;
          window.history.replaceState(null, '', newUrl);
        }, 300);
      }

    })();

    // Request Pilot Access Controller
    (function () {
      // --- CONFIGURATION ---
      // Webhook URL for the Request Pilot Access leads and completions (Google Sheet)
      const ZAPIER_PILOT_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/2874956/4b7fugj/';
      // Webhook URL for sending email to the user for Request Pilot (New Zapier - leave blank to configure)
      const ZAPIER_PILOT_MAIL_WEBHOOK_URL = '';
      
      // Google Calendar Booking URL
      const GOOGLE_CALENDAR_URL = 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ04H3fA2dZc48mYgXQvS8H90gXW';
      // ---------------------

      const modal = document.getElementById('pilot-modal');
      const steps = Array.from(document.querySelectorAll('.pilot-step'));
      const closeBtn = document.getElementById('pilot-close-btn');
      const gotoMiniBtn = document.getElementById('pilot-goto-mini-btn');
      const progress = document.getElementById('pilot-progress');
      const stepCounter = document.getElementById('pilot-step-counter');
      const calendarLink = document.getElementById('pilot-schedule-link');

      let sessionId = '';
      let currentStep = 0; // 0 to 3 (steps 1 to 4)
      let answers = {
        name: '',
        institution: '',
        email: '',
        message: ''
      };

      function openModal() {
        sessionId = 'pilot_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        modal.classList.remove('hidden');
        // Reset overlay visibility correctly
        modal.style.pointerEvents = 'auto';
        setTimeout(() => {
          modal.classList.remove('opacity-0');
          showStep(0);
        }, 10);
        document.body.classList.add('overflow-hidden');

        // Set calendar booking link href when opening
        const calUrl = localStorage.getItem('PILOT_CALENDAR_URL') || localStorage.getItem('GOOGLE_CALENDAR_URL') || GOOGLE_CALENDAR_URL;
        if (calendarLink) {
          calendarLink.href = calUrl;
        }
      }

      function closeModal() {
        modal.classList.add('opacity-0');
        modal.style.pointerEvents = 'none'; // prevent blocking clicks on underlying elements
        document.body.classList.remove('overflow-hidden');
        setTimeout(() => {
          modal.classList.add('hidden');
          resetForm();
        }, 300);
      }

      function sendToZapier(status) {
        let url = '';
        if (status === 'pilot_completed') {
          url = ZAPIER_PILOT_MAIL_WEBHOOK_URL || localStorage.getItem('ZAPIER_PILOT_MAIL_WEBHOOK_URL') || ZAPIER_PILOT_WEBHOOK_URL || localStorage.getItem('ZAPIER_PILOT_WEBHOOK_URL');
        } else {
          url = ZAPIER_PILOT_WEBHOOK_URL || localStorage.getItem('ZAPIER_PILOT_WEBHOOK_URL');
        }

        if (!url) {
          console.warn(`[Zapier Pilot Webhook] Webhook URL for status "${status}" is not set. Connect Zapier in code or set local storage configuration to test.`);
          return;
        }

        const payload = {
          sessionId: sessionId,
          name: answers.name,
          institution: answers.institution,
          email: answers.email,
          message: answers.message || '',
          status: status,
          timestamp: new Date().toISOString()
        };

        fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
        .then(() => {
          console.log(`[Zapier Pilot Webhook] Sent successfully: ${status}`, payload);
        })
        .catch(err => {
          console.error('[Zapier Pilot Webhook] Error sending:', err);
        });
      }

      document.querySelectorAll('[data-cta-pilot="true"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          openModal();
        });
      });

      closeBtn.addEventListener('click', closeModal);
      
      if (calendarLink) {
        calendarLink.addEventListener('click', () => {
          sendToZapier('pilot_completed');
          // Stay on step 4, do not close modal or reset
        });
      }

      gotoMiniBtn.addEventListener('click', () => {
        sendToZapier('pilot_completed');
        closeModal();
        setTimeout(() => {
          const miniTrigger = document.querySelector('[data-cta-demo="true"]');
          if (miniTrigger) {
            miniTrigger.click();
          }
        }, 350);
      });

      function showStep(index) {
        currentStep = index;
        
        steps.forEach((step, idx) => {
          if (idx === index) {
            step.classList.remove('opacity-0', 'translate-y-8', 'pointer-events-none');
            step.classList.add('opacity-100', 'translate-y-0');
            step.querySelectorAll('input, textarea, button').forEach(el => el.removeAttribute('disabled'));
          } else {
            step.classList.add('opacity-0', 'translate-y-8', 'pointer-events-none');
            step.classList.remove('opacity-100', 'translate-y-0');
            step.querySelectorAll('input, textarea, button').forEach(el => el.setAttribute('disabled', 'true'));
          }
        });

        stepCounter.innerText = (index + 1).toString();
        progress.style.width = `${((index + 1) / steps.length) * 100}%`;

        if (index === 0) {
          setTimeout(() => {
            const nameInput = document.getElementById('pilot-name');
            if (nameInput) nameInput.focus();
          }, 300);
        } else if (index === 1) {
          setTimeout(() => {
            const emailInput = document.getElementById('pilot-email');
            if (emailInput) emailInput.focus();
          }, 300);
        } else if (index === 2) {
          setTimeout(() => {
            const msgInput = document.getElementById('pilot-message');
            if (msgInput) msgInput.focus();
          }, 300);
        }
      }

      function navigateNext() {
        if (validateStep(currentStep)) {
          saveStepData(currentStep);
          
          if (currentStep === 2) {
            // Submit lead immediately after Step 3 is completed
            sendToZapier('pilot_lead');
          }

          if (currentStep < steps.length - 1) {
            showStep(currentStep + 1);
          }
        }
      }

      function navigatePrev() {
        if (currentStep > 0) {
          saveStepData(currentStep);
          showStep(currentStep - 1);
        }
      }

      // Bind inline buttons
      modal.querySelectorAll('.pilot-next-inline-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          navigateNext();
        });
      });
      modal.querySelectorAll('.pilot-prev-inline-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          navigatePrev();
        });
      });

      function validateStep(index) {
        if (index === 0) {
          const nameVal = document.getElementById('pilot-name').value.trim();
          const instVal = document.getElementById('pilot-institution').value.trim();
          const errorDiv = document.getElementById('pilot-step-1-error');
          if (!nameVal || !instVal) {
            if (errorDiv) errorDiv.classList.remove('hidden');
            return false;
          } else {
            if (errorDiv) errorDiv.classList.add('hidden');
          }
        }
        
        if (index === 1) {
          const emailVal = document.getElementById('pilot-email').value.trim();
          const errorDiv = document.getElementById('pilot-step-2-error');
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailVal || !emailRegex.test(emailVal)) {
            if (errorDiv) errorDiv.classList.remove('hidden');
            return false;
          } else {
            if (errorDiv) errorDiv.classList.add('hidden');
          }
        }
        return true;
      }

      function saveStepData(index) {
        if (index === 0) {
          answers.name = document.getElementById('pilot-name').value.trim();
          answers.institution = document.getElementById('pilot-institution').value.trim();
        }
        if (index === 1) {
          answers.email = document.getElementById('pilot-email').value.trim();
        }
        if (index === 2) {
          answers.message = document.getElementById('pilot-message').value.trim();
        }
      }

      function resetForm() {
        currentStep = 0;
        sessionId = '';
        answers = {
          name: '',
          institution: '',
          email: '',
          message: ''
        };
        
        const nameInput = document.getElementById('pilot-name');
        const instInput = document.getElementById('pilot-institution');
        const emailInput = document.getElementById('pilot-email');
        const msgInput = document.getElementById('pilot-message');
        const err1 = document.getElementById('pilot-step-1-error');
        const err2 = document.getElementById('pilot-step-2-error');

        if (nameInput) nameInput.value = '';
        if (instInput) instInput.value = '';
        if (emailInput) emailInput.value = '';
        if (msgInput) msgInput.value = '';
        if (err1) err1.classList.add('hidden');
        if (err2) err2.classList.add('hidden');
        if (calendarLink) calendarLink.href = '#';

        steps.forEach(step => step.classList.remove('opacity-100', 'translate-y-0'));
      }

      window.addEventListener('keydown', (e) => {
        if (modal.classList.contains('hidden') || modal.classList.contains('opacity-0')) return;

        if (e.key === 'Escape') {
          closeModal();
          return;
        }

        if (e.key === 'Enter') {
          // Allow enter key to submit inputs, but allow newlines in textarea unless modifier (Cmd/Ctrl) is pressed
          const activeEl = document.activeElement;
          const isTextArea = activeEl && activeEl.tagName === 'TEXTAREA';
          const isModifier = e.metaKey || e.ctrlKey;
          
          if (isTextArea && !isModifier) {
            return; // let textarea handle standard Enter key
          }
          
          e.preventDefault();
          if (currentStep < 3) {
            navigateNext();
          } else {
            if (calendarLink) calendarLink.click();
          }
          return;
        }
      });

      // Auto-open modal based on URL query parameters
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('pilot') === 'true') {
        setTimeout(() => {
          openModal();
          const newUrl = window.location.pathname + window.location.hash;
          window.history.replaceState(null, '', newUrl);
        }, 300);
      }

    })();

    // Load test runner if query parameter 'test=true' is present
    if (new URLSearchParams(window.location.search).get('test') === 'true') {
      const script = document.createElement('script');
      script.src = 'onboarding-tests.js';
      document.body.appendChild(script);
    }
