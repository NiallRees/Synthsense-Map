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

    planSideBar(sensor) {
        if (sensor == null) {
            return (<p id="title">No sensor selected</p>)
        } else {
            return(
                <>
                    <p id="title">Name: {sensor.name}</p>
                    <p id="title">Latitude: {sensor.latitude}</p>
                    <p id="title">Longitude: {sensor.longitude}</p>
                    <button className="sidebar-button" type="button"
                    onClick={(e) => {
                        this.props.removeSensorClickHandler(sensor);
                    }}
                    >
                    Remove Sensor
                    </button>
                </>
            )
        }
    }

    sidebar() {
        if (this.props.state.mode === "view") {
            return(
                this.viewSideBar(this.props.state.selectedSensor)
            )
        }

        if (this.props.state.mode === "plan") {
            return(
                this.planSideBar(this.props.state.selectedSensor)
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