import Map from '../map';
import React from 'react';
var enzyme = require('enzyme');

describe('Test Map', () => {
  it('Renders', () => {
    const component = enzyme.shallow(<Map />);
    expect(component.exists()).toBe(true);
    expect(component).toMatchSnapshot();
  })
})