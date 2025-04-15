import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

const MapClickComponent = () => {
  const [region, setRegion] = useState({
    latitude: 35.6762, // Default center latitude (Tokyo)
    longitude: 139.6503, // Default center longitude (Tokyo)
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleMapPress = event => {
    const {latitude, longitude} = event.nativeEvent.coordinate;
    console.log('Clicked Location:', latitude, longitude);
    setSelectedLocation({latitude, longitude});
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
        onPress={handleMapPress} // Capture click location
      >
        {/* Show marker only if a location is selected */}
        {selectedLocation && <Marker coordinate={selectedLocation} />}
      </MapView>
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

export default MapClickComponent;
