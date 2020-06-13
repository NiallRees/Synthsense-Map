import FlightParameters from '../flightParameters';
import React from 'react';
var enzyme = require('enzyme');

describe('Test FlightParameters', () => {
  it('Renders', () => {
    const component = enzyme.shallow(
      <FlightParameters 
        updatePlanFlightParameters={jest.fn()} 
        updateValidatePlanFlightParameters={jest.fn()}
        stagingPlanFlightParameters={jest.fn()}
      />
    );
    expect(component.exists()).toBe(true);
    expect(component).toMatchSnapshot();
  })
})