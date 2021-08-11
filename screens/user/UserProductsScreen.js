import React from 'react';
import { FlatList, Button, Platform, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import * as productsActions from '../../store/actions/products';

import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';

import Colors from '../../constants/Colors';

import ProductItem from '../../components/shop/ProductItem';

const UserProductsScreen = (props) => {
  const userProducts = useSelector((state) => state.products.userProducts);
  const dispatch = useDispatch();

  const deleteHandler = (id) => {
    Alert.alert('Are you sure?', 'Do you really want to delete this item?', [
      { text: 'No', style: 'default' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => {
          // console.log('deleting...');
          dispatch(productsActions.deleteProduct(id));
        },
      },
    ]);
  };

  const editProductHandler = (id) =>
    props.navigation.navigate({
      routeName: 'EditProduct',
      params: { productId: id },
    });

  const renderFlatListItem = ({ item }) => {
    const { id, imageUrl, title, price } = item;
    return (
      <ProductItem
        imageUrl={imageUrl}
        title={title}
        price={price}
        onSelect={() => editProductHandler(id)}
      >
        <Button
          color={Colors.primary}
          title="Edit"
          onPress={() => editProductHandler(id)}
        />
        <Button
          color={Colors.primary}
          title="Delete"
          onPress={() => deleteHandler(id)}
        />
      </ProductItem>
    );
  };

  return (
    <FlatList
      data={userProducts}
      keyExtractor={(item) => item.id}
      renderItem={renderFlatListItem}
    />
  );
};

UserProductsScreen.navigationOptions = (navData) => {
  return {
    headerTitle: 'Your Products',
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
          title="Add"
          iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
          onPress={() => navData.navigation.navigate('EditProduct')}
        />
      </HeaderButtons>
    ),
  };
};

export default UserProductsScreen;
