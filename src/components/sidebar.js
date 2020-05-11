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
    } else if (this.props.state.planRouteSensors.length < 1) {
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
                <p className="field-input-p">
                  <input
                      className="field-input"
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
          <div className="fields-div">
            <p className="title">{selectedMarker.name}</p>
            {Object.keys(schemas[selectedMarker.type]).map(key =>
              <div className="field-div" key={key}>
                <p key={key} className="field-name">{schemas[selectedMarker.type][key]["Human Readable"]}</p>
                <p className="field-input-p">
                  <input 
                    className="field-input"
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