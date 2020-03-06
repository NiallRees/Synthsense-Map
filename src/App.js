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
      selectedSensor: null,
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
    this.resetSelectedSensor = this.resetSelectedSensor.bind(this);
    this.setPinPrompt = this.setPinPrompt.bind(this);
    this.viewDataClickHandler = this.viewDataClickHandler.bind(this);
    this.removeSensorClickHandler = this.removeSensorClickHandler.bind(this);
    this.updateSensor = this.updateSensor.bind(this);
    this.updateMouseCoords = this.updateMouseCoords.bind(this);
    this.addPlanSensor = this.addPlanSensor.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  } 

  markerClickHandler(sensor) {
    this.setState({
      selectedSensor: sensor
    })
  }

  updateSensor(input) {
    var updatedSensor = { ...this.state.selectedSensor};
    const newValue = input.target.name === 'name' ? input.target.value : parseFloat(input.target.value);
    updatedSensor[input.target.name] = newValue;
    this.setState(prevState => ({
      planSensors: [...prevState.planSensors.filter(sensor => sensor['id'] !== this.state.selectedSensor['id']), updatedSensor],
      selectedSensor: updatedSensor
    }))
  }

  updateMouseCoords(lngLat) {
    this.setState({
      mouseCoords: {
        lng: lngLat[0],
        lat: lngLat[1]
      }
    })
  }

  resetSelectedSensor() {
    this.setState({
      selectedSensor: null
    })
  }

  viewDataClickHandler(sensor) {
    ipcRenderer.send('asynchronous-message', sensor.name)
  }

  removeSensorClickHandler(selectedSensor) {
    this.setState(prevState => ({
      planSensors: prevState.planSensors.filter(sensor => sensor['id'] !== selectedSensor['id']),
      selectedSensor: null
    }))
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

  addPlanSensor(pinPrompt, pinType) {
    const newSensor = {
      "id": this.makeid(8), // Make this a generated id
      "name": "New Sensor",
      "longitude": pinPrompt.lng,
      "latitude": pinPrompt.lat,
      "data": []
    }
    this.setState(prevState => ({
      planSensors: [...prevState.planSensors, newSensor]
    }))
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
      selectedSensor: null
    })
  }

  render() {
    return (
      <div className="container">
        <div className="map">
          <Map 
            sensors={this.state.switchIsOn ? this.state.planSensors : this.state.viewSensors}
            selectedSensor={this.state.selectedSensor} 
            markerClickHandler={this.markerClickHandler}
            addPlanSensor={this.addPlanSensor}
            resetSelectedSensor={this.resetSelectedSensor}
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
            removeSensorClickHandler={this.removeSensorClickHandler}
            updateSensor={this.updateSensor}
          />
        </aside>
      </div>
    );
  }
}

export default App;
