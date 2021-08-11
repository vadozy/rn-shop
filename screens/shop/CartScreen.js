import React from 'react';
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import * as cartActions from '../../store/actions/cart';
import * as ordersAction from '../../store/actions/orders';
import Colors from '../../constants/Colors';
import CartItem from '../../components/shop/CartItem';

const CartScreen = (props) => {
  const cartTotalAmount = useSelector((state) => state.cart.totalAmount);
  const cartItems = useSelector((state) => {
    const transformedCartItems = [];
    for (const key in state.cart.items) {
      transformedCartItems.push({
        productId: key,
        productTitle: state.cart.items[key].productTitle,
        productPrice: state.cart.items[key].productPrice,
        quantity: state.cart.items[key].quantity,
        sum: state.cart.items[key].sum,
      });
    }
    return transformedCartItems.sort((a, b) =>
      a.productId > b.productId ? 1 : -1
    );
  });
  const dispatch = useDispatch();

  const renderFlatListItem = ({ item }) => {
    return (
      <CartItem
        quantity={item.quantity}
        title={item.productTitle}
        amount={item.sum}
        onRemove={() => dispatch(cartActions.removeFromCart(item.productId))}
      />
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Total:{' '}
          <Text style={styles.amount}>
            ${Math.round(cartTotalAmount * 100) / 100}
          </Text>
        </Text>
        <Button
          color={Colors.accent}
          title="Order Now"
          onPress={() => {
            dispatch(ordersAction.addOrder(cartItems, cartTotalAmount));
          }}
          disabled={cartItems.length === 0}
        />
      </View>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.productId}
        renderItem={renderFlatListItem}
      />
    </View>
  );
};

CartScreen.navigationOptions = {
  headerTitle: 'Your Cart',
};

export default CartScreen;

const styles = StyleSheet.create({
  screen: {
    margin: 20,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  summaryText: {
    fontSize: 16,
  },
  amount: {
    color: Colors.primary,
    fontFamily: 'open-sans',
  },
});
