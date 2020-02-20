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
    this.addPlanSensor = this.addPlanSensor.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  } 

  markerClickHandler(sensor) {
    this.setState({
      selectedSensor: sensor
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

  addPlanSensor(pinPrompt, pinType) {
    const newSensor = {
      "id": "New Sensor", // Make this a generated id
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
            mode={this.state.mode}
          />
        </div>
        <aside>
          <Sidebar
            state={this.state}
            handleToggle={this.handleToggle}
            viewDataClickHandler={this.viewDataClickHandler}
          />
        </aside>
      </div>
    );
  }
}

export default App;
