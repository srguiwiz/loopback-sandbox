//
loopback = require('loopback');

module.exports = function(Thing) {

function beforeRemotePaint(remoteHookContext, unused, next) {
  var loopbackContext = loopback.getCurrentContext();
  loopbackContext.thingInstance = remoteHookContext.instance;
  console.log("the color before is", loopbackContext.thingInstance.color);
  //
  console.log("about to call next() from before remote method");
  return next();
}

Thing.beforeRemote('**', function beforeRemoteWildcard(remoteHookContext, modelInstanceMaybe, next) {
  var method = remoteHookContext.method;
  var methodName = method.name;
  switch (methodName) {
    case 'paint':
      return beforeRemotePaint(remoteHookContext, modelInstanceMaybe, next);
    default:
      return next();
  }
});

Thing.prototype.paint = function thingPaint(httpContext, uploadFileCallback) {
  console.log("got into remote method");
  var loopbackContext = loopback.getCurrentContext();
  console.log("loopback.getCurrentContext() returns", loopbackContext ? "a value" : loopbackContext + " !!!");
  console.log("the color is", loopbackContext.thingInstance.color);
  return uploadFileCallback(null, {});
}

Thing.remoteMethod
('paint',
  {
    isStatic: false,
    accepts: [{
      arg: 'httpContext', type: 'object', 'http': { source: 'context' }
    }],
    returns: {
      arg: 'result', type: 'object'
    },
    description: "Dummy paint method",
    http: { verb: 'POST', path: '/paint' },
  });

};
