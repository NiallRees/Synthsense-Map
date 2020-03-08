import React, {PureComponent} from 'react';
import { ReactComponent as Drone } from './drone.svg';

const size = 30;
const pinStyle = {
  cursor: 'pointer',
  transform: `translate(${-size/2}px,${-size/2}px)`
};

export default class TakeoffPin extends PureComponent {

  state = {
    hovered: false,
  };

  render() {
    const {takeoff = null, clickHandler = null} = this.props;

    return (
      <div className="pin-object">
        <div style={{float:'left'}}>
        {(this.props.selected) ? <span className="takeoff-dot"></span> : <></>}
          <div
            style={{...pinStyle}}
            onMouseOver={(e) => {
              this.setState({ hovered: true});
              }}
            onMouseOut={(e) => {
              this.setState({ hovered: false});
              }}
            onClick={(e) => {
              clickHandler(takeoff);
              }}
          >
            <Drone />
          </div>
        </div>
        {
          (this.state.hovered && !this.props.selected) &&
          <div id="pin-label">
            {takeoff.name}
          </div>
        }
      </div>
    );
  }
}