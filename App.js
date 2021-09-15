import React, { useState, useEffect } from 'react';

import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import * as Font from 'expo-font';
import { composeWithDevTools } from 'redux-devtools-extension';

import productsReducer from './store/reducers/products';
import cartReducer from './store/reducers/cart';
import ordersReducer from './store/reducers/orders';
import authReducer from './store/reducers/auth';

import NavigationContainer from './navigation/NavigationContainer';

const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  orders: ordersReducer,
  auth: authReducer,
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(ReduxThunk))
);
// const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  const fetchFonts = async () => {
    await Font.loadAsync({
      'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
      'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf'),
    });
    setFontLoaded(true);
  };

  useEffect(() => {
    fetchFonts();
  }, []);

  if (!fontLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <NavigationContainer />
    </Provider>
  );
}
