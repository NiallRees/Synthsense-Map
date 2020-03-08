import React, { Component } from "react";
import ReactMapGL, {Marker} from "react-map-gl";
import config from '../config';
import SensorPin from './sensorPin';
import TakeoffPin from './takeoffPin';
import PinPrompt from './pinPrompt';
import PolylineOverlay from './polylineOverlay';

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
    const lngLat = [this.state.viewport.longitude, this.state.viewport.latitude];
    this.props.updateMouseCoords(lngLat);
  }

  state = {
    viewport: defaultViewport,
    PinPrompt: {
      'enabled': false,
      'longitude': 0,
      'latitude': 0
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
          'longitude': lngLat[0],
          'latitude': lngLat[1]
        }
      })
    }
  }

  renderSensorPin({ sensor }) {
    const selected = (sensor === this.props.selectedMarker);
    return (
      <Marker key={sensor.id} latitude={sensor.latitude} longitude={sensor.longitude}>
        <SensorPin
          sensor={sensor}
          selected={selected}
          clickHandler={this.props.markerClickHandler}
          mode = {this.props.mode}
        />
      </Marker>
    )
  }

  renderTakeoffPin() {
  const selected = (this.props.takeoff === this.props.selectedMarker);
  const takeoff = this.props.takeoff;
  if (takeoff != null) {
      return (
        <Marker key={takeoff.id} latitude={takeoff.latitude} longitude={takeoff.longitude}>
          <TakeoffPin
            takeoff={takeoff}
            selected={selected}
            clickHandler={this.props.markerClickHandler}
            mode = {this.props.mode}
          />
        </Marker>
      )
    }
  }

  renderPinPrompt() {
    if (this.state.PinPrompt.enabled) {
      return (
        <Marker key={99} latitude={this.state.PinPrompt.latitude} longitude={this.state.PinPrompt.longitude}>
          <PinPrompt PinPrompt={this.state.PinPrompt} pinPromptClickHandler={this.pinPromptClickHandler}/>
        </Marker>
      )
    }
  }

  pinPromptClickHandler(pinPrompt, pinType) {
    this.setState({
      PinPrompt: {
        'enabled': false,
        'longitude': 0,
        'latitude': 0
      }
    })
    this.props.addPlanPin(pinPrompt, pinType)
  }

  mapClickHandler(e) {
    if(e.leftButton) {
      this.props.resetselectedMarker();
      this.setState({
        PinPrompt: {
          'enabled': false,
          'longitude': 0,
          'latitude': 0
        }
      })
    }
  }

  planPath() {
    if (this.props.buildRouteMode) {
      return(
        <PolylineOverlay points={this.props.planRouteLineCoords} />
      )
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
          onMouseMove={(e) => {
            this.props.updateMouseCoords(e.lngLat)
          }}
        >
          {this.planPath()}
          {this.props.sensors.map(sensor => 
            this.renderSensorPin({sensor}),
          )}
          {this.renderTakeoffPin()}
          {this.renderPinPrompt()}
        </ReactMapGL>
      </>
    );
  }
}

export default Map;
