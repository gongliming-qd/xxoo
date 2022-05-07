import lodash from "lodash";
import axios from "axios";
import store from "../store/index";
import Vue from "vue";
var apiServe = require("../../config/apiServe");

// axios封装formdata
export const axiosFormData = async ({ url, data }) => {
  axios.interceptors.response.use(
    function(response) {
      // 对响应数据做点什么
      return response;
    },
    function(error) {
      Vue.prototype.$message.error("服务器报错!");
    }
  );
  let results = await axios({
    method: "post",
    url:
      process.env.NODE_ENV === "development"
        ? `/dev${url}`
        : `${apiServe.prodServe}${url}`,
    data,
    headers: {
      //   Authorization: window.sessionStorage.getItem("token")
    }
  });
  return results;
};

// 菜单重新渲染
export const setChangeMenu = () => {
  store.dispatch("setChangeMenu", store.state.changeMenu + 1);
};

// 对象中剔除数值等于空字符串的选项
export const objectDeleStringNone = obj => {
  // 1. 去除空的
  return lodash.pickBy(obj, item => item);
};

// 根据秒转换 小时 ： 分钟 ： 秒
export const timeTransformation = val => {
  var h = Math.floor(val / 3600);
  var m = Math.floor((val / 60) % 60);
  var s = Math.floor(val % 60);
  h < 10 ? (h = `0${h}:`) : `${h}:`;
  m < 10 ? (m = `0${m}:`) : `${m}:`;
  s < 10 ? (s = `0${s}`) : `${s}`;
  if (h == "00:") {
    return m + s;
  } else {
    return h + m + s;
  }
};

// 时间格式转换 : YYYY-MM-DD HH:mm:ss, 有time则处理time的时间, 没time为当前时间
export const getDate = time => {
  let myDate = new Date();
  if (time) myDate = new Date(time);
  let getFullYear = myDate.getFullYear();
  let Month = myDate.getMonth() + 1;
  if (Month < 10) Month = "0" + Month;
  let getDate = myDate.getDate();
  if (getDate < 10) getDate = "0" + getDate;
  let getHours = myDate.getHours();
  if (getHours < 10) getHours = "0" + getHours;
  let getMinutes = myDate.getMinutes();
  if (getMinutes < 10) getMinutes = "0" + getMinutes;
  let getSeconds = myDate.getSeconds();
  if (getSeconds < 10) getSeconds = "0" + getSeconds;
  return `${getFullYear}-${Month}-${getDate} ${getHours}:${getMinutes}:${getSeconds}`;
};

// 添加到组件到根元素，并且返回改组件this

export const appendCompToRoot = (component, props) => {
  console.log(component);
  //component 参数为组件名
  var instance = new Vue({
    el: document.createElement("div"),
    render: createElement => {
      return createElement(component, {
        ...props
      });
    }
  });
  document.body.appendChild(instance.$el);
  return instance.$children[0];
};

export const convertImgToBase64 = (url, callback, outputFormat) => {
  var canvas = document.createElement("CANVAS"),
    ctx = canvas.getContext("2d"),
    img = new Image();
  img.crossOrigin = "Anonymous";
  img.onload = function() {
    canvas.height = img.height;
    canvas.width = img.width;
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL(outputFormat || "image/png");
    callback.call(this, dataURL);
    canvas = null;
  };
  img.src = url;
};

export const setlocalTime = () => {
  var curTime = new Date().getTime();
  localStorage.setItem("timePeriodCache", JSON.stringify(curTime));
};

export const getlocalTime = () => {
  var data = localStorage.getItem("timePeriodCache");
  var dataObj = JSON.parse(data);
  console.log(new Date().getTime(), dataObj, new Date().getTime() - dataObj);
  // if (new Date().getTime() - dataObj > 31104000000) {
  if (new Date().getTime() - dataObj > 31104000000) {
    return true;
  } else {
    return false;
  }
};

export const creactAjax = (data, fn) => {
  let websocket = new WebSocket("ws://localhost:8080");
  websocket.onopen = evt => {
    websocket.send(JSON.stringify(data));
  };
  websocket.onmessage = async evt => {
    let obj = JSON.parse(evt.data);
    // console.log(obj);
    await fn(obj);
    websocket.close();
  };
};

export const hasId = (arr, key, value, has, none = () => {}) => {
  let lengthData = arr.filter(ele => {
    if (ele[key] === value) {
      return true;
    } else {
      return false;
    }
  });
  lengthData.length === 0 ? none() : has();
};

export const sendMessageAjax = (data, fn) => {
  let num = Math.random() + "";
  store.state.onlyWebsocket.send(JSON.stringify({ ...data, num }));
  store.state.proxy1[num] = { name: 1 };
  store.state.proxy2[num] = { name: 1 };

  store.state.proxy1[num] = new Proxy(store.state.proxy2[num], {
    get(target, props) {
      console.log("get");
      Reflect.get(target, props);
    },
    set: async (target, props, value) => {
      console.log("set", num);
      Reflect.set(target, props, value);
      console.log(store.state.onlywebsocketCallBackData[num]);

      if (store.state.onlywebsocketCallBackData[num]) {
        // console.log(store.state.onlywebsocketCallBackData[num]);
        console.log(store.state.onlywebsocketCallBackData[num]);
        await fn(store.state.onlywebsocketCallBackData[num]);
      }
    }
  });
  // var tem = "";
  // Object.defineProperty(store.state.onlywebsocketCallBackData, num + "", {
  //   get: () => {
  //     return tem;
  //   },
  //   set: async value => {
  //     tem = value;
  //     if (store.state.onlywebsocketCallBackData[num] !== "") {
  //       console.log(store.state.onlywebsocketCallBackData);
  //       await fn(store.state.onlywebsocketCallBackData[num]);
  //     }
  //   }
  // });
};
