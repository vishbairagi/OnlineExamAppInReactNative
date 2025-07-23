import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import React from 'react';

const ExamInstructionScreen = ({ navigation }) => {
  const handleStartExam = () => {
    navigation.replace('Question', { name: 'Candidate Name' }); // Replace with real name if needed
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>📝 Exam Instructions</Text>

        <View style={styles.section}>
          <Text style={styles.heading}>General Guidelines:</Text>
          <Text style={styles.text}>• Total Time: 10 minutes</Text>
          <Text style={styles.text}>• Number of Questions: 30</Text>
          <Text style={styles.text}>• Types: Single Choice & Multiple Choice</Text>
          <Text style={styles.text}>• No negative marking</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Instructions:</Text>
          <Text style={styles.text}>1. Read each question carefully before answering.</Text>
          <Text style={styles.text}>2. You can move between questions using the navigation buttons.</Text>
          <Text style={styles.text}>3. Once the time is up, the exam will auto-submit.</Text>
          <Text style={styles.text}>4. You can clear your response for any question.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.warning}>
            ⚠ Once you start the exam, the timer will begin and cannot be paused.
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.startButton} onPress={handleStartExam}>
        <Text style={styles.startButtonText}>Start Exam</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ExamInstructionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#111827',
  },
  text: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 5,
    lineHeight: 20,
  },
  warning: {
    fontSize: 14,
    color: '#b91c1c',
    fontStyle: 'italic',
  },
  startButton: {
    backgroundColor: '#1e40af',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 8,
    margin: 20,
    elevation: 3,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
