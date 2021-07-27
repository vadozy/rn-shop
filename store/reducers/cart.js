import { ADD_TO_CART } from '../actions/cart';
import CartItem from '../../models/cart-item';

const initialState = {
  items: {}, // key is product id, value is CartItem
  totalAmount: 0,
};

export default cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const addedProduct = action.product;
      const price = addedProduct.price;
      const title = addedProduct.title;

      let updatedOrNewCartItem = new CartItem(1, price, title, price);

      const existingCartItem = state.items[addedProduct.id];
      if (existingCartItem) {
        // alreade have this product in the cart
        updatedOrNewCartItem = new CartItem(
          existingCartItem.quantity + 1,
          price,
          title,
          existingCartItem.sum + price
        );
      }

      return {
        ...state,
        items: { ...state.items, [addedProduct.id]: updatedOrNewCartItem },
        totalAmount: state.totalAmount + price,
      };
  }
  return state;
};
