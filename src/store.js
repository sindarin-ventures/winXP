import thunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import reducers from './WinXP/reducers';
const reducer = combineReducers(reducers);
// applyMiddleware supercharges createStore with middleware:
const store = createStore(reducer, applyMiddleware(thunk));

export default store;
