import { ajax } from 'rxjs/observable/dom/ajax';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import { push } from 'react-router-redux';
import { API_GETDESIGNID } from '@/apiConf';
import { loginSuccess, loginError } from '@/actions/Login';
import { GET_DESIGN_ID } from '@/actions/Actiontype';

// epic
const fetchEpic = (action$, store) => {
    console.log(store);
    return action$.ofType(GET_DESIGN_ID)
        .mergeMap(action =>
            ajax.post(API_GETDESIGNID, action.data, { 'authorization': 'Bearer ' + store, 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' })
                .do(body => {
                    return loginSuccess(body.response);
                })
                .map(body => {
                    return push('/application');
                })
                .catch(error => {
                    switch (error.status) {
                        case 400:
                            alert('账号不存在');
                            break;
                        case 401:
                            alert('密码错误，请重新输入');
                            break;
                    }
                    return Observable.of(loginError());
                })
        );
};
export default fetchEpic;