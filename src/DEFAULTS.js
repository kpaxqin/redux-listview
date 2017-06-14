import { uniq, omitBy } from './utils';
import { parse } from 'query-string';

export const DEFAULT_LIST_DATA = {
  pageIndex: 0,
  pageSize: 10,
  totalCount: 0,
  items: [],
  loading: false,
};

export const DEFAULT_INIT_CONFIG = {
  getLocationFromProps(props){
    return props.location;
  },
  mountField: 'listView',
}

export const DEFAULT_LIST_CONFIG = {
  name: uniq(),
  autoLoad: true,
  mapLocationToRequest(location) {
    const DEFAULT_REQUEST = {
      pageIndex: 1,
      pageSize: 10,
    };
    const queryObject = parse(location.search);
    return {
      ...DEFAULT_REQUEST,
      ...queryObject,
    };
  },
  mapLocationToSearch(location) {
    return parse(location.search);
  },
  mapSearchToQuery(search) {
    const emptyValues = ['', undefined];
    return omitBy(search, v => emptyValues.indexOf(v) !== -1);
  },
  dataLoader() {
    return Promise.resolve(DEFAULT_LIST_DATA);
  },
};