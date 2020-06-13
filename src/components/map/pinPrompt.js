import React from 'react';
import {Marker} from "react-map-gl";
import './pinPrompt.css';

export default function PinPrompt(props) {

  const clickHandler = (pinType) => {
    props.pinPromptClickHandler(props.pinPrompt, pinType);
  }

  if (props.pinPrompt.enabled) {
    return (
      <Marker key={99} latitude={props.pinPrompt.latitude} longitude={props.pinPrompt.longitude}>
        <div className="pin-prompt">
          <ul className="menu-list">
            <li className="menu-item" onClick={(e) => {clickHandler("sensor")}}>Add Sensor</li>
            <li className="menu-item" onClick={(e) => {clickHandler("recharge")}}>Add Recharge</li>
            <li className="menu-item" onClick={(e) => {clickHandler("takeoff")}}>Add Takeoff</li>
          </ul>
        </div>
      </Marker>
    )
  } else {
    return null
  }
}