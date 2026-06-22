(async function() {
  console.log("%c=== EPIC AI ONBOARDING TEST SUITE STARTING ===", "color: #fe932c; font-size: 14px; font-weight: bold;");

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  function assert(condition, message) {
    if (!condition) {
      console.error(`%c[FAIL] ${message}`, "color: #ba1a1a; font-weight: bold;");
      throw new Error(`Assertion failed: ${message}`);
    } else {
      console.log(`%c[PASS] ${message}`, "color: #904d00;");
    }
  }

  async function clickNextOf(activeStepId) {
    const activeStep = document.getElementById(activeStepId);
    assert(activeStep, `Step panel ${activeStepId} exists`);
    const nextBtn = activeStep.querySelector('.signup-next-inline-btn');
    assert(nextBtn, `Next/OK button exists in ${activeStepId}`);
    nextBtn.click();
    await sleep(400);
  }

  async function runTestCase({ name, email, pathway, customModules, objectives, stage, supports, learningStyles, commitment, expectedSpaceUrl, expectedCredential, expectedLearnerType }) {
    console.log(`%c\n--- Running Test Case: ${name} (${pathway} Pathway) ---`, "color: #735c00; font-weight: bold;");
    
    // Open signup modal
    const startBtn = document.querySelector('[data-cta-pathway="true"]');
    assert(startBtn, "Landing page CTA button exists");
    startBtn.click();
    await sleep(400);

    const modal = document.getElementById('signup-modal');
    assert(!modal.classList.contains('hidden'), "Signup modal is visible");

    // 1. Fill Name and Email
    const nameInput = document.getElementById('signup-name');
    const emailInput = document.getElementById('signup-email');
    nameInput.value = name;
    emailInput.value = email;
    // Dispatch input events
    nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    
    await clickNextOf('step-name-email');

    // 2. Select Pathway Interest
    const pathwayCard = document.querySelector(`.signup-pathway-card[data-value="${pathway}"]`);
    assert(pathwayCard, `Pathway interest card for '${pathway}' exists`);
    pathwayCard.click();
    await sleep(500); // Wait for auto-advance animation

    // 3. Custom Module Selection (If Custom Pathway)
    if (pathway === 'custom') {
      const customBuilderStep = document.getElementById('step-custom-builder');
      assert(!customBuilderStep.classList.contains('opacity-0'), "Custom builder step is visible");
      
      // Select custom modules
      for (const modId of customModules) {
        const modCard = document.querySelector(`.signup-module-card[data-id="${modId}"]`);
        assert(modCard, `Custom module card for '${modId}' exists`);
        modCard.click();
        await sleep(100);
      }
      
      // Verify max selection constraint (try selecting 7th and check if it does not select)
      const test7thId = 'ei-4';
      const modCard7 = document.querySelector(`.signup-module-card[data-id="${test7thId}"]`);
      if (modCard7) {
        modCard7.click();
        await sleep(100);
        // It shouldn't be selected because limit is 6
        const isSelected = modCard7.classList.contains('border-primary');
        assert(!isSelected, "Enforced maximum limit of 6 modules correctly");
      }

      await clickNextOf('step-custom-builder');
    }

    // 4. Select Objectives (What to build)
    const objStep = document.getElementById('step-what-to-build');
    assert(!objStep.classList.contains('opacity-0'), "Objective step is active");
    for (const val of objectives) {
      const choice = objStep.querySelector(`.signup-choice[data-value="${val}"]`);
      assert(choice, `Objective choice for '${val}' exists`);
      choice.click();
      await sleep(100);
    }
    await clickNextOf('step-what-to-build');

    // 5. Select Journey Stage (Radio auto-advances)
    const stageStep = document.getElementById('step-journey-stage');
    assert(!stageStep.classList.contains('opacity-0'), "Journey stage step is active");
    const stageChoice = stageStep.querySelector(`.signup-radio[data-value="${stage}"]`);
    assert(stageChoice, `Journey stage choice for '${stage}' exists`);
    stageChoice.click();
    await sleep(500); // Wait for auto-advance

    // 6. Select Support Needs
    const supportStep = document.getElementById('step-support-needs');
    assert(!supportStep.classList.contains('opacity-0'), "Support needs step is active");
    for (const val of supports) {
      const choice = supportStep.querySelector(`.signup-choice[data-value="${val}"]`);
      assert(choice, `Support choice for '${val}' exists`);
      choice.click();
      await sleep(100);
    }
    await clickNextOf('step-support-needs');

    // 7. Select Learning Styles
    const styleStep = document.getElementById('step-learning-style');
    assert(!styleStep.classList.contains('opacity-0'), "Learning style step is active");
    for (const val of learningStyles) {
      const choice = styleStep.querySelector(`.signup-choice[data-value="${val}"]`);
      assert(choice, `Learning style choice for '${val}' exists`);
      choice.click();
      await sleep(100);
    }
    await clickNextOf('step-learning-style');

    // 8. Select Commitment (Radio submits form)
    const commitStep = document.getElementById('step-commitment');
    assert(!commitStep.classList.contains('opacity-0'), "Commitment step is active");
    const commitChoice = commitStep.querySelector(`.signup-radio[data-value="${commitment}"]`);
    assert(commitChoice, `Commitment choice for '${commitment}' exists`);
    commitChoice.click();
    
    // Wait for the loading screen (5 steps * 750ms + buffers = 5 seconds)
    console.log("Waiting for pathway generation loader...");
    await sleep(5500);

    // Verify Success Screen
    const successScreen = document.getElementById('signup-success-screen');
    assert(!successScreen.classList.contains('opacity-0'), "Success screen is visible");

    // Assert results
    const displayedPathway = document.getElementById('preview-pathway').innerText;
    const displayedCredential = document.getElementById('preview-credential').innerText;
    const displayedLearnerType = document.getElementById('preview-learner-type').innerText;
    const redirectBtn = document.getElementById('signup-mighty-redirect-btn');
    const redirectUrl = redirectBtn.getAttribute('href');

    console.log(`Results: Pathway='${displayedPathway}', Credential='${displayedCredential}', LearnerType='${displayedLearnerType}', URL='${redirectUrl}'`);

    assert(redirectUrl === expectedSpaceUrl, `Redirect URL is correctly mapped: ${redirectUrl}`);
    assert(displayedCredential === expectedCredential, `Credential Level is correct: ${displayedCredential}`);
    assert(displayedLearnerType === expectedLearnerType, `Learner Type is correct: ${displayedLearnerType}`);

    // Close success screen to reset state
    const closeSuccessBtn = document.getElementById('signup-success-close-btn');
    closeSuccessBtn.click();
    await sleep(500);
    assert(modal.classList.contains('hidden'), "Signup modal successfully closed and reset");
  }

  try {
    // Test Case 1: Entrepreneurship Standard Pathway (Build Nano)
    await runTestCase({
      name: "Alice Startup",
      email: "alice@startup.edu",
      pathway: "entrepreneurship",
      objectives: ["startup"],
      stage: "rough_idea",
      supports: ["prototype"],
      learningStyles: ["short_readings"],
      commitment: "1_3h",
      expectedSpaceUrl: "https://epic-ai.mn.co/spaces/founder-track",
      expectedCredential: "Build Nano",
      expectedLearnerType: "Founder"
    });

    // Test Case 2: Custom Pathway (Full Micro-Credential)
    await runTestCase({
      name: "Bob Builder",
      email: "bob@builder.org",
      pathway: "custom",
      customModules: ["ei-1", "sis-1", "dti-1", "ei-2", "sis-2", "dti-2"],
      objectives: ["social_impact"],
      stage: "working_on",
      supports: ["impact_model"],
      learningStyles: ["videos_walkthroughs"],
      commitment: "more_5h",
      expectedSpaceUrl: "https://epic-ai.mn.co/spaces/impact-studio",
      expectedCredential: "Full Micro-Credential",
      expectedLearnerType: "Changemaker"
    });

    console.log("%c=== ALL EPIC ONBOARDING TESTS PASSED SUCCESSFULLY! ===", "color: #904d00; font-size: 14px; font-weight: bold;");
  } catch (err) {
    console.error("%c=== EPIC ONBOARDING TESTS FAILED ===", "color: #ba1a1a; font-size: 14px; font-weight: bold;");
    console.error(err);
  }
})();
