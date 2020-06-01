import React from "react";
import '../sidebar.css';
import schemas from '../../schemas';

function EditMarker(props) {
  return(
    <>
      <div className="fields-div">
        <p className="title">{props.selectedMarker.name}</p>
        {Object.keys(schemas[props.selectedMarker.type]).map(key =>
          <div className="field-div" key={key}>
            <p key={key} className="field-name">{schemas[props.selectedMarker.type][key]["Human Readable"]}</p>
            <p className="field-value">
              <input 
                className="field-input"
                type="text" 
                name={key} 
                onChange={props.updateSelectedMarker.bind(this)}
                onBlur={props.validateMarker.bind(this)} 
                value={props.selectedMarker[key]}
              >
              </input>
            </p>
          </div>
        )}
      </div>
      <button className="sidebar-button" type="button"
      onClick={(e) => {
        props.removeMarkerClickHandler(props.selectedMarker);
      }}
      >
      Delete
      </button>
    </>
  )
}

export default EditMarker;