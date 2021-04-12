import service from '@/utils/request'

//获取列表信息（GET）
export const queryVideos = (params) => {
  return service.post('/api/videos', { _method: 'GET', _args: params })
}

//删除单条信息
export const deleteVideo = (id) => {
  return service.delete(`/api/videos/${id}`)
}

//更细单条信息
export const updateVideo = (id, params) => {
  return service.put(`/api/videos/${id}`, params)
}

//获取单条信息
export const getVideo = (id) => {
  return service.get(`/api/videos/${id}`)
}

//新增一条数据（POST）
export const createVideo = (params) => {
  return service.post('/api/videos', params)
}


export const getVideoThumbPath = (file) => {
  return `/thumb/${file}`
}


// get_SUBTITLE: function f() {
//
// }
