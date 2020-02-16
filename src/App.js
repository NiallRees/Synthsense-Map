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
      sensors: sensorData.sensors,
      selected_sensor: null,
      switchIsOn: false,
      mode: "view",
      pinPrompt: {
        'enabled': false,
        'lng': 0,
        'lat': 0
      }
    };

    this.markerClickHandler = this.markerClickHandler.bind(this);
    this.mapClickHandler = this.mapClickHandler.bind(this);
    this.renderPinPrompt = this.renderPinPrompt.bind(this);
    this.viewDataClickHandler = this.viewDataClickHandler.bind(this);
  } 

  markerClickHandler(sensor) {
    this.setState({
      selected_sensor: sensor
    })
  }

  mapClickHandler() {
    this.setState({
      selected_sensor: null,
      pinPrompt: {
        'enabled': false,
        'lng': 0,
        'lat': 0
      }
    })
  }

  viewDataClickHandler(sensor) {
    ipcRenderer.send('asynchronous-message', sensor.name)
  }

  renderMarkerData(sensor) {
    if (this.state.sensors.length === 0) {
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

  renderPinPrompt(lngLat) {
    this.state.pinPrompt.enabled = true;
    this.state.pinPrompt.lng = lngLat[0];
    this.state.pinPrompt.lng = lngLat[1];
  }

  renderSideBar(state) {
    return (
      <>
        {this.renderMarkerData(state.selected_sensor)}
        <div className="mode-container">
            <div className="mode-element" id="mode-left">View</div>
            <div className="mode-element">
              <Switch
                isOn={state.switchIsOn}
                handleToggle={() => this.setState({ switchIsOn: !state.switchIsOn,  mode: (state.switchIsOn ? 'view' : 'plan')})}
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
            sensors={this.state.sensors}
            selected_sensor={this.state.selected_sensor} 
            markerClickHandler={this.markerClickHandler} 
            mapClickHandler={this.mapClickHandler}
            renderPinPrompt={this.renderPinPrompt}
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
