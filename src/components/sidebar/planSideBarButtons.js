import React from "react";
import '../sidebar.css';

function PlanSideBarButtons(props) {
  return(
    <>
      <button className="sidebar-button" type="button"
      onClick={(e) => {
        props.savePlanClickHandler();
      }}
      >
      Save Plan
      </button>
      <button className="sidebar-button" type="button"
      onClick={(e) => {
        props.importPlanClickHandler();
      }}
      >
      Import Plan
      </button>
      <button className="sidebar-button" type="button"
      onClick={(e) => {
        props.buildRouteClickHandler();
      }}
      >
      Build Route
      </button>
      <button className="sidebar-button" type="button"
      onClick={(e) => {
        props.clearMarkersClickHandler();
      }}
      >
      Clear Markers
      </button>
    </>
  )
}

export default PlanSideBarButtons;