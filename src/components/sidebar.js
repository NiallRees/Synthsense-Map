import React from "react";
import './sidebar.css';
import Switch from './sidebar/switch';
import FlightPlanInfoCalcs from './sidebar/flightPlanInfoCalcs';
import ViewFlightInfo from "./sidebar/viewFlightInfo";
import PlanSideBar from "./sidebar/planSideBar";
import ViewSideBar from "./sidebar/viewSideBar";

function Sidebar(props) {

  const sidebar = () => {
    if (props.state.mode === "view") {
      return (
        <>
          <ViewSideBar
            selectedMarker={props.state.selectedMarker}
            viewMarkers={props.state.viewMarkers}
            importViewDataClickHandler={props.importViewDataClickHandler}
            viewDataClickHandler={props.viewDataClickHandler}
          />
          <ViewFlightInfo 
            flightInfo={props.state.viewFlightInfo}
          />
        </>
      )
    }

    if (props.state.mode === "plan") {
      return (
        <>
          <PlanSideBar
            planTakeoff={props.state.planTakeoff}
            selectedMarker={props.state.selectedMarker}
            buildRouteMode={props.state.buildRouteMode}
            planRouteMarkers={props.state.planRouteMarkers}
            undoBuildRouteClickHandler={props.undoBuildRouteClickHandler}
            resetBuildRouteClickHandler={props.resetBuildRouteClickHandler}
            exportBuildRouteClickHandler={props.exportBuildRouteClickHandler}
            exitBuildRouteClickHandler={props.exitBuildRouteClickHandler}
            savePlanClickHandler={props.savePlanClickHandler}
            importPlanClickHandler={props.importPlanClickHandler}
            buildRouteClickHandler={props.buildRouteClickHandler}
            clearMarkersClickHandler={props.clearMarkersClickHandler}
            updatePlanFlightParameters={props.updatePlanFlightParameters}
            validatePlanFlightParameters={props.validatePlanFlightParameters}
            stagingPlanFlightParameters={props.state.stagingPlanFlightParameters}
            updateSelectedMarker={props.updateSelectedMarker}
            validateMarker={props.validateMarker}
            removeMarkerClickHandler={props.removeMarkerClickHandler}
          />
          <FlightPlanInfoCalcs
            planRouteMarkers={props.state.planRouteMarkers}
            planTakeoff={props.state.planTakeoff}
            planFlightParameters={props.state.planFlightParameters}
          />
        </>
      )
    }
  }  

  return (
    <div className="sidebar">
    {sidebar()}
    <div className="mode-container">
      <div className="mode-element" id="mode-left">View</div>
      <div className="mode-element">
      <Switch
        isOn={props.state.switchIsOn}
        handleModeToggle={props.handleModeToggle}
      />
      </div>
      <div className="mode-element" id="mode-right">Plan</div>
    </div>
  </div>
  );

};

export default Sidebar;