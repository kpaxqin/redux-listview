import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { parse } from 'query-string';
import { createAction, createAsyncAction } from 'redux-action-tools';
import propTypes, { routerPropTypes } from './propTypes';
import listReducer from './reducer';
import { DEFAULT_LIST_CONFIG, DEFAULT_LIST_DATA, DEFAULT_INIT_CONFIG } from './DEFAULTS';
import { makePath } from './utils';


const initConnectListView = initConfig => {
  return function connectListView(listConfig, ListComponent) {
    const finalInitConfig = {
      ...DEFAULT_INIT_CONFIG,
      ...initConfig,
    };
    const finalListConfig = {
      ...DEFAULT_LIST_CONFIG,
      ...listConfig,
    };

    const actions = {
      initList: createAction('INIT_LIST'),
      loadList: createAsyncAction('LOAD_LIST', finalListConfig.dataLoader, (payload, defaultMeta) => ({
        list: finalListConfig.name,
        ...defaultMeta,
      })),
      loadListQuiet: createAsyncAction('LOAD_LIST', finalListConfig.dataLoader, (payload, defaultMeta) => ({
        list: finalListConfig.name,
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
          name: finalListConfig.name,
          initData: DEFAULT_LIST_DATA,
        }));

        this.history = context.router ? context.router.history : this.props.history;

        this.actionMethods = finalListConfig.actions
          ? bindActionCreators(finalListConfig.actions, dispatch)
          : undefined;
      }
      componentWillMount() {
        finalListConfig.autoLoad && this.load(this.props);
      }
      componentWillReceiveProps(nextProps) {
        const shouldReload = this.props.location.search !== nextProps.location.search;
        shouldReload && finalListConfig.autoLoad && this.load(nextProps);
      }
      load = (props = this.props, quiet) => {
        const { dispatch } = props;
        const location = finalInitConfig.getLocationFromProps(props);
        const request = finalListConfig.mapLocationToRequest(location, props);
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
          ...finalListConfig.mapSearchToQuery(params, parse(search)),
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
        const { [finalInitConfig.mountField]: listView } = this.props;
        const listData = listView[finalListConfig.name] || DEFAULT_LIST_DATA;

        const location = finalInitConfig.getLocationFromProps(this.props);
        const {sortType, sortBy, ...searchParams} = finalListConfig.mapLocationToSearch(location, this.props);
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

    return connect(state=> state)(ListView);
  }
}

const connectListView = initConnectListView();

export { connectListView, propTypes, listReducer, DEFAULT_LIST_CONFIG };

export default initConnectListView;
