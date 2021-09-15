import React, { useEffect, useRef } from 'react';

import { useSelector } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import ShopNavigator from './ShopNavigator';

const NavigationContainer = (props) => {
  const navRef = useRef();
  const isAuthenticated = useSelector((state) => !!state.auth.token);

  useEffect(() => {
    if (!isAuthenticated) {
      navRef.current.dispatch(
        NavigationActions.navigate({
          routeName: 'Auth',
        })
      );
    }
  }, [isAuthenticated]);
  return <ShopNavigator ref={navRef} />;
};

export default NavigationContainer;
