import Switch from '../switch';
import React from 'react';
var enzyme = require('enzyme');

describe('Test Switch', () => {
  it('Renders', () => {
    const component = enzyme.shallow(
      <Switch/>
    );
    expect(component.exists()).toBe(true);
    expect(component).toMatchSnapshot();
  })
})