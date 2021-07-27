import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Button,
} from 'react-native';

import { useSelector, useDispatch } from 'react-redux';

import Colors from '../../constants/Colors';

import * as cartActions from '../../store/actions/cart';

const ProductDetailScreen = (props) => {
  const productId = props.navigation.getParam('productId');

  const product = useSelector((state) =>
    state.products.availableProducts.find((p) => p.id === productId)
  );

  const dispatch = useDispatch();

  return (
    <ScrollView style={styles.container}>
      <Image style={styles.image} source={{ uri: product.imageUrl }} />
      <View style={styles.actions}>
        <Button
          color={Colors.primary}
          title="Add to Cart"
          onPress={() => dispatch(cartActions.addToCart(product))}
        />
      </View>
      <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      <Text style={styles.description}>{product.description}</Text>
    </ScrollView>
  );
};

export default ProductDetailScreen;

ProductDetailScreen.navigationOptions = (navData) => {
  return {
    headerTitle: navData.navigation.getParam('productTitle'),
  };
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  actions: {
    marginVertical: 10,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
  },
  price: {
    fontSize: 20,
    fontFamily: 'open-sans-bold',
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
  },
  description: {
    fontFamily: 'open-sans',
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 30,
  },
});
