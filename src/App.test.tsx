import React from 'react';
import { render, screen } from '@testing-library/react';
import renderer, { act } from 'react-test-renderer';
import store from './Store';
import App from './App';

afterEach(() => {
  jest.clearAllMocks();
});

test('Initial render', () => {
  render(<App />);
  const mainContainer = screen.getByTestId("MainContiner");
  expect(mainContainer).toBeTruthy();
});

test('initial getData call', () => {
  const getDataSpy = jest.spyOn(store, 'getData');
  act(() =>  { 
     renderer.create(<App />)
  });
  expect(getDataSpy).toHaveBeenCalled();
});

