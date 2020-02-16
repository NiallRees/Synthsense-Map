import React, { Component } from "react";
import ReactMapGL, {Marker} from "react-map-gl";
import config from '../config';
import Pin from './pin';

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
  }

  state = {
    viewport: defaultViewport
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

  renderSensorPin({ sensor }) {
    const selected = (sensor === this.props.selected_sensor);
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
            this.props.renderPinPrompt(e.lngLat);
            e.preventDefault();
          }}
          onClick={(e) => {
            this.props.mapClickHandler();
          }}
        >
          {this.props.sensors.map(sensor => 
            this.renderSensorPin({sensor}),
          )}
        </ReactMapGL>
      </>
    );
  }
}

export default Map;
