module.exports = function(context, mySbMsg) {
    context.log('inventory: ', mySbMsg);
    context.bindings.outputBlob = mySbMsg;
    context.done();
};