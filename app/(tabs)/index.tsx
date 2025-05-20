import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { fetchDailyActivity } from '@/services/fitnessApi';
import ActivityRing from '@/components/ActivityRing';
import ActivityCard from '@/components/ActivityCard';
import { Calendar, Clock, Flame, Footprints as FootprintsIcon } from 'lucide-react-native';

export default function HomeScreen() {
  const { actualTheme } = useTheme();
  const theme = actualTheme === 'dark' ? Colors.dark : Colors.light;
  
  const [activityData, setActivityData] = useState({
    steps: 0,
    calories: 0,
    activeMinutes: 0,
    distanceKm: 0,
    stepsGoal: 10000,
    caloriesGoal: 500,
    activeMinutesGoal: 60,
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchDailyActivity();
        setActivityData(data);
      } catch (error) {
        console.error('Failed to load activity data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    
    // Refresh data every minute
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const stepsProgress = (activityData.steps / activityData.stepsGoal) * 100;
  const caloriesProgress = (activityData.calories / activityData.caloriesGoal) * 100;
  const activeMinutesProgress = (activityData.activeMinutes / activityData.activeMinutesGoal) * 100;

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Daily Activity</Text>
        <Text style={[styles.date, { color: theme.gray }]}>
          <Calendar size={16} color={theme.gray} /> {formattedDate}
        </Text>
      </View>
      
      <View style={styles.ringContainer}>
        <ActivityRing 
          progress={stepsProgress > 100 ? 100 : stepsProgress} 
          size={200}
          strokeWidth={20}
          color={theme.blue}
        />
        <View style={styles.ringContent}>
          <Text style={[styles.stepsCount, { color: theme.text }]}>
            {activityData.steps.toLocaleString()}
          </Text>
          <Text style={[styles.stepsLabel, { color: theme.gray }]}>steps</Text>
          <Text style={[styles.stepsGoal, { color: theme.gray }]}>
            Goal: {activityData.stepsGoal.toLocaleString()}
          </Text>
        </View>
      </View>
      
      <View style={styles.cardsContainer}>
        <ActivityCard 
          icon={<Flame size={24} color={theme.orange} />}
          title="Calories"
          value={activityData.calories}
          unit="kcal"
          goal={activityData.caloriesGoal}
          progress={caloriesProgress}
          color={theme.orange}
          theme={theme}
        />
        <ActivityCard 
          icon={<Clock size={24} color={theme.green} />}
          title="Active Minutes"
          value={activityData.activeMinutes}
          unit="min"
          goal={activityData.activeMinutesGoal}
          progress={activeMinutesProgress}
          color={theme.green}
          theme={theme}
        />
        <ActivityCard 
          icon={<FootprintsIcon size={24} color={theme.purple} />}
          title="Distance"
          value={activityData.distanceKm}
          unit="km"
          theme={theme}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  ringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
    position: 'relative',
  },
  ringContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepsCount: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
  },
  stepsLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  stepsGoal: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  cardsContainer: {
    marginTop: 24,
    gap: 16,
  },
});