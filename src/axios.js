import Vue from 'vue';
import axios from 'axios';
import router from './router'

const axiosInstance = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 20000,
    withCredentials: false,
    transformRequest: function (data, headers) {
        headers['ng-params-one'] = localStorage.getItem('ng-params-one');
        headers['ng-params-two'] = localStorage.getItem('ng-params-two');
        headers['ng-params-three'] = localStorage.getItem('ng-params-three');
        headers['Content-Type'] = "application/json;charset=UTF-8";
        if (data instanceof FormData) {
            return data;
        }
        return JSON.stringify(data);
    }
});
// const checkUserPermisson
axiosInstance.interceptors.response.use(function (response) {
    let data = response.data || { result: false, message: '空的响应内容' };
    if (typeof data.result !== 'boolean') {
        data = { result: false, message: '响应格式错误' };
    }
    // if (data.result === false) {
    //     window.message(data.message);
    // }
    return data;
}, function (error) {
    return Promise.reject(error);
});
const checkUserPermission = axiosInstance.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    console.log(error.message);
    let message = '';
    if (~error.message.indexOf('timeout')) {
        window.message("网络请求超时～");
    } else {
        const response = error.response || { status: 0 };
        switch (response.status) {
            case 401: {
                message = '登录失效，请先登录';
                router.push('/login');
                break;
            }
            default: message = "服务器响应异常～";
        }
    }
    return Promise.resolve({ result: false, message: message });
});

const axiosCustom = {
    get() {
        return new Promise(resolve => {
            let check = arguments[2] || true;
            axiosInstance.get(arguments[0], arguments[1]).then(res => {
                if (!res.result && check) {
                    Vue.prototype.$message.error(res.message);
                } else {
                    resolve(res);
                }
            })
        })
    },
    delete() {
        return new Promise(resolve => {
            let check = arguments[2] || true;
            axiosInstance.delete(arguments[0], arguments[1]).then(res => {
                if (!res.result && check) {
                    Vue.prototype.$message.error(res.message);
                } else {
                    resolve(res);
                }
            })
        })
    },
    put() {
        return new Promise(resolve => {
            let check;
            if (typeof arguments[2] == 'boolean') {
                check = arguments[2];
            } else {
                check = arguments[3] || true;
            }
            axiosInstance.put(arguments[0], arguments[1], arguments[2]).then(res => {
                if (!res.result && check) {
                    Vue.prototype.$message.error(res.message);
                } else {
                    resolve(res);
                }
            })
        })
    },
    post() {
        return new Promise(resolve => {
            let check;
            if (typeof arguments[2] == 'boolean') {
                check = arguments[2];
            } else {
                check = arguments[3] || true;
            }
            axiosInstance.post(arguments[0], arguments[1], arguments[2]).then(res => {
                if (!res.result && check) {
                    Vue.prototype.$message.error(res.message);
                } else {
                    resolve(res);
                }
            })
        })
    }
};
export default axiosCustom;
export { checkUserPermission,axiosInstance }