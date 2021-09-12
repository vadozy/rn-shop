import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import { useSelector, useDispatch } from 'react-redux';

import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import * as productActions from '../../store/actions/products';

import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';

import Colors from '../../constants/Colors';

const ProductsOverviewScreen = (props) => {
  const products = useSelector((state) => state.products.availableProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const dispatch = useDispatch();

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      await dispatch(productActions.fetchProducts());
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const subscription = props.navigation.addListener(
      'willFocus',
      loadProducts
    );
    return () => subscription.remove();
  }, [loadProducts]);

  useEffect(() => {
    loadProducts();
  }, []);

  const renderFlatListItem = ({ item }) => {
    const { imageUrl, title, price } = item;

    const navigateToProductDetail = () => {
      props.navigation.navigate({
        routeName: 'ProductDetail',
        params: {
          productId: item.id,
          productTitle: item.title, // used for Prod Detais Header
        },
      });
    };

    return (
      <ProductItem
        imageUrl={imageUrl}
        title={title}
        price={price}
        onSelect={navigateToProductDetail}
      >
        <Button
          color={Colors.primary}
          title="View Details"
          onPress={navigateToProductDetail}
        />
        <Button
          color={Colors.primary}
          title="To Cart"
          onPress={() => {
            dispatch(cartActions.addToCart(item));
          }}
        />
      </ProductItem>
    );
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred: {error}</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  } else if (products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No Products Found. Maybe start adding some.</Text>
      </View>
    );
  }

  return (
    <FlatList
      onRefresh={loadProducts}
      refreshing={isLoading}
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={renderFlatListItem}
    />
  );
};

ProductsOverviewScreen.navigationOptions = (navData) => {
  return {
    headerTitle: 'All Products',
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Cart"
          iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
          onPress={() => {
            navData.navigation.navigate('Cart');
          }}
        />
      </HeaderButtons>
    ),
  };
};

export default ProductsOverviewScreen;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
