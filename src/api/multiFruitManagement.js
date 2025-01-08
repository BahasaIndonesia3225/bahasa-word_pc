import request from '@/utils/request'

// 用户管理
export const getStageAdminList = (params) => {
  return request({
    url: '/stageIosAdmin/list',
    method: 'get',
    params
  })
}

// 阶段列表
export const getStageAdmin = (params) => {
  return request({
    url: '/stageAdmin/list',
    method: 'get',
    params
  })
}

// 阶段新增
export const newStageAdmin = (params) => {
  return request({
    url: '/stageAdmin',
    method: 'post',
    data: params
  })
}

// 阶段删除
export const deleteStageAdmin = (id) => {
  return request({
    url: '/stageAdmin/' + id,
    method: 'delete',
  })
}

// 阶段修改
export const editStageAdmin = (params) => {
  return request({
    url: '/stageAdmin',
    method: 'put',
    data: params
  })
}

// 题库列表
export const getQuestion = (params) => {
  return request({
    url: '/system/question/list',
    method: 'get',
    params
  })
}

// 题库新增
export const newQuestion = (params) => {
  return request({
    url: '/system/question',
    method: 'post',
    data: params
  })
}

// 题库删除
export const deleteQuestion = (id) => {
  return request({
    url: '/system/question/' + id,
    method: 'delete',
  })
}

// 题库修改
export const editQuestion = (params) => {
  return request({
    url: '/system/question',
    method: 'put',
    data: params
  })
}

// 题库详情
export const checkQuestion = (id) => {
  return request({
    url: '/system/question/' + id,
    method: 'get',
  })
}



