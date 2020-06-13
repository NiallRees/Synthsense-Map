import React from 'react';

export default function MouseCoords(props) {
  return(
    <div className="coords-box">
      <pre className="coord">Latitude: {props.mouseCoords.latitude}</pre>
      <pre className="coord">Longitude: {props.mouseCoords.longitude}</pre>
    </div>
  )
}