#import "NativeMethod.h"
#import "NSMutableDictionary+GMSPlace.h"
#import <React/RCTBridge.h>
#import "RCTConvert+RNGPAutocompleteTypeFilter.h"
#import <React/RCTRootView.h>
#import <React/RCTLog.h>
#import <React/RCTConvert.h>

#import <GooglePlaces/GooglePlaces.h>

@interface NativeMethod() <CLLocationManagerDelegate>

@property (strong, nonatomic) CLLocationManager *locationManager;
@property GMSAutocompleteBoundsMode boundsMode;

@end

@implementation NativeMethod

RCT_EXPORT_MODULE();
- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

- (instancetype)init
{
  if (self = [super init]) {
    self.locationManager = [[CLLocationManager alloc] init];
    self.locationManager.delegate = self;
    
    self.boundsMode = kGMSAutocompleteBoundsModeBias;
  }
  
  return self;
}

- (void)dealloc
{
  self.locationManager = nil;
}
RCT_EXPORT_METHOD(getAutocompletePredictions: (NSString *)query
                  filterOptions: (NSDictionary *)options
                  resolver: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject)
{
  NSMutableArray *autoCompleteSuggestionsList = [NSMutableArray array];
  GMSAutocompleteFilter *autocompleteFilter = [[GMSAutocompleteFilter alloc] init];
  autocompleteFilter.type = [self getFilterType:[RCTConvert NSString:options[@"type"]]];
  autocompleteFilter.country = [options[@"country"] length] == 0? nil : options[@"country"];
  
  NSDictionary *locationBias = [RCTConvert NSDictionary:options[@"locationBias"]];
  NSDictionary *locationRestriction = [RCTConvert NSDictionary:options[@"locationRestriction"]];
  
  GMSCoordinateBounds *autocompleteBounds = [self getBounds:locationBias andRestrictOptions:locationRestriction];
  
  GMSAutocompletePrediction *token = [[GMSAutocompletePrediction alloc] init];
  
  [[GMSPlacesClient sharedClient] findAutocompletePredictionsFromQuery:query
                                                                bounds:autocompleteBounds
                                                            boundsMode:self.boundsMode
                                                                filter:autocompleteFilter
                                                          sessionToken:token
                                                              callback:^(NSArray<GMSAutocompletePrediction *> * _Nullable results, NSError *error) {
                                                                if (error != nil) {
                                                                  reject(@"E_AUTOCOMPLETE_ERROR", [error description], nil);
                                                                  return;
                                                                }
                                                                
                                                                if (results != nil) {
                                                                  for (GMSAutocompletePrediction* result in results) {
                                                                    NSMutableDictionary *placeData = [[NSMutableDictionary alloc] init];
                                                                    
                                                                    placeData[@"fullText"] = result.attributedFullText.string;
                                                                    placeData[@"primaryText"] = result.attributedPrimaryText.string;
                                                                    placeData[@"secondaryText"] = result.attributedSecondaryText.string;
                                                                    placeData[@"placeID"] = result.placeID;
                                                                    placeData[@"types"] = result.types;
                                                                    
                                                                    [autoCompleteSuggestionsList addObject:placeData];
                                                                  }
                                                                  
                                                                  resolve(autoCompleteSuggestionsList);
                                                                  
                                                                }
                                                                
                                                              }];
}
- (NSError *) errorFromException: (NSException *) exception
{
  NSDictionary *exceptionInfo = @{
                                  @"name": exception.name,
                                  @"reason": exception.reason,
                                  @"callStackReturnAddresses": exception.callStackReturnAddresses,
                                  @"callStackSymbols": exception.callStackSymbols,
                                  @"userInfo": exception.userInfo
                                  };
  
  return [[NSError alloc] initWithDomain: @"RNGooglePlaces"
                                    code: 0
                                userInfo: exceptionInfo];
}

- (GMSPlacesAutocompleteTypeFilter) getFilterType:(NSString *)type
{
  if ([type isEqualToString: @"regions"]) {
    return kGMSPlacesAutocompleteTypeFilterRegion;
  } else if ([type isEqualToString: @"geocode"]) {
    return kGMSPlacesAutocompleteTypeFilterGeocode;
  } else if ([type isEqualToString: @"address"]) {
    return kGMSPlacesAutocompleteTypeFilterAddress;
  } else if ([type isEqualToString: @"establishment"]) {
    return kGMSPlacesAutocompleteTypeFilterEstablishment;
  } else if ([type isEqualToString: @"cities"]) {
    return kGMSPlacesAutocompleteTypeFilterCity;
  } else {
    return kGMSPlacesAutocompleteTypeFilterNoFilter;
  }
}

- (GMSCoordinateBounds *) getBounds: (NSDictionary *)biasOptions andRestrictOptions: (NSDictionary *)restrictOptions
{
  double biasLatitudeSW = [[RCTConvert NSNumber:biasOptions[@"latitudeSW"]] doubleValue];
  double biasLongitudeSW = [[RCTConvert NSNumber:biasOptions[@"longitudeSW"]] doubleValue];
  double biasLatitudeNE = [[RCTConvert NSNumber:biasOptions[@"latitudeNE"]] doubleValue];
  double biasLongitudeNE = [[RCTConvert NSNumber:biasOptions[@"longitudeNE"]] doubleValue];
  
  double restrictLatitudeSW = [[RCTConvert NSNumber:restrictOptions[@"latitudeSW"]] doubleValue];
  double restrictLongitudeSW = [[RCTConvert NSNumber:restrictOptions[@"longitudeSW"]] doubleValue];
  double restrictLatitudeNE = [[RCTConvert NSNumber:restrictOptions[@"latitudeNE"]] doubleValue];
  double restrictLongitudeNE = [[RCTConvert NSNumber:restrictOptions[@"longitudeNE"]] doubleValue];
  
  if (biasLatitudeSW != 0 && biasLongitudeSW != 0 && biasLatitudeNE != 0 && biasLongitudeNE != 0) {
    CLLocationCoordinate2D neBoundsCorner = CLLocationCoordinate2DMake(biasLatitudeNE, biasLongitudeNE);
    CLLocationCoordinate2D swBoundsCorner = CLLocationCoordinate2DMake(biasLatitudeSW, biasLongitudeSW);
    GMSCoordinateBounds *bounds = [[GMSCoordinateBounds alloc] initWithCoordinate:neBoundsCorner
                                                                       coordinate:swBoundsCorner];
    
    return bounds;
  }
  
  if (restrictLatitudeSW != 0 && restrictLongitudeSW != 0 && restrictLatitudeNE != 0 && restrictLongitudeNE != 0) {
    CLLocationCoordinate2D neBoundsCorner = CLLocationCoordinate2DMake(restrictLatitudeNE, restrictLongitudeNE);
    CLLocationCoordinate2D swBoundsCorner = CLLocationCoordinate2DMake(restrictLatitudeSW, restrictLongitudeSW);
    GMSCoordinateBounds *bounds = [[GMSCoordinateBounds alloc] initWithCoordinate:neBoundsCorner
                                                                       coordinate:swBoundsCorner];
    
    self.boundsMode = kGMSAutocompleteBoundsModeRestrict;
    
    return bounds;
  }
  
  return nil;
}
@end