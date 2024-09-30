import request from '@/utils/request'

// 用户列表
export const getUserManagement = (params) => {
  return request({
    url: '/system/userAdmin/list',
    method: 'get',
    params
  })
}

// 用户新增
export const newUserManagement = (params) => {
  return request({
    url: '/system/userAdmin',
    method: 'post',
    data: params
  })
}

// 用户删除
export const deleteUserManagement = (id) => {
  return request({
    url: '/system/userAdmin/' + id,
    method: 'delete',
  })
}

// 用户查看
export const checkUserManagement = (id) => {
  return request({
    url: '/system/userAdmin/' + id,
    method: 'get',
  })
}

// 用户修改
export const editUserManagement = (params) => {
  return request({
    url: '/system/userAdmin',
    method: 'put',
    data: params
  })
}


