import React, { Component } from "react";
import './sidebar.css';
import Switch from './switch';

class Sidebar extends Component {

    viewSideBar(sensor) {
        if (this.props.state.viewSensors.length === 0) {
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
                this.props.viewDataClickHandler(sensor);
              }}
            >
              View Data
            </button>
          </>
        )
        }
    }

    planSideBar(marker) {
        if (marker == null) {
            return (<p id="title">No marker selected</p>)
        } else {
            return(
                <>
                    <p id="title">Name: <input type="text" name="name" onChange={this.props.updateMarker.bind(this)} value={marker.name}></input></p>
                    <p id="title">Latitude: <input type="text" name="latitude" onChange={this.props.updateMarker.bind(this)} value={marker.latitude}></input></p>
                    <p id="title">Longitude: <input type="text" name="longitude" onChange={this.props.updateMarker.bind(this)} value={marker.longitude}></input></p>
                    <button className="sidebar-button" type="button"
                    onClick={(e) => {
                        this.props.removeMarkerClickHandler(marker);
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
            return(
                this.viewSideBar(this.props.state.selectedMarker)
            )
        }

        if (this.props.state.mode === "plan") {
            return(
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