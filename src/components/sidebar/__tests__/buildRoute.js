import BuildRoute from '../buildRoute';
import React from 'react';
var enzyme = require('enzyme');

describe('Test BuildRoute', () => {
  it('Renders', () => {
    const component = enzyme.shallow(<BuildRoute/>);
    expect(component.exists()).toBe(true);
    expect(component).toMatchSnapshot();
  })
})