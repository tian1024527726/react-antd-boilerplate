/**
 * 观察订阅模式--用于观察接口请求是否结束
 */
let instance;

class RequestHandler {
  constructor() {
    let _this = this;
    if (instance == undefined) {
      instance = _this;
    }
    return instance;
  }
	requestRecord = {}

  subscribe(type, fn) {
    let _this = this;
    if (_this.requestRecord[type] == undefined) {
      _this.requestRecord[type] = [];
    }
    let typeHandle = _this.requestRecord[type];
    typeHandle.push(fn);
    return function unSubscribe() {
      const index = typeHandle.indexOf(fn);
      typeHandle.splice(index, 1);
      JSON.stringify(_this.requestRecord[type]) === '[]' && delete _this.requestRecord[type]
    }
  }
}
const requestHandler = new RequestHandler();

window.requestHandler = requestHandler

module.exports = requestHandler;
