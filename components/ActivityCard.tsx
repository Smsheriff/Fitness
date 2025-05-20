import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ProgressBar from '@/components/ProgressBar';

interface ActivityCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  unit: string;
  goal?: number;
  progress?: number;
  color?: string;
  theme: any; // Colors theme object
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  icon,
  title,
  value,
  unit,
  goal,
  progress,
  color,
  theme,
}) => {
  return (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <View style={styles.header}>
        {icon}
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.value, { color: theme.text }]}>
          {value} <Text style={[styles.unit, { color: theme.gray }]}>{unit}</Text>
        </Text>
        {goal && (
          <Text style={[styles.goal, { color: theme.gray }]}>
            Goal: {goal} {unit}
          </Text>
        )}
      </View>
      
      {progress && (
        <View style={styles.progressContainer}>
          <ProgressBar progress={progress > 100 ? 100 : progress} color={color || theme.blue} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
  content: {
    marginBottom: 12,
  },
  value: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
  },
  unit: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  goal: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  progressContainer: {
    marginTop: 8,
  },
});

export default ActivityCard;