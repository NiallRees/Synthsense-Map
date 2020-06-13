import PinPrompt from '../pinPrompt';
import React from 'react';
var enzyme = require('enzyme');

describe('Test PinPrompt', () => {
  it('Renders', () => {
    const component = enzyme.shallow(<PinPrompt pinPrompt={{enabled: true, latitude: 0, longitude: 0}}/>);
    expect(component.exists()).toBe(true);
    expect(component).toMatchSnapshot();
  })
})