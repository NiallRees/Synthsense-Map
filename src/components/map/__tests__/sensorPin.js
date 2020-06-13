import SensorPin from '../sensorPin';
import React from 'react';
var enzyme = require('enzyme');

describe('Test MouseCoords', () => {
  it('Renders', () => {
    const component = enzyme.shallow(<SensorPin/>);
    expect(component.exists()).toBe(true);
    expect(component).toMatchSnapshot();
  })
})