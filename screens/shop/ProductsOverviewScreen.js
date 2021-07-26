import React from 'react';
import { FlatList } from 'react-native';

import { useSelector } from 'react-redux';

import ProductItem from '../../components/shop/ProductItem';

const ProductsOverviewScreen = (props) => {
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
          console.log(`Add To Cart ${item.id}`);
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
