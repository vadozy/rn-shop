import React, { useState, useEffect, useCallback, useReducer } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';

import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import * as productsActions from '../../store/actions/products';

import HeaderButton from '../../components/UI/HeaderButton';
import Input from '../../components/UI/Input';

import Colors from '../../constants/Colors';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedInputValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedInputValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };

    let formIsValid = true;
    for (const key in updatedInputValidities) {
      formIsValid = formIsValid && updatedInputValidities[key];
    }
    return {
      ...state, // not needed really as we replace all state props
      inputValues: updatedInputValues,
      inputValidities: updatedInputValidities,
      formIsValid,
    };
  }
  return state;
};

const EditProductScreen = (props) => {
  const productId = props.navigation.getParam('productId');
  const editedProduct = useSelector((state) =>
    state.products.userProducts.find((p) => p.id === productId)
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const dispatch = useDispatch();

  const [formState, formDispatch] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : '',
      imageUrl: editedProduct ? editedProduct.imageUrl : '',
      description: editedProduct ? editedProduct.description : '',
      price: '', // if editing product, price is not visible, no need to set
    },
    inputValidities: {
      title: editedProduct ? true : false,
      imageUrl: editedProduct ? true : false,
      description: editedProduct ? true : false,
      price: editedProduct ? true : false,
    },
    formIsValid: editedProduct ? true : false,
  });

  const { title, imageUrl, price, description } = formState.inputValues;
  const {
    title: titleIsValid,
    imageUrl: imageUrlIsValid,
    description: descriptionIsValid,
    price: priceIsValid,
  } = formState.inputValidities;
  const formIsValid = formState.formIsValid;

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred', error, [{ text: 'Okay' }]);
    }
  }, [error]);

  const submitHandler = useCallback(async () => {
    // console.log('submitHandler');
    if (!formIsValid) {
      Alert.alert('Wrong input!', 'Please check errors in the form', [
        {
          text: 'Okay',
        },
      ]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (productId) {
        await dispatch(
          productsActions.updateProduct(productId, title, description, imageUrl)
        );
      } else {
        await dispatch(
          productsActions.createProduct(title, description, imageUrl, +price)
        );
      }
      props.navigation.goBack();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, productId, formState]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

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
  }

  const inputChangeHandler = (input) => (value, isValid) => {
    // console.log('formDispatch');
    formDispatch({
      type: FORM_INPUT_UPDATE,
      value,
      isValid,
      input,
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={100}
    >
      <ScrollView>
        <View style={styles.form}>
          <Input
            label="Title"
            initialValue={title}
            initiallyValid={titleIsValid}
            onInputChange={inputChangeHandler('title')}
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect={true}
            returnKeyType="go"
            required
          ></Input>
          <Input
            label="Image URL"
            initialValue={imageUrl}
            initiallyValid={imageUrlIsValid}
            onInputChange={inputChangeHandler('imageUrl')}
            required
          ></Input>
          {!editedProduct && (
            <Input
              label="Price"
              initialValue={price}
              initiallyValid={priceIsValid}
              onInputChange={inputChangeHandler('price')}
              keyboardType="decimal-pad"
              required
              min={0.1}
            ></Input>
          )}
          <Input
            label="Description"
            initialValue={description}
            initiallyValid={descriptionIsValid}
            onInputChange={inputChangeHandler('description')}
            autoCorrect={true}
            multiline={true}
            numberOfLines={3}
            required
            minLength={5}
          ></Input>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

EditProductScreen.navigationOptions = (navData) => {
  const submit = navData.navigation.getParam('submit');
  return {
    headerTitle: navData.navigation.getParam('productId')
      ? 'Edit Product'
      : 'Add New Product',
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Save"
          iconName={
            Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'
          }
          onPress={submit}
        />
      </HeaderButtons>
    ),
  };
};

export default EditProductScreen;

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
