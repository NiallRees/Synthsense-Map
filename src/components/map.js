import React, { Component } from "react";
import ReactMapGL, {Marker, FlyToInterpolator, NavigationControl, ScaleControl} from "react-map-gl";
import * as d3 from 'd3-ease';
import config from '../config';
import SensorPin from './map/sensorPin';
import TakeoffPin from './map/takeoffPin';
import RechargePin from './map/rechargePin';
import PinPrompt from './map/pinPrompt';
import PolylineOverlay from './map/polylineOverlay';


const TOKEN=config.MAPBOX_TOKEN;
const GEOCODEURL='https://api.mapbox.com/geocoding/v5/mapbox.places/'
const MAPSEARCHINTERVAL=1500

class Map extends Component {

  constructor(props) {
    super(props);
    const lngLat = [this.props.viewport.longitude, this.props.viewport.latitude];
    this.props.updateMouseCoords(lngLat);
    this.searchForLocation = this.searchForLocation.bind(this);
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.searchForLocation()
    }, MAPSEARCHINTERVAL)
  }

  calculateLatLong(coords) {
    let lats = coords.map(a => a.latitude);
    let longs = coords.map(a => a.longitude);
    let middle_lat = (Math.min(...lats) + Math.max(...lats))/2;
    let middle_long = (Math.min(...longs) + Math.max(...longs))/2;
    return [middle_lat, middle_long];
  }

  renderMarkers() {
    if (this.props.markers) {
      return(
        this.props.markers.map(marker => 
          this.renderMarker({marker}),
        )
      )
    }
  }

  renderMarker({ marker }) {
    const selectedMarkerID = this.props.selectedMarker ? this.props.selectedMarker.id : null
    const selected = (marker.id === selectedMarkerID);
    if (marker.type === "sensor") {
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
    if (marker.type === "recharge") {
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
  const takeoff = this.props.takeoff;
  if (takeoff) {
    const selectedMarkerID = this.props.selectedMarker ? this.props.selectedMarker.id : null
    const selected = (takeoff.id === selectedMarkerID);
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
    if (this.props.mode === 'plan' && this.props.planRouteMarkers && this.props.takeoff && this.props.planRouteMarkers.length > 0) {
      var lineCoords = this.props.planRouteMarkers.map(sensor =>
        [sensor['longitude'], sensor['latitude']]
      )
      lineCoords.unshift([this.props.takeoff['longitude'], this.props.takeoff['latitude']])
      return (
        <PolylineOverlay points={lineCoords} />
      )
    }
  }

  searchForLocation() {
    const searchLocation = this.props.searchLocation;
    if(searchLocation === '') { // Removes the results when search box is cleared
      this.props.setSearchResults([])
    }
    if ((searchLocation !== this.props.lastSearchLocation) && searchLocation !== '') {

      fetch(GEOCODEURL.concat(searchLocation, '.json?access_token=', TOKEN))
      .then(res => res.json())
      .then((data) => {
        this.props.setSearchResults(data.features)
      })
      .catch(console.log)
      this.props.setLastSearchLocation(searchLocation)
    }
  }

  searchResultClickHandler(result) {
    if (result.bbox) {
      var {longitude, latitude, zoom} = this.props.centeredViewport(result.bbox[1], result.bbox[0], result.bbox[3], result.bbox[2])
    } else { // In case the result doesn't have a bbox eg a street
      var longitude = result.center[0]
      var latitude = result.center[1]
      var zoom = 16
    }
    const viewport = {
      ...this.props.viewport,
      longitude,
      latitude,
      zoom: zoom+1,
      transitionDuration: 2000,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: d3.easeCubic
    }
    this.props.setViewport(viewport)
    this.props.setShowSearchResults(false)
  }

  renderSearchResults() {
    if(this.props.showSearchResults) {
      return (
        <div id="search-results">
          <ol id="search-results-list">
            {this.props.searchResults.map(result =>
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
            this.props.setSearchLocation(e.target.value)
          }}
          onFocus={(e) => {
            this.props.setShowSearchResults(true)
          }}
        >
        </input>
        {this.renderSearchResults()}
      </div>
    )
  }

  render() {
    return (
      <>
        <ReactMapGL
          mapStyle="mapbox://styles/mapbox/streets-v11"
          {...this.props.viewport}
          mapboxApiAccessToken={TOKEN}
          width='100%'
          height='100%'
          onViewportChange={viewport => this.props.onViewportChange(viewport)}
          onContextMenu={(e) => {
            this.props.enablePinPrompt(e.lngLat);
            e.preventDefault();
          }}
          onClick={(e) => {
            this.props.mapClickHandler(e);
            this.props.setShowSearchResults(false)
          }}
          onMouseMove={(e) => {
            this.props.updateMouseCoords(e.lngLat)
          }}
        >
          <div id="navigation">
            <NavigationControl />
          </div>
          <div id="scale">
            <ScaleControl maxWidth={200} unit={"metric"}/>
          </div>
          {this.planPath()}
          {this.renderMarkers()}
          {this.renderTakeoffPin()}
          {this.renderPinPrompt()}
          <div className="coords-box">
            <pre className="coord">Latitude: {this.props.mouseCoords.latitude}</pre>
            <pre className="coord">Longitude: {this.props.mouseCoords.longitude}</pre>
          </div>
        </ReactMapGL>
        {this.renderSearchBox()}
      </>
    );
  }
}

export default Map;
