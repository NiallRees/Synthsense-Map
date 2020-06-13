import React, { useState } from 'react';
import { ReactComponent as Drone } from './drone.svg';

const size = 30;
const pinStyle = {
  cursor: 'pointer',
  transform: `translate(${-size/2}px,${-size/2}px)`
};

export default function TakeoffPin(props) {

  const [hovered, setHovered] = useState(false)
  const {takeoff = null, clickHandler = null} =   props;

  return (
    <div className="pin-object">
      {(  props.selected) ? <span className="central-dot"></span> : <></>}
      <div
        style={{...pinStyle}}
        onMouseOver={(e) => {
          setHovered(true)
        }}
        onMouseOut={(e) => {
            setHovered(false)
        }}
        onClick={(e) => {
          clickHandler(takeoff);
        }}
      >
        {
          (hovered && ! props.selected) &&
          <div id="pin-label">
            {takeoff.name}
          </div>
        }
        <Drone />
      </div>
    </div>
  );
}