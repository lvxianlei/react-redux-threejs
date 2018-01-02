import { combineEpics } from 'redux-observable';
import fetchLoginEpic from './fetchLoginEpic';
import fetchDesignEpic from './fetchDesignEpic';
import { fetchNodeEpic, fetchAllNodeEpic } from './fetchNodeEpic';
import fetchProductEpic from './fetchProductEpic';
const rootEpic = combineEpics(
    fetchLoginEpic, 
    fetchProductEpic,
    fetchNodeEpic,
    fetchAllNodeEpic
);

export default rootEpic;

