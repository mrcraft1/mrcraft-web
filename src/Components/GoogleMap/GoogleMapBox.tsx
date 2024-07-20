import React, { useState, useEffect } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useSelector } from "react-redux";
import {
  GoogleMapBoxProps,
  GoogleMapRootState,
  Location,
} from "../../typescriptTypes/globalTypes";

const GoogleMapBox: React.FC<GoogleMapBoxProps> = ({
  onSelectLocation,
  apiKey,
  isLocationPass,
  locationlat,
  locationlng,
}) => {
  const locationData = useSelector(
    (state: GoogleMapRootState) => state.Location
  );

  const location_lat = isLocationPass ? locationlat : locationData.lat;
  const location_lng = isLocationPass ? locationlng : locationData.lng;

  const [initialLocation, setInitialLocation] = useState<Location>({
    lat: location_lat,
    lng: location_lng,
  });

  const [location, setLocation] = useState<Location>(initialLocation);

  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    setLocation(initialLocation);
  }, [initialLocation]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reverseGeocodedData = await performReverseGeocoding(
          location_lat,
          location_lng
        );

        if (reverseGeocodedData) {
          const updatedLocation: Location = {
            lat: location_lat,
            lng: location_lng,
            ...reverseGeocodedData,
          };

          onSelectLocation(updatedLocation);
        }
      } catch (error) {
        console.error("Error performing reverse geocoding:", error);
      }
    };

    fetchData();
  }, []);

  const onMarkerDragStart = () => {};

  const onMarkerDragEnd = async (e: google.maps.MapMouseEvent) => {
    try {
      if (e.latLng) {
        const reverseGeocodedData = await performReverseGeocoding(
          e.latLng.lat(),
          e.latLng.lng()
        );

        if (reverseGeocodedData) {
          const updatedLocation: Location = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
            ...reverseGeocodedData,
          };

          setInitialLocation(updatedLocation);
          setLocation(updatedLocation);
          onSelectLocation(updatedLocation);
        } else {
          console.error("No reverse geocoding data available");
        }
      }
    } catch (error) {
      console.error("Error performing reverse geocoding:", error);
    }
  };

  const performReverseGeocoding = async (
    lat: number,
    lng: number
  ): Promise<Omit<Location, "lat" | "lng"> | null> => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data. Status: " + response.status);
      }

      const data = await response.json();

      if (data.status === "OK" && data.results && data.results.length > 0) {
        const result = data.results[0];
        const addressComponents = result.address_components;
        const areaComponent = addressComponents.find(
          (component: any) =>
            component.types.includes("locality") ||
            component.types.includes("sublocality")
        );

        const areaName = areaComponent?.long_name;
        const formatted_address = result.formatted_address;
        const { city, country, state } = extractCityFromGeocodeResult(result);

        return {
          formatted_address,
          city,
          country,
          state,
          areaName,
        };
      } else {
        throw new Error("No results found");
      }
    } catch (error) {
      console.error("Error performing reverse geocoding:", error);
      return null;
    }
  };

  const extractCityFromGeocodeResult = (geocodeResult: any) => {
    let city = null;
    let country = null;
    let state = null;

    for (const component of geocodeResult.address_components) {
      if (component.types.includes("locality")) {
        city = component.long_name;
      } else if (component.types.includes("country")) {
        country = component.long_name;
      } else if (component.types.includes("administrative_area_level_1")) {
        state = component.long_name;
      }
    }

    return { city, country, state };
  };

  return (
    <div>
      {mapError ? (
        <div>{mapError}</div>
      ) : (
        <GoogleMap
          zoom={11}
          center={location}
          mapContainerStyle={{
            borderRadius: "10px",
            width: "100%",
            height: "500px",
          }}
        >
          <Marker
            position={location}
            draggable={true}
            onDragStart={onMarkerDragStart}
            onDragEnd={onMarkerDragEnd}
          />
        </GoogleMap>
      )}
    </div>
  );
};

export default GoogleMapBox;
