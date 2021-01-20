import qs from 'qs';
import axios from 'axios';
import config from '../config/configDev';
import {isString, isBlank, isEmpty, isNotEmpty, isFormData, getSession} from './util';

const ContentType = config.ContentType;
const HttpMethod = config.HttpMethod;

/**
 * @desc 使用axios第三方库访问后台服务器, 返回封装过后的Promise对象.
 * @param {string} url 请求的接口地址, 格式: "/xxx..."
 * @param {string} domain 跨域请求的域名地址, 如: http://www.baidu.com
 * @param {string} type HTTP请求方式, 默认GET.
 * @param {object} data 请求的数据, object对象格式
 * @param {function} onUpload 上传文件过程中的回调函数, 接收progressEvent参数.
 * @param {function} onDownload 下载文件过程中的回调函数, 接收progressEvent参数.
 * @param {function} cancel 取消请求的回调函数, 接收cancel参数, 当执行cancel()参数时请求被取消.
 * @param {number} timeout 配置请求超时时间, 为毫秒数, 默认从配置文件读取.
 * @param {boolean} cache 是否开启缓存, 开启后同样的请求(url相同, 参数相同), 第二次请求时会直接返回缓存数据, 不会请求后台数据, 默认false.
 * @param {boolean} handleError 是否自动处理接口报错情况, 默认true.
 * @return {object} - 返回一个promise的实例对象
 */
export function Request({
        url = null,
        urlType = null,
        domain = null,
        type = HttpMethod.GET,
        data = null,
        contentType = ContentType.JSON,
        onUpload = null,
        onDownload = null,
        cancel = null,
        timeout = config.timeout,
        closeTips = false,
        cache = false,
        handleError = true
    }) {
    let getData;
    let postData;
    let cancelToken;
    let crossDomain = false;
    if (isEmpty(url)) {
        return Promise.resolve();
    }

    if (type === HttpMethod.POST || type === HttpMethod.PUT) {

        if (isNotEmpty(data)) {
            postData = data;
            switch (contentType) {
                case ContentType.FORM_URLENCODED:
                    if (isNotEmpty(postData) && !isFormData(postData)) {
                        postData = qs.stringify(postData, {allowDots: true});
                    }
                    break;
            }
        }
    } else {
        getData = data === null ? {} : data;
    }
    if (isNotEmpty(cancel)) {
        cancelToken = new axios.CancelToken(cancel);
    }
    let promise = new Promise(function (resolve, reject) {
        axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        axios.defaults.headers.post['Content-Type'] = contentType + ';charset=UTF-8';
        let httpRequest = axios({
            method: type,
            baseURL: '',
            url: url,
            timeout: timeout,
            params: getData,
            data: postData,
            withCredentials: crossDomain,
            onUploadProgress: onUpload,
            onDownloadProgress: onDownload,
            cancelToken: cancelToken
        }).then(function (response) {
            if (isBlank(response.data)) {
                reject(response);
            } else {
                let responseData = response.data;
                if (isString(responseData)) {
                    try {
                        responseData = JSON.parse(responseData);
                    } catch (e) {
                        try {
                            if (urlType) {
                                responseData = JSON.parse(responseData.split('=')[1].split(';')[0]);
                            }
                        } catch (e) {
                            reject(e);
                            return;
                        }
                    }
                }
                if (!urlType) {
                    if (responseData.code === 200 || responseData.code === 403) {
                        resolve(responseData);
                    } else if (responseData.code === 332) {
                        //权限
                    } else {
                        reject(responseData);
                    }
                } else {
                    resolve(responseData);
                }
            }
        }).catch(function (error) {
            if (error.response) {
                reject(error.response);
            } else {
                reject(error);
            }
        });
    });
    return promise;
}

