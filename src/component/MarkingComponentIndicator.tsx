import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Modal} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';

interface Point {
  latitude: number;
  longitude: number;
  needsApproval: boolean;
  id: string; // Added for unique identification
}

interface LineSegment {
  start: Point;
  end: Point;
  needsApproval: boolean;
  id: string; // Added for unique identification
}

const MarkingComponentIndicator = () => {
  const [region, setRegion] = useState({
    latitude: 35.6762,
    longitude: 139.6503,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  const [selectedItem, setSelectedItem] = useState<{
    type: 'point' | 'line';
    index: number;
  } | null>(null);

  // Single points that need approval
  const [singlePoints, setSinglePoints] = useState<Point[]>([
    {
      latitude: 35.678,
      longitude: 139.682,
      needsApproval: true,
      id: 'point-1',
    },
    {
      latitude: 35.6625,
      longitude: 139.73,
      needsApproval: false,
      id: 'point-2',
    },
    {
      latitude: 35.693,
      longitude: 139.72,
      needsApproval: true,
      id: 'point-3',
    },
  ]);

  // Line segments that need approval
  const [lineSegments, setLineSegments] = useState<LineSegment[]>([
    {
      start: {
        latitude: 35.689,
        longitude: 139.7,
        needsApproval: true,
        id: 'line-1-start',
      },
      end: {
        latitude: 35.672,
        longitude: 139.75,
        needsApproval: false,
        id: 'line-1-end',
      },
      needsApproval: true,
      id: 'line-1',
    },
    {
      start: {
        latitude: 35.703,
        longitude: 139.74,
        needsApproval: false,
        id: 'line-2-start',
      },
      end: {
        latitude: 35.715,
        longitude: 139.76,
        needsApproval: true,
        id: 'line-2-end',
      },
      needsApproval: true,
      id: 'line-2',
    },
  ]);

  // Function to toggle approval for a single point
  const togglePointApproval = (index: number) => {
    setSinglePoints(prev => {
      const newPoints = [...prev];
      newPoints[index] = {
        ...newPoints[index],
        needsApproval: !newPoints[index].needsApproval,
      };
      return newPoints;
    });
    setSelectedItem(null);
  };

  // Function to toggle approval for a line segment
  const toggleLineApproval = (index: number) => {
    setLineSegments(prev => {
      const newSegments = [...prev];
      newSegments[index] = {
        ...newSegments[index],
        needsApproval: !newSegments[index].needsApproval,
      };
      return newSegments;
    });
    setSelectedItem(null);
  };

  const handleMarkerPress = (type: 'point' | 'line', index: number) => {
    setSelectedItem({type, index});
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={setRegion}>
        {/* Render single points */}
        {singlePoints.map((point, index) => (
          <React.Fragment key={`point-${point.id}`}>
            <Marker
              coordinate={point}
              onPress={() => handleMarkerPress('point', index)}
            />
            {point.needsApproval && (
              <Marker
                coordinate={{
                  latitude: point.latitude,
                  longitude: point.longitude + 0.002, // Move to the right of the point
                }}
                anchor={{x: 0.5, y: 0.5}}>
                <View style={styles.approvalDot} />
              </Marker>
            )}
          </React.Fragment>
        ))}

        {/* Render line segments */}
        {lineSegments.map((segment, index) => (
          <React.Fragment key={`line-${segment.id}`}>
            <Marker
              coordinate={segment.start}
              onPress={() => handleMarkerPress('line', index)}
            />
            <Marker
              coordinate={segment.end}
              onPress={() => handleMarkerPress('line', index)}
            />
            <Polyline
              coordinates={[segment.start, segment.end]}
              strokeColor={segment.needsApproval ? '#FFA500' : '#0000FF'}
              strokeWidth={3}
            />
            {segment.needsApproval && (
              <>
                {segment.start.needsApproval && (
                  <Marker
                    coordinate={{
                      latitude: segment.start.latitude,
                      longitude: segment.start.longitude + 0.002, // Move to the right
                    }}
                    anchor={{x: 0.5, y: 0.5}}>
                    <View style={styles.approvalDot} />
                  </Marker>
                )}
                {segment.end.needsApproval && (
                  <Marker
                    coordinate={{
                      latitude: segment.end.latitude,
                      longitude: segment.end.longitude + 0.002, // Move to the right
                    }}
                    anchor={{x: 0.5, y: 0.5}}>
                    <View style={styles.approvalDot} />
                  </Marker>
                )}
              </>
            )}
          </React.Fragment>
        ))}
      </MapView>

      {/* Approval Modal */}
      <Modal
        visible={!!selectedItem}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedItem?.type === 'point'
                ? 'Point Approval'
                : 'Line Segment Approval'}
            </Text>
            <Text style={styles.modalText}>
              {selectedItem?.type === 'point'
                ? singlePoints[selectedItem.index].needsApproval
                  ? 'This point needs approval'
                  : 'This point is approved'
                : lineSegments[selectedItem?.index || 0].needsApproval
                ? 'This line segment needs approval'
                : 'This line segment is approved'}
            </Text>
            <TouchableOpacity
              style={styles.approveButton}
              onPress={() => {
                if (selectedItem?.type === 'point') {
                  togglePointApproval(selectedItem.index);
                } else if (selectedItem?.type === 'line') {
                  toggleLineApproval(selectedItem.index);
                }
              }}>
              <Text style={styles.buttonText}>
                {selectedItem?.type === 'point'
                  ? singlePoints[selectedItem.index].needsApproval
                    ? 'Approve Point'
                    : 'Mark as Unapproved'
                  : lineSegments[selectedItem?.index || 0].needsApproval
                  ? 'Approve Line'
                  : 'Mark as Unapproved'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeModal}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  approvalDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFD700',
    borderWidth: 2,
    borderColor: '#FFA500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#F44336',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MarkingComponentIndicator;