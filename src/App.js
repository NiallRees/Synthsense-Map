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
      planRouteLineCoords: [],
      planTakeoff: null,
      selectedMarker: null,
      switchIsOn: false,
      mode: "view",
      buildRouteMode: false,
      mouseCoords: {
        latitude: 52.405436044104256,
        longitude: -0.32935776356134167
      },
      PinPrompt: {
        'enabled': false,
        'longitude': 0,
        'latitude': 0
      }
    };

    this.markerClickHandler = this.markerClickHandler.bind(this);
    this.resetselectedMarker = this.resetselectedMarker.bind(this);
    this.setPinPrompt = this.setPinPrompt.bind(this);
    this.viewDataClickHandler = this.viewDataClickHandler.bind(this);
    this.buildRouteClickHandler = this.buildRouteClickHandler.bind(this);
    this.exitBuildRouteClickHandler = this.exitBuildRouteClickHandler.bind(this);
    this.removeMarkerClickHandler = this.removeMarkerClickHandler.bind(this);
    this.updateMarker = this.updateMarker.bind(this);
    this.updateMouseCoords = this.updateMouseCoords.bind(this);
    this.addPlanPin = this.addPlanPin.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  } 

  markerClickHandler(marker) {
    if (this.state.buildRouteMode === false) {
      this.setState({
        selectedMarker: marker
      })
    } else {
      if (!containsObject(marker, this.state.planRouteSensors)) {
        this.setState(prevState => ({
          planRouteSensors: [...prevState.planRouteSensors, marker],
          planRouteLineCoords: [...prevState.planRouteLineCoords, [marker['longitude'], marker['latitude']]]
        }))
      }
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

  updateMouseCoords(lngLat) {
    this.setState({
      mouseCoords: {
        longitude: lngLat[0],
        latitude: lngLat[1]
      }
    })
  }

  resetselectedMarker() {
    this.setState({
      selectedMarker: null
    })
  }

  viewDataClickHandler(sensor) {
    ipcRenderer.send('asynchronous-message', sensor.name)
  }

  exitBuildRouteClickHandler() {
    this.setState({
      buildRouteMode: false
    })
  }

  buildRouteClickHandler() {
    this.setState({
      buildRouteMode: true
    })
    if (this.state.planTakeoff !== null) {
      this.setState({
        planRouteLineCoords: [[this.state.planTakeoff['longitude'], this.state.planTakeoff['latitude']]]
      })
    }
  }

  removeMarkerClickHandler(selectedMarker) {
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
        "id": this.makeid(8),
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
        "name": "Takeoff",
        "longitude": pinPrompt.longitude,
        "latitude": pinPrompt.latitude,
      }
      this.setState({
        planTakeoff: takeoff
      })
      if (this.state.planRouteLineCoords.length < 1) {
        this.setState({
          planRouteLineCoords: [[takeoff['longitude'], takeoff['latitude']]]
        })
      }
    }
  }

  setPinPrompt(lngLat) {
    this.state.PinPrompt.enabled = true;
    this.state.PinPrompt.longitude = lngLat[0];
    this.state.PinPrompt.latitude = lngLat[1];
  }

  handleToggle() {
    if (!this.state.switchIsOn) {
      this.setState({
        switchIsOn: true,
        mode: 'plan'
      })
      if (this.state.planSensors.length === 0) {
        this.setState({
          planSensors: this.state.viewSensors
        })
      }
    }

    if (this.state.switchIsOn) {
      this.setState({
        switchIsOn: false,
        mode: 'view'
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
            planRouteLineCoords={this.state.planRouteLineCoords}
            takeoff={this.state.switchIsOn ? this.state.planTakeoff : null}
            selectedMarker={this.state.selectedMarker} 
            markerClickHandler={this.markerClickHandler}
            addPlanPin={this.addPlanPin}
            resetselectedMarker={this.resetselectedMarker}
            setPinPrompt={this.setPinPrompt}
            PinPrompt={this.state.PinPrompt}
            updateMouseCoords={this.updateMouseCoords}
            mode={this.state.mode}
          />
          <div id="coords-box">
            <pre id="coord">Latitude: {this.state.mouseCoords.latitude}</pre><pre id="coord">Longitude: {this.state.mouseCoords.longitude}</pre>
          </div>
        </div>
        <aside>
          <Sidebar
            state={this.state}
            handleToggle={this.handleToggle}
            viewDataClickHandler={this.viewDataClickHandler}
            buildRouteClickHandler={this.buildRouteClickHandler}
            exitBuildRouteClickHandler={this.exitBuildRouteClickHandler}
            removeMarkerClickHandler={this.removeMarkerClickHandler}
            updateMarker={this.updateMarker}
          />
        </aside>
      </div>
    );
  }
}

export default App;
