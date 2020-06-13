import React from "react";
import './sidebar.css';
import Switch from './sidebar/switch';
import FlightPlanInfoCalcs from './sidebar/flightPlanInfoCalcs';
import ViewFlightInfo from "./sidebar/viewFlightInfo";
import PlanSideBar from "./sidebar/planSideBar";
import ViewSideBar from "./sidebar/viewSideBar";

function Sidebar(props) {

  const sidebar = () => {
    if (props.mode === "view") {
      return (
        <>
          <ViewSideBar
            selectedMarker={props.selectedMarker}
            viewMarkers={props.viewMarkers}
            importViewDataClickHandler={props.importViewDataClickHandler}
            viewDataClickHandler={props.viewDataClickHandler}
          />
          <ViewFlightInfo 
            flightInfo={props.viewFlightInfo}
          />
        </>
      )
    }

    if (props.mode === "plan") {
      return (
        <>
          <PlanSideBar
            planTakeoff={props.planTakeoff}
            selectedMarker={props.selectedMarker}
            buildRouteMode={props.buildRouteMode}
            planRouteMarkers={props.planRouteMarkers}
            undoBuildRouteClickHandler={props.undoBuildRouteClickHandler}
            resetBuildRouteClickHandler={props.resetBuildRouteClickHandler}
            exportBuildRouteClickHandler={props.exportBuildRouteClickHandler}
            exitBuildRouteClickHandler={props.exitBuildRouteClickHandler}
            savePlanClickHandler={props.savePlanClickHandler}
            importPlanClickHandler={props.importPlanClickHandler}
            buildRouteClickHandler={props.buildRouteClickHandler}
            clearMarkersClickHandler={props.clearMarkersClickHandler}
            updatePlanFlightParameters={props.updatePlanFlightParameters}
            updateValidatePlanFlightParameters={props.updateValidatePlanFlightParameters}
            stagingPlanFlightParameters={props.stagingPlanFlightParameters}
            updateSelectedMarker={props.updateSelectedMarker}
            updateValidatedMarker={props.updateValidatedMarker}
            removeMarkerClickHandler={props.removeMarkerClickHandler}
          />
          <FlightPlanInfoCalcs
            planRouteMarkers={props.planRouteMarkers}
            planTakeoff={props.planTakeoff}
            planFlightParameters={props.planFlightParameters}
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
        isOn={props.switchIsOn}
        handleModeToggle={props.handleModeToggle}
      />
      </div>
      <div className="mode-element" id="mode-right">Plan</div>
    </div>
  </div>
  );

};

export default Sidebar;