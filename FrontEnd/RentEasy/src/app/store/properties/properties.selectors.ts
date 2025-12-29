import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PropertiesState, propertiesAdapter } from './properties.reducer';

export const selectPropertiesState = createFeatureSelector<PropertiesState>('properties');

// Entity Adapter Selectors
const { selectIds, selectEntities, selectAll, selectTotal } = propertiesAdapter.getSelectors();

export const selectPropertyIds = createSelector(
  selectPropertiesState,
  selectIds
);

export const selectPropertyEntities = createSelector(
  selectPropertiesState,
  selectEntities
);

export const selectAllProperties = createSelector(
  selectPropertiesState,
  selectAll
);

export const selectPropertiesTotal = createSelector(
  selectPropertiesState,
  selectTotal
);

export const selectPropertiesLoading = createSelector(
  selectPropertiesState,
  (state) => state.isLoading
);

export const selectPropertiesError = createSelector(
  selectPropertiesState,
  (state) => state.error
);

export const selectSelectedPropertyId = createSelector(
  selectPropertiesState,
  (state) => state.selectedPropertyId
);

export const selectSelectedProperty = createSelector(
  selectPropertyEntities,
  selectSelectedPropertyId,
  (entities, selectedId) => selectedId ? entities[selectedId] : null
);

export const selectPropertyById = (id: number) =>
  createSelector(
    selectPropertyEntities,
    (entities) => entities[id]
  );

// Select Featured Properties (first 6)
export const selectFeaturedProperties = createSelector(
  selectAllProperties,
  (properties) => properties.slice(0, 6)
);
