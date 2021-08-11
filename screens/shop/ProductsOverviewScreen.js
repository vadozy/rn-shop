import React from 'react';
import { FlatList, Button, Platform } from 'react-native';

import { useSelector, useDispatch } from 'react-redux';

import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';

import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';

import Colors from '../../constants/Colors';

const ProductsOverviewScreen = (props) => {
  const dispatch = useDispatch();

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

  const products = useSelector((state) => state.products.availableProducts);
  return (
    <FlatList
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
