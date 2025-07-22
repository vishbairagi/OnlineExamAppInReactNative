// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState(null);
  const [name, setName] = useState(null);

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        const storedName = await AsyncStorage.getItem('name');
        if (storedUsername) setUsername(storedUsername);
        if (storedName) setName(storedName);
      } catch (error) {
        console.error('Error loading auth data:', error);
      }
    };
    loadAuthData();
  }, []);

  const updateAuthData = async (newUsername, newName) => {
    try {
      setUsername(newUsername || null);
      setName(newName || null);
      if (newUsername) await AsyncStorage.setItem('username', newUsername);
      else await AsyncStorage.removeItem('username');
      if (newName) await AsyncStorage.setItem('name', newName);
      else await AsyncStorage.removeItem('name');
    } catch (error) {
      console.error('Error saving auth data:', error);
    }
  };

  const clearAuthData = async () => {
    try {
      setUsername(null);
      setName(null);
      await AsyncStorage.removeItem('username');
      await AsyncStorage.removeItem('name');
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ username, name, updateAuthData, clearAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);