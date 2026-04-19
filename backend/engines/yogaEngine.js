/**
 * Ayurvedic Yoga Recommendation Engine
 *
 * Recommends yoga poses, pranayama, and meditation based on:
 * - Dosha constitution (Prakriti) and current imbalance (Vikriti)
 * - Disease risks and health conditions
 * - Time of day (Dosha Clock alignment)
 * - Season (Ritucharya)
 * - Physical capabilities (age, BMI, fitness level)
 * - Therapeutic needs
 *
 * References: Hatha Yoga Pradipika, Yoga Sutras of Patanjali
 */

/**
 * Score a yoga pose for a specific user
 */
function scoreYogaPoseForUser(pose, doshaStatus, sessionType, userData) {
  let score = 0;
  const reasons = [];
  const doshaEffect = pose.dosha_effect || {};

  // 1. DOSHA BALANCING (Primary factor)
  for (const [dosha, effect] of Object.entries(doshaEffect)) {
    const doshaKey = `${dosha}Status`;
    const status = doshaStatus[doshaKey];

    if (status === 'aggravated' && effect < 0) {
      score += Math.abs(effect) * 2;
      reasons.push(`Pacifies ${capitalize(dosha)} (${Math.abs(effect)}x effect)`);
    } else if (status === 'aggravated' && effect > 0) {
      score -= effect * 2;
      reasons.push(`May aggravate ${capitalize(dosha)}`);
    }
  }

  // 2. SESSION TYPE MATCHING
  const bestTime = (pose.best_time || '').toLowerCase();
  if (sessionType === 'morning' && (bestTime.includes('morning') || bestTime.includes('sunrise'))) {
    score += 2;
    reasons.push('Ideal for morning practice');
  } else if (sessionType === 'evening' && (bestTime.includes('evening') || bestTime.includes('sleep'))) {
    score += 2;
    reasons.push('Perfect for evening wind-down');
  }

  // 3. DIFFICULTY APPROPRIATENESS
  const age = userData?.age || 30;
  const bmi = userData?.bmi || 22;
  const activity = userData?.physical_activity || 'moderate';

  if (pose.difficulty === 'advanced') {
    if (age > 55 || bmi > 30 || activity === 'low') {
      score -= 3;
      reasons.push('Advanced pose - may not be suitable for current fitness level');
    }
  }
  if (pose.difficulty === 'beginner') {
    if (activity === 'low' || age > 50) {
      score += 1; // Beginner-friendly is better for less active people
    }
  }

  // 4. CATEGORY PREFERENCES BY DOSHA
  if (doshaStatus.dominant === 'Vata') {
    if (['Restorative', 'Seated', 'Balance', 'Meditation'].includes(pose.category)) {
      score += 2;
      reasons.push('Grounding category ideal for Vata');
    }
    if (pose.category === 'Flow' && pose.difficulty !== 'beginner') {
      score -= 1; // Fast flows can aggravate Vata
    }
  } else if (doshaStatus.dominant === 'Pitta') {
    if (['Restorative', 'Twist', 'Meditation', 'Pranayama'].includes(pose.category)) {
      score += 2;
      reasons.push('Cooling category ideal for Pitta');
    }
    if (pose.category === 'Core') {
      score -= 1; // Core work generates heat
    }
  } else if (doshaStatus.dominant === 'Kapha') {
    if (['Flow', 'Core', 'Backbend', 'Standing'].includes(pose.category)) {
      score += 2;
      reasons.push('Stimulating category ideal for Kapha');
    }
    if (['Restorative', 'Meditation'].includes(pose.category) && sessionType === 'morning') {
      score -= 1; // Kapha needs stimulation in morning
    }
  }

  return { score, reasons: reasons.slice(0, 3) };
}

/**
 * Generate personalized yoga recommendations
 */
function generateYogaRecommendations(yogaPoses, doshaStatus, userData, diseaseRisks, sessionType = 'morning') {
  const scoredPoses = [];

  for (const pose of yogaPoses) {
    const result = scoreYogaPoseForUser(pose, doshaStatus, sessionType, userData);

    // Add therapeutic bonuses based on disease risks
    let therapeuticBonus = 0;
    const therapeuticReasons = [];

    if (diseaseRisks?.diabetes > 50) {
      if (['Sun Salutation', 'Boat Pose', 'Bow Pose'].includes(pose.name) ||
          pose.category === 'Core' || pose.pranayama_type === 'Kapalabhati') {
        therapeuticBonus += 2;
        therapeuticReasons.push('Therapeutic for diabetes risk');
      }
    }
    if (diseaseRisks?.stress > 50 || diseaseRisks?.sleep_disorder > 50) {
      if (['Yoga Nidra', 'Legs Up The Wall', 'Child Pose'].includes(pose.name) ||
          pose.pranayama_type === 'Bhramari' || pose.pranayama_type === 'Nadi Shodhana') {
        therapeuticBonus += 3;
        therapeuticReasons.push('Therapeutic for stress/sleep');
      }
    }
    if (diseaseRisks?.hypertension > 50 || diseaseRisks?.heart_disease > 50) {
      if (pose.pranayama_type === 'Bhramari' || pose.pranayama_type === 'Sheetali' ||
          ['Corpse Pose', 'Legs Up The Wall', 'Supine Twist'].includes(pose.name)) {
        therapeuticBonus += 2;
        therapeuticReasons.push('Therapeutic for heart/BP');
      }
      // Avoid inversions and vigorous poses for high BP
      if (['Headstand', 'Shoulder Stand'].includes(pose.name) || pose.category === 'Inversion') {
        therapeuticBonus -= 5;
        therapeuticReasons.push('Avoid inversions with high BP risk');
      }
    }
    if (diseaseRisks?.obesity > 50) {
      if (['Sun Salutation', 'Boat Pose', 'Bow Pose', 'Camel Pose'].includes(pose.name) ||
          pose.pranayama_type === 'Kapalabhati') {
        therapeuticBonus += 2;
        therapeuticReasons.push('Supports weight management');
      }
    }
    if (diseaseRisks?.digestive_disorder > 40) {
      if (['Cat-Cow Stretch', 'Supine Twist'].includes(pose.name) || pose.name.includes('Vajrasana')) {
        therapeuticBonus += 2;
        therapeuticReasons.push('Supports digestive health');
      }
    }

    const totalScore = result.score + therapeuticBonus;
    const allReasons = [...result.reasons, ...therapeuticReasons];

    scoredPoses.push({
      ...pose,
      score: totalScore,
      reasons: allReasons.slice(0, 4),
      session_type: sessionType
    });
  }

  // Sort by score
  scoredPoses.sort((a, b) => b.score - a.score);

  return scoredPoses;
}

/**
 * Build a complete yoga session (sequence of poses)
 */
function buildYogaSession(recommendations, sessionType, duration = 30, doshaStatus) {
  const session = {
    type: sessionType,
    duration_minutes: duration,
    warmup: [],
    main_sequence: [],
    pranayama: [],
    meditation: [],
    cooldown: [],
    savasana: null
  };

  const warmups = recommendations.filter(p => p.category === 'Warm-up');
  const standing = recommendations.filter(p => p.category === 'Standing' && p.score > 0);
  const seated = recommendations.filter(p => p.category === 'Seated' && p.score > 0);
  const backbends = recommendations.filter(p => p.category === 'Backbend' && p.score > 0);
  const twists = recommendations.filter(p => p.category === 'Twist' && p.score > 0);
  const balancing = recommendations.filter(p => p.category === 'Balance' && p.score > 0);
  const flows = recommendations.filter(p => p.category === 'Flow' && p.score > 0);
  const core = recommendations.filter(p => p.category === 'Core' && p.score > 0);
  const pranayama = recommendations.filter(p => p.category === 'Pranayama' && p.score > 0);
  const meditation = recommendations.filter(p => p.category === 'Meditation' && p.score > 0);
  const restorative = recommendations.filter(p => p.category === 'Restorative' && p.score > 0);
  const inversions = recommendations.filter(p => p.category === 'Inversion' && p.score > 0);
  const hipOpeners = recommendations.filter(p => p.category === 'Hip Opener' && p.score > 0);

  // Build sequence based on session type
  if (sessionType === 'morning') {
    // Warm-up
    session.warmup = warmups.slice(0, 1).map(formatPose);
    if (session.warmup.length === 0) {
      session.warmup = [{ name: 'Cat-Cow Stretch', duration: '2 min', sets: '10 rounds' }];
    }

    // Main flow
    if (doshaStatus.kaphaStatus === 'aggravated') {
      // Vigorous for Kapha
      if (flows.length > 0) session.main_sequence.push(...flows.slice(0, 1).map(p => formatPose(p, '10-15 min')));
      session.main_sequence.push(...standing.slice(0, 3).map(formatPose));
      session.main_sequence.push(...core.slice(0, 2).map(formatPose));
      session.main_sequence.push(...backbends.slice(0, 2).map(formatPose));
    } else if (doshaStatus.pittaStatus === 'aggravated') {
      // Moderate cooling for Pitta
      session.main_sequence.push(...standing.slice(0, 2).map(formatPose));
      session.main_sequence.push(...twists.slice(0, 1).map(formatPose));
      session.main_sequence.push(...backbends.slice(0, 1).map(formatPose));
      session.main_sequence.push(...hipOpeners.slice(0, 1).map(formatPose));
    } else {
      // Grounding for Vata
      session.main_sequence.push(...standing.slice(0, 2).map(formatPose));
      session.main_sequence.push(...balancing.slice(0, 1).map(formatPose));
      session.main_sequence.push(...seated.slice(0, 2).map(formatPose));
    }

    // Pranayama
    session.pranayama = pranayama.slice(0, 2).map(p => formatPose(p, `${Math.round(p.duration_seconds / 60)} min`));

    // Cool down
    session.cooldown = restorative.slice(0, 1).map(formatPose);

    // Savasana (always included)
    const savasanaData = recommendations.find(p => p.name === 'Corpse Pose');
    session.savasana = savasanaData ? formatPose(savasanaData, '5 min') : { name: 'Savasana', duration: '5 min' };

  } else if (sessionType === 'evening') {
    // Gentle evening sequence
    session.warmup = warmups.slice(0, 1).map(p => formatPose(p, '3 min'));
    session.main_sequence = [
      ...seated.slice(0, 2).map(formatPose),
      ...twists.slice(0, 1).map(formatPose),
      ...hipOpeners.slice(0, 1).map(formatPose),
      ...restorative.slice(0, 2).map(formatPose)
    ];
    session.pranayama = pranayama
      .filter(p => p.pranayama_type === 'Bhramari' || p.pranayama_type === 'Nadi Shodhana')
      .slice(0, 2)
      .map(p => formatPose(p, '5 min'));
    session.meditation = meditation.slice(0, 1).map(p => formatPose(p, '10 min'));
    const savasanaData = recommendations.find(p => p.name === 'Corpse Pose');
    session.savasana = savasanaData ? formatPose(savasanaData, '5 min') : { name: 'Savasana', duration: '5 min' };

  } else if (sessionType === 'therapeutic') {
    // Focused on healing
    session.warmup = warmups.slice(0, 1).map(p => formatPose(p, '3 min'));
    session.main_sequence = recommendations
      .filter(p => p.reasons.some(r => r.toLowerCase().includes('therapeutic')))
      .slice(0, 5)
      .map(formatPose);
    session.pranayama = pranayama.slice(0, 2).map(p => formatPose(p, '5 min'));
    session.cooldown = restorative.slice(0, 2).map(formatPose);
    const savasanaData = recommendations.find(p => p.name === 'Yoga Nidra' || p.name === 'Corpse Pose');
    session.savasana = savasanaData ? formatPose(savasanaData, '10 min') : { name: 'Yoga Nidra', duration: '10 min' };
  }

  // Calculate total duration
  let totalMinutes = 0;
  const countDuration = (items) => items.forEach(i => {
    const dur = parseInt(i.duration) || 1;
    totalMinutes += dur;
  });

  countDuration(session.warmup);
  countDuration(session.main_sequence);
  countDuration(session.pranayama);
  countDuration(session.meditation);
  countDuration(session.cooldown);
  if (session.savasana) totalMinutes += parseInt(session.savasana.duration) || 5;

  session.estimated_duration = totalMinutes;

  // Dosha-specific tips
  if (doshaStatus.vataStatus === 'aggravated') {
    session.dosha_tips = [
      'Move slowly and mindfully - Vata needs grounding, not speed',
      'Hold poses longer with steady breath',
      'Keep the room warm',
      'Focus on exhale to calm Vata'
    ];
  } else if (doshaStatus.pittaStatus === 'aggravated') {
    session.dosha_tips = [
      'Practice with 75% effort - Pitta tends to push too hard',
      'Keep eyes soft, jaw relaxed',
      'Practice non-competitively',
      'Include cooling breath (Sheetali) between intense poses'
    ];
  } else if (doshaStatus.kaphaStatus === 'aggravated') {
    session.dosha_tips = [
      'Build heat and intensity - Kapha needs stimulation',
      'Move dynamically between poses',
      'Challenge yourself slightly beyond comfort',
      'Practice Kapalabhati to energize'
    ];
  }

  return session;
}

function formatPose(pose, overrideDuration) {
  const dur = overrideDuration || `${Math.round((pose.duration_seconds || 30) / 60)} min`;
  return {
    name: pose.name,
    sanskrit: pose.sanskrit_name,
    category: pose.category,
    duration: dur,
    instructions: pose.instructions,
    benefits: pose.benefits,
    contraindications: pose.contraindications,
    difficulty: pose.difficulty,
    score: pose.score,
    reasons: pose.reasons
  };
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = {
  scoreYogaPoseForUser,
  generateYogaRecommendations,
  buildYogaSession
};
