import React, { useEffect } from 'react';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { useDispatch } from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../constants/Colors';

import * as authActions from '../store/actions/auth';

const StartupScreen = (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const tryLogin = async () => {
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        props.navigation.navigate('Auth');
        return;
      }

      const transformedData = JSON.parse(userData);
      const {
        token,
        userId,
        expirationDate: expirationDateString,
      } = transformedData;
      console.log(`token: [${token}]`);
      console.log(`userId: [${userId}]`);
      console.log(`expirationDate: [${expirationDateString}]`);

      const expirationDate = new Date(expirationDateString);

      if (expirationDate <= new Date() || !token || !userId) {
        props.navigation.navigate('Auth');
        return;
      }

      dispatch(
        authActions.authenticate(
          token,
          userId,
          expirationDate.getTime() - new Date().getTime()
        )
      );

      props.navigation.navigate('Shop');
    };

    tryLogin();
  }, []);

  return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

export default StartupScreen;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
