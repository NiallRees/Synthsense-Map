import React, { Component } from 'react';
import './App.css';
import Map from './components/map';
import Switch from './components/switch';
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

  renderMarkerData(sensor) {
    if (this.state.viewSensors.length === 0) {
      return (<p id="title">No data imported</p>)
    } else if (sensor == null) {
      return (<p id="title">No sensor selected</p>)
    } else {
    const listItems = sensor.data.map((d) => <li className="datum" key={Object.keys(d)[0]}>{Object.keys(d)[0]}: {Object.values(d)[0]}</li>);
    return (
      <>
        <p id="title">{sensor.name}</p>
        <ul className='data' >
          {listItems}
        </ul>
        <button className="sidebar-button" type="button"
          onClick={(e) => {
            this.viewDataClickHandler(sensor);
          }}
        >
          View Data
        </button>
      </>
    )
    }
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

  setPinPrompt(lngLat) {
    this.state.PinPrompt.enabled = true;
    this.state.PinPrompt.lng = lngLat[0];
    this.state.PinPrompt.lat = lngLat[1];
  }

  renderSideBar(state) {
    return (
      <>
        {this.renderMarkerData(state.selectedSensor)}
        <div className="mode-container">
            <div className="mode-element" id="mode-left">View</div>
            <div className="mode-element">
              <Switch
                isOn={state.switchIsOn}
                handleToggle={this.handleToggle}
              />
            </div>
            <div className="mode-element" id="mode-right">Plan</div>
        </div>
      </>
    );
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
          <div className="sensor-data">
            {this.renderSideBar(this.state)}
          </div>
        </aside>
      </div>
    );
  }
}

export default App;
