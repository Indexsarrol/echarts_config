import { Request } from './../utils/request';

// export function getUserList(data) {
//     return HJPromise({
//         url: '/admin/list',
//         type: 'post',
//         data
//     });
// }

export function login(data) {
    return Request({
        url: '/yimi/oapicampuslogin/login',
        type: 'get',
        data
    })
}


export function getSignature(data) {
    return Request({
        url: '/yimi/oapicampuslogin/getSignature',
        type: 'get',
        data
    })
}


export function getDate(data) {
    return Request({
        url: '/yimi/oapicampuslogin/getDate',
        type: 'get',
        data
    })
}
