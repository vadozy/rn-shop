import PRODUCTS from '../../data/dummy-data';

const initialState = {
  availableProducts: PRODUCTS,
  userProducts: PRODUCTS.filter((p) => p.ownerId === 'u1'),
};

export default productsReducer = (state = initialState, actions) => {
  return state;
};
