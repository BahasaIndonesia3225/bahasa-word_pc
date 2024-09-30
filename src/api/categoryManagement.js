import request from '@/utils/request'

// 类别列表
export const getCategoryManagement = (params) => {
  return request({
    url: '/system/category/list',
    method: 'get',
    params
  })
}

// 类别新增
export const newCategoryManagement = (params) => {
  return request({
    url: '/system/category',
    method: 'post',
    data: params
  })
}

// 类别删除
export const deleteCategoryManagement = (id) => {
  return request({
    url: '/system/category/' + id,
    method: 'delete',
  })
}

// 类别查看
export const checkCategoryManagement = (id) => {
  return request({
    url: '/system/category/' + id,
    method: 'get',
  })
}

// 类别修改
export const editCategoryManagement = (params) => {
  return request({
    url: '/system/category',
    method: 'put',
    data: params
  })
}


