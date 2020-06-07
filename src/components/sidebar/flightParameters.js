import React from "react";
import '../sidebar.css';
import schemas from '../../schemas';

function FlightParameters(props) {
  return(
    <div className="fields-div">
      {Object.keys(schemas.flight).map(key =>
        <div className="field-div" key={key}>
          <p key={key} className="field-name">{schemas.flight[key]["human_readable"]}</p>
          <p className="field-value">
            <input
                className="field-input"
                type="text"
                name={key}
                onChange={props.updatePlanFlightParameters.bind(this)}
                onBlur={props.validatePlanFlightParameters.bind(this)}
                value={props.stagingPlanFlightParameters[key]}
              >
            </input>
          </p>
        </div>
      )}
    </div>
  )
}

export default FlightParameters;