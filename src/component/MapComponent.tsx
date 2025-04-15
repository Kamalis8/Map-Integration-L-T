import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';

const MyMapComponent = () => {
  const [region, setRegion] = useState({
    latitude: (35.6762 + 35.6074) / 2, // Midpoint between Tokyo and Chiba
    longitude: (139.6503 + 140.1065) / 2, // Midpoint between Tokyo and Chiba
    latitudeDelta: 0.1, // Adjust to fit both markers
    longitudeDelta: 0.1, // Adjust to fit both markers
  });

  const tokyoRegion = {
    latitude: 35.6762,
    longitude: 139.6503,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const chibaRegion = {
    latitude: 35.6074,
    longitude: 140.1065,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const coordinates = [tokyoRegion, chibaRegion];

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={setRegion}>
        <Marker coordinate={chibaRegion} pinColor="green" />

        <Polyline
          coordinates={coordinates}
          strokeColor="#000"
          strokeWidth={3}
          lineDashPattern={[1]}
        />
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

export default MyMapComponent;
