import React, {PureComponent} from 'react';
import './pinPrompt.css';

export default class PinPrompt extends PureComponent {

  clickHandler(pinType) {
    this.props.pinPromptClickHandler(this.props.PinPrompt, pinType);
  }

  render() {
    return (
      <div className="pin-prompt">
        <ul className="menu-list">
          <li className="menu-item" onClick={(e) => {this.clickHandler("sensor")}}>Add Sensor</li>
          <li className="menu-item" onClick={(e) => {this.clickHandler("recharge")}}>Add Recharge</li>
          <li className="menu-item" onClick={(e) => {this.clickHandler("takeoff")}}>Add Takeoff</li>
        </ul>
      </div>
    );
  }

}