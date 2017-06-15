const fs = require('fs')

function sumOfQuantities(evt) {
  var count = 0;
  var order = evt.order.order;
  var shipmentList = order.shipmentList;
  var firstShipment = shipmentList[0]; 
  // console.log('firstShipment keys: ' + Object.keys(firstShipment));
  var lineItemList = firstShipment.lineItemList;

  for (var i = 0; i < lineItemList.length; i++) {
    var item = lineItemList[i];
    var qty = item.quantity;
    count = count + qty;
  }
  return count;
}

// function GetQuantity_original(evt) {
//   var count = 0;
//   var order = evt.order;
//   var shipmentList = order.shipmentList;
//   var firstShipment = shipmentList[0];
//   // console.log('firstShipment keys: ' + Object.keys(firstShipment));
//   var lineItemList = firstShipment.lineItemList;
 
//   for (var i = 0; i < lineItemList.length; i++) {
//     var item = lineItemList[i];
//     var qty = item.quantity;
//     count = count + qty;
//   }
//   return count;
// }

// A very defensive function; ensures the evt is as we expect it.
function GetQuantity(evt) {
  var count = 0;
  if ('order' in evt) {
    var order = evt.order;
    if ('shipmentList' in order) {
      var shipmentList = order.shipmentList;
      if (Array.isArray(shipmentList)) {
        if (shipmentList.length > 0) {
          var firstShipment = shipmentList[0];
          var lineItemList  = firstShipment.lineItemList;
          if (Array.isArray(lineItemList)) {
            if (lineItemList.length > 0) {
              for (var i = 0; i < lineItemList.length; i++) {
                var item = lineItemList[i];
                if ('quantity' in item) {
                  var qty = item.quantity;
                  count = count + qty;
                }
              }
            }
          }
        }
      }
    }
  }
  return count;
}

if (false) {
  var infile = 'data/test_json_withtime2.json'
  var jstr = fs.readFileSync(infile, 'utf-8').toString();
  var order = JSON.parse(jstr);
  var evt = {};
  evt['order'] = order;
  var sum = sumOfQuantities(evt);
  console.log(sum);
}

if (true) {
  var infile = 'data/test_json_withtime2_ok_msg.json'
  var jstr  = fs.readFileSync(infile, 'utf-8').toString();
  var evt   = JSON.parse(jstr);
  var count = GetQuantity(evt);
  console.log(count);

  var jstr  = '{"something":"unexpected"}';
  var evt   = JSON.parse(jstr);
  var count = GetQuantity(evt);
  console.log(count);
}
