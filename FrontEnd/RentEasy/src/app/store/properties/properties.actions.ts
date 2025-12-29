import { createAction, props } from '@ngrx/store';
import { Property, PropertyFilters, PropertyCreateRequest, PropertyUpdateRequest } from '../../shared/models/property.model';

// Load All Properties
export const loadProperties = createAction(
  '[Properties] Load Properties',
  props<{ filters?: PropertyFilters }>()
);

export const loadPropertiesSuccess = createAction(
  '[Properties] Load Properties Success',
  props<{ properties: Property[] }>()
);

export const loadPropertiesFailure = createAction(
  '[Properties] Load Properties Failure',
  props<{ error: string }>()
);

// Load My Properties (Owner)
export const loadMyProperties = createAction('[Properties] Load My Properties');

export const loadMyPropertiesSuccess = createAction(
  '[Properties] Load My Properties Success',
  props<{ properties: Property[] }>()
);

export const loadMyPropertiesFailure = createAction(
  '[Properties] Load My Properties Failure',
  props<{ error: string }>()
);

// Load Single Property
export const loadProperty = createAction(
  '[Properties] Load Property',
  props<{ id: number }>()
);

export const loadPropertySuccess = createAction(
  '[Properties] Load Property Success',
  props<{ property: Property }>()
);

export const loadPropertyFailure = createAction(
  '[Properties] Load Property Failure',
  props<{ error: string }>()
);

// Create Property
export const createProperty = createAction(
  '[Properties] Create Property',
  props<{ property: PropertyCreateRequest }>()
);

export const createPropertySuccess = createAction(
  '[Properties] Create Property Success',
  props<{ property: Property }>()
);

export const createPropertyFailure = createAction(
  '[Properties] Create Property Failure',
  props<{ error: string }>()
);

// Update Property
export const updateProperty = createAction(
  '[Properties] Update Property',
  props<{ id: number; property: PropertyUpdateRequest }>()
);

export const updatePropertySuccess = createAction(
  '[Properties] Update Property Success',
  props<{ property: Property }>()
);

export const updatePropertyFailure = createAction(
  '[Properties] Update Property Failure',
  props<{ error: string }>()
);

// Delete Property
export const deleteProperty = createAction(
  '[Properties] Delete Property',
  props<{ id: number }>()
);

export const deletePropertySuccess = createAction(
  '[Properties] Delete Property Success',
  props<{ id: number }>()
);

export const deletePropertyFailure = createAction(
  '[Properties] Delete Property Failure',
  props<{ error: string }>()
);

// Select Property
export const selectProperty = createAction(
  '[Properties] Select Property',
  props<{ id: number | null }>()
);

// Clear Properties Error
export const clearPropertiesError = createAction('[Properties] Clear Error');
