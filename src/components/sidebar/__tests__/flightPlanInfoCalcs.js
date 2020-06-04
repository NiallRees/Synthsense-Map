import FlightPlanInfoCalcs from '../flightPlanInfoCalcs';
import React from 'react';
var enzyme = require('enzyme');


describe('Test FlightPlanInfoCalcs', () => {
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
    expect(component).toMatchSnapshot();
  })

  it('Matches snapshot with arbitrary takeoff and sensors', () => {
    const component = enzyme.shallow(
      <FlightPlanInfoCalcs 
        planFlightParameters={{
          'horizontalSpeed':5,
          'ascendingSpeed':5,
          'descendingSpeed':5,
          'altitude': 30
        }}
        planTakeoff={{
          'elevation': 0,
          'latitude': 51.470188,
          'longitude': -0.3064749
        }}
        planRouteMarkers={[
          {'elevation': 0,
          'latitude': 51.4721273,
          'longitude': -0.3043489},
          {'elevation': 0,
          'latitude': 51.4711572,
          'longitude': -0.3022958}
        ]}
      />
    );
    expect(component.find('#bottom-flight-info-value').at(0).text()).toBe('02:52') // time
    expect(component.find('#bottom-flight-info-value').at(1).text()).toBe('440') // distance
    expect(component.find('#bottom-flight-info-value').at(2).text()).toBe('60') // ascent
    expect(component).toMatchSnapshot();
  })

});
