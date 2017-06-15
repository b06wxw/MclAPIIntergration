module.exports = function(context, mySbMsg) {
    context.log('orders mq: ', mySbMsg);
    context.bindings.outputBlob = mySbMsg;
    context.done();
};
