import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import MapView, { Marker, Polyline, LatLng } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

interface PolylineData {
  points: LatLng[];
  id: string;
}

const MarkingComponentDrag = () => {
  const [region, setRegion] = useState({
    latitude: 35.6762,
    longitude: 139.6503,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  const [polylines, setPolylines] = useState<PolylineData[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState<LatLng[]>([]);
  const [extendIdx, setExtendIdx] = useState<{
    polyIdx: number;
    pointIdx: number;
  } | null>(null);
  const mapRef = useRef<MapView>(null);

  // Start or finish drawing on map press
const handleMapPress = (e: any) => {
  const coordinate = e?.nativeEvent?.coordinate;
  if (!coordinate) return;

  if (extendIdx !== null) {
    const { polyIdx, pointIdx } = extendIdx;
    const newPolylines = [...polylines];
    newPolylines[polyIdx].points = [
      ...newPolylines[polyIdx].points.slice(0, pointIdx + 1),
      coordinate,
      ...newPolylines[polyIdx].points.slice(pointIdx + 1),
    ];
    setPolylines(newPolylines);
    setExtendIdx({ polyIdx, pointIdx: pointIdx + 1 });
    return;
  }

  if (!drawing) {
    setCurrentLine([coordinate]);
    setDrawing(true);
  } else {
    if (currentLine.length > 1) {
      setPolylines(prev => [
        ...prev,
        { points: currentLine, id: Date.now().toString() },
      ]);
    }
    setCurrentLine([]);
    setDrawing(false);
  }
};

  // Draw line as user drags
 const handlePanDrag = (e: any) => {
  const coordinate = e?.nativeEvent?.coordinate;
  if (!coordinate || !drawing) return;
  setCurrentLine(prev => [...prev, coordinate]);
};

  // Tap marker to enable extend mode
  const handleMarkerPress = (polyIdx: number, pointIdx: number) => {
    setExtendIdx({ polyIdx, pointIdx });
  };

  // Render shortcut/label for each polyline
  const renderShortcuts = () =>
    polylines.map((poly, idx) => {
      const midIdx = Math.floor(poly.points.length / 2);
      const shortcutCoord = poly.points[midIdx];
      return (
        <Marker
          key={`shortcut-${poly.id}`}
          coordinate={shortcutCoord}
          anchor={{ x: 0.5, y: 1.5 }}
        >
          <View style={styles.shortcutBox}>
            <Text style={styles.shortcutText}>Shortcut {idx + 1}</Text>
          </View>
        </Marker>
      );
    });

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
        onPress={handleMapPress}
        onPanDrag={handlePanDrag}
      >
        {/* Draw existing polylines and their markers */}
        {polylines.map((poly, polyIdx) => (
          <React.Fragment key={poly.id}>
            <Polyline
              coordinates={poly.points}
              strokeColor="#007AFF"
              strokeWidth={4}
            />
            {poly.points.map((pt, ptIdx) => (
              <Marker
                key={`marker-${poly.id}-${ptIdx}`}
                coordinate={pt}
                onPress={() => handleMarkerPress(polyIdx, ptIdx)}
              >
                <View style={styles.markerDot} />
              </Marker>
            ))}
          </React.Fragment>
        ))}
        {/* Draw current line while dragging */}
        {drawing && currentLine.length > 0 && (
          <>
            <Polyline
              coordinates={currentLine}
              strokeColor="#34C759"
              strokeWidth={3}
            />
            {currentLine.map((pt, idx) => (
              <Marker key={`current-marker-${idx}`} coordinate={pt}>
                <View style={styles.markerDot} />
              </Marker>
            ))}
          </>
        )}
        {/* Shortcuts */}
        {renderShortcuts()}
      </MapView>
      {extendIdx !== null && (
        <View style={styles.extendHint}>
          <Text style={styles.extendHintText}>Extend mode: Tap on map to add points</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  markerDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    borderWidth: 2,
    borderColor: '#fff',
  },
  shortcutBox: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    elevation: 3,
  },
  shortcutText: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  extendHint: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  extendHintText: {
    backgroundColor: '#fff',
    color: '#007AFF',
    padding: 8,
    borderRadius: 8,
    fontWeight: 'bold',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
});

export default MarkingComponentDrag; 