import { ADD_TO_CART, REMOVE_FROM_CART } from '../actions/cart';
import { ADD_ORDER } from '../actions/orders';
import { DELETE_PRODUCT } from '../actions/products';
import CartItem from '../../models/cart-item';

const initialState = {
  items: {}, // key is product id, value is CartItem
  totalAmount: 0,
};

export default cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART: {
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

    case REMOVE_FROM_CART: {
      const productId = action.productId;
      const newItems = { ...state.items };
      const prevCartItem = newItems[productId];
      const price = prevCartItem.productPrice;
      const newCartItem = new CartItem(
        prevCartItem.quantity - 1,
        price,
        prevCartItem.productTitle,
        prevCartItem.sum - price
      );

      if (newCartItem.quantity === 0) {
        delete newItems[productId];
      } else {
        newItems[productId] = newCartItem;
      }
      return {
        ...state,
        items: newItems,
        totalAmount: state.totalAmount - price,
      };
    }

    case ADD_ORDER: {
      return {
        ...state,
        items: {},
        totalAmount: 0,
      };
    }
    case DELETE_PRODUCT: {
      if (!state.items[action.pid]) {
        return state;
      }
      const updatedItems = { ...state.items };
      const itemTotal = state.items[action.pid].sum;
      delete updatedItems[action.pid];
      return {
        ...state,
        items: updatedItems,
        totalAmount: state.totalAmount - itemTotal,
      };
    }
  }
  return state;
};
