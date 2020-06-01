import React from "react";
import '../sidebar.css';

function BuildRoute(props) {

  const buildRouteTips = () => {
    if (props.planTakeoff == null) {
      return (
          <p className="title">Add a Takeoff Point</p>
      )
    } else if (props.planRouteMarkers.length < 1) {
      return (
          <p className="title">Select the First Sensor</p>
      )
    } else { 
      return (
        <p className="title">Select the Next Sensor</p>
      )
    }
  }

  return (
    <>
      <p className="title">Build Route</p>
      {buildRouteTips()}
      <button className="sidebar-button" type="button"
      onClick={(e) => {
        props.undoBuildRouteClickHandler();
      }}
      >
      Undo
      </button>
      <button className="sidebar-button" type="button"
      onClick={(e) => {
        props.resetBuildRouteClickHandler();
      }}
      >
      Reset
      </button>
      <button className="sidebar-button" type="button"
      onClick={(e) => {
        props.exportBuildRouteClickHandler();
      }}
      >
      Export
      </button>
      <button className="sidebar-button" type="button"
      onClick={(e) => {
        props.exitBuildRouteClickHandler();
      }}
      >
      Exit
      </button>
    </>
  )
}

export default BuildRoute;