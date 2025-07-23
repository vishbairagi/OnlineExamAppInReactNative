import React, { useRef, useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated, Dimensions, ScrollView, StatusBar } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { useAuth } from './AuthContext';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation, route }) => {
  const { username, updateAuthData } = useAuth();
  const scaleHome = useRef(new Animated.Value(1)).current;
  const scaleQuestion = useRef(new Animated.Value(1)).current;
  const scoreCardScale = useRef(new Animated.Value(0)).current;
  const scoreCardOpacity = useRef(new Animated.Value(0)).current;
  const resultOpacity = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  const { score, total } = route.params || {};
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (score !== undefined) {
      // Animate score card entrance
      Animated.parallel([
        Animated.spring(scoreCardScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(scoreCardOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(resultOpacity, {
          toValue: 1,
          duration: 1200,
          delay: 400,
          useNativeDriver: true,
        }),
        Animated.timing(confettiAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [score]);

  const animateButton = (scaleRef, route,params) => {
    Animated.sequence([
      Animated.timing(scaleRef, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleRef, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      if (route) navigation.navigate(route,params);
    });
  };

  const getScoreColor = () => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return '#10b981'; // Excellent - Green
    if (percentage >= 70) return '#3b82f6'; // Good - Blue
    if (percentage >= 50) return '#f59e0b'; // Average - Orange
    return '#ef4444'; // Poor - Red
  };

  const getScoreGrade = () => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return 'GRADE: A+';
    if (percentage >= 80) return 'GRADE: A';
    if (percentage >= 70) return 'GRADE: B+';
    if (percentage >= 60) return 'GRADE: B';
    if (percentage >= 50) return 'GRADE: C+';
    return 'GRADE: C';
  };

  const getScoreStatus = () => {
    const percentage = (score / total) * 100;
    if (percentage >= 70) return 'PASSED';
    return 'FAILED';
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const renderConfetti = () => {
    const confettiElements = [];
    for (let i = 0; i < 20; i++) {
      const randomLeft = Math.random() * width;
      const animatedStyle = {
        opacity: confettiAnim,
        transform: [
          {
            translateY: confettiAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-50, height + 100],
            }),
          },
          {
            rotate: confettiAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '360deg'],
            }),
          },
        ],
        left: randomLeft,
      };

      confettiElements.push(
        <Animated.View key={i} style={[styles.confetti, animatedStyle]}>
          <Text style={styles.confettiText}>
            {['🎉', '🎊', '⭐', '🏆', '✨'][Math.floor(Math.random() * 5)]}
          </Text>
        </Animated.View>
      );
    }
    return confettiElements;
  };

  return (
    <>
      <StatusBar backgroundColor="#1e40af" barStyle="light-content" />
      <View style={styles.container}>
        {/* Confetti Animation */}
        {score !== undefined && score / total >= 0.7 && (
          <View style={styles.confettiContainer}>
            {renderConfetti()}
          </View>
        )}

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Examination Portal</Text>
          <Text style={styles.headerSubtitle}>Results & Dashboard </Text>
        </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {score !== undefined ? (
              <Animated.View
                style={[
                  styles.scoreCardContainer,
                  {
                    transform: [{ scale: scoreCardScale }],
                    opacity: scoreCardOpacity,
                  },
                ]}
              >
                {/* Official Score Card */}
                <View style={styles.scoreCard}>
                  {/* Header Section */}
                  <View style={styles.scoreCardHeader}>
                    <View style={styles.instituteLogo}>
                      <Text style={styles.logoText}>🎓</Text>
                    </View>
                    <View style={styles.instituteInfo}>
                      <Text style={styles.instituteName}>EXAMINATION BOARD</Text>
                      <Text style={styles.certificateTitle}>OFFICIAL SCORE CARD</Text>
                    </View>
                    <View style={styles.stampContainer}>
                      <Text style={styles.stampText}>VERIFIED</Text>
                    </View>
                  </View>

                  {/* Student Information */}
                  <View style={styles.studentInfo}>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Candidate Name:</Text>
                      <Text style={styles.infoValue}>{username || ''}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Examination Date:</Text>
                      <Text style={styles.infoValue}>{formatDate(currentTime)}</Text>
                    </View>
                   
                  </View>

                  {/* Score Display */}
                  <View style={styles.scoreDisplay}>
                    <View style={styles.scoreCircle}>
                      <Text style={[styles.scoreNumber, { color: getScoreColor() }]}>
                        {score}
                      </Text>
                      <Text style={styles.scoreDivider}>/</Text>
                      <Text style={styles.totalNumber}>{total}</Text>
                    </View>
                    
                    <View style={styles.scoreDetails}>
                      <View style={[styles.gradeContainer, { backgroundColor: getScoreColor() }]}>
                        <Text style={styles.gradeText}>{getScoreGrade()}</Text>
                      </View>
                      <Text style={styles.percentageText}>
                        {Math.round((score / total) * 100)}%
                      </Text>
                    </View>
                  </View>

                  {/* Status Banner */}
                  <View style={[styles.statusBanner, { backgroundColor: getScoreColor() }]}>
                    <Text style={styles.statusText}>{getScoreStatus()}</Text>
                    <Text style={styles.statusIcon}>
                      {getScoreStatus() === 'PASSED' ? '🏆' : '📝'}
                    </Text>
                  </View>

                  {/* Performance Breakdown */}
                  <View style={styles.performanceSection}>
                    <Text style={styles.performanceTitle}>Performance Analysis</Text>
                    <View style={styles.statsGrid}>
                      <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{score}</Text>
                        <Text style={styles.statLabel}>Correct</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{total - score}</Text>
                        <Text style={styles.statLabel}>Incorrect</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{Math.round((score / total) * 100)}%</Text>
                        <Text style={styles.statLabel}>Accuracy</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statNumber}>10:00</Text>
                        <Text style={styles.statLabel}>Duration</Text>
                      </View>
                    </View>
                  </View>

                  {/* Footer */}
                  <View style={styles.certificateFooter}>
                    <Text style={styles.footerText}>
                      This is a computer-generated score card
                    </Text>
                    <Text style={styles.footerTime}>
                      Generated on {formatTime(currentTime)}
                    </Text>
                  </View>
                </View>

                {/* Result Message */}
                <Animated.View style={[styles.resultMessage, { opacity: resultOpacity }]}>
                  {getScoreStatus() === 'PASSED' ? (
                    <View style={styles.successMessage}>
                      <Text style={styles.congratsText}>🎉 Congratulations!</Text>
                      <Text style={styles.successText}>
                        Excellent performance! You have successfully passed the examination.
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.failMessage}>
                      <Text style={styles.tryAgainText}>📚 Keep Learning!</Text>
                      <Text style={styles.failText}>
                        Don't give up! Review the topics and try again to improve your score.
                      </Text>
                    </View>
                  )}
                </Animated.View>
              </Animated.View>
            ) : (
              /* Welcome Screen */
              <View style={styles.welcomeContainer}>
                <View style={styles.welcomeCard}>
                  <Text style={styles.welcomeIcon}>🎯</Text>
                  <Text style={styles.welcomeTitle}>Welcome to Exam Portal</Text>
                  <Text style={styles.welcomeText}>
                    Your gateway to knowledge assessment and academic excellence
                  </Text>
                  <View style={styles.featuresContainer}>
                    <View style={styles.feature}>
                      <Text style={styles.featureIcon}>⏱️</Text>
                      <Text style={styles.featureText}>Timed Examinations</Text>
                    </View>
                    <View style={styles.feature}>
                      <Text style={styles.featureIcon}>📊</Text>
                      <Text style={styles.featureText}>Instant Results</Text>
                    </View>
                    <View style={styles.feature}>
                      <Text style={styles.featureIcon}>🏆</Text>
                      <Text style={styles.featureText}>Performance Analytics</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Premium Navigation Bar */}
        <View style={styles.navigationContainer}>
          <View style={styles.navigationBar}>
            <Animated.View style={{ transform: [{ scale: scaleHome }] }}>
              <TouchableOpacity 
                style={[styles.navButton, styles.activeNavButton]}
                onPress={() => animateButton(scaleHome)}
              >
                <View style={styles.navIconContainer}>
                  <Text style={styles.navIcon}>🏠</Text>
                </View>
                <Text style={styles.navLabel}>Dashboard</Text>
                <View style={styles.activeIndicator} />
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.navDivider} />

            <Animated.View style={{ transform: [{ scale: scaleQuestion }] }}>
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => animateButton(scaleQuestion, 'RegisterExam',{ username })}
              >
                <View style={styles.navIconContainer}>
                  <Text style={styles.navIcon}>📝</Text>
                </View>
                <Text style={styles.navLabel}>Start Exam</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    pointerEvents: 'none',
  },
  confetti: {
    position: 'absolute',
    zIndex: 1001,
  },
  confettiText: {
    fontSize: 20,
  },
  header: {
    backgroundColor: '#1e40af',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#bfdbfe',
    textAlign: 'center',
    marginTop: 4,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  scoreCardContainer: {
    marginTop: 20,
  },
  scoreCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 0,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  scoreCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  instituteLogo: {
    width: 50,
    height: 50,
    backgroundColor: '#3b82f6',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 24,
  },
  instituteInfo: {
    flex: 1,
    marginLeft: 15,
  },
  instituteName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  certificateTitle: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  stampContainer: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    transform: [{ rotate: '-5deg' }],
  },
  stampText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  studentInfo: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: 'bold',
  },
  scoreDisplay: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#f9fafb',
  },
  scoreCircle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ffffff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 20,
  },
  scoreNumber: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  scoreDivider: {
    fontSize: 24,
    color: '#9ca3af',
    marginHorizontal: 5,
  },
  totalNumber: {
    fontSize: 24,
    color: '#6b7280',
    fontWeight: '600',
  },
  scoreDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  gradeContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  gradeText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  percentageText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    gap: 10,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  statusIcon: {
    fontSize: 20,
  },
  performanceSection: {
    padding: 20,
  },
  performanceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  certificateFooter: {
    backgroundColor: '#f9fafb',
    paddingVertical: 15,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
  },
  footerTime: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  resultMessage: {
    marginTop: 20,
    padding: 20,
    borderRadius: 15,
  },
  successMessage: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#10b981',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  congratsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 10,
  },
  successText: {
    fontSize: 16,
    color: '#047857',
    textAlign: 'center',
    lineHeight: 24,
  },
  failMessage: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#ef4444',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  tryAgainText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 10,
  },
  failText: {
    fontSize: 16,
    color: '#b91c1c',
    textAlign: 'center',
    lineHeight: 24,
  },
  welcomeContainer: {
    marginTop: 40,
  },
  welcomeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  welcomeIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  featuresContainer: {
    width: '100%',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 12,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  navigationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  navigationBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom: 25,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    position: 'relative',
  },
  activeNavButton: {
    backgroundColor: '#eff6ff',
    borderRadius: 15,
    paddingHorizontal: 20,
  },
  navIconContainer: {

    
    width: 40,
    height: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  navIcon: {
    fontSize: 18,
  },
  navLabel: {
    fontSize: 10,
    color: '#374151',
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -15,
    width: 4,
    height: 4,
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
  navDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 20,
  },
});

export default HomeScreen;