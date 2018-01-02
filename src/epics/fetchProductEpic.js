import { ajax } from 'rxjs/observable/dom/ajax';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import { API_GET_PRODUCT_LIST } from '@/apiConf';
import { getProductListSuccess, getProductListError } from '@/actions/Application';
import { API } from '@/actions/Actiontype';
const { GET_PRODUCT_LIST } = API;

// epic
const fetchProductEpic = (action$, store) => {
    const state = store.getState();
    return action$.ofType(GET_PRODUCT_LIST)
        .mergeMap(action =>
            ajax.get(API_GET_PRODUCT_LIST + '?categoryId=' + action.id, { 'authorization': 'Bearer ' + state.Login.token, 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' })
                .map(body => {
                    return getProductListSuccess(body.response.data);
                })
                .catch(error => {
                    return Observable.of(getProductListError());
                })
        );
};

export default fetchProductEpic;