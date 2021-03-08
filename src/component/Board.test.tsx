import * as React from 'react';
import { render, screen } from '@testing-library/react'
import Board from './Board';

jest.mock("./CardPlaceholder", () => {
  return {
    __esModule: true,
    default: () => {
      return <div></div>;
    },
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

test('Initial Board render', async () => {
  const data={
    statuses: [
      {
        id: 'progress',
        displayName: 'In Progress',
        order: 0
      },
      {
        id: 'done',
        displayName: 'Done',
        order: 1
      }
  ],
  } as any;
  jest.spyOn(React, 'useContext').mockImplementation(() => data);

  render(
    <Board />
  );
  const boardContent = await screen.getByTestId("BoardContent");
  expect(boardContent).toBeTruthy();
  expect(boardContent.children.length).toBe(2);
});