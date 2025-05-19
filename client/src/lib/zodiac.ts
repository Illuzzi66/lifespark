import { ZodiacInfo } from '@/types';

interface ZodiacSign {
  name: string;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
  traits: string[];
  motivation: string;
}

// Define zodiac signs with their date ranges, traits, and motivational messages
export const zodiacSigns: ZodiacSign[] = [
  {
    name: 'Aries',
    startMonth: 3,
    startDay: 21,
    endMonth: 4,
    endDay: 19,
    traits: ['Confident', 'Determined', 'Passionate', 'Energetic'],
    motivation: 'Your energy and drive can move mountains today. Channel it wisely!'
  },
  {
    name: 'Taurus',
    startMonth: 4,
    startDay: 20,
    endMonth: 5,
    endDay: 20,
    traits: ['Reliable', 'Patient', 'Practical', 'Devoted'],
    motivation: 'Your persistence will pay off today. Stay grounded and focused.'
  },
  {
    name: 'Gemini',
    startMonth: 5,
    startDay: 21,
    endMonth: 6,
    endDay: 20,
    traits: ['Adaptable', 'Curious', 'Communicative', 'Quick-witted'],
    motivation: 'Your versatility is your superpower. Embrace new ideas today!'
  },
  {
    name: 'Cancer',
    startMonth: 6,
    startDay: 21,
    endMonth: 7,
    endDay: 22,
    traits: ['Intuitive', 'Emotional', 'Protective', 'Nurturing'],
    motivation: 'Your compassion touches others deeply. Lead with your heart today.'
  },
  {
    name: 'Leo',
    startMonth: 7,
    startDay: 23,
    endMonth: 8,
    endDay: 22,
    traits: ['Creative', 'Passionate', 'Generous', 'Warm-hearted'],
    motivation: 'Your creative energy is at its peak today. Use it to inspire others!'
  },
  {
    name: 'Virgo',
    startMonth: 8,
    startDay: 23,
    endMonth: 9,
    endDay: 22,
    traits: ['Analytical', 'Practical', 'Diligent', 'Detail-oriented'],
    motivation: 'Your attention to detail will solve a complex problem today.'
  },
  {
    name: 'Libra',
    startMonth: 9,
    startDay: 23,
    endMonth: 10,
    endDay: 22,
    traits: ['Diplomatic', 'Fair-minded', 'Social', 'Cooperative'],
    motivation: 'Your balance and harmony will create peace in chaotic situations today.'
  },
  {
    name: 'Scorpio',
    startMonth: 10,
    startDay: 23,
    endMonth: 11,
    endDay: 21,
    traits: ['Resourceful', 'Powerful', 'Passionate', 'Determined'],
    motivation: 'Your intensity is your strength. Use it to transform challenges into victories.'
  },
  {
    name: 'Sagittarius',
    startMonth: 11,
    startDay: 22,
    endMonth: 12,
    endDay: 21,
    traits: ['Optimistic', 'Adventurous', 'Enthusiastic', 'Open-minded'],
    motivation: 'Your optimism will open new doors today. Keep exploring!'
  },
  {
    name: 'Capricorn',
    startMonth: 12,
    startDay: 22,
    endMonth: 1,
    endDay: 19,
    traits: ['Responsible', 'Disciplined', 'Self-controlled', 'Independent'],
    motivation: 'Your discipline and hard work are building something lasting. Keep going!'
  },
  {
    name: 'Aquarius',
    startMonth: 1,
    startDay: 20,
    endMonth: 2,
    endDay: 18,
    traits: ['Progressive', 'Original', 'Independent', 'Humanitarian'],
    motivation: 'Your innovative thinking will solve a problem others can\'t see today.'
  },
  {
    name: 'Pisces',
    startMonth: 2,
    startDay: 19,
    endMonth: 3,
    endDay: 20,
    traits: ['Compassionate', 'Artistic', 'Intuitive', 'Gentle'],
    motivation: 'Your intuition is speaking clearly today. Listen to your inner wisdom.'
  }
];

// Determine zodiac sign based on month and day
export const getZodiacSign = (month: number, day: number): ZodiacSign | null => {
  const zodiacSign = zodiacSigns.find(sign => {
    // Handle cases where zodiac spans across year change (December to January)
    if (sign.startMonth > sign.endMonth) {
      return (month === sign.startMonth && day >= sign.startDay) || 
             (month === sign.endMonth && day <= sign.endDay) ||
             (month > sign.startMonth && month < 13) || 
             (month < sign.endMonth && month > 0);
    }
    
    // Handle normal cases
    return (month === sign.startMonth && day >= sign.startDay) || 
           (month === sign.endMonth && day <= sign.endDay) || 
           (month > sign.startMonth && month < sign.endMonth);
  });
  
  return zodiacSign || null;
};

// Fetch zodiac info from Zodiac API
export const fetchZodiacInfo = async (month: number, day: number): Promise<ZodiacInfo> => {
  try {
    // First try to get info from the external API
    const response = await fetch(`https://zodiacal.herokuapp.com/api/sign/${month}/${day}`);
    
    // If API is successful, use that data
    if (response.ok) {
      const data = await response.json();
      return {
        month,
        day,
        sign: data.name,
        traits: data.traits || [],
        motivation: data.motivation || 'Trust your instincts today!'
      };
    }
    
    // If API fails, fallback to our local implementation
    const signInfo = getZodiacSign(month, day);
    
    if (signInfo) {
      return {
        month,
        day,
        sign: signInfo.name,
        traits: signInfo.traits,
        motivation: signInfo.motivation
      };
    }
    
    throw new Error('Could not determine zodiac sign');
    
  } catch (error) {
    // In case of any API failure, use our local implementation
    const signInfo = getZodiacSign(month, day);
    
    if (signInfo) {
      return {
        month,
        day,
        sign: signInfo.name,
        traits: signInfo.traits,
        motivation: signInfo.motivation
      };
    }
    
    // If everything fails, return basic info without sign details
    return { month, day };
  }
};
