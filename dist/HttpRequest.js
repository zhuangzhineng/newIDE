"use strict";
var HttpRequest = function() {
  function HttpRequest() {}
  return ($traceurRuntime.createClass)(HttpRequest, {}, {
    post: function() {
      var $__6;
      for (var setting = [],
          $__3 = 0; $__3 < arguments.length; $__3++)
        setting[$__3] = arguments[$__3];
      ($__6 = this)._ajax.apply($__6, $traceurRuntime.spread(["POST"], setting));
    },
    get: function() {
      var $__6;
      for (var setting = [],
          $__4 = 0; $__4 < arguments.length; $__4++)
        setting[$__4] = arguments[$__4];
      ($__6 = this)._ajax.apply($__6, $traceurRuntime.spread(["GET"], setting));
    },
    _ajax: function() {
      var $__6;
      var methodType = arguments[0] !== (void 0) ? arguments[0] : 'GET';
      for (var setting = [],
          $__5 = 1; $__5 < arguments.length; $__5++)
        setting[$__5 - 1] = arguments[$__5];
      var option = setting.length > 1 ? setting[1] : setting[0];
      var optionOriginal = Object.assign({}, option);
      Object.assign(option, {
        contentType: 'application/json;charset=utf-8',
        dataType: 'json',
        method: methodType,
        statusCode: {
          200: function(data) {
            console.log('success receive:' + data);
          },
          405: function(error) {
            console.error('error message:' + error);
          }
        }
      }, optionOriginal);
      console.log(setting);
      ($__6 = $).ajax.apply($__6, $traceurRuntime.spread(setting));
    }
  });
}();
var $__default = HttpRequest;
Object.defineProperties(module.exports, {
  default: {get: function() {
      return $__default;
    }},
  __esModule: {value: true}
});
