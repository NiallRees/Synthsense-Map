import EditMarker from '../editMarker';
import React from 'react';
var enzyme = require('enzyme');

describe('Test EditMarker', () => {
  it('Renders', () => {
    const component = enzyme.shallow(
      <EditMarker
        selectedMarker={{
          name: "test",
          type: "sensor"
        }}
        updateSelectedMarker={jest.fn()}
        updateValidatedMarker={jest.fn()}
      />
    );
    expect(component.exists()).toBe(true);
    expect(component).toMatchSnapshot();
  })
})