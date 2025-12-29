import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Property } from '../../shared/models/property.model';
import * as PropertiesActions from './properties.actions';

export interface PropertiesState extends EntityState<Property> {
  selectedPropertyId: number | null;
  isLoading: boolean;
  error: string | null;
}

export const propertiesAdapter: EntityAdapter<Property> = createEntityAdapter<Property>({
  selectId: (property) => property.id,
  sortComparer: (a, b) => b.id - a.id // Sort by newest first
});

export const initialState: PropertiesState = propertiesAdapter.getInitialState({
  selectedPropertyId: null,
  isLoading: false,
  error: null
});

export const propertiesReducer = createReducer(
  initialState,

  // Load Properties
  on(PropertiesActions.loadProperties, PropertiesActions.loadMyProperties, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(PropertiesActions.loadPropertiesSuccess, PropertiesActions.loadMyPropertiesSuccess, (state, { properties }) =>
    propertiesAdapter.setAll(properties, {
      ...state,
      isLoading: false,
      error: null
    })
  ),

  on(PropertiesActions.loadPropertiesFailure, PropertiesActions.loadMyPropertiesFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Load Single Property
  on(PropertiesActions.loadProperty, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(PropertiesActions.loadPropertySuccess, (state, { property }) =>
    propertiesAdapter.upsertOne(property, {
      ...state,
      selectedPropertyId: property.id,
      isLoading: false,
      error: null
    })
  ),

  on(PropertiesActions.loadPropertyFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Create Property
  on(PropertiesActions.createProperty, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(PropertiesActions.createPropertySuccess, (state, { property }) =>
    propertiesAdapter.addOne(property, {
      ...state,
      isLoading: false,
      error: null
    })
  ),

  on(PropertiesActions.createPropertyFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Update Property
  on(PropertiesActions.updateProperty, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(PropertiesActions.updatePropertySuccess, (state, { property }) =>
    propertiesAdapter.updateOne(
      { id: property.id, changes: property },
      {
        ...state,
        isLoading: false,
        error: null
      }
    )
  ),

  on(PropertiesActions.updatePropertyFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Delete Property
  on(PropertiesActions.deleteProperty, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(PropertiesActions.deletePropertySuccess, (state, { id }) =>
    propertiesAdapter.removeOne(id, {
      ...state,
      isLoading: false,
      error: null
    })
  ),

  on(PropertiesActions.deletePropertyFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Select Property
  on(PropertiesActions.selectProperty, (state, { id }) => ({
    ...state,
    selectedPropertyId: id
  })),

  // Clear Error
  on(PropertiesActions.clearPropertiesError, (state) => ({
    ...state,
    error: null
  }))
);
