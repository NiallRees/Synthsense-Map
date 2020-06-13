import FlightPlanInfoCalcs from '../flightPlanInfoCalcs';
import React from 'react';
var enzyme = require('enzyme');

describe('Test FlightPlanInfoCalcs', () => {
  it('Matches values and snapshot with arbitrary takeoff and sensors', () => {
    const component = enzyme.shallow(
      <FlightPlanInfoCalcs 
        planFlightParameters={{
          'horizontalSpeed':5,
          'ascendingSpeed':2,
          'descendingSpeed':3,
          'altitude': 30
        }}
        planTakeoff={{
          'elevation': 3,
          'latitude': 51.470188,
          'longitude': -0.3064749
        }}
        planRouteMarkers={[
          {'elevation': 6,
          'latitude': 51.4721273,
          'longitude': -0.3043489},
          {'elevation': 4,
          'latitude': 51.4711572,
          'longitude': -0.3022958}
        ]}
      />
    );
    expect(component.find('#bottom-flight-info-value').at(1).text()).toBe('748') // distance
    expect(component.find('#bottom-flight-info-value').at(2).text()).toBe('93') // ascent
    expect(component.find('#bottom-flight-info-value').at(0).text()).toBe('03:47') // time
    expect(component).toMatchSnapshot();
  })

  it('Renders correctly without props', () => {
    const component = enzyme.shallow(<FlightPlanInfoCalcs/>);
    expect(component).toMatchSnapshot();
  });

  it('Matches snapshot with no takeoff or sensors', () => {
    const component = enzyme.shallow(
      <FlightPlanInfoCalcs 
        planFlightParameters={{
          'horizontalSpeed':0,
          'ascendingSpeed':0,
          'descendingSpeed':0
        }}
        planTakeoff={null}
        planRouteMarkers={[]}
      />
    );
    expect(component.find('#bottom-flight-info-value').at(0).text()).toBe('00:00') // time
    expect(component.find('#bottom-flight-info-value').at(1).text()).toBe('0') // distance
    expect(component.find('#bottom-flight-info-value').at(2).text()).toBe('0') // ascent
    expect(component).toMatchSnapshot();
  })

  it('Matches values with no takeoff or sensors', () => {
    const component = enzyme.shallow(
      <FlightPlanInfoCalcs 
        planFlightParameters={{
          'horizontalSpeed':5,
          'ascendingSpeed':5,
          'descendingSpeed':5,
          'altitude': 30
        }}
        planTakeoff={null}
        planRouteMarkers={[]}
      />
    );
    expect(component.find('#bottom-flight-info-value').at(0).text()).toBe('00:00') // time
    expect(component.find('#bottom-flight-info-value').at(1).text()).toBe('0') // distance
    expect(component.find('#bottom-flight-info-value').at(2).text()).toBe('0') // ascent
    expect(component).toMatchSnapshot();
  })

});
