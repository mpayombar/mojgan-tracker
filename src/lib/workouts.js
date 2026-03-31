export const WORKOUT_DAYS = {
  Mon: {
    type: 'Lower body',
    color: 'sage',
    warmup: '5 min assault bike or jump rope · Rest 2 min between sets',
    exercises: [
      { name: 'Goblet squat', sets: '3 × 10', startLoad: '20 lb KB', note: 'Chest tall, squat to depth.' },
      { name: 'Romanian deadlift', sets: '3 × 10', startLoad: '45 lb BB', note: 'Hinge at hips, slow eccentric.' },
      { name: 'Walking lunges', sets: '3 × 10/leg', startLoad: '15 lb DBs', note: 'Step length = shin vertical.' },
      { name: 'Hip thrust', sets: '3 × 12', startLoad: '35 lb BB', note: '1s pause at top. Drive through heels.' },
      { name: 'Dead bug', sets: '3 × 10', startLoad: 'Bodyweight', note: 'Low back stays on floor.' },
      { name: 'Calf raises', sets: '3 × 15', startLoad: '25 lb DB', note: 'On a step, full ROM.' },
    ]
  },
  Wed: {
    type: 'Upper body',
    color: 'terracotta',
    warmup: 'Band pull-aparts × 15, arm circles · Rest 90s between sets',
    exercises: [
      { name: 'Barbell bench press', sets: '4 × 6', startLoad: '45 lb BB', note: 'Bar only week 1.' },
      { name: 'Incline DB row', sets: '3 × 10/side', startLoad: '20 lb DB', note: 'Full row, squeeze at top.' },
      { name: 'Overhead press', sets: '3 × 8', startLoad: '35 lb BB', note: 'Core tight throughout.' },
      { name: 'Band-assisted pull-ups', sets: '3 × 8', startLoad: 'Red/orange band', note: '3s slow eccentric.' },
      { name: "Farmer's carry", sets: '3 × 30m', startLoad: '25 lb each hand', note: 'Shoulders down and back.' },
      { name: 'Face pulls', sets: '3 × 15', startLoad: 'Band', note: 'Elbows high, pull to ears.' },
    ]
  },
  Fri: {
    type: 'Full body + power',
    color: 'stone',
    warmup: '5 min rower + hip circles · Rest 2–3 min on big lifts',
    exercises: [
      { name: 'Trap bar deadlift', sets: '4 × 5', startLoad: '65 lb BB', note: 'Neutral spine. Knee awareness.' },
      { name: 'Front squat', sets: '3 × 6', startLoad: '45 lb BB', note: 'Elbows high, upright torso.' },
      { name: 'Push press', sets: '3 × 6', startLoad: '35 lb BB', note: 'Slight leg drive. Land soft.' },
      { name: 'KB swing', sets: '4 × 15', startLoad: '25 lb KB', note: 'Hip-hinge drive. Glutes at top.' },
      { name: 'Renegade row', sets: '3 × 8/side', startLoad: '15 lb DBs', note: 'Brace hard. No hip rotation.' },
      { name: 'Pallof press', sets: '3 × 12/side', startLoad: 'Band', note: 'Hold 1s at full extension.' },
    ]
  }
}

export const WEEK_THEMES = [
  { week: 1, title: 'Just show up', note: 'Weights feel easy — intentional. Re-establish the habit above everything.' },
  { week: 2, title: 'Build consistency', note: 'Add 5 lbs to goblet squat and RDL only if last week felt solid.' },
  { week: 3, title: 'Add load', note: 'Add 5 lbs to each main lift. Note how it feels.' },
  { week: 4, title: 'Push reps', note: 'Hold week 3 weights, add 1–2 reps per set. Deload prep.' },
]

export const PROGRESSION_RULE = 'Add 5 lbs to main lifts every 2 weeks. That\'s it.'
