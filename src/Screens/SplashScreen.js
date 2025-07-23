import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useAuth } from './AuthContext'; // Adjust path as needed

const SplashScreen = ({ navigation }) => {
  const { username, name } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (username && name) {
        navigation.replace('Home', { username, name });
      } else {
        navigation.replace('Login');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation, username, name]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 180,
    height: 180,
  },
});
