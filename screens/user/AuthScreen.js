import React, { useState, useEffect, useReducer } from 'react';
import {
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Button,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { useDispatch } from 'react-redux';

import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';

import * as authActions from '../../store/actions/auth';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedInputValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedInputValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };

    let formIsValid = true;
    for (const key in updatedInputValidities) {
      formIsValid = formIsValid && updatedInputValidities[key];
    }
    return {
      ...state, // not needed really as we replace all state props
      inputValues: updatedInputValues,
      inputValidities: updatedInputValidities,
      formIsValid,
    };
  }
  return state;
};

const AuthScreen = (props) => {
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const dispatch = useDispatch();

  const [formState, formDispatch] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: '',
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formIsValid: false,
  });

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred', error, [{ text: 'Okay' }]);
    }
  }, [error]);

  const { email, password } = formState.inputValues;
  const { email: emailIsValid, password: passwordIsValid } =
    formState.inputValidities;
  const formIsValid = formState.formIsValid;

  const authHandler = async () => {
    console.log(email, password);
    const action = isSignup ? authActions.signup : authActions.login;
    setIsLoading(true);
    setError(null);
    try {
      await dispatch(action(email, password));
      props.navigation.navigate('Shop');
    } catch (err) {
      console.log('Error');
      console.log(err.message);
      setError(err.message);
      setIsLoading(false);
    }
  };

  const inputChangeHandler = (input) => (value, isValid) => {
    // console.log('formDispatch');
    formDispatch({
      type: FORM_INPUT_UPDATE,
      value,
      isValid,
      input,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={50}
      style={styles.screen}
    >
      <LinearGradient colors={['#ccffff', '#ddffff']} style={styles.gradient}>
        <Card style={styles.authContainer}>
          <ScrollView>
            <Input
              id="email"
              label="E-Mail"
              keyboardType="email-address"
              initialValue=""
              onInputChange={inputChangeHandler('email')}
              email
              required
              autoCapitalize="none"
            />
            <Input
              id="password"
              label="Password"
              keyboardType="default"
              secureTextEntry
              initialValue=""
              onInputChange={inputChangeHandler('password')}
              required
              minLength={5}
              autoCapitalize="none"
            />
            <View style={styles.buttonContainer}>
              {isLoading ? (
                <ActivityIndicator size="large" color={Colors.primary} />
              ) : (
                <Button
                  title={isSignup ? 'Sign Up' : 'Login'}
                  color={Colors.primary}
                  onPress={authHandler}
                />
              )}
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title={isSignup ? 'Switch to Login' : 'Switch to Sign Up'}
                color={Colors.accent}
                onPress={() => setIsSignup((previousState) => !previousState)}
              />
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

AuthScreen.navigationOptions = {
  headerTitle: 'Authenticate',
};

export default AuthScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    maxHeight: 400,
    padding: 20,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 10,
  },
});
