import React, { Component } from "react";
import ReactMapGL, {Marker} from "react-map-gl";
import config from '../config';
import Pin from './pin';
import PinPrompt from './pinPrompt';

const TOKEN=config.REACT_APP_TOKEN

const defaultViewport = {
  width: 800,
  height: 600
};

class Map extends Component {

  constructor(props) {
    super(props);
    if (props.sensors.length > 0) {
      let coords = props.sensors.map(a => ({latitude: a.latitude, longitude: a.longitude}));
      this.state.viewport.zoom = this.calculateDefaultZoom(coords);
      [this.state.viewport.latitude, this.state.viewport.longitude] = this.calculateLatLong(coords);
    };
    this.pinPromptClickHandler = this.pinPromptClickHandler.bind(this);
  }

  state = {
    viewport: defaultViewport,
    PinPrompt: {
      'enabled': false,
      'lng': 0,
      'lat': 0
    }
  };

  calculateDefaultZoom(coords) {
    var max_distance = 0;
    for (let a of coords) {
      for (let b of coords) {
        var latitude_diff = Math.abs(a.latitude - b.latitude);
        var longitude_diff = Math.abs(a.longitude - b.longitude);
        max_distance = Math.max(max_distance, latitude_diff, longitude_diff);
      }
    }
    let zoom = 258*Math.pow(max_distance, 2) - 119*max_distance + 15;
    return zoom;
  }

  calculateLatLong(coords) {
    let lats = coords.map(a => a.latitude);
    let longs = coords.map(a => a.longitude);
    let middle_lat = (Math.min(...lats) + Math.max(...lats))/2;
    let middle_long = (Math.min(...longs) + Math.max(...longs))/2;
    return [middle_lat, middle_long];
  }

  onViewportChange = viewport => { 
    const {width, height, ...etc} = viewport
    this.setState({viewport: etc})
  }

  setPinPrompt(lngLat) {
    if (this.props.mode === "plan") {
      this.setState({
        PinPrompt: {
          'enabled': true,
          'lng': lngLat[0],
          'lat': lngLat[1]
        }
      })
    }
  }

  renderSensorPin({ sensor }) {
    const selected = (sensor === this.props.selectedSensor);
    return (
      <Marker key={sensor.id} latitude={sensor.latitude} longitude={sensor.longitude}>
        <Pin
          sensor={sensor}
          selected={selected}
          clickHandler={this.props.markerClickHandler}
          mode = {this.props.mode}
        />
      </Marker>
    )
  }

  renderPinPrompt() {
    if (this.state.PinPrompt.enabled) {
      return (
        <Marker key={99} latitude={this.state.PinPrompt.lat} longitude={this.state.PinPrompt.lng}>
          <PinPrompt PinPrompt={this.state.PinPrompt} pinPromptClickHandler={this.pinPromptClickHandler}/>
        </Marker>
      )
    }
  }

  pinPromptClickHandler(pinPrompt, pinType) {
    this.setState({
      PinPrompt: {
        'enabled': false,
        'lng': 0,
        'lat': 0
      }
    })
    this.props.addPlanSensor(pinPrompt, pinType)
  }

  mapClickHandler(e) {
    if(e.leftButton) {
      this.props.resetSelectedSensor();
      this.setState({
        PinPrompt: {
          'enabled': false,
          'lng': 0,
          'lat': 0
        }
      })
    }
  }

  render() {
    const { 
      viewport,
    } = this.state
    return (
      <>
        <ReactMapGL
          mapStyle="mapbox://styles/mapbox/streets-v11"
          {...viewport}
          mapboxApiAccessToken={TOKEN}
          width='100%'
          height='100%'
          onViewportChange={viewport => this.onViewportChange(viewport)}
          onContextMenu={(e) => {
            this.setPinPrompt(e.lngLat);
            e.preventDefault();
          }}
          onClick={(e) => {
            this.mapClickHandler(e);
          }}
        >
          {this.props.sensors.map(sensor => 
            this.renderSensorPin({sensor}),
          )}
          {this.renderPinPrompt()}
        </ReactMapGL>
      </>
    );
  }
}

export default Map;
