import React, {PureComponent} from 'react';
import { ReactComponent as Recharge } from './recharge.svg';

const width = 15;
const height = 30;
const pinStyle = {
  cursor: 'pointer',
  transform: `translate(${-width/2}px,${-height/2}px)`
};

export default class rechargePin extends PureComponent {

  state = {
    hovered: false,
  };

  pinColour(mode) {
    if (mode === 'view') {
      return ('#FF0000')
    } else {
      return ('black')
    }
  }

  render() {
    const {sensor = null, clickHandler = null, mode = 'view'} = this.props;

    return (
      <div className="pin-object">
        {(this.props.selected) ? <span className="central-dot"></span> : <></>}
        <div
          style={{...pinStyle}}
          onMouseOver={(e) => {
            this.setState({ hovered: true});
          }}
          onMouseOut={(e) => {
            this.setState({ hovered: false});
          }}
          onClick={(e) => {
            clickHandler(sensor);
          }}
        >        
          {
            (this.state.hovered && !this.props.selected) &&
            <div id="pin-label">
              {sensor.name}
            </div>
          }
          <Recharge style={{fill: this.pinColour(mode)}}/>
        </div>
      </div>
    );
  }
}