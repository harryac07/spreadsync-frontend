import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import configureMockStore from 'redux-mock-store';
import axiosMock from 'axios';
import { createMemoryHistory } from 'history';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { expectSaga } from 'redux-saga-test-plan';
import { Provider } from 'react-redux';
import { FETCH_ALL_USER_ACCOUNTS, FETCH_ALL_USER_ACCOUNTS_SUCCEED } from './constant';
import reducer from './reducer';
import { fetchAllAccountsForUserSaga } from 'containers/Main/saga';
import createSagaMiddleware from 'redux-saga';
import Main from './index.js';

import { API_URL } from 'env';

const mockStore = configureMockStore([createSagaMiddleware]);
jest.mock('axios');

describe('Should trigger fetch accounts action on component mount', () => {
  const history = createMemoryHistory();

  const props = {};
  const state = {
    app: {
      fetching: false,
      selectedAccount: '',
      accounts: [],
    },
  };
  const store = mockStore(state);
  const setup = () => {
    return render(
      <Provider store={store}>
        <Router>
          <Main {...props} history={history} />
        </Router>
      </Provider>
    );
  };
  it('Should dispatch login action', async () => {
    const newState = reducer(state.app, {
      type: FETCH_ALL_USER_ACCOUNTS,
    });
    expect(newState.fetching).toEqual(true);
    expect(newState.accounts).toEqual([]);

    const { getByText } = setup();
    const fetchingText = getByText(/Fetching user data/i);
    expect(fetchingText).toBeInTheDocument();
  });

  it('Should trigger fetchUserSaga successfully and update store state', async () => {
    const userId = 'a2e2d929-c748-4d5b-a4c2-userhari';
    const fakeResData = [
      {
        id: 'test-id-1234',
        name: 'Spreadsync dev',
        admin: 'a2e2d929-c748-4d5b-a4c2-64527795229e',
        created_on: '2020-06-01T13:02:52.904Z',
        updated_on: null,
        user: userId,
      },
    ];
    axiosMock.get.mockResolvedValueOnce({ data: fakeResData });

    const state = {
      app: {
        fetching: false,
        selectedAccount: '',
        accounts: [],
      },
    };
    await expectSaga(fetchAllAccountsForUserSaga, {
      id: userId,
    })
      .withReducer(reducer, state.app)
      .put({
        type: FETCH_ALL_USER_ACCOUNTS_SUCCEED,
        payload: fakeResData,
      })
      .hasFinalState({
        fetching: true,
        selectedAccount: '',
        accounts: fakeResData,
      })
      .run();
    expect(axiosMock.get).toHaveBeenCalledTimes(1);
    expect(axiosMock.get).toHaveBeenCalledWith(`${API_URL}/users/${userId}/accounts`, {
      headers: { Authorization: `bearer null` },
    });
  });
});
