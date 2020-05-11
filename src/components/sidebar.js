import React, { Component } from "react";
import './sidebar.css';
import Switch from './switch';
import schemas from '../schemas';

class Sidebar extends Component {

  viewSideBar(sensor) {
    if (this.props.state.viewMarkers.length === 0) {
      return (<p class="title">No data imported</p>)
    } else if (sensor == null) {
      return (<p class="title">No sensor selected</p>)
    } else {
    const listItems = sensor.data.map((d) => 
      <li class="datum" key={Object.keys(d)[0]}>{Object.keys(d)[0]}: {Object.values(d)[0]}</li>
    );
    return (
      <>
      <p class="title">{sensor.name}</p>
      <ul class='data' >
        {listItems}
      </ul>
      <button class="sidebar-button" type="button"
        onClick={(e) => {
        this.props.viewDataClickHandler(sensor);
        }}
      >
        View Data
      </button>
      </>
    )
    }
  }

  buildRouteSideBar() {
    if (this.props.state.planTakeoff == null) {
      return (
          <p class="title">Add a Takeoff Point</p>
      )
    } else if (this.props.state.planRouteSensors.length < 1) {
      return (
          <p class="title">Select the First Sensor</p>
      )
    } else { 
      return (
        <p class="title">Select the Next Sensor</p>
      )
    }
  }

  planSideBar() {
    const selectedMarker = this.props.state.selectedMarker;
    const buildRouteMode = this.props.state.buildRouteMode;
    if (buildRouteMode) {
      return (
        <>
          <p class="title">Build Route</p>
          {this.buildRouteSideBar()}
          <button class="sidebar-button" type="button"
          onClick={(e) => {
            this.props.undoBuildRouteClickHandler();
          }}
          >
          Undo
          </button>
          <button class="sidebar-button" type="button"
          onClick={(e) => {
            this.props.resetBuildRouteClickHandler();
          }}
          >
          Reset
          </button>
          <button class="sidebar-button" type="button"
          onClick={(e) => {
            this.props.exportBuildRouteClickHandler();
          }}
          >
          Export
          </button>
          <button class="sidebar-button" type="button"
          onClick={(e) => {
            this.props.exitBuildRouteClickHandler();
          }}
          >
          Exit
          </button>
        </>
      )
    } else if (selectedMarker == null) {
      return (
        <>
          <p class="title">No Marker Selected</p>
          <div>
            <button class="sidebar-button" type="button"
            onClick={(e) => {
              this.props.buildRouteClickHandler();
            }}
            >
            Build Route
            </button>
          </div>
          <div>
            <button class="sidebar-button" type="button"
            onClick={(e) => {
              this.props.clearMarkersClickHandler();
            }}
            >
            Clear Markers
            </button>
          </div>
          <div class="fields-div">
            {Object.keys(schemas.Flight).map(key =>
              <div class="field-div" key={key}>
                <p key={key} class="field-name">{schemas.Flight[key]["Human Readable"]}</p>
                <p class="field-input-p">
                  <input
                      class="field-input"
                      type="text"
                      name={key}
                      onChange={this.props.updateFlightParameters.bind(this)} 
                      value={this.props.state.planFlightParameters[key]}
                    >
                  </input>
                </p>
              </div>
            )}
          </div>
        </>
      )
    } else {
      return(
        <>
          <div class="fields-div">
            <p class="title">{selectedMarker.name}</p>
            {Object.keys(schemas[selectedMarker.type]).map(key =>
              <div class="field-div" key={key}>
                <p key={key} class="field-name">{schemas[selectedMarker.type][key]["Human Readable"]}</p>
                <p class="field-input-p">
                  <input 
                    class="field-input"
                    type="text" 
                    name={key} 
                    onChange={this.props.updateMarker.bind(this)} 
                    value={selectedMarker[key]}
                  >
                  </input>
                </p>
              </div>
            )}
          </div>
          <button class="sidebar-button" type="button"
          onClick={(e) => {
            this.props.removeMarkerClickHandler(selectedMarker);
          }}
          >
          Delete
          </button>
        </>
      )
    }
  }

  sidebar() {
    if (this.props.state.mode === "view") {
      return (
        this.viewSideBar(this.props.state.selectedMarker)
      )
    }

    if (this.props.state.mode === "plan") {
      return (
        this.planSideBar(this.props.state.selectedMarker)
      )
    }
  }  

  render() {
    return (
      <div class="sidebar">
      {this.sidebar()}
      <div class="mode-container">
        <div class="mode-element" id="mode-left">View</div>
        <div class="mode-element">
        <Switch
          isOn={this.props.state.switchIsOn}
          handleToggle={this.props.handleToggle}
        />
        </div>
        <div class="mode-element" id="mode-right">Plan</div>
      </div>
    </div>
    );
  }
};

export default Sidebar;