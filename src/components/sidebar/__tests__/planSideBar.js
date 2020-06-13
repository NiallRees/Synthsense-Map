import PlanSideBar from '../planSideBar';
import React from 'react';
var enzyme = require('enzyme');

describe('Test PlanSideBar', () => {
  it('Renders', () => {
    const component = enzyme.shallow(
      <PlanSideBar/>
    );
    expect(component.exists()).toBe(true);
    expect(component).toMatchSnapshot();
  })
})