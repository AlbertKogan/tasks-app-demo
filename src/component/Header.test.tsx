import React from 'react';
import { render, screen } from '@testing-library/react'
import Header from './Header';

afterEach(() => {
  jest.clearAllMocks();
});

test('Proper title render', async () => {
  const activeBoard={
    id: 1,
    isActive: true,
    displayName: "Test",
    taskCount: 5
  } as any;
  const boards=[activeBoard] as any;
  const setActiveBoard = jest.fn();

  render(
    <Header boards={ boards } 
            activeBoard={ activeBoard } 
            setActiveBoard={ setActiveBoard } />
  );
  const headerTitleBoard = await screen.getByTestId("HeaderTitleBoard");
  expect(headerTitleBoard.textContent).toBe("Test board");
});

test('Proper counter render', async () => {
  const activeBoard={
    id: 1,
    isActive: true,
    displayName: "Test",
    taskCount: 5
  } as any;
  const boards=[activeBoard] as any;
  const setActiveBoard = jest.fn();

  render(
    <Header boards={ boards } 
            activeBoard={ activeBoard } 
            setActiveBoard={ setActiveBoard } />
  );
  const headerTitleCount = await screen.getByTestId("HeaderTitleCount");
  expect(headerTitleCount.textContent).toContain("with 5 tasks");
});
