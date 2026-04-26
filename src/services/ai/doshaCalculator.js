class DoshaCalculatorService {
  constructor() {
    this.doshas = {
      vata: {
        name: 'Vata',
        elements: ['Air', 'Space'],
        qualities: ['Dry', 'Light', 'Cold', 'Rough', 'Subtle', 'Mobile'],
        color: '#7B6E8F',
        emoji: '',
      },
      pitta: {
        name: 'Pitta',
        elements: ['Fire', 'Water'],
        qualities: ['Hot', 'Sharp', 'Light', 'Oily', 'Liquid', 'Mobile'],
        color: '#FF6B6B',
        emoji: '',
      },
      kapha: {
        name: 'Kapha',
        elements: ['Water', 'Earth'],
        qualities: ['Heavy', 'Slow', 'Cool', 'Oily', 'Smooth', 'Stable'],
        color: '#6BA6A6',
        emoji: '',
      },
    };
  }

  // Calculate dosha from quiz answers
  calculateDoshaFromQuiz(answers) {
    let vata = 0;
    let pitta = 0;
    let kapha = 0;

    answers.forEach(answer => {
      switch(answer.dosha) {
        case 'vata':
          vata += answer.weight || 1;
          break;
        case 'pitta':
          pitta += answer.weight || 1;
          break;
        case 'kapha':
          kapha += answer.weight || 1;
          break;
      }
    });

    const total = vata + pitta + kapha;
    
    return {
      vata: Math.round((vata / total) * 100),
      pitta: Math.round((pitta / total) * 100),
      kapha: Math.round((kapha / total) * 100),
      dominant: this.getDominantDosha(vata, pitta, kapha),
    };
  }

  // Calculate dosha from user inputs (lifestyle, physical characteristics)
  calculateDoshaFromInputs(inputs) {
    let vata = 0;
    let pitta = 0;
    let kapha = 0;

    // Body frame
    switch(inputs.bodyFrame) {
      case 'thin':
        vata += 3;
        break;
      case 'medium':
        pitta += 2;
        kapha += 1;
        break;
      case 'large':
        kapha += 3;
        break;
    }

    // Skin type
    switch(inputs.skinType) {
      case 'dry':
        vata += 3;
        break;
      case 'sensitive':
        pitta += 3;
        break;
      case 'oily':
        kapha += 3;
        break;
    }

    // Hair type
    switch(inputs.hairType) {
      case 'dry':
        vata += 2;
        break;
      case 'thin':
        pitta += 2;
        break;
      case 'thick':
        kapha += 2;
        break;
    }

    // Appetite
    switch(inputs.appetite) {
      case 'variable':
        vata += 2;
        break;
      case 'strong':
        pitta += 2;
        break;
      case 'steady':
        kapha += 2;
        break;
    }

    // Digestion
    switch(inputs.digestion) {
      case 'irregular':
        vata += 3;
        break;
      case 'fast':
        pitta += 3;
        break;
      case 'slow':
        kapha += 3;
        break;
    }

    // Temperature preference
    switch(inputs.temperaturePreference) {
      case 'warm':
        vata += 2;
        break;
      case 'cool':
        pitta += 2;
        break;
      case 'any':
        kapha += 1;
        break;
    }

    // Sleep pattern
    switch(inputs.sleepPattern) {
      case 'light':
        vata += 2;
        break;
      case 'moderate':
        pitta += 2;
        break;
      case 'heavy':
        kapha += 2;
        break;
    }

    // Stress response
    switch(inputs.stressResponse) {
      case 'anxious':
        vata += 3;
        break;
      case 'irritable':
        pitta += 3;
        break;
      case 'calm':
        kapha += 3;
        break;
    }

    // Energy pattern
    switch(inputs.energyPattern) {
      case 'variable':
        vata += 2;
        break;
      case 'intense':
        pitta += 2;
        break;
      case 'steady':
        kapha += 2;
        break;
    }

    const total = vata + pitta + kapha;
    
    return {
      vata: total > 0 ? Math.round((vata / total) * 100) : 33,
      pitta: total > 0 ? Math.round((pitta / total) * 100) : 33,
      kapha: total > 0 ? Math.round((kapha / total) * 100) : 34,
      dominant: this.getDominantDosha(vata, pitta, kapha),
    };
  }

  // Get dominant dosha
  getDominantDosha(vata, pitta, kapha) {
    const max = Math.max(vata, pitta, kapha);
    
    if (max === vata && vata > pitta + 10 && vata > kapha + 10) return 'vata';
    if (max === pitta && pitta > vata + 10 && pitta > kapha + 10) return 'pitta';
    if (max === kapha && kapha > vata + 10 && kapha > pitta + 10) return 'kapha';
    
    // Mixed doshas
    if (vata > 40 && pitta > 40 && kapha < 20) return 'vata-pitta';
    if (pitta > 40 && kapha > 40 && vata < 20) return 'pitta-kapha';
    if (vata > 40 && kapha > 40 && pitta < 20) return 'vata-kapha';
    
    return 'tridosha';
  }

  // Get dosha description
  getDoshaDescription(doshaType) {
    const descriptions = {
      vata: {
        description: 'Vata types are creative, energetic, and quick-thinking. They tend to be thin, have dry skin, and prefer warm environments.',
        characteristics: ['Creative', 'Enthusiastic', 'Quick learner', 'Energetic'],
        challenges: ['Anxiety', 'Dry skin', 'Irregular digestion', 'Difficulty sleeping'],
        recommendations: 'Maintain regular routines, eat warm grounding foods, stay warm, and practice calming activities.',
      },
      pitta: {
        description: 'Pitta types are intelligent, focused, and driven. They have medium builds, warm body temperature, and strong digestion.',
        characteristics: ['Intelligent', 'Ambitious', 'Good leaders', 'Sharp mind'],
        challenges: ['Irritability', 'Acidity', 'Inflammation', 'Perfectionism'],
        recommendations: 'Avoid spicy foods, stay cool, take breaks, and practice moderation.',
      },
      kapha: {
        description: 'Kapha types are calm, loving, and stable. They tend to have solid builds, smooth skin, and steady energy.',
        characteristics: ['Calm', 'Loving', 'Patient', 'Strong'],
        challenges: ['Weight gain', 'Lethargy', 'Congestion', 'Attachment'],
        recommendations: 'Stay active, eat light foods, seek variety, and avoid heavy meals.',
      },
      'vata-pitta': {
        description: 'You have a combination of Vata and Pitta, making you creative and driven, but potentially prone to anxiety and irritability.',
        characteristics: ['Creative', 'Ambitious', 'Quick', 'Intense'],
        challenges: ['Anxiety', 'Irritability', 'Burnout', 'Impatience'],
        recommendations: 'Balance activity with rest, avoid overexertion, and maintain regular routines.',
      },
      'pitta-kapha': {
        description: 'You have a combination of Pitta and Kapha, making you strong and determined, but potentially prone to stubbornness.',
        characteristics: ['Strong', 'Determined', 'Patient', 'Ambitious'],
        challenges: ['Stubbornness', 'Weight gain', 'Acidity', 'Resistance to change'],
        recommendations: 'Stay active, avoid heavy foods, and practice flexibility.',
      },
      'vata-kapha': {
        description: 'You have a combination of Vata and Kapha, making you creative yet stable, but potentially prone to inconsistency.',
        characteristics: ['Creative', 'Stable', 'Adaptable', 'Calm'],
        challenges: ['Inconsistency', 'Weight fluctuations', 'Indecision', 'Lethargy'],
        recommendations: 'Maintain routines, stay warm, and balance activity with rest.',
      },
      tridosha: {
        description: 'You have a balanced constitution with all three doshas equally present. This is rare and indicates great adaptability.',
        characteristics: ['Balanced', 'Adaptable', 'Versatile', 'Resilient'],
        challenges: ['May be prone to any imbalance depending on season'],
        recommendations: 'Pay attention to seasonal changes and adjust your routine accordingly.',
      },
    };

    return descriptions[doshaType] || descriptions.tridosha;
  }

  // Get seasonal recommendations based on dosha
  getSeasonalRecommendations(dosha, season) {
    const recommendations = {
      vata: {
        spring: 'Continue grounding practices, but incorporate lighter foods.',
        summer: 'Avoid excessive heat, stay hydrated, and keep routines.',
        autumn: 'Increase grounding foods, oil massage, and warm routines.',
        winter: 'Stay warm, eat nourishing foods, and maintain routines.',
        monsoon: 'Stay dry, eat warm foods, and avoid raw vegetables.',
      },
      pitta: {
        spring: 'Enjoy the moderate weather, focus on cooling foods.',
        summer: 'Stay cool, avoid spicy foods, and take it easy.',
        autumn: 'Continue cooling practices as weather changes.',
        winter: 'Enjoy warm foods but avoid overheating.',
        monsoon: 'Stay cool, avoid fermented foods, and practice moderation.',
      },
      kapha: {
        spring: 'Increase activity, eat light foods, and detoxify.',
        summer: 'Stay active but avoid heat exhaustion.',
        autumn: 'Continue active routines as energy increases.',
        winter: 'Maintain activity, eat light warm foods.',
        monsoon: 'Stay warm and dry, maintain activity levels.',
      },
    };

    const doshaMap = {
      vata: 'vata',
      pitta: 'pitta',
      kapha: 'kapha',
      'vata-pitta': 'vata',
      'pitta-kapha': 'pitta',
      'vata-kapha': 'vata',
      tridosha: 'vata',
    };

    const primaryDosha = doshaMap[dosha] || 'vata';
    return recommendations[primaryDosha]?.[season] || 'Maintain balance with your regular routine.';
  }

  // Get daily routine recommendations based on dosha
  getDailyRoutine(dosha) {
    const routines = {
      vata: {
        wakeUp: '6:00 AM',
        morning: 'Oil massage with sesame oil, warm shower',
        exercise: 'Gentle yoga, walking, swimming',
        breakfast: 'Warm oatmeal with ghee',
        lunch: 'Warm, nourishing meal (largest meal)',
        afternoon: 'Regular breaks, avoid overexertion',
        dinner: 'Light, warm meal before 7 PM',
        evening: 'Calming activities, early to bed',
        bedtime: '10:00 PM',
      },
      pitta: {
        wakeUp: '5:30 AM',
        morning: 'Cool shower, gentle stretches',
        exercise: 'Moderate exercise, avoid midday sun',
        breakfast: 'Light, cooling breakfast',
        lunch: 'Substantial meal (largest meal)',
        afternoon: 'Take breaks, stay cool',
        dinner: 'Light meal before sunset',
        evening: 'Cooling activities, moonlight walks',
        bedtime: '10:30 PM',
      },
      kapha: {
        wakeUp: '5:00 AM',
        morning: 'Dry brushing, invigorating shower',
        exercise: 'Vigorous exercise, variety needed',
        breakfast: 'Light or skip breakfast',
        lunch: 'Moderate meal',
        afternoon: 'Stay active, avoid naps',
        dinner: 'Very light, early dinner',
        evening: 'Active evening routine',
        bedtime: '11:00 PM',
      },
    };

    const doshaMap = {
      vata: 'vata',
      pitta: 'pitta',
      kapha: 'kapha',
      'vata-pitta': 'vata',
      'pitta-kapha': 'pitta',
      'vata-kapha': 'vata',
      tridosha: 'vata',
    };

    return routines[doshaMap[dosha]] || routines.vata;
  }

  // Get dietary recommendations based on dosha
  getDietaryRecommendations(dosha) {
    const diets = {
      vata: {
        favor: ['Warm foods', 'Cooked vegetables', 'Healthy fats', 'Sweet fruits'],
        avoid: ['Cold foods', 'Raw vegetables', 'Dry snacks', 'Carbonated drinks'],
        tastes: ['Sweet', 'Sour', 'Salty'],
        reduce: ['Pungent', 'Bitter', 'Astringent'],
        examples: ['Warm oatmeal', 'Stewed vegetables', 'Warm milk with spices'],
      },
      pitta: {
        favor: ['Cool foods', 'Fresh fruits', 'Leafy greens', 'Coconut'],
        avoid: ['Spicy foods', 'Fermented foods', 'Caffeine', 'Alcohol'],
        tastes: ['Sweet', 'Bitter', 'Astringent'],
        reduce: ['Pungent', 'Sour', 'Salty'],
        examples: ['Salads', 'Coconut water', 'Cool smoothies'],
      },
      kapha: {
        favor: ['Light foods', 'Steamed vegetables', 'Legumes', 'Honey'],
        avoid: ['Heavy foods', 'Dairy', 'Fried foods', 'Sweets'],
        tastes: ['Pungent', 'Bitter', 'Astringent'],
        reduce: ['Sweet', 'Sour', 'Salty'],
        examples: ['Quinoa', 'Steamed greens', 'Ginger tea'],
      },
    };

    const doshaMap = {
      vata: 'vata',
      pitta: 'pitta',
      kapha: 'kapha',
      'vata-pitta': 'vata',
      'pitta-kapha': 'pitta',
      'vata-kapha': 'vata',
      tridosha: 'vata',
    };

    return diets[doshaMap[dosha]] || diets.vata;
  }

  // Check for dosha imbalance
  checkImbalance(current, baseline, threshold = 15) {
    const imbalances = [];

    if (Math.abs(current.vata - baseline.vata) > threshold) {
      imbalances.push({
        dosha: 'vata',
        change: current.vata - baseline.vata,
        severity: Math.abs(current.vata - baseline.vata) > 25 ? 'high' : 'medium',
      });
    }

    if (Math.abs(current.pitta - baseline.pitta) > threshold) {
      imbalances.push({
        dosha: 'pitta',
        change: current.pitta - baseline.pitta,
        severity: Math.abs(current.pitta - baseline.pitta) > 25 ? 'high' : 'medium',
      });
    }

    if (Math.abs(current.kapha - baseline.kapha) > threshold) {
      imbalances.push({
        dosha: 'kapha',
        change: current.kapha - baseline.kapha,
        severity: Math.abs(current.kapha - baseline.kapha) > 25 ? 'high' : 'medium',
      });
    }

    return imbalances;
  }

  // Get balancing recommendations for imbalance
  getBalancingRecommendations(imbalance) {
    const recommendations = {
      vata: {
        increase: ['Warmth', 'Routine', 'Grounding foods', 'Oil massage'],
        decrease: ['Cold', 'Irregularity', 'Dryness', 'Overstimulation'],
        foods: ['Warm soups', 'Cooked vegetables', 'Healthy fats'],
        activities: ['Yoga', 'Meditation', 'Warm baths'],
      },
      pitta: {
        increase: ['Coolness', 'Moderation', 'Sweet tastes', 'Time in nature'],
        decrease: ['Heat', 'Spicy foods', 'Competition', 'Overwork'],
        foods: ['Cool salads', 'Sweet fruits', 'Coconut'],
        activities: ['Swimming', 'Moon walks', 'Cooling pranayama'],
      },
      kapha: {
        increase: ['Activity', 'Variety', 'Light foods', 'Warmth'],
        decrease: ['Inactivity', 'Heavy foods', 'Sleep', 'Attachment'],
        foods: ['Light soups', 'Steamed vegetables', 'Spices'],
        activities: ['Vigorous exercise', 'Early rising', 'Dry brushing'],
      },
    };

    return recommendations[imbalance.dosha] || recommendations.vata;
  }
}

export default new DoshaCalculatorService();