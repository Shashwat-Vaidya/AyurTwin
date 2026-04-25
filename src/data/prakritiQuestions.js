// =====================================================
// PRAKRITI QUIZ - 22 Questions
// Category A: Physical Structure (Q1-8, Q19-22)
// Category B: Digestive Function (Q9-13)
// Category C: Mental Traits (Q14-18)
// =====================================================

export const PRAKRITI_QUESTIONS = [
  // Category A: Physical Structure & Appearance
  {
    id: 1,
    category: 'Physical Structure',
    explanation: "Ayurveda links body frame to dosha — thin = Vata (air), medium = Pitta (fire), heavy = Kapha (earth).",
    question: 'What best describes your natural body build or frame?',
    options: [
      { key: 'a', text: 'Lean and thin', dosha: 'vata' },
      { key: 'b', text: 'Medium and proportionate', dosha: 'pitta' },
      { key: 'c', text: 'Well-built, broad, and strong', dosha: 'kapha' },
    ],
  },
  {
    id: 2,
    category: 'Physical Structure',
    explanation: "Symmetry reflects underlying tissue (dhatu) balance. Vata bodies tend to be uneven; Kapha bodies are symmetrical.",
    question: 'How would you describe the symmetry and proportion of your body parts?',
    options: [
      { key: 'a', text: 'Uneven or asymmetrical', dosha: 'vata' },
      { key: 'b', text: 'Well-formed and balanced', dosha: 'pitta' },
      { key: 'c', text: 'Well-proportioned and symmetrical', dosha: 'kapha' },
    ],
  },
  {
    id: 3,
    category: 'Physical Structure',
    explanation: "Skin & hair texture reveal your dominant element. Dry = Vata, soft & warm = Pitta, oily = Kapha.",
    question: 'What is the predominant texture of your skin and hair?',
    options: [
      { key: 'a', text: 'Rough and dry', dosha: 'vata' },
      { key: 'b', text: 'Soft and smooth', dosha: 'pitta' },
      { key: 'c', text: 'Smooth and oily', dosha: 'kapha' },
    ],
  },
  {
    id: 4,
    category: 'Physical Structure',
    explanation: "Face shape mirrors prana (life-force) flow. Narrow faces are typical Vata, sharp ones Pitta, broad ones Kapha.",
    question: 'Which shape best describes your face?',
    options: [
      { key: 'a', text: 'Small and narrow', dosha: 'vata' },
      { key: 'b', text: 'Long or medium, with sharp features', dosha: 'pitta' },
      { key: 'c', text: 'Broad, full, and attractive', dosha: 'kapha' },
    ],
  },
  {
    id: 5,
    category: 'Physical Structure',
    explanation: "Skin nature shows tissue quality. Choose what matches you most days, not just today.",
    question: 'What is the general nature of your skin?',
    options: [
      { key: 'a', text: 'Dry and rough', dosha: 'vata' },
      { key: 'b', text: 'Soft, warm, and sensitive', dosha: 'pitta' },
      { key: 'c', text: 'Smooth, cool, and thick', dosha: 'kapha' },
    ],
  },
  {
    id: 6,
    category: 'Physical Structure',
    explanation: "Touch temperature reflects circulation: cold hands = Vata, warm = Pitta, cool & moist = Kapha.",
    question: 'How does your skin feel to the touch of others?',
    options: [
      { key: 'a', text: 'Generally cold', dosha: 'vata' },
      { key: 'b', text: 'Warm or hot', dosha: 'pitta' },
      { key: 'c', text: 'Cool and slightly oily', dosha: 'kapha' },
    ],
  },
  {
    id: 7,
    category: 'Physical Structure',
    explanation: "Complexion reveals tejas (inner glow). Pick the tone you naturally have without sun/skincare.",
    question: 'What is your natural skin complexion?',
    options: [
      { key: 'a', text: 'Dark or dull', dosha: 'vata' },
      { key: 'b', text: 'Fair, reddish, or coppery', dosha: 'pitta' },
      { key: 'c', text: 'Fair, pale, or glowing', dosha: 'kapha' },
    ],
  },
  {
    id: 8,
    category: 'Physical Structure',
    explanation: "Hair quality shows reproductive tissue (shukra). Dry-frizzy = Vata, fine, prematurely greying = Pitta, thick and shiny = Kapha.",
    question: 'What is the nature of your hair?',
    options: [
      { key: 'a', text: 'Thin, dry, brittle, or frizzy', dosha: 'vata' },
      { key: 'b', text: 'Soft, fine, with tendencies for premature greying or thinning', dosha: 'pitta' },
      { key: 'c', text: 'Thick, black, shiny, and oily', dosha: 'kapha' },
    ],
  },
  // Category B: Digestive & Metabolic Function
  {
    id: 9,
    category: 'Digestive Function',
    explanation: "Joint behaviour reflects synovial fluid (a Kapha quality). Cracking joints suggest Vata excess.",
    question: 'What is the condition of your joints?',
    options: [
      { key: 'a', text: 'They produce cracking sounds and feel loose or unstable', dosha: 'vata' },
      { key: 'b', text: 'They are moderately stable without significant issues', dosha: 'pitta' },
      { key: 'c', text: 'They are strong, well-lubricated, and flexible', dosha: 'kapha' },
    ],
  },
  {
    id: 10,
    category: 'Digestive Function',
    explanation: "Digestive fire (Agni) is core to Ayurveda. Variable = Vata-Vishama, sharp = Pitta-Tikshna, slow = Kapha-Manda.",
    question: 'How is your digestive fire or appetite strength?',
    options: [
      { key: 'a', text: 'Variable - sometimes strong, sometimes weak', dosha: 'vata' },
      { key: 'b', text: 'Consistently strong', dosha: 'pitta' },
      { key: 'c', text: 'Generally slow or weak', dosha: 'kapha' },
    ],
  },
  {
    id: 11,
    category: 'Digestive Function',
    explanation: "Digestion speed shapes weight and metabolism. Pitta digests fastest; Kapha slowest.",
    question: 'How would you describe your digestive capacity?',
    options: [
      { key: 'a', text: 'Irregular - digests some foods well, others poorly', dosha: 'vata' },
      { key: 'b', text: 'Fast - digests food quickly', dosha: 'pitta' },
      { key: 'c', text: 'Slow - feels heavy after eating, digestion takes time', dosha: 'kapha' },
    ],
  },
  {
    id: 12,
    category: 'Digestive Function',
    explanation: "Hunger pattern mirrors metabolism. Pitta types feel hunger sharply; Kapha types can skip meals easily.",
    question: 'How intense is your feeling of hunger?',
    options: [
      { key: 'a', text: 'Low or inconsistent', dosha: 'vata' },
      { key: 'b', text: 'Strong and frequent', dosha: 'pitta' },
      { key: 'c', text: 'Mild and manageable', dosha: 'kapha' },
    ],
  },
  {
    id: 13,
    category: 'Digestive Function',
    explanation: "Cravings hint at dosha. Choose what you genuinely prefer, not what you think is healthiest.",
    question: 'Which tastes do you naturally prefer or crave?',
    options: [
      { key: 'a', text: 'Sweet, sour, and salty', dosha: 'vata' },
      { key: 'b', text: 'Sweet, bitter, and astringent', dosha: 'pitta' },
      { key: 'c', text: 'Pungent, bitter, and astringent', dosha: 'kapha' },
    ],
  },
  // Category C: Mental & Behavioral Traits
  {
    id: 14,
    category: 'Mental Traits',
    explanation: "Voice quality reflects throat (Kapha) and breath (Vata). Pick how it usually sounds, not when sick.",
    question: 'Which best describes your voice?',
    options: [
      { key: 'a', text: 'Weak, thin, or cracked', dosha: 'vata' },
      { key: 'b', text: 'Sharp, clear, and commanding', dosha: 'pitta' },
      { key: 'c', text: 'Deep, pleasant, and melodious', dosha: 'kapha' },
    ],
  },
  {
    id: 15,
    category: 'Mental Traits',
    explanation: "Mental courage in new situations reveals dosha. Anxious = Vata, bold = Pitta, steady = Kapha.",
    question: 'How would you rate your level of courage or bravery in new situations?',
    options: [
      { key: 'a', text: 'Low - tendency towards anxiety or fear', dosha: 'vata' },
      { key: 'b', text: 'High - bold and confident', dosha: 'pitta' },
      { key: 'c', text: 'Moderate - calm and steady', dosha: 'kapha' },
    ],
  },
  {
    id: 16,
    category: 'Mental Traits',
    explanation: "Reaction speed reveals nervous-system pace. Quick = Pitta, deliberate = Kapha.",
    question: 'What is your typical reaction speed to events or information?',
    options: [
      { key: 'a', text: 'Unpredictable - sometimes fast, sometimes slow', dosha: 'vata' },
      { key: 'b', text: 'Quick and immediate', dosha: 'pitta' },
      { key: 'c', text: 'Slow, thoughtful, and deliberate', dosha: 'kapha' },
    ],
  },
  {
    id: 17,
    category: 'Mental Traits',
    explanation: "Pace of movement is dosha-driven. Pick how you naturally walk and work, not when in a hurry.",
    question: 'How would you describe your general pace of activity and movement?',
    options: [
      { key: 'a', text: 'Fast, light, and quick', dosha: 'vata' },
      { key: 'b', text: 'Medium, focused, and purposeful', dosha: 'pitta' },
      { key: 'c', text: 'Slow, steady, and deliberate', dosha: 'kapha' },
    ],
  },
  {
    id: 18,
    category: 'Mental Traits',
    explanation: "Physical endurance reflects ojas (vitality). Kapha types have the most stamina; Vata the least.",
    question: 'What is your level of physical endurance and strength?',
    options: [
      { key: 'a', text: 'Low - tires easily', dosha: 'vata' },
      { key: 'b', text: 'Moderate - good for bursts of activity', dosha: 'pitta' },
      { key: 'c', text: 'High - naturally strong with good stamina', dosha: 'kapha' },
    ],
  },
  // Category A continued: Physical Structure
  {
    id: 19,
    category: 'Physical Structure',
    explanation: "Teeth indicate bone tissue (asthi). Vata = uneven, Pitta = sharp/yellowish, Kapha = strong/white.",
    question: 'What best describes your teeth?',
    options: [
      { key: 'a', text: 'Small, uneven, irregular, or with gaps', dosha: 'vata' },
      { key: 'b', text: 'Medium-sized, sharp, and slightly yellowish', dosha: 'pitta' },
      { key: 'c', text: 'Large, even, strong, and white', dosha: 'kapha' },
    ],
  },
  {
    id: 20,
    category: 'Physical Structure',
    explanation: "Eye size and shine reveal alochaka pitta. Small/dry = Vata, sharp = Pitta, large & moist = Kapha.",
    question: 'What is the shape of your nose?',
    options: [
      { key: 'a', text: 'Thin, small, or irregularly shaped', dosha: 'vata' },
      { key: 'b', text: 'Sharp, well-defined, and of medium size', dosha: 'pitta' },
      { key: 'c', text: 'Broad, rounded, and well-shaped', dosha: 'kapha' },
    ],
  },
  {
    id: 21,
    category: 'Physical Structure',
    explanation: "Sweat pattern reveals heat. Light sweat = Vata, profuse with strong odour = Pitta, mild & sticky = Kapha.",
    question: 'Which description best fits your eyes?',
    options: [
      { key: 'a', text: 'Small, dry, unsteady, or dull', dosha: 'vata' },
      { key: 'b', text: 'Sharp, bright, intense, with slight redness', dosha: 'pitta' },
      { key: 'c', text: 'Large, attractive, calm, and moist', dosha: 'kapha' },
    ],
  },
  {
    id: 22,
    category: 'Physical Structure',
    explanation: "Sleep depth reveals tamas/sattva. Light = Vata, moderate = Pitta, deep & long = Kapha.",
    question: 'What is the condition of your nails?',
    options: [
      { key: 'a', text: 'Dry, rough, brittle, or cracked', dosha: 'vata' },
      { key: 'b', text: 'Soft, pinkish/reddish, and warm', dosha: 'pitta' },
      { key: 'c', text: 'Thick, strong, smooth, and pale', dosha: 'kapha' },
    ],
  },
];

// Scoring function
export const calculatePrakriti = (answers) => {
  let vata = 0;
  let pitta = 0;
  let kapha = 0;

  answers.forEach((answer) => {
    if (answer === 'a') vata += 1;
    else if (answer === 'b') pitta += 1;
    else if (answer === 'c') kapha += 1;
  });

  const total = vata + pitta + kapha;
  const vataPercent = parseFloat(((vata / total) * 100).toFixed(1));
  const pittaPercent = parseFloat(((pitta / total) * 100).toFixed(1));
  const kaphaPercent = parseFloat(((kapha / total) * 100).toFixed(1));

  // Determine prakriti type
  const scores = { Vata: vataPercent, Pitta: pittaPercent, Kapha: kaphaPercent };
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  let prakriti;
  const diff1_2 = sorted[0][1] - sorted[1][1];
  const diff2_3 = sorted[1][1] - sorted[2][1];

  if (diff1_2 < 5 && diff2_3 < 5) {
    prakriti = 'Tridosha';
  } else if (diff1_2 < 10) {
    prakriti = `${sorted[0][0]}-${sorted[1][0]}`;
  } else {
    prakriti = sorted[0][0];
  }

  return {
    vata_score: vata,
    pitta_score: pitta,
    kapha_score: kapha,
    vata_percent: vataPercent,
    pitta_percent: pittaPercent,
    kapha_percent: kaphaPercent,
    prakriti,
  };
};
