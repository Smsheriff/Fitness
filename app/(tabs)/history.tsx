import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import Colors from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { fetchWeeklyActivity } from '@/services/fitnessApi';
import { Calendar, ChartBar as BarChart2 } from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;

export default function HistoryScreen() {
  const { actualTheme } = useTheme();
  const theme = actualTheme === 'dark' ? Colors.dark : Colors.light;
  
  const [weeklyData, setWeeklyData] = useState({
    dates: ['', '', '', '', '', '', ''],
    steps: [0, 0, 0, 0, 0, 0, 0],
    calories: [0, 0, 0, 0, 0, 0, 0],
    activeMinutes: [0, 0, 0, 0, 0, 0, 0],
  });
  
  const [activeTab, setActiveTab] = useState('steps');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchWeeklyActivity();
        setWeeklyData(data);
      } catch (error) {
        console.error('Failed to load weekly activity data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const getChartData = () => {
    let data;
    let color;
    let label;
    
    switch (activeTab) {
      case 'steps':
        data = weeklyData.steps;
        color = theme.blue;
        label = 'Steps';
        break;
      case 'calories':
        data = weeklyData.calories;
        color = theme.orange;
        label = 'Calories';
        break;
      case 'minutes':
        data = weeklyData.activeMinutes;
        color = theme.green;
        label = 'Minutes';
        break;
      default:
        data = weeklyData.steps;
        color = theme.blue;
        label = 'Steps';
    }
    
    return {
      labels: weeklyData.dates,
      datasets: [
        {
          data,
          color: () => color,
          strokeWidth: 2,
        },
      ],
      legend: [label],
    };
  };

  const renderTabs = () => {
    return (
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'steps' && { backgroundColor: theme.blue },
          ]}
          onPress={() => setActiveTab('steps')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'steps' ? 'white' : theme.text },
            ]}
          >
            Steps
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'calories' && { backgroundColor: theme.orange },
          ]}
          onPress={() => setActiveTab('calories')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'calories' ? 'white' : theme.text },
            ]}
          >
            Calories
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'minutes' && { backgroundColor: theme.green },
          ]}
          onPress={() => setActiveTab('minutes')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'minutes' ? 'white' : theme.text },
            ]}
          >
            Minutes
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const chartConfig = {
    backgroundGradientFrom: theme.background,
    backgroundGradientTo: theme.background,
    decimalPlaces: 0,
    color: (opacity = 1) => {
      if (activeTab === 'steps') return `rgba(53, 120, 229, ${opacity})`;
      if (activeTab === 'calories') return `rgba(255, 149, 0, ${opacity})`;
      return `rgba(76, 217, 100, ${opacity})`;
    },
    labelColor: () => theme.text,
    propsForDots: {
      r: '6',
      strokeWidth: '2',
    },
    propsForBackgroundLines: {
      stroke: theme.border,
    },
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Activity History</Text>
        <Text style={[styles.subtitle, { color: theme.gray }]}>
          <Calendar size={16} color={theme.gray} /> Last 7 days
        </Text>
      </View>
      
      {renderTabs()}
      
      <View style={styles.chartContainer}>
        <LineChart
          data={getChartData()}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>
      
      <View style={styles.statsContainer}>
        <Text style={[styles.statsTitle, { color: theme.text }]}>
          <BarChart2 size={20} color={theme.text} /> Weekly Stats
        </Text>
        
        <View style={[styles.statsCard, { backgroundColor: theme.card }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: theme.gray }]}>Avg. Steps</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>
              {Math.round(
                weeklyData.steps.reduce((a, b) => a + b, 0) / weeklyData.steps.length
              ).toLocaleString()}
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: theme.gray }]}>Avg. Calories</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>
              {Math.round(
                weeklyData.calories.reduce((a, b) => a + b, 0) / weeklyData.calories.length
              )}
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: theme.gray }]}>Avg. Active Minutes</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>
              {Math.round(
                weeklyData.activeMinutes.reduce((a, b) => a + b, 0) / weeklyData.activeMinutes.length
              )}
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: theme.gray }]}>Total Steps</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>
              {weeklyData.steps.reduce((a, b) => a + b, 0).toLocaleString()}
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: theme.gray }]}>Total Calories</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>
              {weeklyData.calories.reduce((a, b) => a + b, 0).toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  chartContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  chart: {
    borderRadius: 16,
    paddingRight: 16,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  statsCard: {
    padding: 16,
    borderRadius: 16,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.1)',
  },
  statLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
});