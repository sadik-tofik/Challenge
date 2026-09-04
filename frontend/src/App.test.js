global.IS_REACT_ACT_ENVIRONMENT = true;

import React, { act } from 'react';
import ReactDOM from 'react-dom/client';

jest.mock('./generated/ping_grpc_web_pb', () => {
  const pingFn = jest.fn();
  function MockClient() {
    this.ping = pingFn;
  }
  MockClient.mockPing = pingFn;
  return { PingerPromiseClient: MockClient };
});

import { PingerPromiseClient } from './generated/ping_grpc_web_pb';
import App from './App';

let container = null;
let root = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = ReactDOM.createRoot(container);
  PingerPromiseClient.mockPing.mockReset();
});

afterEach(async () => {
  await act(async () => {
    root.unmount();
  });
  container.remove();
  container = null;
});

function setInputValue(input, value) {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value'
  ).set;
  nativeInputValueSetter.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

test('renders heading and form elements', async () => {
  await act(async () => {
    root.render(<App />);
  });

  expect(container.textContent).toContain('gRPC Ping Service');
  expect(container.querySelector('input')).not.toBeNull();
  expect(container.querySelector('button').textContent).toBe('Send Ping');
});

test('sends ping request and displays server reply', async () => {
  const mockReplyText = 'pong reply from mock server';

  PingerPromiseClient.mockPing.mockResolvedValue({
    getMessage: () => mockReplyText,
  });

  await act(async () => {
    root.render(<App />);
  });

  const input = container.querySelector('input');
  const form = container.querySelector('form');

  await act(async () => {
    setInputValue(input, 'ping message');
  });

  await act(async () => {
    form.dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true })
    );
  });

  expect(container.textContent).toContain('Server Reply:');
  expect(container.textContent).toContain(mockReplyText);
});

test('displays error message when gRPC call fails', async () => {
  const errorMessage =
    'Http response at 400 or 500 level, http status code: 503';

  PingerPromiseClient.mockPing.mockRejectedValue(new Error(errorMessage));

  await act(async () => {
    root.render(<App />);
  });

  const input = container.querySelector('input');
  const form = container.querySelector('form');

  await act(async () => {
    setInputValue(input, 'trigger error');
  });

  await act(async () => {
    form.dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true })
    );
  });

  expect(container.textContent).toContain('Error:');
  expect(container.textContent).toContain('503');
});