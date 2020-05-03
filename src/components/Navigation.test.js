import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Navigation from './Navigation';

afterEach(cleanup);

test('Loads navigation menu successfully', async () => {
  const { queryByText } = render(
    <Router>
      <Navigation />
    </Router>
  );
  expect(queryByText('Projects')).toBeTruthy();
  expect(queryByText('Teams')).toBeTruthy();
  expect(queryByText('Integrations')).toBeTruthy();
  expect(queryByText('Login')).toBeTruthy();
  expect(queryByText('Logout')).toBeTruthy();
});
