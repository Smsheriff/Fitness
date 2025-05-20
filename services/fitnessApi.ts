import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock data for daily activity
const mockDailyActivity = {
  steps: 7532,
  calories: 324,
  activeMinutes: 45,
  distanceKm: 5.8,
  stepsGoal: 10000,
  caloriesGoal: 500,
  activeMinutesGoal: 60,
};

// Mock data for weekly activity
const mockWeeklyActivity = {
  dates: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  steps: [8234, 7532, 10234, 9532, 6234, 8532, 12234],
  calories: [350, 324, 420, 380, 290, 345, 450],
  activeMinutes: [50, 45, 65, 55, 40, 48, 75],
};

// Mock user profile
const mockUserProfile = {
  name: 'John Doe',
  age: 32,
  weight: 75.5,
  height: 178,
  gender: 'Male',
  stepsGoal: 10000,
  caloriesGoal: 500,
  activeMinutesGoal: 60,
};

// Function to simulate API fetch with delay
const simulateApiCall = <T>(data: T, delay = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

// Generate realistic step data that changes throughout the day
export const fetchDailyActivity = async (): Promise<typeof mockDailyActivity> => {
  try {
    // Check if we have stored goals
    const storedGoals = await AsyncStorage.getItem('fitness_goals');
    const goals = storedGoals ? JSON.parse(storedGoals) : {
      stepsGoal: 10000,
      caloriesGoal: 500,
      activeMinutesGoal: 60,
    };
    
    // Get the current hour to make steps increase throughout the day
    const currentHour = new Date().getHours();
    
    // Base steps plus progress based on time of day (more steps as day progresses)
    // Morning (6-12): 20-40% of daily steps
    // Afternoon (12-18): 40-70% of daily steps
    // Evening (18-22): 70-90% of daily steps
    // Night (22-6): 90-100% of daily steps
    
    let progressPercentage = 0;
    
    if (currentHour >= 6 && currentHour < 12) {
      // Morning
      progressPercentage = 0.2 + ((currentHour - 6) / 6) * 0.2;
    } else if (currentHour >= 12 && currentHour < 18) {
      // Afternoon
      progressPercentage = 0.4 + ((currentHour - 12) / 6) * 0.3;
    } else if (currentHour >= 18 && currentHour < 22) {
      // Evening
      progressPercentage = 0.7 + ((currentHour - 18) / 4) * 0.2;
    } else {
      // Night (22-6)
      progressPercentage = 0.9;
    }
    
    // Add some randomness to the steps
    const randomFactor = 0.9 + Math.random() * 0.2; // Between 0.9 and 1.1
    const steps = Math.round(goals.stepsGoal * progressPercentage * randomFactor);
    
    // Calculate calories based on steps (approximately 0.04 calories per step)
    const calories = Math.round(steps * 0.04);
    
    // Calculate active minutes (approximately 1 active minute per 200 steps)
    const activeMinutes = Math.round(steps / 200);
    
    // Calculate distance (approximately 0.0008 km per step)
    const distanceKm = parseFloat((steps * 0.0008).toFixed(1));
    
    return simulateApiCall({
      steps,
      calories,
      activeMinutes,
      distanceKm,
      stepsGoal: goals.stepsGoal,
      caloriesGoal: goals.caloriesGoal,
      activeMinutesGoal: goals.activeMinutesGoal,
    });
  } catch (error) {
    console.error('Error fetching daily activity:', error);
    return mockDailyActivity;
  }
};

// Fetch weekly activity
export const fetchWeeklyActivity = async (): Promise<typeof mockWeeklyActivity> => {
  try {
    // Get the last 7 days
    const dates = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      dates.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
    }
    
    // Generate realistic data for each day
    const steps = [];
    const calories = [];
    const activeMinutes = [];
    
    for (let i = 0; i < 7; i++) {
      // Base steps with some random variation
      const baseSteps = 8000 + Math.round(Math.random() * 4000);
      
      // Weekend boost (Saturday and Sunday)
      const isWeekend = i >= 5;
      const weekendBoost = isWeekend ? 1.2 : 1;
      
      const daySteps = Math.round(baseSteps * weekendBoost);
      const dayCalories = Math.round(daySteps * 0.04);
      const dayActiveMinutes = Math.round(daySteps / 200);
      
      steps.push(daySteps);
      calories.push(dayCalories);
      activeMinutes.push(dayActiveMinutes);
    }
    
    return simulateApiCall({
      dates,
      steps,
      calories,
      activeMinutes,
    });
  } catch (error) {
    console.error('Error fetching weekly activity:', error);
    return mockWeeklyActivity;
  }
};

// Fetch user profile
export const fetchUserProfile = async (): Promise<typeof mockUserProfile> => {
  try {
    // Check if we have a stored profile
    const storedProfile = await AsyncStorage.getItem('user_profile');
    if (storedProfile) {
      return simulateApiCall(JSON.parse(storedProfile));
    }
    
    // Save the mock profile if none exists
    await AsyncStorage.setItem('user_profile', JSON.stringify(mockUserProfile));
    await AsyncStorage.setItem('fitness_goals', JSON.stringify({
      stepsGoal: mockUserProfile.stepsGoal,
      caloriesGoal: mockUserProfile.caloriesGoal,
      activeMinutesGoal: mockUserProfile.activeMinutesGoal,
    }));
    
    return simulateApiCall(mockUserProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return mockUserProfile;
  }
};

// Update user profile
export const updateUserProfile = async (profile: typeof mockUserProfile): Promise<void> => {
  try {
    // Save profile
    await AsyncStorage.setItem('user_profile', JSON.stringify(profile));
    
    // Update fitness goals separately
    await AsyncStorage.setItem('fitness_goals', JSON.stringify({
      stepsGoal: profile.stepsGoal,
      caloriesGoal: profile.caloriesGoal,
      activeMinutesGoal: profile.activeMinutesGoal,
    }));
    
    await simulateApiCall(null);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update profile');
  }
};