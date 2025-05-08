import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';

interface Point {
  latitude: number;
  longitude: number;
}

interface LineSegment {
  start: Point;
  end: Point;
  totalSegments: number;
  completedSegments: number;
}

const MarkingComponentColor = () => {
  const [region, setRegion] = useState({
    latitude: 35.6762,
    longitude: 139.6503,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  // Static line segments with their progress
  const [lineSegments, setLineSegments] = useState<LineSegment[]>([
    {
      start: {latitude: 35.678, longitude: 139.682},
      end: {latitude: 35.689, longitude: 139.7},
      totalSegments: 4,
      completedSegments: 2,
    },
    {
      start: {latitude: 35.6625, longitude: 139.73},
      end: {latitude: 35.672, longitude: 139.75},
      totalSegments: 4,
      completedSegments: 1,
    },
    {
      start: {latitude: 35.693, longitude: 139.72},
      end: {latitude: 35.703, longitude: 139.74},
      totalSegments: 4,
      completedSegments: 3,
    },
  ]);
  // Function to calculate intermediate points for segmentation
  const calculateIntermediatePoints = (
    start: Point,
    end: Point,
    segments: number,
  ): Point[] => {
    const points: Point[] = [];
    for (let i = 0; i <= segments; i++) {
      const fraction = i / segments;
      points.push({
        latitude: start.latitude + (end.latitude - start.latitude) * fraction,
        longitude:
          start.longitude + (end.longitude - start.longitude) * fraction,
      });
    }
    return points;
  };

  // Function to create segmented polylines for a line segment
  const createSegmentedPolylines = (segment: LineSegment) => {
    const allPoints = calculateIntermediatePoints(
      segment.start,
      segment.end,
      segment.totalSegments,
    );

    const segments = [];
    for (let i = 0; i < segment.totalSegments; i++) {
      segments.push({
        coordinates: [allPoints[i], allPoints[i + 1]],
        color: i < segment.completedSegments ? '#00FF00' : '#FF0000',
      });
    }
    return segments;
  };

  // Function to update completed segments for a specific line
  const updateCompletedSegments = (index: number, value: number) => {
    setLineSegments(prev => {
      const newSegments = [...prev];
      newSegments[index] = {
        ...newSegments[index],
        completedSegments: Math.max(
          0,
          Math.min(newSegments[index].totalSegments, value),
        ),
      };
      return newSegments;
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={setRegion}>
        {lineSegments.map((segment, index) => (
          <React.Fragment key={index}>
            <Marker coordinate={segment.start} />
            <Marker coordinate={segment.end} />
            {createSegmentedPolylines(segment).map((polyline, polyIndex) => (
              <Polyline
                key={`${index}-${polyIndex}`}
                coordinates={polyline.coordinates}
                strokeColor={polyline.color}
                strokeWidth={3}
              />
            ))}
          </React.Fragment>
        ))}
      </MapView>

      <View style={styles.controlsContainer}>
        {lineSegments.map((segment, index) => (
          <View key={index} style={styles.segmentControl}>
            <Text style={styles.segmentTitle}>Line {index + 1}</Text>
            <View style={styles.progressContainer}>
              <TouchableOpacity
                style={styles.progressButton}
                onPress={() =>
                  updateCompletedSegments(index, segment.completedSegments - 1)
                }>
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.progressText}>
                {segment.completedSegments}/{segment.totalSegments}
              </Text>
              <TouchableOpacity
                style={styles.progressButton}
                onPress={() =>
                  updateCompletedSegments(index, segment.completedSegments + 1)
                }>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
  controlsContainer: {
    position: 'absolute',
    right: 20,
    top: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  segmentControl: {
    marginBottom: 10,
  },
  segmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressText: {
    fontSize: 16,
    marginHorizontal: 10,
  },
});

export default MarkingComponentColor;
