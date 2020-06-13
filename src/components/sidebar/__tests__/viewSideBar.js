import ViewSideBar from '../viewSideBar';
import React from 'react';
var enzyme = require('enzyme');

describe('Test ViewSideBar', () => {
  it('Renders', () => {
    const component = enzyme.shallow(
      <ViewSideBar
        viewMarkers={{}}
      />
    );
    expect(component.exists()).toBe(true);
    expect(component).toMatchSnapshot();
  })
})