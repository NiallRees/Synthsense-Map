import React, { Component } from "react";
import ReactMapGL, {Marker, WebMercatorViewport, FlyToInterpolator, NavigationControl} from "react-map-gl";
import * as d3 from 'd3-ease';
import config from '../config';
import SensorPin from './sensorPin';
import TakeoffPin from './takeoffPin';
import RechargePin from './rechargePin';
import PinPrompt from './pinPrompt';
import PolylineOverlay from './polylineOverlay';


const TOKEN=config.REACT_APP_TOKEN;
const GEOCODEURL='https://api.mapbox.com/geocoding/v5/mapbox.places/'
const MAPSEARCHINTERVAL=1500

const defaultViewport = {
  width: 800,
  height: 600
};

class Map extends Component {

  constructor(props) {
    super(props);
    const lngLat = [this.state.viewport.longitude, this.state.viewport.latitude];
    this.props.updateMouseCoords(lngLat);
    this.searchForLocation = this.searchForLocation.bind(this);
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.searchForLocation()
    }, MAPSEARCHINTERVAL)
  }

  state = {
    viewport: defaultViewport,
    searchLocation: null,
    lastSearchLocation: null,
    searchResults: [],
    showResults: false
  };

  centeredViewport(a_lat, a_lng, b_lat, b_lng) {
    const viewport = new WebMercatorViewport(defaultViewport)
    .fitBounds([[a_lng, a_lat], [b_lng, b_lat]], {
      padding: 20,
      offset: [0, -100]
    });
    return viewport;
  }

  centerViewportFromCoords(coords) {
    if (coords.length === 0 ) {
      return
    }
    var lat_min = coords[0].latitude
    var lat_max = coords[0].latitude
    var lng_min = coords[0].longitude
    var lng_max = coords[0].longitude
    for (let a of coords) {
      lat_min = Math.min(lat_min, a.latitude)
      lat_max = Math.max(lat_max, a.latitude)
      lng_min = Math.min(lng_min, a.longitude)
      lng_max = Math.max(lng_max, a.longitude)
    }
    var {longitude, latitude, zoom} = this.centeredViewport(lat_min, lng_min, lat_max, lng_max)
    const viewport = {
      ...this.state.viewport,
      longitude,
      latitude,
      zoom: zoom+1,
      transitionDuration: 2000,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: d3.easeCubic
    }
    this.setState({
      viewport
    });
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

  renderMarker({ marker }) {
    const selected = (marker === this.props.selectedMarker);
    if (marker.type === "Sensor") {
      return (
        <Marker key={marker.id} latitude={marker.latitude} longitude={marker.longitude}>
          <SensorPin
            sensor={marker}
            selected={selected}
            clickHandler={this.props.markerClickHandler}
            mode = {this.props.mode}
          />
        </Marker>
      )
    }
    if (marker.type === "Recharge") {
      return (
        <Marker key={marker.id} latitude={marker.latitude} longitude={marker.longitude}>
          <RechargePin
            sensor={marker}
            selected={selected}
            clickHandler={this.props.markerClickHandler}
            mode = {this.props.mode}
          />
        </Marker>
      )
    }
  }

  renderTakeoffPin() {
  const selected = (this.props.takeoff === this.props.selectedMarker);
  const takeoff = this.props.takeoff;
  if (takeoff !== null) {
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
    if (this.props.pinPrompt.enabled) {
      return (
        <Marker key={99} latitude={this.props.pinPrompt.latitude} longitude={this.props.pinPrompt.longitude}>
          <PinPrompt PinPrompt={this.props.pinPrompt} pinPromptClickHandler={this.props.pinPromptClickHandler}/>
        </Marker>
      )
    }
  }

  planPath() {
    if (this.props.mode !== 'view' && this.props.planRouteSensors.length > 0) {
      var lineCoords = this.props.planRouteSensors.map(sensor =>
        [sensor['longitude'], sensor['latitude']]
      )
      lineCoords.unshift([this.props.takeoff['longitude'], this.props.takeoff['latitude']])
      return (
        <PolylineOverlay points={lineCoords} />
      )
    }
  }

  searchForLocation() {
    const searchLocation = this.state.searchLocation;
    if(searchLocation === '') { // Removes the results when search box is cleared
      this.setState({
        searchResults: []
      })
    }
    if ((searchLocation !== this.state.lastSearchLocation) && searchLocation !== '') {

      fetch(GEOCODEURL.concat(searchLocation, '.json?access_token=', TOKEN))
      .then(res => res.json())
      .then((data) => {
        this.setState({
          searchResults: data.features
        })
      })
      .catch(console.log)

      this.setState({
        lastSearchLocation: searchLocation
      })
    }
  }

  searchResultClickHandler(result) {
    if (result.bbox) {
      var {longitude, latitude, zoom} = this.centeredViewport(result.bbox[1], result.bbox[0], result.bbox[3], result.bbox[2])
    } else { // In case the result doesn't have a bbox eg a street
      var longitude = result.center[0]
      var latitude = result.center[1]
      var zoom = 16
    }
    const viewport = {
      ...this.state.viewport,
      longitude,
      latitude,
      zoom: zoom+1,
      transitionDuration: 2000,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: d3.easeCubic
    }
    this.setState({
      viewport,
      showResults: false
    });
  }

  renderSearchResults() {
    if(this.state.showResults) {
      return (
        <div id="search-results">
          <ol id="search-results-list">
            {this.state.searchResults.map(result =>
              <li
                id="search-result-item"
                key={result.id}
                onClick={() => {
                  this.searchResultClickHandler(result)
                }}
              >
                {result.place_name}
              </li>
            )}
          </ol>
        </div>
      )
    }
  }

  renderSearchBox() {
    return(
      <div id="search-box">
        <input
          id="search-input"
          placeholder="Search"
          onInput={(e) => {
            this.setState({
              searchLocation: e.target.value
            })
          }}
          onFocus={(e) => {
            this.setState({
              showResults: true
            })
          }}
        >
        </input>
        {this.renderSearchResults()}
      </div>
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
            this.props.setPinPrompt(e.lngLat);
            e.preventDefault();
          }}
          onClick={(e) => {
            this.props.mapClickHandler(e);
            this.setState({
              showResults: false // Todo add this state to the parent
            })
          }}
          onMouseMove={(e) => {
            this.props.updateMouseCoords(e.lngLat)
          }}
        >
          <div id="navigation">
            <NavigationControl />
          </div>
          {this.planPath()}
          {this.props.markers.map(marker => 
            this.renderMarker({marker}),
          )}
          {this.renderTakeoffPin()}
          {this.renderPinPrompt()}
          <div class="coords-box">
            <pre class="coord">Latitude: {this.props.mouseCoords.latitude}</pre>
            <pre class="coord">Longitude: {this.props.mouseCoords.longitude}</pre>
          </div>
        </ReactMapGL>
        {this.renderSearchBox()}
      </>
    );
  }
}

export default Map;
