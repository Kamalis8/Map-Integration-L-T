import React from 'react';
import {SafeAreaView} from 'react-native';
import MyMapComponent from './src/component/MapComponent';
import MapClickComponent from './src/component/MapClickComponent';
import MapPolylineComponent from './src/component/MapPolylineComponent';
import MarkingComponent from './src/component/MarkingComponent';

const App = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <MarkingComponent />
    </SafeAreaView>
  );
};

export default App;
