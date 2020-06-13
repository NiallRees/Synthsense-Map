import App, { validateParameter } from '../app';
import React from 'react';
var enzyme = require('enzyme');

describe('Test App', () => {
  it('Renders', () => {
    const component = enzyme.shallow(<App />);
    expect(component.exists()).toBe(true);
    expect(component).toMatchSnapshot();
  })
})

describe ('Test validateParameter', () => {
  it('Sets minimum schema parameter if input smaller', () => {
    const schemaParameter = {human_readable: "Latitude", default: 0, min: -89.999999, max: 90}
    const value = -200
    const result = validateParameter(value, schemaParameter)
    expect(result).toBe(-89.999999)
  })

  it('Sets maximum schema parameter if input greater', () => {
    const schemaParameter = {human_readable: "Latitude", default: 0, min: -89.999999, max: 90}
    const value = 5000
    const result = validateParameter(value, schemaParameter)
    expect(result).toBe(90)
  })

  it('Sets default schema parameter if input is non numeric', () => {
    const schemaParameter = {human_readable: "Latitude", default: 0, min: -89.999999, max: 90}
    const value = "String"
    const result = validateParameter(value, schemaParameter)
    expect(result).toBe(0)
  })
})