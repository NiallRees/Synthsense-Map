import MouseCoords from '../mouseCoords';
import React from 'react';
var enzyme = require('enzyme');

describe('Test MouseCoords', () => {
  it('Renders', () => {
    const component = enzyme.shallow(<MouseCoords mouseCoords={{latitude: 0, longitude: 0}}/>);
    expect(component.exists()).toBe(true);
    expect(component).toMatchSnapshot();
  })
})