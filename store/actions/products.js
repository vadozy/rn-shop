import { FIREBASE_URI } from '../../env';
import Product from '../../models/product';

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

const artificialDelay = () =>
  new Promise((resolve, reject) => {
    // setTimeout(() => resolve(), 2000);
    setTimeout(() => resolve(), 20);
  });

export const fetchProducts = () => {
  return async (dispatch, getState) => {
    const userId = getState()?.auth?.userId;
    console.log('LOADING PRODUCTS...');
    console.log(`userId: ${userId}`);
    try {
      const response = await fetch(`${FIREBASE_URI}/products.json`);

      if (!response.ok) {
        const data = await response.json();
        // console.log('Error');
        // console.log(data);
        throw new Error(`Something went wrong - ${data.error}`);
      }

      const data = await response.json();
      // console.log(data);

      const products = [];

      for (const key in data) {
        const v = data[key];
        products.push(
          new Product(
            key,
            v.ownerId,
            v.title,
            v.imageUrl,
            v.description,
            v.price
          )
        );
      }

      await artificialDelay();

      const userProducts = products.filter((p) => p.ownerId === userId);
      // console.log(userProducts);

      dispatch({
        type: SET_PRODUCTS,
        products,
        userProducts,
      });
    } catch (err) {
      console.log(err);
      // send to custom analytic server
      throw err;
    }
  };
};

export const deleteProduct = (productId) => {
  return async (dispatch, getState) => {
    const token = getState()?.auth?.token;
    console.log(`DELETING PRODUCT ${productId}...`);
    const response = await fetch(
      `${FIREBASE_URI}/products/${productId}.json?auth=${token}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      const data = await response.json();
      // console.log('Error');
      // console.log(data);
      throw new Error(`Could not REST DELETE - ${data.error}`);
    }

    await artificialDelay();

    dispatch({ type: DELETE_PRODUCT, pid: productId });
  };
};

export const createProduct = (title, description, imageUrl, price) => {
  return async (dispatch, getState) => {
    const token = getState()?.auth?.token;
    const userId = getState()?.auth?.userId;
    console.log('CREATING PRODUCT...');
    const response = await fetch(
      `${FIREBASE_URI}/products.json?auth=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          price,
          ownerId: userId,
        }),
      }
    );

    await artificialDelay();

    const data = await response.json();

    // console.log(data);

    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: data.name, // firebase generated id
        ownerId: userId,
        title,
        description,
        imageUrl,
        price,
      },
    });
  };
};

export const updateProduct = (id, title, description, imageUrl) => {
  return async (dispatch, getState) => {
    const token = getState()?.auth?.token;
    console.log(`UPDATING PRODUCT ${id}...`);
    const response = await fetch(
      `${FIREBASE_URI}/products/${id}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
        }),
      }
    );

    if (!response.ok) {
      const data = await response.json();
      // console.log('Error');
      // console.log(data);
      throw new Error(`Could not REST PATCH - ${data.error}`);
    }

    await artificialDelay();

    dispatch({
      type: UPDATE_PRODUCT,
      pid: id,
      productData: {
        title,
        description,
        imageUrl,
      },
    });
  };
};
