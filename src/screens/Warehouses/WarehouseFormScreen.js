import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, useTheme, SegmentedButtons, HelperText } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  useGetWarehouseQuery, 
  useCreateWarehouseMutation, 
  useUpdateWarehouseMutation 
} from '../../store/api/inventoryApi';
import { validateRequired, validatePositiveNumber } from '../../utils/validators';

const WarehouseFormScreen = () => {
  const theme = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const { mode, warehouseId } = route.params;

  const isEditMode = mode === 'edit';

  const { data: warehouse, isLoading: isFetchingWarehouse } = useGetWarehouseQuery(warehouseId, {
    skip: !isEditMode,
  });

  const [createWarehouse, { isLoading: isCreating }] = useCreateWarehouseMutation();
  const [updateWarehouse, { isLoading: isUpdating }] = useUpdateWarehouseMutation();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    location: '',
    address: '',
    capacity: '',
    contact_person: '',
    contact_email: '',
    contact_phone: '',
    is_active: true,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (isEditMode && warehouse) {
      setFormData({
        name: warehouse.name,
        code: warehouse.code || '',
        location: warehouse.location,
        address: warehouse.address || '',
        capacity: warehouse.capacity.toString(),
        contact_person: warehouse.contact_person || '',
        contact_email: warehouse.contact_email || '',
        contact_phone: warehouse.contact_phone || '',
        is_active: warehouse.status === 'active',
      });
    }
  }, [isEditMode, warehouse]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
        error = validateRequired(formData.name, 'Warehouse name');
        break;
      case 'code':
        error = validateRequired(formData.code, 'Warehouse code');
        break;
      case 'location':
        error = validateRequired(formData.location, 'Location');
        break;
      case 'capacity':
        error = validatePositiveNumber(formData.capacity, 'Capacity');
        break;
    }

    if (error) {
      setErrors((prev) => ({ ...prev, [field]: error }));
    }

    return !error;
  };

  const validateForm = () => {
    const fields = ['name', 'code', 'location', 'capacity'];
    const newErrors = {};

    fields.forEach((field) => {
      if (!validateField(field)) {
        newErrors[field] = errors[field];
      }
    });

    const allTouched = fields.reduce((acc, field) => ({ ...acc, [field]: true }), {});
    setTouched(allTouched);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix all errors before submitting');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      code: formData.code.trim().toUpperCase(),
      location: formData.location.trim(),
      address: formData.address.trim() || null,
      capacity: parseInt(formData.capacity),
      contact_person: formData.contact_person.trim() || null,
      contact_email: formData.contact_email.trim() || null,
      contact_phone: formData.contact_phone.trim() || null,
      is_active: formData.is_active,
    };

    try {
      if (isEditMode) {
        await updateWarehouse({ id: warehouseId, ...payload }).unwrap();
        Alert.alert('Success', 'Warehouse updated successfully', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        await createWarehouse(payload).unwrap();
        Alert.alert('Success', 'Warehouse created successfully', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (err) {
      Alert.alert(
        'Error',
        err?.data?.detail || `Failed to ${isEditMode ? 'update' : 'create'} warehouse`
      );
    }
  };

  if (isEditMode && isFetchingWarehouse) {
    return (
      <ScreenWrapper>
        <LoadingSpinner message="Loading warehouse..." />
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
            label="Warehouse Name *"
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
            label="Warehouse Code *"
            value={formData.code}
            onChangeText={(value) => handleFieldChange('code', value)}
            onBlur={() => handleFieldBlur('code')}
            mode="outlined"
            error={touched.code && !!errors.code}
            disabled={isSubmitting}
            autoCapitalize="characters"
            style={styles.input}
          />
          {touched.code && errors.code && (
            <HelperText type="error" visible={true}>
              {errors.code}
            </HelperText>
          )}

          <TextInput
            label="Location *"
            value={formData.location}
            onChangeText={(value) => handleFieldChange('location', value)}
            onBlur={() => handleFieldBlur('location')}
            mode="outlined"
            error={touched.location && !!errors.location}
            disabled={isSubmitting}
            style={styles.input}
          />
          {touched.location && errors.location && (
            <HelperText type="error" visible={true}>
              {errors.location}
            </HelperText>
          )}

          <TextInput
            label="Address"
            value={formData.address}
            onChangeText={(value) => handleFieldChange('address', value)}
            mode="outlined"
            multiline
            numberOfLines={3}
            disabled={isSubmitting}
            style={styles.input}
          />

          <TextInput
            label="Capacity *"
            value={formData.capacity}
            onChangeText={(value) => handleFieldChange('capacity', value)}
            onBlur={() => handleFieldBlur('capacity')}
            mode="outlined"
            keyboardType="number-pad"
            error={touched.capacity && !!errors.capacity}
            disabled={isSubmitting}
            style={styles.input}
          />
          {touched.capacity && errors.capacity && (
            <HelperText type="error" visible={true}>
              {errors.capacity}
            </HelperText>
          )}
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <TextInput
            label="Contact Person"
            value={formData.contact_person}
            onChangeText={(value) => handleFieldChange('contact_person', value)}
            mode="outlined"
            disabled={isSubmitting}
            style={styles.input}
          />

          <TextInput
            label="Contact Email"
            value={formData.contact_email}
            onChangeText={(value) => handleFieldChange('contact_email', value)}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            disabled={isSubmitting}
            style={styles.input}
          />

          <TextInput
            label="Contact Phone"
            value={formData.contact_phone}
            onChangeText={(value) => handleFieldChange('contact_phone', value)}
            mode="outlined"
            keyboardType="phone-pad"
            disabled={isSubmitting}
            style={styles.input}
          />
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
            {isEditMode ? 'Update' : 'Create'} Warehouse
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

export default WarehouseFormScreen;
