import PolylineOverlay from '../polylineOverlay';
import React from 'react';
var enzyme = require('enzyme');

describe('Test PolylineOverlay', () => {
  it('Renders', () => {
    const component = enzyme.shallow(<PolylineOverlay />);
    expect(component.exists()).toBe(true);
    expect(component).toMatchSnapshot();
  })
})