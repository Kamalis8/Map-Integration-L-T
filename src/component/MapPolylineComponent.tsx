import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';

const MapPolylineComponent = () => {
  const [region, setRegion] = useState({
    latitude: 35.6762, // Default center latitude (Tokyo)
    longitude: 139.6503, // Default center longitude (Tokyo)
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  const [selectedPoints, setSelectedPoints] = useState([]);

  // Haversine formula to calculate distance between two coordinates
  const calculateDistance = (coord1, coord2) => {
    const toRad = value => (value * Math.PI) / 180;
    const R = 6371; // Radius of Earth in km
    const dLat = toRad(coord2.latitude - coord1.latitude);
    const dLon = toRad(coord2.longitude - coord1.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(coord1.latitude)) *
        Math.cos(toRad(coord2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const handleMapPress = event => {
    const {latitude, longitude} = event.nativeEvent.coordinate;
    console.log('Clicked Location:', latitude, longitude);

    if (selectedPoints.length < 2) {
      setSelectedPoints([...selectedPoints, {latitude, longitude}]);
    } else {
      setSelectedPoints([{latitude, longitude}]);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
        onPress={handleMapPress}>
        {selectedPoints.map((point, index) => (
          <Marker key={index} coordinate={point} />
        ))}

        {selectedPoints.length === 2 && (
          <Polyline
            coordinates={selectedPoints}
            strokeColor="red"
            strokeWidth={3}
          />
        )}
      </MapView>

      {selectedPoints.length === 2 &&
        console.log(
          'Distance between points:',
          calculateDistance(selectedPoints[0], selectedPoints[1]).toFixed(2),
          'km',
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default MapPolylineComponent;
