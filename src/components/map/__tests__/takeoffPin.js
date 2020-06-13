import TakeoffPin from '../takeoffPin';
import React from 'react';
var enzyme = require('enzyme');

describe('Test MouseCoords', () => {
  it('Renders', () => {
    const component = enzyme.shallow(<TakeoffPin/>);
    expect(component.exists()).toBe(true);
    expect(component).toMatchSnapshot();
  })
})