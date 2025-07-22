import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
import questions from '../questions.json';

const TOTAL_TIME = 300; // 5 minutes in seconds
const { width } = Dimensions.get('window');

const QuestionScreen = ({ navigation, route }) => {
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const { name } = route.params || {};

  // Initialize shuffled questions on component mount
  useEffect(() => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
  }, []);

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSelect = (qId, optIdx, type) => {
    setAnswers((prev) => {
      if (type === 'single') {
        return { ...prev, [qId]: optIdx };
      } else {
        const current = prev[qId] || [];
        const updated = current.includes(optIdx)
          ? current.filter((i) => i !== optIdx)
          : [...current, optIdx];
        return { ...prev, [qId]: updated };
      }
    });
  };

  const handleAutoSubmit = () => {
    Alert.alert(
      'Time Up!',
      'The examination time has ended. Your answers will be submitted automatically.',
      [{ text: 'OK', onPress: () => submitExam() }],
      { cancelable: false }
    );
  };

  const handleSubmit = () => {
    const answeredCount = Object.keys(answers).length;
    const totalQuestions = shuffledQuestions.length;

    Alert.alert(
      'Submit Examination',
      `You have answered ${answeredCount} out of ${totalQuestions} questions.\n\nAre you sure you want to submit your examination? This action cannot be undone.`,
      [
        { text: 'Review Answers', style: 'cancel' },
        { text: 'Submit', style: 'destructive', onPress: submitExam }
      ]
    );
  };

  const submitExam = () => {
    setIsSubmitting(true);
    
    let score = 0;
    shuffledQuestions.forEach((q) => {
      const userAns = answers[q.id];
      if (q.type === 'single' && userAns === q.answer) {
        score++;
      } else if (
        q.type === 'multi' &&
        Array.isArray(userAns) &&
        JSON.stringify(userAns.sort()) === JSON.stringify(q.answer.sort())
      ) {
        score++;
      }
    });

    // Simulate submission delay
    setTimeout(() => {
      navigation.replace('Home', {
        score,
        total: shuffledQuestions.length,
        name,
      });
    }, 1500);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft <= 60) return '#d32f2f'; // Red for last minute
    if (timeLeft <= 120) return '#ff9800'; // Orange for last 2 minutes
    return '#2e7d32'; // Green for normal time
  };

  // Check if current question is answered
  const isCurrentQuestionAnswered = () => {
    if (!currentQuestion) return false;
    return answers[currentQuestion.id] !== undefined;
  };

  if (isSubmitting) {
    return (
      <View style={styles.submittingContainer}>
        <Text style={styles.submittingText}>Submitting your examination...</Text>
        <Text style={styles.submittingSubtext}>Please wait while we process your answers</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.examTitle}>Online Examination System</Text>
          <Text style={styles.candidateName}>Candidate: {name}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.timerLabel}>Time Remaining</Text>
          <Text style={[styles.timer, { color: getTimeColor() }]}>
            {formatTime(timeLeft)}
          </Text>
        </View>
      </View>

      <View style={styles.mainContent}>
        {/* Question Section - Now Full Width */}
        <View style={styles.questionSection}>
          <View style={styles.questionHeader}>
            <Text style={styles.questionCounter}>
              Question {currentQuestionIndex + 1} of {shuffledQuestions.length}
            </Text>
            <Text style={styles.questionType}>
              {currentQuestion?.type === 'single' ? 'Single Choice' : 'Multiple Choice'}
            </Text>
            <View style={[styles.answerStatus, isCurrentQuestionAnswered() && styles.answeredStatus]}>
              <Text style={[styles.answerStatusText, isCurrentQuestionAnswered() && styles.answeredStatusText]}>
                {isCurrentQuestionAnswered() ? '✓ Answered' : '○ Not Answered'}
              </Text>
            </View>
          </View>

          <ScrollView style={styles.questionContent} showsVerticalScrollIndicator={false}>
            {currentQuestion && (
              <>
                <Text style={styles.questionText}>
                  {currentQuestion.question}
                </Text>

                <View style={styles.optionsContainer}>
                  {currentQuestion.options.map((opt, idx) => {
                    const selected =
                      currentQuestion.type === 'single'
                        ? answers[currentQuestion.id] === idx
                        : (answers[currentQuestion.id] || []).includes(idx);

                    return (
                      <TouchableOpacity
                        key={idx}
                        style={[styles.optionButton, selected && styles.optionSelected]}
                        onPress={() =>
                          handleSelect(currentQuestion.id, idx, currentQuestion.type)
                        }
                      >
                        <View style={styles.optionContent}>
                          <View style={[
                            styles.radioCircle,
                            currentQuestion.type === 'multi' && styles.checkBox,
                            selected && styles.radioSelected
                          ]}>
                            {selected && (
                              <Text style={styles.radioCheck}>
                                {currentQuestion.type === 'single' ? '●' : '✓'}
                              </Text>
                            )}
                          </View>
                          <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                            {String.fromCharCode(65 + idx)}. {opt}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {currentQuestion.type === 'multi' && (
                  <Text style={styles.instruction}>
                    * Select all correct options
                  </Text>
                )}
              </>
            )}
          </ScrollView>

          {/* Navigation Buttons */}
          <View style={styles.navigationBar}>
            <TouchableOpacity
              disabled={currentQuestionIndex === 0}
              style={[
                styles.navButton,
                styles.previousButton,
                currentQuestionIndex === 0 && styles.disabledButton,
              ]}
              onPress={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
            >
              <Text style={[styles.navText, currentQuestionIndex === 0 && styles.disabledText]}>
                ← Previous
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navButton, styles.clearButton]}
              onPress={() => {
                if (currentQuestion) {
                  const newAnswers = { ...answers };
                  delete newAnswers[currentQuestion.id];
                  setAnswers(newAnswers);
                }
              }}
            >
              <Text style={styles.clearText}>Clear Response</Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={currentQuestionIndex === shuffledQuestions.length - 1}
              style={[
                styles.navButton,
                styles.nextButton,
                currentQuestionIndex === shuffledQuestions.length - 1 && styles.disabledButton,
              ]}
              onPress={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
            >
              <Text style={[styles.navText, currentQuestionIndex === shuffledQuestions.length - 1 && styles.disabledText]}>
                Next →
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Exam Progress</Text>
            <Text style={styles.progressStats}>
              {Object.keys(answers).length} of {shuffledQuestions.length} answered
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(Object.keys(answers).length / shuffledQuestions.length) * 100}%` }
              ]} 
            />
          </View>
        </View>
      </View>

      {/* Submit Button */}
      <View style={styles.submitSection}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit Examination</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 20,
    paddingVertical: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  examTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  candidateName: {
    color: '#bfdbfe',
    fontSize: 14,
    marginTop: 2,
  },
  timerLabel: {
    color: '#bfdbfe',
    fontSize: 12,
  },
  timer: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  mainContent: {
    flex: 1,
  },
  questionSection: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  questionCounter: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },
  questionType: {
    fontSize: 12,
    color: '#64748b',
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  answerStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  answeredStatus: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  answerStatusText: {
    fontSize: 10,
    color: '#dc2626',
    fontWeight: '600',
  },
  answeredStatusText: {
    color: '#16a34a',
  },
  questionContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  questionText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#1e293b',
    marginVertical: 20,
    fontWeight: '500',
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    marginBottom: 12,
    padding: 0,
  },
  optionSelected: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBox: {
    borderRadius: 4,
  },
  radioSelected: {
    borderColor: '#3b82f6',
    backgroundColor: '#3b82f6',
  },
  radioCheck: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
    lineHeight: 24,
  },
  optionTextSelected: {
    color: '#1e40af',
    fontWeight: '500',
  },
  instruction: {
    fontSize: 14,
    color: '#ef4444',
    fontStyle: 'italic',
    marginTop: 10,
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  navButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  previousButton: {
    backgroundColor: '#6b7280',
  },
  nextButton: {
    backgroundColor: '#6b7280',
  },
  clearButton: {
    backgroundColor: '#ef4444',
  },
  disabledButton: {
    backgroundColor: '#e5e7eb',
  },
  navText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  clearText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  disabledText: {
    color: '#9ca3af',
  },
  progressSection: {
    backgroundColor: '#f8fafc',
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  progressStats: {
    fontSize: 14,
    color: '#64748b',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
  submitSection: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  submitText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submittingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  submittingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  submittingSubtext: {
    fontSize: 14,
    color: '#64748b',
  },
  submittingSubtext: {
    fontSize: 14,
    color: '#64748b',
  },
});

export default QuestionScreen;