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
          <li className="menu-item" onClick={(e) => {this.clickHandler("Sensor")}}>Add Sensor</li>
          <li className="menu-item" onClick={(e) => {this.clickHandler("Recharge")}}>Add Recharge</li>
          <li className="menu-item" onClick={(e) => {this.clickHandler("Takeoff")}}>Add Takeoff</li>
        </ul>
      </div>
    );
  }

}