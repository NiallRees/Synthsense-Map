import React, { useEffect, useState } from 'react';
import {WebMercatorViewport, FlyToInterpolator} from "react-map-gl";
import * as d3 from 'd3-ease';
import './App.css';
import Map from './components/map';
import Sidebar from './components/sidebar';
import schemas from './schemas';
const { ipcRenderer } = require('electron');


function App() {
  const defaultPlanFlightParameters = {}
  Object.keys(schemas.flight).forEach(function(key) {
    defaultPlanFlightParameters[key] = schemas.flight[key].Default
  })
  const defaultViewport = {
    width: 800,
    height: 600
  };

  const [viewport, setViewport] = useState(defaultViewport)
  const [searchLocation, setSearchLocation] = useState(null)
  const [lastSearchLocation, setLastSearchLocation] = useState(null)
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [dataFolderPath, setDataFolderPath] = useState(null)
  const [viewMarkers, setViewMarkers] = useState([])
  const [viewFlightInfo, setViewFlightInfo] = useState({})
  const [planMarkers, setPlanMarkers] = useState([])
  const [planRouteMarkers, setPlanRouteMarkers] = useState([])
  const [planTakeoff, setPlanTakeoff] = useState(null)
  const [planFlightParameters, setPlanFlightParameters] = useState(defaultPlanFlightParameters)
  const [stagingPlanFlightParameters, setStagingPlanFlightParameters] = useState(defaultPlanFlightParameters)
  const [selectedMarker, setSelectedMarker] = useState(null)
  const [switchIsOn, setSwitchIsOn] = useState(false)
  const [mode, setMode] = useState('view')
  const [buildRouteMode, setBuildRouteMode] = useState(false)
  const [mouseCoords, setMouseCoords] = useState({
    latitude: 52.4054360,
    longitude: -0.3293577
  })
  const [pinPrompt, setPinPrompt] = useState({
    'enabled': false,
    'longitude': 0,
    'latitude': 0
  })


  useEffect( () => {
    ipcRenderer.on('imported-view-data', importedViewDataListener)
    ipcRenderer.on('imported-plan-data', importedPlanDataListener)
    return () => {
      ipcRenderer.removeListener('imported-view-data', importedViewDataListener)
      ipcRenderer.removeListener('imported-plan-data', importedPlanDataListener)
    }
  })

  const importedViewDataListener = (event, arg) => {
    setViewMarkers(arg[0].sensors)
    setViewFlightInfo(arg[0].flight)
    setDataFolderPath(arg[1])
    centerViewportFromCoords(arg[0].sensors)
  }

  const importedPlanDataListener = (event, arg) => {
    setStagingPlanFlightParameters(arg.planFlightParameters)
    setPlanFlightParameters(arg.planFlightParameters)
    setPlanRouteMarkers(arg.planRouteMarkers)
    setPlanTakeoff(arg.planTakeoff)
    setPlanMarkers(arg.planMarkers)
    centerViewportFromCoords([arg.planTakeoff, ...arg.planMarkers])
  }

  const planRouteMarkerClickHandler = (marker) => {
    if (planTakeoff) {
      setPlanRouteMarkers([...planRouteMarkers, marker])
    }
  }

  const markerClickHandler = (marker) => {
    if (buildRouteMode === false) {
      setSelectedMarker(marker)
    } else {
     planRouteMarkerClickHandler(marker);
    }
  }

  const editPlanMarkersInPlace = (updatedMarker) => {
    var updatedplanRouteMarkers = [...planRouteMarkers]
    for (var i = 0; i < planRouteMarkers.length; i++) {
      if (planRouteMarkers[i]['id'] === updatedMarker['id']) {
        updatedplanRouteMarkers.splice(i, 1, updatedMarker)
      }
    }
    return(updatedplanRouteMarkers)
  }

  const updateSelectedMarker = (input) => {
    var updatedMarker = {...selectedMarker};
    updatedMarker[input.target.name] = input.target.value;
    setSelectedMarker(updatedMarker)
  }

  const validateMarker = (input) => {
    var updatedMarker = {...selectedMarker};
    var newValue;
    if (input.target.name === "name") {
      newValue = input.target.value
    } else {
      const schemaVariable = schemas[updatedMarker.type][input.target.name];
      newValue = isNaN(parseFloat(input.target.value)) ? 0.0 : parseFloat(input.target.value)
      newValue = (newValue < schemaVariable.Min) ? schemaVariable.Min : newValue
      newValue = (newValue > schemaVariable.Max) ? schemaVariable.Max : newValue
    }
    updatedMarker[input.target.name] = newValue;
    if (selectedMarker.type === "takeoff") {
      setPlanTakeoff(updatedMarker)
      setPlanRouteMarkers(editPlanMarkersInPlace(updatedMarker))
      setSelectedMarker(updatedMarker)
    } else {
      setPlanMarkers([...planMarkers.filter(sensor => sensor['id'] !== selectedMarker['id']), updatedMarker])
      setPlanRouteMarkers(editPlanMarkersInPlace(updatedMarker))
      setSelectedMarker(updatedMarker)
    }
  }

  const updatePlanFlightParameters = (input) => {
    var updatedParameters = {planFlightParameters}
    updatedParameters[input.target.name] = parseFloat(input.target.value)
    setStagingPlanFlightParameters(updatedParameters)
  }

  const validatePlanFlightParameters = (input) => {
    var newValue = isNaN(parseFloat(input.target.value)) ? 0.0 : parseFloat(input.target.value)
    var updatedParameters = {planFlightParameters}
    const schemaVariable = schemas.flight[input.target.name]
    newValue = (newValue < schemaVariable.Min) ? schemaVariable.Min : newValue
    newValue = (newValue > schemaVariable.Max) ? schemaVariable.Max : newValue
    updatedParameters[input.target.name] = newValue;
    setPlanFlightParameters(updatedParameters)
    setStagingPlanFlightParameters(updatedParameters)
  }

  const centeredViewport = (a_lat, a_lng, b_lat, b_lng) => {
    const viewport = new WebMercatorViewport(defaultViewport)
    .fitBounds([[a_lng, a_lat], [b_lng, b_lat]], {
      padding: 20,
      offset: [0, -100]
    });
    return viewport;
  }

  const onViewportChange = (viewport) => { 
    const {width, height, ...etc} = viewport
    setViewport(etc)
  }

  const centerViewportFromCoords = (coords) => {
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
    var {longitude, latitude, zoom} = centeredViewport(lat_min, lng_min, lat_max, lng_max)
    const newViewport = {
      ...viewport,
      longitude,
      latitude,
      zoom: zoom+1,
      transitionDuration: 2000,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: d3.easeCubic
    }
    setViewport(newViewport)
  }

  const mapClickHandler = (e) => {
    if(e.leftButton) {
      resetSelectedMarker()
      setPinPrompt({
        'enabled': false,
        'longitude': 0,
        'latitude': 0
      })
    }
  }

  const updateMouseCoords = (lngLat) => {
    if(lngLat[0]) {
      setMouseCoords({
        longitude: lngLat[0].toFixed(7),
        latitude: lngLat[1].toFixed(7)
      })
    }
  }

  const resetSelectedMarker = () => {
      setSelectedMarker(null)
  }

  const viewDataClickHandler = (sensor) => {
    ipcRenderer.send('open-data-folder', [dataFolderPath, sensor.name])
  }

  const importViewDataClickHandler = () => {
    ipcRenderer.send('import-view-data')
  }

  const exitBuildRouteClickHandler = () => {
    setBuildRouteMode(false)
  }

  const resetBuildRouteClickHandler = () => {
    setPlanRouteMarkers([])
  }

  const exportBuildRouteClickHandler = () => {
    const data = {
      'flightParameters': planFlightParameters,
      'route': planRouteMarkers
    }
    ipcRenderer.send('export-route', data)
  }

  const undoBuildRouteClickHandler = () => {
    const newPlanRouteMarkers = [...planRouteMarkers];
    newPlanRouteMarkers.pop();
    setPlanRouteMarkers(newPlanRouteMarkers)
  }

  const savePlanClickHandler = () => {
    const data = {
      'planFlightParameters': planFlightParameters,
      'planRouteMarkers': planRouteMarkers,
      'planTakeoff': planTakeoff,
      'planMarkers': planMarkers
    }
    ipcRenderer.send('save-plan', data)
  }

  const importPlanClickHandler = () => {
    ipcRenderer.send('import-plan')
  }

  const buildRouteClickHandler = () => {
    setBuildRouteMode(true)
  }

  const clearMarkersClickHandler = () => {
    setPlanMarkers([])
    setPlanRouteMarkers([])
  }

  const removeMarkerClickHandler = (selectedMarker) => {
    setPlanRouteMarkers([])
    if (selectedMarker === planTakeoff) {
      setPlanTakeoff(null)
      setSelectedMarker(null)
    } else {
      setPlanMarkers(planMarkers.filter(sensor => sensor['id'] !== selectedMarker['id']))
      setPlanRouteMarkers(planRouteMarkers.filter(sensor => sensor['id'] !== selectedMarker['id']))
      setSelectedMarker(null)
    }
  }

  const makeid = (length) => {
    // Taken from https://stackoverflow.com/a/1349426
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

  const addPlanPin = (pinPrompt, pinType) => {
      var newMarker = {}
      Object.keys(schemas[pinType]).forEach(function(key) {
        newMarker[key] = schemas[pinType][key].Default
      });

      newMarker["id"] =makeid(8) // TODO add collision prevention
      newMarker["type"] = pinType
      newMarker["longitude"] = +(pinPrompt.longitude.toFixed(7)) // 7 dp gives 11mm precision
      newMarker["latitude"] = +(pinPrompt.latitude.toFixed(7))

    if (pinType === "takeoff") {
      setPlanTakeoff(newMarker)
    } else {
      setPlanMarkers([...planMarkers, newMarker])
    }
  }

  const enablePinPrompt = (lngLat) => {
    if (mode === "plan") {
      setPinPrompt({
        'enabled': true,
        'longitude': lngLat[0],
        'latitude': lngLat[1]
      })
    }
  }

  const pinPromptClickHandler = (pinPrompt, pinType) => {
    setPinPrompt({
      'enabled': false,
      'longitude': 0,
      'latitude': 0
    })
    addPlanPin(pinPrompt, pinType)
  }

  const handleModeToggle = () => {
    if (!switchIsOn) {
      setMode('plan')
      setSwitchIsOn(true)
      if (planMarkers.length === 0) {
        setPlanMarkers(viewMarkers.map(sensor => (
          {
            id: sensor.id,
            type: sensor.type,
            name: sensor.name,
            longitude: sensor.longitude,
            latitude: sensor.latitude,
            elevation: sensor.elevation
          }
        )))
      }
    }

    if (switchIsOn) {
      setMode('view')
      setBuildRouteMode(false)
      setSwitchIsOn(false)
    }      
    
    setSelectedMarker(null)
  }

  return (
    <div className="container">
      <div className="map">
        <Map
          centeredViewport={centeredViewport}
          searchLocation={searchLocation}
          setSearchLocation={setSearchLocation}
          lastSearchLocation={lastSearchLocation}
          setLastSearchLocation={setLastSearchLocation}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          showSearchResults={showSearchResults}
          setShowSearchResults={setShowSearchResults}
          viewport={viewport}
          setViewport={setViewport}
          onViewportChange={onViewportChange}
          markers={switchIsOn ? planMarkers : viewMarkers}
          planRouteMarkers={planRouteMarkers}
          takeoff={switchIsOn ? planTakeoff : null}
          selectedMarker={selectedMarker} 
          markerClickHandler={markerClickHandler}
          addPlanPin={addPlanPin}
          resetSelectedMarker={resetSelectedMarker}
          enablePinPrompt={enablePinPrompt}
          pinPrompt={pinPrompt}
          switchIsOn={switchIsOn}
          updateMouseCoords={updateMouseCoords}
          mode={mode}
          buildRouteMode={buildRouteMode}
          mouseCoords={mouseCoords}
          pinPromptClickHandler={pinPromptClickHandler}
          mapClickHandler={mapClickHandler}
        />
      </div>
      <aside>
        <Sidebar
          handleModeToggle={handleModeToggle}
          viewDataClickHandler={viewDataClickHandler}
          importViewDataClickHandler={importViewDataClickHandler}
          savePlanClickHandler={savePlanClickHandler}
          importPlanClickHandler={importPlanClickHandler}
          buildRouteClickHandler={buildRouteClickHandler}
          clearMarkersClickHandler={clearMarkersClickHandler}
          exitBuildRouteClickHandler={exitBuildRouteClickHandler}
          exportBuildRouteClickHandler={exportBuildRouteClickHandler}
          resetBuildRouteClickHandler={resetBuildRouteClickHandler}
          undoBuildRouteClickHandler={undoBuildRouteClickHandler}
          viewMarkers={viewMarkers}
          removeMarkerClickHandler={removeMarkerClickHandler}
          updateSelectedMarker={updateSelectedMarker}
          validateMarker={validateMarker}
          updatePlanFlightParameters={updatePlanFlightParameters}
          validatePlanFlightParameters={validatePlanFlightParameters}
          planTakeoff={planTakeoff}
          selectedMarker={selectedMarker}
          buildRouteMode={buildRouteMode}
          planRouteMarkers={planRouteMarkers}
          stagingPlanFlightParameters={stagingPlanFlightParameters}
          planFlightParameters={planFlightParameters}
          viewFlightInfo={viewFlightInfo}
          switchIsOn={switchIsOn}
          mode={mode}
        />
      </aside>
    </div>
  );
}

export default App;
