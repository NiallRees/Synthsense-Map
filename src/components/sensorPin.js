import React, {PureComponent} from 'react';

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

const pinStyle = {
  cursor: 'pointer',
  stroke: 'none'
};

const size = 20;

export default class sensorPin extends PureComponent {

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
        <div style={{float:'left'}}>
        {(this.props.selected) ? <span className="sensor-dot"></span> : <></>}
        <svg
          height={size}
          viewBox="0 0 24 24"
          style={{...pinStyle, fill: this.pinColour(mode), transform: `translate(${-size/2}px,${-size}px)`}}
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
          <path d={ICON}/>
        </svg>
        </div>
        {
          (this.state.hovered && !this.props.selected) &&
          <div id="pin-label">
            {sensor.name}
          </div>
        }
      </div>
    );
  }
}