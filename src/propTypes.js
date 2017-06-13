import { PropTypes } from 'react';

export const routerPropTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }),
  match: PropTypes.shape({
    params: PropTypes.object,
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
    replace: PropTypes.func,
    goBack: PropTypes.func,
  }),
};

const propTypes = {
  listData: PropTypes.shape({
    pageIndex: PropTypes.number,
    pageSize: PropTypes.number,
    totalCount: PropTypes.number,
    items: PropTypes.array,
    loading: PropTypes.bool,
  }),
  searchList: PropTypes.func.isRequired,
  goToPage: PropTypes.func.isRequired,
  sortParams: PropTypes.shape({
    sortBy: PropTypes.string,
    sortType: PropTypes.string,
  }),
};

export default propTypes