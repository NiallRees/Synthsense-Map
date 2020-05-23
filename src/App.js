import React, { Component } from 'react';
import './App.css';
import Map from './components/map';
import Sidebar from './components/sidebar';
import schemas from './schemas';
const { ipcRenderer } = window.require('electron');


class App extends Component {
  constructor() {
    super();
    var planFlightParameters = {}
    Object.keys(schemas.Flight).forEach(function(key) {
      planFlightParameters[key] = schemas.Flight[key].Default
    });
    this.state = {
      dataFolderPath: null,
      viewMarkers: [],
      planMarkers: [],
      planRouteMarkers: [],
      planTakeoff: null,
      planFlightParameters: planFlightParameters,
      stagingPlanFlightParameters: planFlightParameters,
      selectedMarker: null,
      switchIsOn: false,
      mode: 'view',
      buildRouteMode: false,
      mouseCoords: {
        latitude: 52.4054360,
        longitude: -0.3293577
      },
      pinPrompt: {
        'enabled': false,
        'longitude': 0,
        'latitude': 0
      }
    };

    ipcRenderer.on('imported-view-data', (event, arg) => {
      this.setState({
        viewMarkers: arg[0].sensors,
        dataFolderPath: arg[1]
      })
      this.refs.map.centerViewportFromCoords(arg[0].sensors)
    })

    ipcRenderer.on('imported-plan-data', (event, data) => {
      this.setState({
        planFlightParameters: data.planFlightParameters,
        planRouteMarkers: data.planRouteMarkers,
        planTakeoff: data.planTakeoff,
        planMarkers: data.planMarkers
      })
      this.refs.map.centerViewportFromCoords([data.planTakeoff, ...data.planMarkers])
    })

    this.markerClickHandler = this.markerClickHandler.bind(this);
    this.resetSelectedMarker = this.resetSelectedMarker.bind(this);
    this.setPinPrompt = this.setPinPrompt.bind(this);
    this.pinPromptClickHandler = this.pinPromptClickHandler.bind(this);
    this.mapClickHandler = this.mapClickHandler.bind(this);
    this.viewDataClickHandler = this.viewDataClickHandler.bind(this);
    this.importViewDataClickHandler = this.importViewDataClickHandler.bind(this);
    this.savePlanClickHandler = this.savePlanClickHandler.bind(this);
    this.importPlanClickHandler = this.importPlanClickHandler.bind(this);
    this.buildRouteClickHandler = this.buildRouteClickHandler.bind(this);
    this.clearMarkersClickHandler = this.clearMarkersClickHandler.bind(this);
    this.exitBuildRouteClickHandler = this.exitBuildRouteClickHandler.bind(this);
    this.resetBuildRouteClickHandler = this.resetBuildRouteClickHandler.bind(this);
    this.exportBuildRouteClickHandler = this.exportBuildRouteClickHandler.bind(this);
    this.undoBuildRouteClickHandler = this.undoBuildRouteClickHandler.bind(this);
    this.removeMarkerClickHandler = this.removeMarkerClickHandler.bind(this);
    this.updateSelectedMarker = this.updateSelectedMarker.bind(this);
    this.validateMarker = this.validateMarker.bind(this);
    this.updatePlanFlightParameters = this.updatePlanFlightParameters.bind(this);
    this.validatePlanFlightParameters = this.validatePlanFlightParameters.bind(this);
    this.updateMouseCoords = this.updateMouseCoords.bind(this);
    this.addPlanPin = this.addPlanPin.bind(this);
    this.handleModeToggle = this.handleModeToggle.bind(this);
  }

  planRouteMarkerClickHandler(marker) {
    if (this.state.planTakeoff) {
      this.setState(prevState => ({
        planRouteMarkers: [...prevState.planRouteMarkers, marker]
      }))
    }
  }

  markerClickHandler(marker) {
    if (this.state.buildRouteMode === false) {
      this.setState({
        selectedMarker: marker
      })
    } else {
      this.planRouteMarkerClickHandler(marker);
    }
  }

  editPlanMarkersInPlace(updatedMarker) {
    var updatedplanRouteMarkers = [...this.state.planRouteMarkers]
    for (var i = 0; i < this.state.planRouteMarkers.length; i++) {
      if (this.state.planRouteMarkers[i]['id'] === updatedMarker['id']) {
        updatedplanRouteMarkers.splice(i, 1, updatedMarker)
      }
    }
    return(updatedplanRouteMarkers)
  }

  updateSelectedMarker(input) {
    var updatedMarker = { ...this.state.selectedMarker};
    updatedMarker[input.target.name] = input.target.value;
    this.setState({
      selectedMarker: updatedMarker
    })
  }

  validateMarker(input) {
    var updatedMarker = { ...this.state.selectedMarker};
    var newValue;
    if (input.target.name === "name") {
      newValue = input.target.value
    } else {
      const schemaVariable = schemas[updatedMarker.type][input.target.name];
      var newValue = isNaN(parseFloat(input.target.value)) ? 0.0 : parseFloat(input.target.value)
      newValue = (newValue < schemaVariable.Min) ? schemaVariable.Min : newValue
      newValue = (newValue > schemaVariable.Max) ? schemaVariable.Max : newValue
    }
    updatedMarker[input.target.name] = newValue;
    if (this.state.selectedMarker.type === "Takeoff") {
      this.setState({
        planTakeoff: updatedMarker,
        planRouteMarkers: this.editPlanMarkersInPlace(updatedMarker),
        selectedMarker: updatedMarker
      })
    } else {
      this.setState(prevState => ({
        planMarkers: [...prevState.planMarkers.filter(sensor => sensor['id'] !== this.state.selectedMarker['id']), updatedMarker],
        planRouteMarkers: this.editPlanMarkersInPlace(updatedMarker),
        selectedMarker: updatedMarker
      }))
    }
  }

  updatePlanFlightParameters(input) {
    var updatedParameters = { ...this.state.planFlightParameters};
    updatedParameters[input.target.name] = input.target.value;
    this.setState({
      stagingPlanFlightParameters: updatedParameters
    })
  }

  validatePlanFlightParameters(input) {
    var newValue = isNaN(parseFloat(input.target.value)) ? 0.0 : parseFloat(input.target.value)
    var updatedParameters = { ...this.state.planFlightParameters};
    const schemaVariable = schemas.Flight[input.target.name]
    newValue = (newValue < schemaVariable.Min) ? schemaVariable.Min : newValue
    newValue = (newValue > schemaVariable.Max) ? schemaVariable.Max : newValue
    updatedParameters[input.target.name] = newValue;
    this.setState({
      planFlightParameters: updatedParameters
    })
  }

  mapClickHandler(e) {
    if(e.leftButton) {
      this.resetSelectedMarker();
      this.setState({
        pinPrompt: {
          'enabled': false,
          'longitude': 0,
          'latitude': 0
        }
      })
    }
  }

  updateMouseCoords(lngLat) {
    if(lngLat[0]) {
      this.setState({
        mouseCoords: {
          longitude: lngLat[0].toFixed(7),
          latitude: lngLat[1].toFixed(7)
        }
      })
    }
  }

  resetSelectedMarker() {
    this.setState({
      selectedMarker: null
    })
  }

  viewDataClickHandler(sensor) {
    ipcRenderer.send('open-data-folder', [this.state.dataFolderPath, sensor.name])
  }

  importViewDataClickHandler() {
    ipcRenderer.send('import-view-data')
  }

  exitBuildRouteClickHandler() {
    this.setState({
      buildRouteMode: false
    })
  }

  resetBuildRouteClickHandler() {
    this.setState({
      planRouteMarkers: []
    })
  }

  exportBuildRouteClickHandler() {
    const data = {
      'flightParameters': this.state.planFlightParameters,
      'route': this.state.planRouteMarkers
    }
    ipcRenderer.send('export-route', data)
  }

  undoBuildRouteClickHandler() {
    const planRouteMarkers = [...this.state.planRouteMarkers];
    planRouteMarkers.pop();
    this.setState({
      planRouteMarkers: planRouteMarkers
    })
  }

  savePlanClickHandler() {
    const data = {
      'planFlightParameters': this.state.planFlightParameters,
      'planRouteMarkers': this.state.planRouteMarkers,
      'planTakeoff': this.state.planTakeoff,
      'planMarkers': this.state.planMarkers
    }
    ipcRenderer.send('save-plan', data)
  }

  importPlanClickHandler() {
    ipcRenderer.send('import-plan')
  }

  buildRouteClickHandler() {
    this.setState({
      buildRouteMode: true
    })
  }

  clearMarkersClickHandler() {
    this.setState({
      planMarkers: [],
      planRouteMarkers: []
    })
  }

  removeMarkerClickHandler(selectedMarker) {
    this.setState({
      planRouteMarkers: []
    })
    if (selectedMarker === this.state.planTakeoff) {
      this.setState({
        planTakeoff: null,
        selectedMarker: null
      })
    } else {
      this.setState(prevState => ({
        planMarkers: prevState.planMarkers.filter(sensor => sensor['id'] !== selectedMarker['id']),
        planRouteMarkers: prevState.planRouteMarkers.filter(sensor => sensor['id'] !== selectedMarker['id']),
        selectedMarker: null
      }))
    }
  }

  makeid(length) {
    // Taken from https://stackoverflow.com/a/1349426
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

  addPlanPin(pinPrompt, pinType) {
      var newMarker = {}
      Object.keys(schemas[pinType]).forEach(function(key) {
        newMarker[key] = schemas[pinType][key].Default
      });

      newMarker["id"] = this.makeid(8) // TODO add collision prevention
      newMarker["type"] = pinType
      newMarker["longitude"] = +(pinPrompt.longitude.toFixed(7)) // 7 dp gives 11mm precision
      newMarker["latitude"] = +(pinPrompt.latitude.toFixed(7))

    if (pinType === "Takeoff") {
      this.setState({
        planTakeoff: newMarker
      })
    } else {
      this.setState(prevState => ({
        planMarkers: [...prevState.planMarkers, newMarker]
      }))
    }
  }

  setPinPrompt(lngLat) {
    if (this.state.mode === "plan") {
      this.setState({
        pinPrompt: {
          'enabled': true,
          'longitude': lngLat[0],
          'latitude': lngLat[1]
        }
      })
    }
  }

  pinPromptClickHandler(pinPrompt, pinType) {
    this.setState({
      pinPrompt: {
        'enabled': false,
        'longitude': 0,
        'latitude': 0
      }
    })
    this.addPlanPin(pinPrompt, pinType)
  }

  handleModeToggle() {
    if (!this.state.switchIsOn) {
      this.setState({
        mode: 'plan',
        switchIsOn: true
      })
      if (this.state.planMarkers.length === 0) {
        this.setState({
          planMarkers: this.state.viewMarkers.map(sensor => (
            {
              id: sensor.id,
              type: sensor.type,
              name: sensor.name,
              longitude: sensor.longitude,
              latitude: sensor.latitude,
              elevation: sensor.elevation
            }
          ))
        })
      }
    }

    if (this.state.switchIsOn) {
      this.setState({
        mode: 'view',
        buildRouteMode: false,
        switchIsOn: false
      })
    }      
    
    this.setState({
      selectedMarker: null
    })
  }

  render() {
    return (
      <div className="container">
        <div className="map">
          <Map
            ref="map"
            markers={this.state.switchIsOn ? this.state.planMarkers : this.state.viewMarkers}
            planRouteMarkers={this.state.planRouteMarkers}
            takeoff={this.state.switchIsOn ? this.state.planTakeoff : null}
            selectedMarker={this.state.selectedMarker} 
            markerClickHandler={this.markerClickHandler}
            addPlanPin={this.addPlanPin}
            resetSelectedMarker={this.resetSelectedMarker}
            setPinPrompt={this.setPinPrompt}
            pinPrompt={this.state.pinPrompt}
            updateMouseCoords={this.updateMouseCoords}
            mode={this.state.mode}
            buildRouteMode={this.state.buildRouteMode}
            mouseCoords={this.state.mouseCoords}
            pinPromptClickHandler={this.pinPromptClickHandler}
            mapClickHandler={this.mapClickHandler}
          />
        </div>
        <aside>
          <Sidebar
            state={this.state}
            handleModeToggle={this.handleModeToggle}
            viewDataClickHandler={this.viewDataClickHandler}
            importViewDataClickHandler={this.importViewDataClickHandler}
            savePlanClickHandler={this.savePlanClickHandler}
            importPlanClickHandler={this.importPlanClickHandler}
            buildRouteClickHandler={this.buildRouteClickHandler}
            clearMarkersClickHandler={this.clearMarkersClickHandler}
            exitBuildRouteClickHandler={this.exitBuildRouteClickHandler}
            exportBuildRouteClickHandler={this.exportBuildRouteClickHandler}
            resetBuildRouteClickHandler={this.resetBuildRouteClickHandler}
            undoBuildRouteClickHandler={this.undoBuildRouteClickHandler}
            removeMarkerClickHandler={this.removeMarkerClickHandler}
            updateSelectedMarker={this.updateSelectedMarker}
            validateMarker={this.validateMarker}
            updatePlanFlightParameters={this.updatePlanFlightParameters}
            validatePlanFlightParameters={this.validatePlanFlightParameters}
          />
        </aside>
      </div>
    );
  }
}

export default App;
