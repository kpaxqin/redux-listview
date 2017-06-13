import _ from 'lodash';
import { parse } from 'query-string';

export const DEFAULT_LIST_DATA = {
  pageIndex: 0,
  pageSize: 10,
  totalCount: 0,
  items: [],
  loading: false,
};

function transformListQuery(query) {
  return _.chain(query)
    .mapKeys((v, k) => _.snakeCase(k))
    .mapValues((v, k) => (k === 'page_index' ? v - 1 : v))
    .value();
}

export const DEFAULT_CONFIG = {
  name: _.uniq(),
  autoLoad: true,
  mapPropsToRequest(props) {
    const DEFAULT_REQUEST = {
      pageIndex: 1,
      pageSize: 10,
    };
    const queryObject = parse(props.location.search);
    return transformListQuery({
      ...DEFAULT_REQUEST,
      ...queryObject,
    });
  },
  mapPropsToSearch(props) {
    return parse(props.location.search);
  },
  mapSearchToQuery(search) {
    const emptyValues = ['', undefined];
    return _.omitBy(search, v => emptyValues.indexOf(v) !== -1);
  },
  dataLoader() {
    return Promise.resolve(DEFAULT_LIST_DATA);
  },
};