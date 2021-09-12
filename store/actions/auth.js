import { FIREBASE_API_KEY } from '../../env';

export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';

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
    dispatch({
      type: SIGNUP,
      token: responseData.idToken,
      userId: responseData.localId,
    });
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
    dispatch({
      type: LOGIN,
      token: responseData.idToken,
      userId: responseData.localId,
    });
  };
};
