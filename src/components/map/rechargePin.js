import React, { useState } from 'react';
import { ReactComponent as Recharge } from './recharge.svg';

const width = 15;
const height = 30;
const pinStyle = {
  cursor: 'pointer',
  transform: `translate(${-width/2}px,${-height/2}px)`
};

export default function RechargePin(props) {
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
      {(props.selected) ? <span className="central-dot"></span> : <></>}
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
        {
          (hovered && !props.selected) &&
          <div id="pin-label">
            {sensor.name}
          </div>
        }
        <Recharge style={{fill: pinColour(mode)}}/>
      </div>
    </div>
  );
}