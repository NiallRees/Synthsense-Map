import React from "react";
import '../sidebar.css';
import schemas from '../../schemas';

function ViewSideBar(props) {

  const noData = () => {
    if (props.viewMarkers.length === 0) {
      return(<p className="title">No Data Imported</p>)
    } else {
      return(<p className="title">No Sensor Selected</p>)
    }
  }

  if (props.selectedMarker == null) {
    return (
      <>
        {noData()}
        <button className="sidebar-button" type="button"
        onClick={(e) => {
          props.importViewDataClickHandler();
        }}
        >
          Import Data
        </button>
      </>
    )
  } else {
    const listItems = Object.keys(props.selectedMarker.data).map((key) => 
      <div key={key} className="field-div">
        <p className="field-name">{key}</p>
        <p id="bottom-flight-info-value" className="field-value">{props.selectedMarker.data[key]}</p>
      </div>
    );
    return (
      <>
        <div className="fields-div">
          <p className="title">{props.selectedMarker.name}</p>
          {["latitude", "longitude", "elevation"].map((key) =>
            <div key={key} className="field-div">
              <p className="field-name">{schemas.sensor[key]["human_readable"]}</p>
              <p id="bottom-flight-info-value" className="field-value">{props.selectedMarker[key]}</p>
            </div>
          )}
          {listItems}
        </div>
        <button className="sidebar-button" type="button"
          onClick={(e) => {
            props.viewDataClickHandler(props.selectedMarker);
          }}
        >
          View Data
        </button>
      </>
    )
  }
}

export default ViewSideBar;