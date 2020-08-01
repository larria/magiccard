import { createStore, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import rdr_user_name from './reducers/rdr_user_name';
import rdr_avatar from './reducers/rdr_avatar';
import rdr_exp from './reducers/rdr_exp';
import rdr_gold from './reducers/rdr_gold';
import rdr_power from './reducers/rdr_power';


const reducer = combineReducers({
    userName: rdr_user_name,
    avatar: rdr_avatar,
    exp: rdr_exp,
    gold: rdr_gold,
    power: rdr_power,
});

const persistConfig = {
    key: 'magic_card_v1',
    storage,
}
const persistedReducer = persistReducer(persistConfig, reducer)

// const store = createStore(reducer, {}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
export const store = createStore(persistedReducer, {}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
export const persistor = persistStore(store)