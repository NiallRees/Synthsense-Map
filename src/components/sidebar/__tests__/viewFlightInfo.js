import ViewFlightInfo from '../viewFlightInfo';
import React from 'react';
var enzyme = require('enzyme');

describe('Test ViewFlightInfo', () => {
  it('Renders', () => {
    const component = enzyme.shallow(
      <ViewFlightInfo
        flightInfo={{}}
      />
    );
    expect(component.exists()).toBe(true);
    expect(component).toMatchSnapshot();
  })
})