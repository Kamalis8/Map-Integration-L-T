import React from 'react';
import {SafeAreaView} from 'react-native';
import MyMapComponent from './src/component/MapComponent';
import MapClickComponent from './src/component/MapClickComponent';
import MapPolylineComponent from './src/component/MapPolylineComponent';
import MarkingComponent from './src/component/MarkingComponent';
import MarkingComponentColor from './src/component/MarkingComponentColor';
import MarkingComponentIndicator from './src/component/MarkingComponentIndicator';
import MarkingComponentDrag from './src/component/MarkingComponentDrag';


const App = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <MarkingComponentDrag />
    </SafeAreaView>
  );
};

export default App;
