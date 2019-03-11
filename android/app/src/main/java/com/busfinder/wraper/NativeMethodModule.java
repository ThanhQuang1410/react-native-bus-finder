package com.busfinder.wraper;

import android.content.Intent;
import android.net.Uri;
import android.os.AsyncTask;
import android.provider.Settings;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.util.Log;

import com.busfinder.R;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReadableMap;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.google.android.gms.common.api.Status;
import com.google.android.gms.maps.model.LatLngBounds;
import com.google.android.gms.tasks.Task;
import com.google.android.libraries.places.api.Places;
import com.google.android.libraries.places.api.model.AutocompleteSessionToken;
import com.google.android.libraries.places.api.model.LocationBias;
import com.google.android.libraries.places.api.model.LocationRestriction;
import com.google.android.libraries.places.api.model.Place;
import com.google.android.libraries.places.api.model.RectangularBounds;
import com.google.android.libraries.places.api.model.TypeFilter;
import com.google.android.libraries.places.api.net.FindAutocompletePredictionsRequest;
import com.google.android.libraries.places.api.net.FindAutocompletePredictionsResponse;
import com.google.android.libraries.places.api.net.PlacesClient;
import com.google.android.libraries.places.widget.Autocomplete;
import com.google.android.libraries.places.widget.AutocompleteActivity;
import com.google.android.libraries.places.widget.AutocompleteSupportFragment;
import com.google.android.libraries.places.widget.listener.PlaceSelectionListener;
import com.google.android.libraries.places.widget.model.AutocompleteActivityMode;
import com.google.android.libraries.places.api.model.PlaceLikelihood;
import com.google.android.libraries.places.api.net.FindCurrentPlaceRequest;
import com.google.android.libraries.places.api.net.FindCurrentPlaceResponse;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.libraries.places.api.model.AutocompletePrediction;
import com.google.android.libraries.places.api.net.FetchPlaceResponse;
import com.google.android.libraries.places.api.net.FetchPlaceRequest;


public class NativeMethodModule extends ReactContextBaseJavaModule {
    private Promise pendingPromise;
    public NativeMethodModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }
    private PlacesClient placesClient;
    private List<Place.Field> lastSelectedFields;
    @Override
    public String getName() {
        return "NativeMethodModule";
    }


    @ReactMethod
    public void getAutocompletePredictions(String query, ReadableMap options, final Promise promise) {
        this.pendingPromise = promise;

        if (!Places.isInitialized()) {
            promise.reject("E_API_KEY_ERROR", new Error("No API key defined in gradle.properties or errors initializing Places"));
            return;
        }

        String type = options.getString("type");
        String country = options.getString("country");
        country = country.isEmpty() ? null : country;
        boolean useSessionToken = options.getBoolean("useSessionToken");

        ReadableMap locationBias = options.getMap("locationBias");
        double biasToLatitudeSW = locationBias.getDouble("latitudeSW");
        double biasToLongitudeSW = locationBias.getDouble("longitudeSW");
        double biasToLatitudeNE = locationBias.getDouble("latitudeNE");
        double biasToLongitudeNE = locationBias.getDouble("longitudeNE");

        ReadableMap locationRestriction = options.getMap("locationRestriction");
        double restrictToLatitudeSW = locationRestriction.getDouble("latitudeSW");
        double restrictToLongitudeSW = locationRestriction.getDouble("longitudeSW");
        double restrictToLatitudeNE = locationRestriction.getDouble("latitudeNE");
        double restrictToLongitudeNE = locationRestriction.getDouble("longitudeNE");

        FindAutocompletePredictionsRequest.Builder requestBuilder =
                FindAutocompletePredictionsRequest.builder()
                        .setQuery(query);

        if (country != null) {
            requestBuilder.setCountry(country);
        }

        if (biasToLatitudeSW != 0 && biasToLongitudeSW != 0 && biasToLatitudeNE != 0 && biasToLongitudeNE != 0) {
            requestBuilder.setLocationBias(RectangularBounds.newInstance(
                    new LatLng(biasToLatitudeSW, biasToLongitudeSW),
                    new LatLng(biasToLatitudeNE, biasToLongitudeNE)));
        }

        if (restrictToLatitudeSW != 0 && restrictToLongitudeSW != 0 && restrictToLatitudeNE != 0 && restrictToLongitudeNE != 0) {
            requestBuilder.setLocationRestriction(RectangularBounds.newInstance(
                    new LatLng(restrictToLatitudeSW, restrictToLongitudeSW),
                    new LatLng(restrictToLatitudeNE, restrictToLongitudeNE)));
        }

        requestBuilder.setTypeFilter(getFilterType(type));

        if (useSessionToken) {
            requestBuilder.setSessionToken(AutocompleteSessionToken.newInstance());
        }

        Task<FindAutocompletePredictionsResponse> task =
                placesClient.findAutocompletePredictions(requestBuilder.build());

        task.addOnSuccessListener(
                (response) -> {
                    if (response.getAutocompletePredictions().size() == 0) {
                        WritableArray emptyResult = Arguments.createArray();
                        promise.resolve(emptyResult);
                        return;
                    }

                    WritableArray predictionsList = Arguments.createArray();

                    for (AutocompletePrediction prediction : response.getAutocompletePredictions()) {
                        WritableMap map = Arguments.createMap();
                        map.putString("fullText", prediction.getFullText(null).toString());
                        map.putString("primaryText", prediction.getPrimaryText(null).toString());
                        map.putString("secondaryText", prediction.getSecondaryText(null).toString());
                        map.putString("placeID", prediction.getPlaceId().toString());

                        if (prediction.getPlaceTypes().size() > 0) {
                            List<String> types = new ArrayList<>();
                            for (Place.Type placeType : prediction.getPlaceTypes()) {
                                types.add(RNGooglePlacesPlaceTypeMapper.getTypeSlug(placeType));
                            }
                            map.putArray("types", Arguments.fromArray(types.toArray(new String[0])));
                        }

                        predictionsList.pushMap(map);
                    }

                    promise.resolve(predictionsList);

                });

        task.addOnFailureListener(
                (exception) -> {
                    promise.reject("E_AUTOCOMPLETE_ERROR", new Error(exception.getMessage()));
                });
    }

    @Nullable
    private TypeFilter getFilterType(String type) {
        TypeFilter mappedFilter;

        switch (type) {
            case "geocode":
                mappedFilter = TypeFilter.GEOCODE;
                break;
            case "address":
                mappedFilter = TypeFilter.ADDRESS;
                break;
            case "establishment":
                mappedFilter = TypeFilter.ESTABLISHMENT;
                break;
            case "regions":
                mappedFilter = TypeFilter.REGIONS;
                break;
            case "cities":
                mappedFilter = TypeFilter.CITIES;
                break;
            default:
                mappedFilter = null;
                break;
        }

        return mappedFilter;
    }

}
