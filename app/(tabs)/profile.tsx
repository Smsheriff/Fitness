import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Switch,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import Colors from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { fetchUserProfile, updateUserProfile } from '@/services/fitnessApi';
import { Save, Moon, Sun, User, Target } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const { theme, actualTheme, setTheme } = useTheme();
  const colors = actualTheme === 'dark' ? Colors.dark : Colors.light;
  
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    gender: '',
    stepsGoal: '',
    caloriesGoal: '',
    activeMinutesGoal: '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await fetchUserProfile();
        setProfile({
          ...data,
          age: data.age.toString(),
          weight: data.weight.toString(),
          height: data.height.toString(),
          stepsGoal: data.stepsGoal.toString(),
          caloriesGoal: data.caloriesGoal.toString(),
          activeMinutesGoal: data.activeMinutesGoal.toString(),
        });
      } catch (error) {
        console.error('Failed to load profile data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      // Validate fields
      if (!profile.name.trim()) {
        Alert.alert('Error', 'Name cannot be empty');
        return;
      }
      
      const age = parseInt(profile.age);
      if (isNaN(age) || age <= 0 || age > 120) {
        Alert.alert('Error', 'Please enter a valid age (1-120)');
        return;
      }
      
      const weight = parseFloat(profile.weight);
      if (isNaN(weight) || weight <= 0) {
        Alert.alert('Error', 'Please enter a valid weight');
        return;
      }
      
      const height = parseFloat(profile.height);
      if (isNaN(height) || height <= 0) {
        Alert.alert('Error', 'Please enter a valid height');
        return;
      }
      
      const stepsGoal = parseInt(profile.stepsGoal);
      if (isNaN(stepsGoal) || stepsGoal <= 0) {
        Alert.alert('Error', 'Please enter a valid steps goal');
        return;
      }
      
      // Update profile
      await updateUserProfile({
        ...profile,
        age: parseInt(profile.age),
        weight: parseFloat(profile.weight),
        height: parseFloat(profile.height),
        stepsGoal: parseInt(profile.stepsGoal),
        caloriesGoal: parseInt(profile.caloriesGoal),
        activeMinutesGoal: parseInt(profile.activeMinutesGoal),
      });
      
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const renderField = (label, value, key, keyboardType = 'default') => {
    return (
      <View style={styles.fieldContainer}>
        <Text style={[styles.fieldLabel, { color: colors.gray }]}>{label}</Text>
        {isEditing ? (
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: colors.card,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            value={value}
            onChangeText={(text) => setProfile({ ...profile, [key]: text })}
            keyboardType={keyboardType}
          />
        ) : (
          <Text style={[styles.fieldValue, { color: colors.text }]}>{value}</Text>
        )}
      </View>
    );
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleSystemTheme = () => {
    setTheme(theme === 'system' ? (actualTheme === 'dark' ? 'dark' : 'light') : 'system');
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
          <TouchableOpacity
            style={[
              styles.editButton,
              { backgroundColor: isEditing ? colors.green : colors.blue },
            ]}
            onPress={isEditing ? handleSave : () => setIsEditing(true)}
          >
            <Text style={styles.editButtonText}>
              {isEditing ? 'Save' : 'Edit'}
            </Text>
            {isEditing && <Save size={16} color="white" style={{ marginLeft: 4 }} />}
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.cardHeader}>
          <User size={20} color={colors.blue} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>Personal Information</Text>
        </View>
        
        {renderField('Name', profile.name, 'name')}
        {renderField('Age', profile.age, 'age', 'numeric')}
        {renderField('Weight (kg)', profile.weight, 'weight', 'decimal-pad')}
        {renderField('Height (cm)', profile.height, 'height', 'decimal-pad')}
        {renderField('Gender', profile.gender, 'gender')}
      </View>
      
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.cardHeader}>
          <Target size={20} color={colors.green} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>Fitness Goals</Text>
        </View>
        
        {renderField('Daily Steps', profile.stepsGoal, 'stepsGoal', 'numeric')}
        {renderField('Daily Calories (kcal)', profile.caloriesGoal, 'caloriesGoal', 'numeric')}
        {renderField('Active Minutes', profile.activeMinutesGoal, 'activeMinutesGoal', 'numeric')}
      </View>
      
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.cardHeader}>
          {theme === 'dark' ? (
            <Moon size={20} color={colors.purple} />
          ) : (
            <Sun size={20} color={colors.yellow} />
          )}
          <Text style={[styles.cardTitle, { color: colors.text }]}>Appearance</Text>
        </View>
        
        <View style={styles.themeContainer}>
          <Text style={[styles.themeText, { color: colors.text }]}>Dark Mode</Text>
          <Switch
            value={actualTheme === 'dark'}
            onValueChange={toggleTheme}
            thumbColor={Platform.OS === 'android' ? (actualTheme === 'dark' ? colors.purple : colors.gray) : ''}
            trackColor={{ false: '#767577', true: '#9d7cc8' }}
          />
        </View>
        
        <View style={styles.themeContainer}>
          <Text style={[styles.themeText, { color: colors.text }]}>Use System Settings</Text>
          <Switch
            value={theme === 'system'}
            onValueChange={toggleSystemTheme}
            thumbColor={Platform.OS === 'android' ? (theme === 'system' ? colors.blue : colors.gray) : ''}
            trackColor={{ false: '#767577', true: '#81adef' }}
          />
        </View>
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
  },
  editButton: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginLeft: 8,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  themeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  themeText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
});