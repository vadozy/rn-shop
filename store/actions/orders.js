import { FIREBASE_URI } from '../../env';
import Order from '../../models/order';
export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';

const artificialDelay = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => resolve(), 2000);
  });

export const fetchOrders = () => {
  return async (dispatch, getState) => {
    const userId = getState()?.auth?.userId;
    console.log('LOADING ORDERS...');
    try {
      const response = await fetch(`${FIREBASE_URI}/orders/${userId}.json`);

      if (!response.ok) {
        throw new Error('Something went wrong. Is URL correct?');
      }

      const data = await response.json();
      // console.log(data);

      const orders = [];

      for (const key in data) {
        const v = data[key];
        orders.push(
          new Order(key, v.cartItems, v.totalAmount, new Date(v.date))
        );
      }

      await artificialDelay();

      dispatch({ type: SET_ORDERS, orders });
    } catch (err) {
      console.log(err);
      // send to custom analytic server
      throw err;
    }
  };
};

export const addOrder = (cartItems, totalAmount) => {
  return async (dispatch, getState) => {
    const token = getState()?.auth?.token;
    const userId = getState()?.auth?.userId;
    const date = new Date();

    console.log('CREATING ORDER...');
    const response = await fetch(
      `${FIREBASE_URI}/orders/${userId}.json?auth=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems,
          totalAmount,
          date: date.toISOString(),
        }),
      }
    );

    if (!response.ok) {
      const data = await response.json();
      // console.log('Error');
      // console.log(data);
      throw new Error(`Could not save order - ${data.error}`);
    }

    await artificialDelay();

    const data = await response.json();

    // console.log(data);

    dispatch({
      type: ADD_ORDER,
      orderData: {
        id: data.name,
        items: cartItems,
        amount: totalAmount,
        date: date.toISOString(),
      },
    });
  };
};
