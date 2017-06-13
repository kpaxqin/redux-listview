import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { parse } from 'query-string';
import { createAction, createAsyncAction } from 'redux-action-tools';
import propTypes, { routerPropTypes } from './propTypes';
import listReducer from './reducer';
import { DEFAULT_CONFIG, DEFAULT_LIST_DATA } from './DEFAULTS';
import { makePath } from './utils';

function connectListView(config, ListComponent) {
  const finalConfig = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  const actions = {
    initList: createAction('INIT_LIST'),
    loadList: createAsyncAction('LOAD_LIST', finalConfig.dataLoader, (payload, defaultMeta) => ({
      list: finalConfig.name,
      ...defaultMeta,
    })),
    loadListQuiet: createAsyncAction('LOAD_LIST', finalConfig.dataLoader, (payload, defaultMeta) => ({
      list: finalConfig.name,
      omitLoading: true,
      ...defaultMeta,
    })),
  };

  class ListView extends Component {
    static propTypes = {
      dispatch: PropTypes.func.isRequired,
      location: routerPropTypes.location.isRequired,
      /* eslint-disable react/forbid-prop-types */
      listView: PropTypes.object.isRequired,
      history: routerPropTypes.history,
    };
    static contextTypes = {
      router: PropTypes.shape({
        history: routerPropTypes.history
      })
    };
    static defaultProps = {
      history: undefined,
    };
    constructor(props, context) {
      super(props);
      const { dispatch } = this.props;
      dispatch(actions.initList({
        name: finalConfig.name,
        initData: DEFAULT_LIST_DATA,
      }));

      this.history = context.router ? context.router.history : this.props.history;

      this.actionMethods = finalConfig.actions
        ? bindActionCreators(finalConfig.actions, dispatch)
        : undefined;
    }
    componentWillMount() {
      finalConfig.autoLoad && this.load(this.props);
    }
    componentWillReceiveProps(nextProps) {
      const shouldReload = this.props.location.search !== nextProps.location.search;
      shouldReload && finalConfig.autoLoad && this.load(nextProps);
    }
    load = (props = this.props, quiet) => {
      const { dispatch } = props;
      const request = finalConfig.mapPropsToRequest(props);
      const loadAction = quiet ? actions.loadListQuiet : actions.loadList;
      return dispatch(loadAction(request));
    }
    goToPage = (pageIndex)=> {
      const { dispatch, location: { pathname: path, search } } = this.props;
      const targetQuery = {
        ...parse(search),
        pageIndex,
      };
      this.history.push(makePath(path, targetQuery));
    }
    search = (params)=> {
      const { dispatch, location: { pathname: path, search } } = this.props;
      const targetQuery = {
        ...finalConfig.mapSearchToQuery(params, parse(search)),
        pageIndex: 1,
      };
      this.history.push(makePath(path, targetQuery));
    }
    sort = (sortData)=> {
      const { dispatch, location: { pathname: path, search } } = this.props;
      const targetQuery = {
        ...parse(search),
        ...sortData,
        pageIndex: 1,
      };
      this.history.push(makePath(path, targetQuery));
    }
    render() {
      const { listView } = this.props;
      const listData = listView[finalConfig.name] || DEFAULT_LIST_DATA;
      const {sortType, sortBy, ...searchParams} = finalConfig.mapPropsToSearch(this.props);
      const sortParams = { sortBy, sortType };
      return (
        <ListComponent
          listData={listData}
          loadList={this.load}
          searchParams={searchParams}
          searchList={this.search}
          sortParams={sortParams}
          sortList={this.sort}
          goToPage={this.goToPage}
          {...this.actionMethods}
          {...this.props}
        />
      );
    }
  }

  return connect(state => state)(ListView);
}

export { connectListView, propTypes, listReducer, DEFAULT_CONFIG };

export default connectListView;
