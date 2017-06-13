import { uniq, omitBy } from './utils';
import { parse } from 'query-string';

export const DEFAULT_LIST_DATA = {
  pageIndex: 0,
  pageSize: 10,
  totalCount: 0,
  items: [],
  loading: false,
};

export const DEFAULT_CONFIG = {
  name: uniq(),
  autoLoad: true,
  mapPropsToRequest(props) {
    const DEFAULT_REQUEST = {
      pageIndex: 1,
      pageSize: 10,
    };
    const queryObject = parse(props.location.search);
    return {
      ...DEFAULT_REQUEST,
      ...queryObject,
    };
  },
  mapPropsToSearch(props) {
    return parse(props.location.search);
  },
  mapSearchToQuery(search) {
    const emptyValues = ['', undefined];
    return omitBy(search, v => emptyValues.indexOf(v) !== -1);
  },
  dataLoader() {
    return Promise.resolve(DEFAULT_LIST_DATA);
  },
};