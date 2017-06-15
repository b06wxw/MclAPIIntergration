module.exports = function(context, mySbMsg) {
    context.log('order update: ', mySbMsg);
    context.bindings.outputBlob = mySbMsg;
    context.done();
};