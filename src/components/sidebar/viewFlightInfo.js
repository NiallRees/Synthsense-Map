import React from "react";
import '../sidebar.css';


function ViewFlightInfo(props) {
  return(
    <div id="bottom-flight-info" className="fields-div">
      {Object.keys(props.flightInfo).map((key) => 
        <div className="field-div">
          <p className="field-name">{key}</p>
          <p id="bottom-flight-info-value" className="field-value">{props.flightInfo[key]}</p>
        </div>
      )}
    </div>
  )
}

export default ViewFlightInfo;