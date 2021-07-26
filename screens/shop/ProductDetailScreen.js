import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Button,
} from 'react-native';

import { useSelector } from 'react-redux';

const ProductDetailScreen = (props) => {
  const productId = props.navigation.getParam('productId');

  const product = useSelector((state) =>
    state.products.availableProducts.find((p) => p.id === productId)
  );

  return (
    <View style={styles.container}>
      <Text>{product.title}</Text>
    </View>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
