module.exports = function(context, mySbMsg) {
    context.log('order collect: ', mySbMsg);
    context.bindings.outputBlob = mySbMsg;
    context.done();
};