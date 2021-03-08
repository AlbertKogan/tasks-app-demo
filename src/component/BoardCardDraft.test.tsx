import * as React from 'react';
import { render, screen } from '@testing-library/react'
import BoardCardDraft from './BoardCardDraft';

afterEach(() => {
  jest.clearAllMocks();
});

test('Initial draft card render', async () => {
  const setIsDraftSpy = jest.fn();
  const data={
    status: "progress",
  } as any;

  jest.spyOn(React, 'useContext').mockImplementation(() => ({
    activeBoard: { id: 'id' }
  }));

  render(
    <BoardCardDraft data= { data } setIsDraft={ setIsDraftSpy } />
  );
  const cardWrapper = await screen.getByTestId("CardWrapper");
  expect(cardWrapper).toBeTruthy();
});

test('Discard changes', async () => {
  const setIsDraftSpy = jest.fn();
  const data={
    status: "progress",
  } as any;

  jest.spyOn(React, 'useContext').mockImplementation(() => ({
    activeBoard: { id: 'id' }
  }));

  render(
    <BoardCardDraft data= { data } setIsDraft={ setIsDraftSpy } />
  );
  const discardButton = await screen.getByTestId("DiscardButton");
  discardButton.click();
  expect(setIsDraftSpy).toBeCalled();
});
