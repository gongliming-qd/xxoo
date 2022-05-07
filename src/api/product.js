
import {
  http
} from './ajax'

let env = "?env=test"
process.env.NODE_ENV === 'development' ? env = '?env=test' : env = '?env=test_online'

// 获取产品数据
export const getProductList = (data) => {
  return http.post('/hitpawedit/getmaterial' + env, data)
}

