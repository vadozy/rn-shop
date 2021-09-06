import { FIREBASE_URI } from '../../env';
import Product from '../../models/product';

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

export const fetchProducts = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(`${FIREBASE_URI}/products.json`);

      if (!response.ok) {
        throw new Error('Something went wrong. Is URL correct?');
      }

      const data = await response.json();
      // console.log(data);

      const products = [];

      for (const key in data) {
        const v = data[key];
        products.push(
          new Product(key, 'u1', v.title, v.imageUrl, v.description, v.price)
        );
      }

      await new Promise((resolve, reject) => {
        setTimeout(() => resolve(), 2000);
      });

      dispatch({
        type: SET_PRODUCTS,
        products,
      });
    } catch (err) {
      console.log(err);
      // send to custom analytic server
      throw err;
    }
  };
};

export const deleteProduct = (productId) => {
  return { type: DELETE_PRODUCT, pid: productId };
};

export const createProduct = (title, description, imageUrl, price) => {
  return async (dispatch) => {
    const response = await fetch(`${FIREBASE_URI}/products.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
        imageUrl,
        price,
      }),
    });

    const data = await response.json();

    // console.log(data);

    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: data.name, // firebase generated id
        title,
        description,
        imageUrl,
        price,
      },
    });
  };
};

export const updateProduct = (id, title, description, imageUrl) => {
  return {
    type: UPDATE_PRODUCT,
    pid: id,
    productData: {
      title,
      description,
      imageUrl,
    },
  };
};
