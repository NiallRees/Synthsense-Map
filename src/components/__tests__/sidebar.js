import Sidebar from '../sidebar';
import React from 'react';
var enzyme = require('enzyme');

describe('Test Sidebar', () => {
  it('Renders', () => {
    const component = enzyme.shallow(<Sidebar />);
    expect(component.exists()).toBe(true);
    expect(component).toMatchSnapshot();
  })
})