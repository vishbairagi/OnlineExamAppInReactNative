// LoginScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Text,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
  ScrollView,
} from 'react-native';
import { useAuth } from './AuthContext';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  
  const { updateAuthData } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for logo
    const pulseAnimation = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]).start(() => pulseAnimation());
    };
    pulseAnimation();
  }, []);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://192.168.0.103:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('Login successful:', data);
        const name = data.name || username;
        await updateAuthData(username, name);
        navigation.replace('Home', { username, name });
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Network Error', 'Cannot reach server');
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = ({ visible }) => (
    <View style={styles.eyeIconContainer}>
      <View style={[styles.eyeIconBase, !visible && styles.eyeIconClosed]}>
        <View style={styles.eyeIconPupil} />
      </View>
      {!visible && <View style={styles.eyeIconSlash} />}
    </View>
  );

  const UserIcon = () => (
    <View style={styles.iconContainer}>
      <View style={styles.userIconHead} />
      <View style={styles.userIconBody} />
    </View>
  );

  const LockIcon = () => (
    <View style={styles.iconContainer}>
      <View style={styles.lockIconBody} />
      <View style={styles.lockIconShackle} />
      <View style={styles.lockIconKeyhole} />
    </View>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#4c1d95" />
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View
              style={[
                styles.content,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {/* Header Section */}
              <View style={styles.headerSection}>
                <Animated.View
                  style={[
                    styles.logoContainer,
                    { transform: [{ scale: pulseAnim }] }
                  ]}
                >
                  <View style={styles.logoInner}>
                    <LockIcon />
                  </View>
                </Animated.View>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to continue</Text>
              </View>

              {/* Form Section */}
              <View style={styles.formContainer}>
                {/* Username Input */}
                <View style={[
                  styles.inputContainer,
                  usernameFocused && styles.inputContainerFocused
                ]}>
                  <View style={styles.inputIconWrapper}>
                    <UserIcon />
                  </View>
                  <TextInput
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    style={styles.input}
                    placeholderTextColor="#9ca3af"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => setUsernameFocused(true)}
                    onBlur={() => setUsernameFocused(false)}
                  />
                </View>

                {/* Password Input */}
                <View style={[
                  styles.inputContainer,
                  passwordFocused && styles.inputContainerFocused
                ]}>
                  <View style={styles.inputIconWrapper}>
                    <LockIcon />
                  </View>
                  <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    style={styles.input}
                    placeholderTextColor="#9ca3af"
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIconButton}
                  >
                    <EyeIcon visible={showPassword} />
                  </TouchableOpacity>
                </View>

                {/* Login Button */}
                <TouchableOpacity
                  style={[
                    styles.loginButton,
                    loading && styles.loginButtonDisabled
                  ]}
                  onPress={handleLogin}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <View style={styles.loginButtonContent}>
                    {loading && (
                      <View style={styles.loadingSpinner} />
                    )}
                    <Text style={styles.loginButtonText}>
                      {loading ? 'Signing In...' : 'Sign In'}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Forgot Password */}
                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.footerLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7c3aed',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 30,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 15,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  inputContainerFocused: {
    borderColor: '#7c3aed',
    backgroundColor: '#faf5ff',
  },
  inputIconWrapper: {
    marginRight: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1f2937',
  },
  loginButton: {
    backgroundColor: '#7c3aed',
    borderRadius: 15,
    paddingVertical: 18,
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#7c3aed',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  loginButtonDisabled: {
    backgroundColor: '#9ca3af',
    shadowOpacity: 0.2,
  },
  loginButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingSpinner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderTopColor: '#fff',
    marginRight: 10,
  },
  forgotPassword: {
    alignSelf: 'center',
    paddingVertical: 10,
  },
  forgotPasswordText: {
    color: '#7c3aed',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  footerLink: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  // Custom Icon Styles
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userIconHead: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7c3aed',
    marginBottom: 2,
  },
  userIconBody: {
    width: 16,
    height: 10,
    backgroundColor: '#7c3aed',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  lockIconBody: {
    width: 14,
    height: 10,
    backgroundColor: '#7c3aed',
    borderRadius: 2,
    position: 'absolute',
    bottom: 0,
  },
  lockIconShackle: {
    width: 10,
    height: 8,
    borderWidth: 2,
    borderColor: '#7c3aed',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomWidth: 0,
    position: 'absolute',
    top: 0,
  },
  lockIconKeyhole: {
    width: 3,
    height: 3,
    backgroundColor: '#fff',
    borderRadius: 1.5,
    position: 'absolute',
    bottom: 3,
  },
  eyeIconButton: {
    padding: 5,
  },
  eyeIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIconBase: {
    width: 18,
    height: 10,
    backgroundColor: '#7c3aed',
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIconClosed: {
    height: 2,
    borderRadius: 1,
  },
  eyeIconPupil: {
    width: 6,
    height: 6,
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  eyeIconSlash: {
    position: 'absolute',
    width: 20,
    height: 2,
    backgroundColor: '#7c3aed',
    transform: [{ rotate: '45deg' }],
  },
});

export default LoginScreen;