import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, useTheme, SegmentedButtons, HelperText } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { 
  useGetProductQuery, 
  useCreateProductMutation, 
  useUpdateProductMutation 
} from '../../store/api/inventoryApi';
import { PRODUCT_CATEGORIES } from '../../constants/enums';
import { 
  validateRequired, 
  validatePositiveNumber, 
  validateSKU 
} from '../../utils/validators';

const ProductFormScreen = () => {
  const theme = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const { mode, productId } = route.params;

  const isEditMode = mode === 'edit';

  // Fetch product data if in edit mode
  const { data: product, isLoading: isFetchingProduct } = useGetProductQuery(productId, {
    skip: !isEditMode,
  });

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: PRODUCT_CATEGORIES.ELECTRONICS,
    description: '',
    price: '',
    cost: '',
    minimum_stock_level: '',
    is_active: true,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Populate form in edit mode
  useEffect(() => {
    if (isEditMode && product) {
      setFormData({
        name: product.name,
        sku: product.sku,
        category: product.category,
        description: product.description || '',
        price: product.price.toString(),
        cost: product.cost.toString(),
        minimum_stock_level: product.minimum_stock_level.toString(),
        is_active: product.status === 'active',
      });
    }
  }, [isEditMode, product]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleFieldBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field) => {
    let error = null;

    switch (field) {
      case 'name':
        error = validateRequired(formData.name, 'Product name');
        break;
      case 'sku':
        const skuValidation = validateSKU(formData.sku);
        error = skuValidation.isValid ? null : skuValidation.error;
        break;
      case 'price':
        error = validatePositiveNumber(formData.price, 'Price');
        break;
      case 'cost':
        error = validatePositiveNumber(formData.cost, 'Cost');
        break;
      case 'minimum_stock_level':
        error = validatePositiveNumber(formData.minimum_stock_level, 'Minimum stock level', true);
        break;
    }

    if (error) {
      setErrors((prev) => ({ ...prev, [field]: error }));
    }

    return !error;
  };

  const validateForm = () => {
    const fields = ['name', 'sku', 'price', 'cost', 'minimum_stock_level'];
    const newErrors = {};

    fields.forEach((field) => {
      if (!validateField(field)) {
        newErrors[field] = errors[field];
      }
    });

    // Mark all fields as touched
    const allTouched = fields.reduce((acc, field) => ({ ...acc, [field]: true }), {});
    setTouched(allTouched);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix all errors before submitting');
      return;
    }

    // Prepare payload
    const payload = {
      name: formData.name.trim(),
      sku: formData.sku.trim().toUpperCase(),
      category: formData.category,
      description: formData.description.trim() || null,
      price: parseFloat(formData.price),
      cost: parseFloat(formData.cost),
      minimum_stock_level: parseInt(formData.minimum_stock_level),
      is_active: formData.is_active,
    };

    try {
      if (isEditMode) {
        await updateProduct({ id: productId, ...payload }).unwrap();
        Alert.alert('Success', 'Product updated successfully', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        await createProduct(payload).unwrap();
        Alert.alert('Success', 'Product created successfully', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (err) {
      Alert.alert(
        'Error',
        err?.data?.detail || `Failed to ${isEditMode ? 'update' : 'create'} product`
      );
    }
  };

  if (isEditMode && isFetchingProduct) {
    return (
      <ScreenWrapper>
        <LoadingSpinner message="Loading product..." />
      </ScreenWrapper>
    );
  }

  const isSubmitting = isCreating || isUpdating;

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        {/* Basic Information */}
        <View style={styles.section}>
          <TextInput
            label="Product Name *"
            value={formData.name}
            onChangeText={(value) => handleFieldChange('name', value)}
            onBlur={() => handleFieldBlur('name')}
            mode="outlined"
            error={touched.name && !!errors.name}
            disabled={isSubmitting}
            style={styles.input}
          />
          {touched.name && errors.name && (
            <HelperText type="error" visible={true}>
              {errors.name}
            </HelperText>
          )}

          <TextInput
            label="SKU *"
            value={formData.sku}
            onChangeText={(value) => handleFieldChange('sku', value)}
            onBlur={() => handleFieldBlur('sku')}
            mode="outlined"
            error={touched.sku && !!errors.sku}
            disabled={isSubmitting}
            autoCapitalize="characters"
            style={styles.input}
          />
          {touched.sku && errors.sku && (
            <HelperText type="error" visible={true}>
              {errors.sku}
            </HelperText>
          )}

          <TextInput
            label="Category *"
            value={formData.category}
            mode="outlined"
            disabled={true}
            style={styles.input}
          />
          <SegmentedButtons
            value={formData.category}
            onValueChange={(value) => handleFieldChange('category', value)}
            buttons={Object.values(PRODUCT_CATEGORIES).map((cat) => ({
              value: cat,
              label: cat,
            }))}
            style={styles.segmentedButtons}
            disabled={isSubmitting}
          />

          <TextInput
            label="Description"
            value={formData.description}
            onChangeText={(value) => handleFieldChange('description', value)}
            mode="outlined"
            multiline
            numberOfLines={3}
            disabled={isSubmitting}
            style={styles.input}
          />
        </View>

        {/* Pricing */}
        <View style={styles.section}>
          <TextInput
            label="Unit Price (₹) *"
            value={formData.price}
            onChangeText={(value) => handleFieldChange('price', value)}
            onBlur={() => handleFieldBlur('price')}
            mode="outlined"
            keyboardType="decimal-pad"
            error={touched.price && !!errors.price}
            disabled={isSubmitting}
            left={<TextInput.Affix text="₹" />}
            style={styles.input}
          />
          {touched.price && errors.price && (
            <HelperText type="error" visible={true}>
              {errors.price}
            </HelperText>
          )}

          <TextInput
            label="Unit Cost (₹) *"
            value={formData.cost}
            onChangeText={(value) => handleFieldChange('cost', value)}
            onBlur={() => handleFieldBlur('cost')}
            mode="outlined"
            keyboardType="decimal-pad"
            error={touched.cost && !!errors.cost}
            disabled={isSubmitting}
            left={<TextInput.Affix text="₹" />}
            style={styles.input}
          />
          {touched.cost && errors.cost && (
            <HelperText type="error" visible={true}>
              {errors.cost}
            </HelperText>
          )}
        </View>

        {/* Stock Settings */}
        <View style={styles.section}>
          <TextInput
            label="Minimum Stock Level *"
            value={formData.minimum_stock_level}
            onChangeText={(value) => handleFieldChange('minimum_stock_level', value)}
            onBlur={() => handleFieldBlur('minimum_stock_level')}
            mode="outlined"
            keyboardType="number-pad"
            error={touched.minimum_stock_level && !!errors.minimum_stock_level}
            disabled={isSubmitting}
            style={styles.input}
          />
          {touched.minimum_stock_level && errors.minimum_stock_level && (
            <HelperText type="error" visible={true}>
              {errors.minimum_stock_level}
            </HelperText>
          )}
        </View>

        {/* Status */}
        <View style={styles.section}>
          <SegmentedButtons
            value={formData.is_active ? 'active' : 'inactive'}
            onValueChange={(value) => handleFieldChange('is_active', value === 'active')}
            buttons={[
              { value: 'active', label: 'Active', icon: 'check-circle' },
              { value: 'inactive', label: 'Inactive', icon: 'archive' },
            ]}
            disabled={isSubmitting}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            disabled={isSubmitting}
            style={styles.button}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.button}
          >
            {isEditMode ? 'Update' : 'Create'} Product
          </Button>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 8,
  },
  segmentedButtons: {
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 32,
  },
  button: {
    flex: 1,
  },
});

export default ProductFormScreen;
