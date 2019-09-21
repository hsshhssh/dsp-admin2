import request from '@/utils/loginRequest'


export function loginByUsername(username, password) {
  let d = new FormData();
  d.append('username', username);
  d.append('password', password);
  return request({
    // url: '/user/login',
    // method: 'post',
    // data: {
    //   username,
    //   password
    // }
    url: '/xqh/ad/account/login',
    method: 'post',
    data: d,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function logout() {
  return request({
    // url: '/user/logout',
    // method: 'post'
    url: '/xqh/ad/account/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    // url: '/user/info',
    // method: 'get',
    // params: { token }
    url: '/xqh/ad/account/info',
    method: 'get',
    params: { token }
  })
}

export function reset(userName, passwordOld, password) {
  let d = new FormData();
  d.append('userName', userName);
  d.append('passwordOld', passwordOld);
  d.append('password', password);
  return request({
    url: '/xqh/ad/account/reset',
    method: 'post',
    data: d,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

