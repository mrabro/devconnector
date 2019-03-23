import { createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk';

const middlerware = [thunk];

const store = createStore(() => [], {}, applyMiddleware(...middlerware));

export default store;