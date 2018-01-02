import { ajax } from 'rxjs/observable/dom/ajax';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { push } from 'react-router-redux';
import { API_TOKEN } from '@/apiConf';
import { loginSuccess, loginError } from '@/actions/Login';
import { API } from '@/actions/Actiontype';

const { LOGIN } = API;
// epic
const fetchLoginEpic = action$ => {
    return action$.ofType(LOGIN)
        .mergeMap(action =>
            ajax.post(API_TOKEN, action.data, { 'authorization': 'Basic YXBwNTBqaWE6NTBqaWExMjM0NTY=', 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' })
                .map(body => loginSuccess(body.response))
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
export default fetchLoginEpic;