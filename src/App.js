import React, { Component } from 'react';
import './App.css';
import Map from './components/map';
import Sidebar from './components/sidebar';
import * as sensorData from "./data/sensors.json";
const { ipcRenderer } = window.require('electron');

function containsObject(obj, list) {
  var i;
  for (i = 0; i < list.length; i++) {
      if (list[i] === obj) {
          return true;
      }
  }

  return false;
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      viewSensors: sensorData.sensors,
      planSensors: [],
      planRouteSensors: [],
      planTakeoff: null,
      selectedMarker: null,
      switchIsOn: false,
      mode: 'view',
      buildRouteMode: false,
      mouseCoords: {
        latitude: 52.405436044104256,
        longitude: -0.32935776356134167
      },
      pinPrompt: {
        'enabled': false,
        'longitude': 0,
        'latitude': 0
      }
    };

    this.markerClickHandler = this.markerClickHandler.bind(this);
    this.resetSelectedMarker = this.resetSelectedMarker.bind(this);
    this.setPinPrompt = this.setPinPrompt.bind(this);
    this.pinPromptClickHandler = this.pinPromptClickHandler.bind(this);
    this.mapClickHandler = this.mapClickHandler.bind(this);
    this.viewDataClickHandler = this.viewDataClickHandler.bind(this);
    this.buildRouteClickHandler = this.buildRouteClickHandler.bind(this);
    this.exitBuildRouteClickHandler = this.exitBuildRouteClickHandler.bind(this);
    this.resetBuildRouteClickHandler = this.resetBuildRouteClickHandler.bind(this);
    this.exportBuildRouteClickHandler = this.exportBuildRouteClickHandler.bind(this);
    this.undoBuildRouteClickHandler = this.undoBuildRouteClickHandler.bind(this);
    this.removeMarkerClickHandler = this.removeMarkerClickHandler.bind(this);
    this.updateMarker = this.updateMarker.bind(this);
    this.updateMouseCoords = this.updateMouseCoords.bind(this);
    this.addPlanPin = this.addPlanPin.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }

  planRouteMarkerClickHandler(marker) {
    if (!containsObject(marker, this.state.planRouteSensors) && this.state.planTakeoff) {
      this.setState(prevState => ({
        planRouteSensors: [...prevState.planRouteSensors, marker]
      }))
    }
  }

  markerClickHandler(marker) {
    if (this.state.buildRouteMode === false) {
      this.setState({
        selectedMarker: marker
      })
    } else {
      this.planRouteMarkerClickHandler(marker);
    }
  }

  updateMarker(input) {
    var updatedMarker = { ...this.state.selectedMarker};
    const newValue = input.target.name === 'name' ? input.target.value : parseFloat(input.target.value);
    updatedMarker[input.target.name] = newValue;
    if (this.state.selectedMarker === this.state.planTakeoff) {
      this.setState({
        planTakeoff: updatedMarker,
        selectedMarker: updatedMarker
      })
    } else {
      this.setState(prevState => ({
        planSensors: [...prevState.planSensors.filter(sensor => sensor['id'] !== this.state.selectedMarker['id']), updatedMarker],
        selectedMarker: updatedMarker
      }))
    }
  }

  mapClickHandler(e) {
    if(e.leftButton) {
      this.resetSelectedMarker();
      this.setState({
        pinPrompt: {
          'enabled': false,
          'longitude': 0,
          'latitude': 0
        }
      })
    }
  }

  updateMouseCoords(lngLat) {
    this.setState({
      mouseCoords: {
        longitude: lngLat[0],
        latitude: lngLat[1]
      }
    })
  }

  resetSelectedMarker() {
    this.setState({
      selectedMarker: null
    })
  }

  viewDataClickHandler(sensor) {
    ipcRenderer.send('open_data_folder', sensor.name)
  }

  exitBuildRouteClickHandler() {
    this.setState({
      buildRouteMode: false
    })
  }

  resetBuildRouteClickHandler() {
    this.setState({
      planRouteSensors: []
    })
  }

  exportBuildRouteClickHandler() {
    ipcRenderer.send('export_route', this.state.planRouteSensors)
  }

  undoBuildRouteClickHandler() {
    const planRouteSensors = [...this.state.planRouteSensors];
    planRouteSensors.pop();
    this.setState({
      planRouteSensors: planRouteSensors
    })
  }

  buildRouteClickHandler() {
    this.setState({
      buildRouteMode: true
    })
  }

  removeMarkerClickHandler(selectedMarker) {
    this.setState({
      planRouteSensors: []
    })
    if (selectedMarker === this.state.planTakeoff) {
      this.setState({
        planTakeoff: null,
        selectedMarker: null
      })
    } else {
      this.setState(prevState => ({
        planSensors: prevState.planSensors.filter(sensor => sensor['id'] !== selectedMarker['id']),
        selectedMarker: null
      }))
    }
  }

  makeid(length) {
    // Taken from https://stackoverflow.com/a/1349426
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

  addPlanPin(pinPrompt, pinType) {
    if (pinType === "sensor") {
      const newSensor = {
        "id": this.makeid(8), // TODO add collision prevention
        "type": "Sensor",
        "name": "New Sensor",
        "longitude": pinPrompt.longitude,
        "latitude": pinPrompt.latitude,
        "data": []
      }
      this.setState(prevState => ({
        planSensors: [...prevState.planSensors, newSensor]
      }))
    }

    if (pinType === "takeoff") {
      const takeoff = {
        "id": this.makeid(8),
        "type": "Takeoff",
        "name": "Takeoff",
        "longitude": pinPrompt.longitude,
        "latitude": pinPrompt.latitude,
      }
      this.setState({
        planTakeoff: takeoff
      })
    }
  }

  setPinPrompt(lngLat) {
    if (this.state.mode === "plan") {
      this.setState({
        pinPrompt: {
          'enabled': true,
          'longitude': lngLat[0],
          'latitude': lngLat[1]
        }
      })
    }
  }

  pinPromptClickHandler(pinPrompt, pinType) {
    this.setState({
      pinPrompt: {
        'enabled': false,
        'longitude': 0,
        'latitude': 0
      }
    })
    this.addPlanPin(pinPrompt, pinType)
  }

  handleToggle() {
    if (!this.state.switchIsOn) {
      this.setState({
        mode: 'plan',
        switchIsOn: true
      })
      if (this.state.planSensors.length === 0) {
        this.setState({
          planSensors: this.state.viewSensors.map(sensor => (
            {
              id: sensor.id,
              type: sensor.type,
              name: sensor.name,
              longitude: sensor.longitude,
              latitude: sensor.latitude
            }
          ))
        })
      }
    }

    if (this.state.switchIsOn) {
      this.setState({
        mode: 'view',
        buildRouteMode: false,
        switchIsOn: false
      })
    }      
    
    this.setState({
      selectedMarker: null
    })
  }

  render() {
    return (
      <div className="container">
        <div className="map">
          <Map 
            sensors={this.state.switchIsOn ? this.state.planSensors : this.state.viewSensors}
            planRouteSensors={this.state.planRouteSensors}
            takeoff={this.state.switchIsOn ? this.state.planTakeoff : null}
            selectedMarker={this.state.selectedMarker} 
            markerClickHandler={this.markerClickHandler}
            addPlanPin={this.addPlanPin}
            resetSelectedMarker={this.resetSelectedMarker}
            setPinPrompt={this.setPinPrompt}
            pinPrompt={this.state.pinPrompt}
            updateMouseCoords={this.updateMouseCoords}
            mode={this.state.mode}
            buildRouteMode={this.state.buildRouteMode}
            mouseCoords={this.state.mouseCoords}
            pinPromptClickHandler={this.pinPromptClickHandler}
            mapClickHandler={this.mapClickHandler}
          />
        </div>
        <aside>
          <Sidebar
            state={this.state}
            handleToggle={this.handleToggle}
            viewDataClickHandler={this.viewDataClickHandler}
            buildRouteClickHandler={this.buildRouteClickHandler}
            exitBuildRouteClickHandler={this.exitBuildRouteClickHandler}
            exportBuildRouteClickHandler={this.exportBuildRouteClickHandler}
            resetBuildRouteClickHandler={this.resetBuildRouteClickHandler}
            undoBuildRouteClickHandler={this.undoBuildRouteClickHandler}
            removeMarkerClickHandler={this.removeMarkerClickHandler}
            updateMarker={this.updateMarker}
          />
        </aside>
      </div>
    );
  }
}

export default App;
