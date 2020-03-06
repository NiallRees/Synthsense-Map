import React, { Component } from 'react';
import './App.css';
import Map from './components/map';
import Sidebar from './components/sidebar';
import * as sensorData from "./data/sensors.json";
const { ipcRenderer } = window.require('electron');

class App extends Component {
  constructor() {
    super();
    this.state = {
      viewSensors: sensorData.sensors,
      planSensors: [],
      planTakeoff: null,
      selectedMarker: null,
      switchIsOn: false,
      mode: "view",
      mouseCoords: {
        lat: 52.405436044104256,
        lng: -0.32935776356134167
      },
      PinPrompt: {
        'enabled': false,
        'lng': 0,
        'lat': 0
      }
    };

    this.markerClickHandler = this.markerClickHandler.bind(this);
    this.resetselectedMarker = this.resetselectedMarker.bind(this);
    this.setPinPrompt = this.setPinPrompt.bind(this);
    this.viewDataClickHandler = this.viewDataClickHandler.bind(this);
    this.removeMarkerClickHandler = this.removeMarkerClickHandler.bind(this);
    this.updateMarker = this.updateMarker.bind(this);
    this.updateMouseCoords = this.updateMouseCoords.bind(this);
    this.addPlanPin = this.addPlanPin.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  } 

  markerClickHandler(marker) {
    this.setState({
      selectedMarker: marker
    })
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
        lng: lngLat[0],
        lat: lngLat[1]
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
        "longitude": pinPrompt.lng,
        "latitude": pinPrompt.lat,
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
        "longitude": pinPrompt.lng,
        "latitude": pinPrompt.lat,
      }
      this.setState({
        planTakeoff: takeoff
      })
    }
  }

  setPinPrompt(lngLat) {
    this.state.PinPrompt.enabled = true;
    this.state.PinPrompt.lng = lngLat[0];
    this.state.PinPrompt.lat = lngLat[1];
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
            <pre id="coord">Latitude: {this.state.mouseCoords.lat}</pre><pre id="coord">Longitude: {this.state.mouseCoords.lng}</pre>
          </div>
        </div>
        <aside>
          <Sidebar
            state={this.state}
            handleToggle={this.handleToggle}
            viewDataClickHandler={this.viewDataClickHandler}
            removeMarkerClickHandler={this.removeMarkerClickHandler}
            updateMarker={this.updateMarker}
          />
        </aside>
      </div>
    );
  }
}

export default App;
