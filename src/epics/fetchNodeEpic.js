import { ajax } from 'rxjs/observable/dom/ajax';
import { Observable } from 'rxjs/Observable';
import { API_GET_NODE_LIST, API_GET_ALL_NODE_LIST } from '@/apiConf';
import { getNodeListSuccess, getNodeListError, getAllNodeListSuccess, getAllNodeListError } from '@/actions/Application';
import { API } from '@/actions/Actiontype';
const { GET_NODE_LIST, GET_ALL_NODE_LIST } = API;

// epic
const fetchNodeEpic = (action$, store) => {
    const state = store.getState();
    return action$.ofType(GET_NODE_LIST)
        .mergeMap(action =>
            ajax.post(API_GET_NODE_LIST + '?node=' + action.node + '&packageId=' + action.packageId, { 'authorization': 'Bearer ' + state.Login.token, 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' })
                .map(body => {
                    return getNodeListSuccess(action.node, body.response.data[0].standardItemList);
                })
                .catch(error => {
                    return Observable.of(getNodeListError());
                })
        );
};

const fetchAllNodeEpic = (action$, store) => {
    return action$.ofType(GET_ALL_NODE_LIST)
        .mergeMap(action => {
            const state = store.getState();
            return ajax.get(API_GET_ALL_NODE_LIST + '?node=' + action.node, { 'authorization': 'Bearer ' + state.Login.token, 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' })
                .map(body => {
                    return getAllNodeListSuccess(action.node, body.response.data[0].standardItemList);
                })
                .catch(error => {
                    return Observable.of(getAllNodeListError());
                });
        });
};

export { fetchNodeEpic, fetchAllNodeEpic };