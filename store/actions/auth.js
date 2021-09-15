import AsyncStorage from '@react-native-async-storage/async-storage';

import { FIREBASE_API_KEY } from '../../env';

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

let logoutTimer;

export const authenticate = (token, userId, expiresMs) => {
  return (dispatch) => {
    dispatch(setLogoutTimer(expiresMs));
    dispatch({ type: AUTHENTICATE, token, userId });
  };
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem('userData');
  return { type: LOGOUT };
};

const setLogoutTimer = (expirationTime) => {
  return (dispatch) => {
    logoutTimer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};

const clearLogoutTimer = () => {
  if (logoutTimer) {
    clearTimeout(logoutTimer);
    logoutTimer = null;
  }
};

export const signup = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorResponseData = await response.json();
      console.log(errorResponseData);
      throw new Error(
        `Something went wrong at Sign Up: ${errorResponseData?.error?.message}`
      );
    }

    const responseData = await response.json();
    console.log(responseData);

    const [token, userId] = [responseData.idToken, responseData.localId];
    const exp = new Date().getTime() + parseInt(responseData.expiresIn) * 1000;
    const expirationDate = new Date(exp);
    await saveDataToStorage(token, userId, expirationDate);

    dispatch(
      authenticate(token, userId, parseInt(responseData.expiresIn - 5) * 1000)
    );
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorResponseData = await response.json();
      console.log(errorResponseData);
      throw new Error(
        `Something went wrong at login: ${errorResponseData?.error?.message}`
      );
    }

    const responseData = await response.json();
    console.log(responseData);

    const [token, userId] = [responseData.idToken, responseData.localId];
    const exp = new Date().getTime() + parseInt(responseData.expiresIn) * 1000;
    const expirationDate = new Date(exp);
    await saveDataToStorage(token, userId, expirationDate);

    dispatch(
      authenticate(token, userId, parseInt(responseData.expiresIn - 5) * 1000)
    );
  };
};

async function saveDataToStorage(token, userId, expirationDate) {
  try {
    await AsyncStorage.setItem(
      'userData',
      JSON.stringify({
        token,
        userId,
        expirationDate: expirationDate.toISOString(),
      })
    );
  } catch (e) {
    console.error('Could not store user data to AsyncStorage');
  }
}
