import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';


const MarkingComponent = () => {
  const [region, setRegion] = useState({
    latitude: 35.6762, // Default center latitude (Tokyo)
    longitude: 139.6503, // Default center longitude (Tokyo)
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  const [selectedPoints, setSelectedPoints] = useState([]);
  const [selectedMode, setSelectedMode] = useState('none'); // 'marker' | 'polyline' | 'none'

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

    if (selectedMode === 'marker') {
      setSelectedPoints([...selectedPoints, {latitude, longitude}]);
    } else if (selectedMode === 'polyline') {
      if (selectedPoints.length < 2) {
        setSelectedPoints([...selectedPoints, {latitude, longitude}]);
      } else {
        setSelectedPoints([{latitude, longitude}]);
      }
    }
  };

  const resetMap = () => {
    setSelectedPoints([]);
    setSelectedMode('none');
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

      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        {/* Marker Mode */}
        <TouchableOpacity
          style={[styles.fab, selectedMode === 'marker' && styles.selectedFab]}
          onPress={() => setSelectedMode('marker')}>
          <Image source={require('../assets/images.png')} style={styles.icon} />
        </TouchableOpacity>

        {/* Polyline Mode */}
        <TouchableOpacity
          style={[
            styles.fab,
            selectedMode === 'polyline' && styles.selectedFab,
          ]}
          onPress={() => setSelectedMode('polyline')}>
          <Image
            source={require('../assets/polyline.png')}
            style={styles.icon}
          />
        </TouchableOpacity>

        {/* Reset Button */}
        <TouchableOpacity style={styles.fab} onPress={resetMap}>
          <Image
            source={require('../assets/refresh.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
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
  fabContainer: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    flexDirection: 'column',
    alignItems: 'center',
  },
  fab: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 30,
    marginBottom: 10,
    elevation: 5, // Shadow for Android
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  selectedFab: {
    backgroundColor: '#ffcc00', // Highlight selected button
  },
  icon: {
    width: 30,
    height: 30,
  },
});

export default MarkingComponent;
