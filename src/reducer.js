import { createReducer } from 'redux-action-tools';

const getPages = ({ totalCount, pageSize }) => (Math.ceil(totalCount / pageSize));

const reducer = createReducer()
  .when('INIT_LIST', (state, { payload: { name, initData } }) => {
    /* eslint-disable no-param-reassign */
    state[name] = initData; // return the original reference to avoid unnecessary UI update;
    return state;
  })
  .when('LOAD_LIST', (state, { meta: { list } }) => ({
    [list]: {
      ...state[list],
      loading: true,
    },
  }))
  .done((state, { payload, meta: { list } }) => ({
    [list]: {
      ...state[list],
      ...payload,
      pageItems: getPages(payload),
      loading: false,
    },
  }))
  .failed((state, { meta: { list } }) => ({
    [list]: {
      loading: false,
    },
  }))
  .build({});

  export default reducer;