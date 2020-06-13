import RechargePin from '../rechargePin';
import React from 'react';
var enzyme = require('enzyme');

describe('Test MouseCoords', () => {
  it('Renders', () => {
    const component = enzyme.shallow(<RechargePin/>);
    expect(component.exists()).toBe(true);
    expect(component).toMatchSnapshot();
  })
})