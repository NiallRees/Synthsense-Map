import React from "react";
import '../sidebar.css';
import BuildRoute from './buildRoute'
import PlanSideBarButtons from "./planSideBarButtons";
import FlightParameters from "./flightParameters";
import EditMarker from "./editMarker"

function PlanSideBar(props) {
  if (props.buildRouteMode) {
    return (
      <BuildRoute
        planTakeoff={props.planTakeoff}
        planRouteMarkers={props.planRouteMarkers}
        undoBuildRouteClickHandler={props.undoBuildRouteClickHandler}
        resetBuildRouteClickHandler={props.resetBuildRouteClickHandler}
        exportBuildRouteClickHandler={props.exportBuildRouteClickHandler}
        exitBuildRouteClickHandler={props.exitBuildRouteClickHandler}
      />
    )
  } else if (props.selectedMarker == null) {
    return (
      <>
        <p className="title">No Marker Selected</p>
        <PlanSideBarButtons 
          savePlanClickHandler={props.savePlanClickHandler}
          importPlanClickHandler={props.importPlanClickHandler}
          buildRouteClickHandler={props.buildRouteClickHandler}
          clearMarkersClickHandler={props.clearMarkersClickHandler}
        />
        <FlightParameters 
          updatePlanFlightParameters={props.updatePlanFlightParameters}
          updateValidatePlanFlightParameters={props.updateValidatePlanFlightParameters}
          stagingPlanFlightParameters={props.stagingPlanFlightParameters}
        />
      </>
    )
  } else {
    return(
      <EditMarker
        selectedMarker={props.selectedMarker}
        updateSelectedMarker={props.updateSelectedMarker}
        updateValidatedMarker={props.updateValidatedMarker}
        removeMarkerClickHandler={props.removeMarkerClickHandler}
      />
    )
  }

}

export default PlanSideBar;