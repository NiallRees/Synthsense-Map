import React, { Component } from "react";
import './sidebar.css';
import Switch from './switch';
import schemas from '../schemas';

class Sidebar extends Component {

  viewSideBar(sensor) {
    if (this.props.state.viewMarkers.length === 0) {
      return (<p className="title">No data imported</p>)
    } else if (sensor == null) {
      return (<p className="title">No sensor selected</p>)
    } else {
    const listItems = sensor.data.map((d) => 
      <li className="datum" key={Object.keys(d)[0]}>{Object.keys(d)[0]}: {Object.values(d)[0]}</li>
    );
    return (
      <>
      <p className="title">{sensor.name}</p>
      <ul className='data' >
        {listItems}
      </ul>
      <button className="sidebar-button" type="button"
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
          <p className="title">Add a Takeoff Point</p>
      )
    } else if (this.props.state.planRouteMarkers.length < 1) {
      return (
          <p className="title">Select the First Sensor</p>
      )
    } else { 
      return (
        <p className="title">Select the Next Sensor</p>
      )
    }
  }

  planSideBar() {
    const selectedMarker = this.props.state.selectedMarker;
    const buildRouteMode = this.props.state.buildRouteMode;
    if (buildRouteMode) {
      return (
        <>
          <p className="title">Build Route</p>
          {this.buildRouteSideBar()}
          <button className="sidebar-button" type="button"
          onClick={(e) => {
            this.props.undoBuildRouteClickHandler();
          }}
          >
          Undo
          </button>
          <button className="sidebar-button" type="button"
          onClick={(e) => {
            this.props.resetBuildRouteClickHandler();
          }}
          >
          Reset
          </button>
          <button className="sidebar-button" type="button"
          onClick={(e) => {
            this.props.exportBuildRouteClickHandler();
          }}
          >
          Export
          </button>
          <button className="sidebar-button" type="button"
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
          <p className="title">No Marker Selected</p>
          <div>
            <button className="sidebar-button" type="button"
            onClick={(e) => {
              this.props.buildRouteClickHandler();
            }}
            >
            Build Route
            </button>
          </div>
          <div>
            <button className="sidebar-button" type="button"
            onClick={(e) => {
              this.props.clearMarkersClickHandler();
            }}
            >
            Clear Markers
            </button>
          </div>
          <div className="fields-div">
            {Object.keys(schemas.Flight).map(key =>
              <div className="field-div" key={key}>
                <p key={key} className="field-name">{schemas.Flight[key]["Human Readable"]}</p>
                <p className="field-value">
                  <input
                      className="field-input"
                      type="text"
                      name={key}
                      onChange={this.props.updatePlanFlightParameters.bind(this)}
                      onBlur={this.props.validatePlanFlightParameters.bind(this)}
                      value={this.props.state.stagingPlanFlightParameters[key]}
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
          <div className="fields-div">
            <p className="title">{selectedMarker.name}</p>
            {Object.keys(schemas[selectedMarker.type]).map(key =>
              <div className="field-div" key={key}>
                <p key={key} className="field-name">{schemas[selectedMarker.type][key]["Human Readable"]}</p>
                <p className="field-value">
                  <input 
                    className="field-input"
                    type="text" 
                    name={key} 
                    onChange={this.props.updateSelectedMarker.bind(this)}
                    onBlur={this.props.validateMarker.bind(this)} 
                    value={selectedMarker[key]}
                  >
                  </input>
                </p>
              </div>
            )}
          </div>
          <button className="sidebar-button" type="button"
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

  calculateCoordDistance(lat1, lat2, lon1, lon2) {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI/180; // φ, λ in radians
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // in metres
    return(d)
  }

  routeDistance() {
    var length = 0
    var marker1 = this.props.state.planTakeoff
    var d
    for (let marker2 of this.props.state.planRouteMarkers) {
      d = this.calculateCoordDistance(marker1.latitude, marker2.latitude, marker1.longitude, marker2.longitude)
      length += d
      marker1 = marker2
    }
    return length
  }

  routeAscent() {
    var ascent = 0
    var marker1 = this.props.state.planTakeoff
    var h
    for (let marker2 of this.props.state.planRouteMarkers) {
      h = Math.max(marker2.elevation - marker1.elevation, 0) + this.props.state.planFlightParameters.altitude
      ascent += h
      marker1 = marker2
    }
    return ascent
  }

  airTime() {
    var seconds = 0
    if (this.routeDistance() > 0) {
      seconds += this.routeDistance() / this.props.state.planFlightParameters.horizontalSpeed
      seconds += this.routeAscent() / this.props.state.planFlightParameters.ascendingSpeed
      seconds += this.routeAscent() / this.props.state.planFlightParameters.descendingSpeed
    }
    return ((seconds/60).toFixed(0).padStart(2, '0') + ':' + (seconds % 60).toFixed(0).padStart(2, '0'))
  }

  flightPlanInfoCalcs() {
    return(
      <>
        <div id="bottom-flight-info" className="fields-div">
          <div className="field-div">
            <p className="field-name">Total Air Time (m:s)</p>
            <p id="bottom-flight-info-value" className="field-value">{this.airTime()}</p>
          </div>
          <div className="field-div">
            <p className="field-name">Total Route Length (m)</p>
            <p id="bottom-flight-info-value" className="field-value">{this.routeDistance().toFixed(0)}</p>
          </div>
          <div className="field-div">
            <p className="field-name">Total Route Ascent (m)</p>
            <p id="bottom-flight-info-value" className="field-value">{this.routeAscent().toFixed(0)}</p>
          </div>
        </div>
      </>
    )
  }

  sidebar() {
    if (this.props.state.mode === "view") {
      return (
        this.viewSideBar(this.props.state.selectedMarker)
      )
    }

    if (this.props.state.mode === "plan") {
      return (
        <>
          {this.planSideBar(this.props.state.selectedMarker)}
          {this.flightPlanInfoCalcs()}
        </>
      )
    }
  }  

  render() {
    return (
      <div className="sidebar">
      {this.sidebar()}
      <div className="mode-container">
        <div className="mode-element" id="mode-left">View</div>
        <div className="mode-element">
        <Switch
          isOn={this.props.state.switchIsOn}
          handleToggle={this.props.handleToggle}
        />
        </div>
        <div className="mode-element" id="mode-right">Plan</div>
      </div>
    </div>
    );
  }
};

export default Sidebar;