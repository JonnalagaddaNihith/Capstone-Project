import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';
import { PropertyService } from '../../core/services/property.service';
import { NotificationService } from '../../core/services/notification.service';
import * as PropertiesActions from './properties.actions';

@Injectable()
export class PropertiesEffects {
  private actions$ = inject(Actions);
  private propertyService = inject(PropertyService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  loadProperties$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PropertiesActions.loadProperties),
      exhaustMap(({ filters }) =>
        this.propertyService.getAllProperties(filters).pipe(
          map((response) => {
            if (response.success && response.data) {
              return PropertiesActions.loadPropertiesSuccess({ properties: response.data });
            }
            return PropertiesActions.loadPropertiesFailure({ error: response.message || 'Failed to load properties' });
          }),
          catchError((error) =>
            of(PropertiesActions.loadPropertiesFailure({ error: error.error?.message || 'Failed to load properties' }))
          )
        )
      )
    )
  );

  loadMyProperties$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PropertiesActions.loadMyProperties),
      exhaustMap(() =>
        this.propertyService.getMyProperties().pipe(
          map((response) => {
            if (response.success && response.data) {
              return PropertiesActions.loadMyPropertiesSuccess({ properties: response.data });
            }
            return PropertiesActions.loadMyPropertiesFailure({ error: response.message || 'Failed to load properties' });
          }),
          catchError((error) =>
            of(PropertiesActions.loadMyPropertiesFailure({ error: error.error?.message || 'Failed to load properties' }))
          )
        )
      )
    )
  );

  loadProperty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PropertiesActions.loadProperty),
      exhaustMap(({ id }) =>
        this.propertyService.getPropertyById(id).pipe(
          map((response) => {
            if (response.success && response.data) {
              return PropertiesActions.loadPropertySuccess({ property: response.data });
            }
            return PropertiesActions.loadPropertyFailure({ error: response.message || 'Failed to load property' });
          }),
          catchError((error) =>
            of(PropertiesActions.loadPropertyFailure({ error: error.error?.message || 'Failed to load property' }))
          )
        )
      )
    )
  );

  createProperty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PropertiesActions.createProperty),
      exhaustMap(({ property }) =>
        this.propertyService.createProperty(property).pipe(
          map((response) => {
            if (response.success && response.data) {
              return PropertiesActions.createPropertySuccess({ property: response.data });
            }
            return PropertiesActions.createPropertyFailure({ error: response.message || 'Failed to create property' });
          }),
          catchError((error) =>
            of(PropertiesActions.createPropertyFailure({ error: error.error?.message || 'Failed to create property' }))
          )
        )
      )
    )
  );

  createPropertySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PropertiesActions.createPropertySuccess),
        tap(() => {
          this.notificationService.success('Property created successfully!');
          this.router.navigate(['/owner/properties']);
        })
      ),
    { dispatch: false }
  );

  updateProperty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PropertiesActions.updateProperty),
      exhaustMap(({ id, property }) =>
        this.propertyService.updateProperty(id, property).pipe(
          map((response) => {
            if (response.success && response.data) {
              return PropertiesActions.updatePropertySuccess({ property: response.data });
            }
            return PropertiesActions.updatePropertyFailure({ error: response.message || 'Failed to update property' });
          }),
          catchError((error) =>
            of(PropertiesActions.updatePropertyFailure({ error: error.error?.message || 'Failed to update property' }))
          )
        )
      )
    )
  );

  updatePropertySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PropertiesActions.updatePropertySuccess),
        tap(() => {
          this.notificationService.success('Property updated successfully!');
          this.router.navigate(['/owner/properties']);
        })
      ),
    { dispatch: false }
  );

  deleteProperty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PropertiesActions.deleteProperty),
      exhaustMap(({ id }) =>
        this.propertyService.deleteProperty(id).pipe(
          map((response) => {
            if (response.success) {
              return PropertiesActions.deletePropertySuccess({ id });
            }
            return PropertiesActions.deletePropertyFailure({ error: response.message || 'Failed to delete property' });
          }),
          catchError((error) =>
            of(PropertiesActions.deletePropertyFailure({ error: error.error?.message || 'Failed to delete property' }))
          )
        )
      )
    )
  );

  deletePropertySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PropertiesActions.deletePropertySuccess),
        tap(() => {
          this.notificationService.success('Property deleted successfully!');
        })
      ),
    { dispatch: false }
  );

  propertyFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          PropertiesActions.loadPropertiesFailure,
          PropertiesActions.loadPropertyFailure,
          PropertiesActions.createPropertyFailure,
          PropertiesActions.updatePropertyFailure,
          PropertiesActions.deletePropertyFailure
        ),
        tap(({ error }) => {
          this.notificationService.error(error);
        })
      ),
    { dispatch: false }
  );
}
