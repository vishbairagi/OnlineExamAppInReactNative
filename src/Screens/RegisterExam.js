import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, ScrollView } from 'react-native';

const API_URL = 'http://10.0.2.2:5000';
const EXAM_DURATION_MINUTES = 30;

const RegisterExam = ({ navigation, route }) => {
  console.log("Received username from route params:", route.params);
  const { username } = route.params || {};

if (!username) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: 'red' }}>⚠️ Username not passed. Please login again.</Text>
    </View>
  );
}

  const [examUsers, setExamUsers] = useState([]);
  const [registered, setRegistered] = useState(false);


  useEffect(() => {
    fetchExamUsers();
  }, []);

  const fetchExamUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/exam/registered-users`);
      const json = await res.json();
      if (json.success) {
        setExamUsers(json.users);
        setRegistered(json.users.some(u => u.username === username));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegister = async () => {
    try {
      const res = await fetch(`${API_URL}/exam/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();
      if (data.success) {
        Alert.alert('Success', data.message);
        fetchExamUsers();
      } else {
        Alert.alert('Failed', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not register for exam');
    }
  };

  const handleStartExam = () => {
    navigation.navigate('ExamInstruction', {
      username,
      startTime: new Date().toISOString(),
      duration: EXAM_DURATION_MINUTES,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>📋 Exam Registration</Text>

        <View style={styles.section}>
          <Text style={styles.heading}>Instructions:</Text>
          <Text style={styles.text}>• Register once to attempt the exam.</Text>
          <Text style={styles.text}>• The exam duration is {EXAM_DURATION_MINUTES} minutes.</Text>
        </View>

        <TouchableOpacity
          style={[styles.registerButton, registered && styles.disabledButton]}
          onPress={handleRegister}
          disabled={registered}
        >
          <Text style={styles.registerText}>
            {registered ? 'Already Registered' : 'Register for Exam'}
          </Text>
        </TouchableOpacity>

        {registered && (
          <TouchableOpacity style={styles.startButton} onPress={handleStartExam}>
            <Text style={styles.registerText}>🚀 Start Exam</Text>
          </TouchableOpacity>
        )}

        <View style={styles.section}>
          <Text style={styles.heading}>Exam Registered Users:</Text>
          {examUsers.length === 0 ? (
            <Text style={styles.text}>No one has registered yet.</Text>
          ) : (
            <FlatList
              data={examUsers}
              keyExtractor={(item) => item.username}
              renderItem={({ item }) => (
                <View style={styles.userItem}>
                  <Text style={styles.userText}>👤 {item.username}</Text>
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default RegisterExam;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  content: { padding: 20 },
  title: {
    fontSize: 24, fontWeight: 'bold', color: '#1e3a8a',
    marginBottom: 20, textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff', borderRadius: 8,
    padding: 15, marginBottom: 20,
    borderLeftWidth: 4, borderLeftColor: '#3b82f6',
  },
  heading: { fontSize: 18, fontWeight: '600', marginBottom: 10, color: '#111827' },
  text: { fontSize: 14, color: '#374151', marginBottom: 5 },
  registerButton: {
    backgroundColor: '#1e40af',
    paddingVertical: 14, alignItems: 'center', borderRadius: 8, marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#059669',
    paddingVertical: 14, alignItems: 'center', borderRadius: 8, marginBottom: 20,
  },
  disabledButton: { backgroundColor: '#9ca3af' },
  registerText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  userItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  userText: { fontSize: 14, color: '#1f2937' },
});
