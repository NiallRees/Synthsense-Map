import React from "react";
import '../sidebar.css';


function FlightPlanInfoCalcs(props) {

  const calculateCoordDistance = (lat1, lat2, lon1, lon2) => {
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

  const routeDistance = () => {
    var length = 0
    var marker1 = props.planTakeoff
    var d
    if (props.planRouteMarkers) {
      for (let marker2 of props.planRouteMarkers) {
        d = calculateCoordDistance(marker1.latitude, marker2.latitude, marker1.longitude, marker2.longitude)
        length += d
        marker1 = marker2
      }
    }
    return length
  }

  const routeAscent = () => {
    var ascent = 0
    var marker1 = props.planTakeoff
    var h
    if (props.planRouteMarkers) {
      for (let marker2 of props.planRouteMarkers) {
        h = Math.max(marker2.elevation - marker1.elevation, 0) + props.planFlightParameters.altitude
        ascent += h
        marker1 = marker2
      }
    }
    return ascent
  }

  const airTime = () => {
    var seconds = 0
    if (routeDistance() > 0) {
      seconds += routeDistance() / props.planFlightParameters.horizontalSpeed
      seconds += routeAscent() / props.planFlightParameters.ascendingSpeed
      seconds += routeAscent() / props.planFlightParameters.descendingSpeed
    }
    return ((seconds/60).toFixed(0).padStart(2, '0') + ':' + (seconds % 60).toFixed(0).padStart(2, '0'))
  }

  return(
    <>
      <div id="bottom-flight-info" className="fields-div">
        <div className="field-div">
          <p className="field-name">Total Air Time (m:s)</p>
          <p id="bottom-flight-info-value" className="field-value">{airTime()}</p>
        </div>
        <div className="field-div">
          <p className="field-name">Total Route Distance (m)</p>
          <p id="bottom-flight-info-value" className="field-value">{routeDistance().toFixed(0)}</p>
        </div>
        <div className="field-div">
          <p className="field-name">Total Route Ascent (m)</p>
          <p id="bottom-flight-info-value" className="field-value">{routeAscent().toFixed(0)}</p>
        </div>
      </div>
    </>
  )
}

export default FlightPlanInfoCalcs;