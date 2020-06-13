import React, { useEffect, useRef } from "react";
import ReactMapGL, {Marker, FlyToInterpolator, NavigationControl, ScaleControl} from "react-map-gl";
import * as d3 from 'd3-ease';
import config from '../config';
import SensorPin from './map/sensorPin';
import TakeoffPin from './map/takeoffPin';
import RechargePin from './map/rechargePin';
import MouseCoords from './map/mouseCoords';
import PinPrompt from './map/pinPrompt';
import PolylineOverlay from './map/polylineOverlay';


const TOKEN=config.MAPBOX_TOKEN;
const GEOCODEURL='https://api.mapbox.com/geocoding/v5/mapbox.places/'
const MAPSEARCHINTERVAL=1500

function searchForLocation(searchLocation, lastSearchLocation, setSearchResults, setLastSearchLocation) {
  if(searchLocation === '') { // Removes the results when search box is cleared
    setSearchResults([])
  }
  if ((searchLocation !== lastSearchLocation) && searchLocation !== '') {

    fetch(GEOCODEURL.concat(searchLocation, '.json?access_token=', TOKEN))
    .then(res => res.json())
    .then((data) => {
      setSearchResults(data.features)
    })
    .catch(console.log)
    setLastSearchLocation(searchLocation)
  }
}

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function Map(props) {

  useInterval(() => {
    searchForLocation(props.searchLocation, props.lastSearchLocation, props.setSearchResults, props.setLastSearchLocation)
  }, MAPSEARCHINTERVAL);

  const renderMarkers = () => {
    if (props.markers) {
      return(
        props.markers.map(marker => 
          renderMarker(marker),
        )
      )
    }
  }

  const renderMarker = (marker) => {
    const selectedMarkerID = props.selectedMarker ? props.selectedMarker.id : null
    const selected = (marker.id === selectedMarkerID);
    if (marker.type === "sensor") {
      return (
        <Marker key={marker.id} latitude={marker.latitude} longitude={marker.longitude}>
          <SensorPin
            sensor={marker}
            selected={selected}
            clickHandler={props.markerClickHandler}
            mode = {props.mode}
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
            clickHandler={props.markerClickHandler}
            mode = {props.mode}
          />
        </Marker>
      )
    }
  }

  const renderTakeoffPin = () => {
  const takeoff = props.takeoff;
  if (takeoff) {
    const selectedMarkerID = props.selectedMarker ? props.selectedMarker.id : null
    const selected = (takeoff.id === selectedMarkerID);
      return (
        <Marker key={takeoff.id} latitude={takeoff.latitude} longitude={takeoff.longitude}>
          <TakeoffPin
            takeoff={takeoff}
            selected={selected}
            clickHandler={props.markerClickHandler}
            mode = {props.mode}
          />
        </Marker>
      )
    }
  }

  const planPath = () => {
    if (props.mode === 'plan' && props.planRouteMarkers && props.takeoff && props.planRouteMarkers.length > 0) {
      var lineCoords = props.planRouteMarkers.map(sensor =>
        [sensor['longitude'], sensor['latitude']]
      )
      lineCoords.unshift([props.takeoff['longitude'], props.takeoff['latitude']])
      return (
        <PolylineOverlay points={lineCoords} />
      )
    }
  }

  const searchResultClickHandler = (result) => {
    var longitude, latitude, zoom
    if (result.bbox) {
      ({longitude, latitude, zoom} = props.centeredViewport(result.bbox[1], result.bbox[0], result.bbox[3], result.bbox[2]))
    } else { // In case the result doesn't have a bbox eg a street
      longitude = result.center[0]
      latitude = result.center[1]
      zoom = 16
    }
    const viewport = {
      ...props.viewport,
      longitude,
      latitude,
      zoom: zoom+1,
      transitionDuration: 2000,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: d3.easeCubic
    }
    props.setViewport(viewport)
    props.setShowSearchResults(false)
  }

  const renderSearchResults = () => {
    if(props.showSearchResults) {
      return (
        <div id="search-results">
          <ol id="search-results-list">
            {props.searchResults.map(result =>
              <li
                id="search-result-item"
                key={result.id}
                onClick={() => {
                  searchResultClickHandler(result)
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

  const renderSearchBox = () => {
    return(
      <div id="search-box">
        <input
          id="search-input"
          placeholder="Search"
          onInput={(e) => {
            props.setSearchLocation(e.target.value)
          }}
          onFocus={(e) => {
            props.setShowSearchResults(true)
          }}
        >
        </input>
        {renderSearchResults()}
      </div>
    )
  }

  return (
    <>
      <ReactMapGL
        mapStyle="mapbox://styles/mapbox/streets-v11"
        {...props.viewport}
        mapboxApiAccessToken={TOKEN}
        width='100%'
        height='100%'
        onViewportChange={viewport => props.onViewportChange(viewport)}
        onContextMenu={(e) => {
          props.enablePinPrompt(e.lngLat);
          e.preventDefault();
        }}
        onClick={(e) => {
          props.deselectMarker(e);
          props.setShowSearchResults(false)
        }}
        onMouseMove={(e) => {
          props.updateMouseCoords(e.lngLat)
        }}
      >
        <div id="navigation">
          <NavigationControl />
        </div>
        <div id="scale">
          <ScaleControl maxWidth={200} unit={"metric"}/>
        </div>
        {planPath()}
        {renderMarkers()}
        {renderTakeoffPin()}
        <PinPrompt
          pinPromptClickHandler={props.pinPromptClickHandler}
          pinPrompt={props.pinPrompt}
        />
        <MouseCoords mouseCoords={props.mouseCoords} />
      </ReactMapGL>
      {renderSearchBox()}
    </>
  );
}

export default Map;
