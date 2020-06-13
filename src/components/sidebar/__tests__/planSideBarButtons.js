import PlanSideBarButtons from '../planSideBarButtons';
import React from 'react';
var enzyme = require('enzyme');

describe('Test PlanSideBarButtons', () => {
  it('Renders', () => {
    const component = enzyme.shallow(
      <PlanSideBarButtons/>
    );
    expect(component.exists()).toBe(true);
    expect(component).toMatchSnapshot();
  })
})