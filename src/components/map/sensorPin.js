import React, { useState } from 'react';

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

const height = 22;
const width = 18.33
const pinStyle = {
  cursor: 'pointer',
  stroke: 'none',
  transform: `translate(${-width/2}px,${-height}px)`
};

export default function SensorPin(props) {

  const [hovered, setHovered] = useState(false)

  const pinColour = (mode) => {
    if (mode === 'view') {
      return ('#FF0000')
    } else {
      return ('black')
    }
  }

  const {sensor = null, clickHandler = null, mode = 'view'} = props;

  return (
    <div className="pin-object">
      {(props.selected) ? <span className="sensor-dot"></span> : <></>}
      <div
        style={{...pinStyle}}
        onMouseOver={(e) => {
            setHovered(true)
        }}
        onMouseOut={(e) => {
            setHovered(false)
        }}
        onClick={(e) => {
          clickHandler(sensor);
        }}
      >
        <svg
          height={height}
          viewBox="2 0 20 24"
          style={{fill:   pinColour(mode), display: 'block'}}
        >
          <path d={ICON}/>
        </svg>
        {
          (hovered && !props.selected) &&
          <div id="pin-label">
            {sensor.name}
          </div>
        }
      </div>
    </div>
  );
}