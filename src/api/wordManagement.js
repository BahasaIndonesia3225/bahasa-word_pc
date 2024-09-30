import request from '@/utils/request'

// 单词列表
export const getWordManagement = (params) => {
  return request({
    url: '/system/word/list',
    method: 'get',
    params
  })
}

// 单词新增
export const newWordManagement = (params) => {
  return request({
    url: '/system/word',
    method: 'post',
    data: params
  })
}

// 单词删除
export const deleteWordManagement = (id) => {
  return request({
    url: '/system/word/' + id,
    method: 'delete',
  })
}

// 单词查看
export const checkWordManagement = (id) => {
  return request({
    url: '/system/word/' + id,
    method: 'get',
  })
}

// 单词修改
export const editWordManagement = (params) => {
  return request({
    url: '/system/word',
    method: 'put',
    data: params
  })
}


