import { createStore, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import rdr_user_name from './reducers/rdr_user_name';
import rdr_avatar from './reducers/rdr_avatar';
import rdr_exp from './reducers/rdr_exp';
import rdr_gold from './reducers/rdr_gold';
import rdr_power from './reducers/rdr_power';
import rdr_rep_stat from './reducers/rdr_rep_stat';
import rdr_bag_list from './reducers/rdr_bag_list';
import rdr_chest_list from './reducers/rdr_chest_list';
import rdr_draw_stat from './reducers/rdr_draw_stat';
import rdr_book_stat from './reducers/rdr_book_stat';
import rdr_stove_stat from './reducers/rdr_stove_stat';
import rdr_stove_list from './reducers/rdr_stove_list';
import rdr_minifastshop from './reducers/rdr_minifastshop';
import rdr_lvl_bonus from './reducers/rdr_lvl_bonus';


const reducer = combineReducers({
    userName: rdr_user_name,
    avatar: rdr_avatar,
    exp: rdr_exp,
    gold: rdr_gold,
    power: rdr_power,
    repStat: rdr_rep_stat,
    bagList: rdr_bag_list,
    chestList: rdr_chest_list,
    drawStat: rdr_draw_stat,
    bookStat: rdr_book_stat,
    stoveStat: rdr_stove_stat,
    stoveList: rdr_stove_list,
    minifastshop: rdr_minifastshop,
    lvlBonus: rdr_lvl_bonus,
});

const persistConfig = {
    key: 'magic_card_v1',
    storage,
    blacklist: ['minifastshop']
}
const persistedReducer = persistReducer(persistConfig, reducer)

// const store = createStore(reducer, {}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
export const store = createStore(persistedReducer, {}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
export const persistor = persistStore(store)