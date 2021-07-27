import React from 'react';
import { FlatList } from 'react-native';

import { useSelector, useDispatch } from 'react-redux';

import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';

const ProductsOverviewScreen = (props) => {
  const dispatch = useDispatch();

  const renderFlatListItem = ({ item }) => {
    return (
      <ProductItem
        {...item}
        onViewDetail={() => {
          props.navigation.navigate({
            routeName: 'ProductDetail',
            params: {
              productId: item.id,
              productTitle: item.title, // used for Prod Detais Header
            },
          });
        }}
        onAddToCart={() => {
          dispatch(cartActions.addToCart(item));
        }}
      />
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

ProductsOverviewScreen.navigationOptions = {
  headerTitle: 'All Products',
};

export default ProductsOverviewScreen;
