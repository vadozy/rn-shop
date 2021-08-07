import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../../constants/Colors';

const CartItem = (props) => {
  return (
    <View style={styles.cartItem}>
      <View style={styles.itemData}>
        <Text style={styles.quantity}>{props.quantity} </Text>
        <Text style={styles.title}>{props.title}</Text>
      </View>
      <View style={styles.itemData}>
        <Text style={styles.amount}>${props.amount.toFixed(2)}</Text>
        {props.onRemove && (
          <TouchableOpacity
            onPress={props.onRemove}
            style={styles.deleteButton}
          >
            <Ionicons
              size={23}
              color="red"
              name={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CartItem;

const styles = StyleSheet.create({
  cartItem: {
    padding: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
  },
  itemData: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantity: {
    fontFamily: 'open-sans',
    color: '#888',
    fontSize: 16,
  },
  title: {
    fontFamily: 'open-sans',
    fontSize: 16,
  },
  amount: {
    fontFamily: 'open-sans',
    fontSize: 16,
  },
  deleteButton: {
    marginLeft: 20,
  },
});
