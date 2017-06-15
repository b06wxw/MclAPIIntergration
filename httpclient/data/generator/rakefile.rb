
require 'faker'

# Class DataGenerator, defined below, attempts to generate
# randomized values to be used to create HTTP POSTed Orders
# given the following example JSON.

# {
#   "order": {
#     "header": {
#       "referringId": 871,
#       "partnerOrderId": "s1284",
#       "clientId": "MCL",
#       "subclientId": "TMALL",
 
#       "State": "CREATED"
#     },
#     "shipmentList": [{
#       "partnerShipmentId": 1,
#       "mkpPartnerId": "TMALL",
#       "shippingContact": {
#         "name": {
#           "firstName": "Macys",
#           "lastName": "Limited"
#         },
#         "address": {
#           "line1": "655 Rivermond Road",
#           "city": "Los Angeles",
#           "state": "CA",
#           "zipCode": 30445,
#           "country": "USA"
#         }
#       },
#       "lineItemList": [{
#         "partnerLineId": 1,
#         "upc": 31458916,
#         "quantity": 1,
#         "unitPrice": {
#           "price": 25.00,
#           "currencyName": "USD"
#         }
#       }]
#     }]
#   }
# }

class DataGenerator

  def self.generate_order_data(n)
    fields = Array.new
    fields.push('seq')
    fields.push('referringId')
    fields.push('partnerOrderId')
    fields.push('clientId')
    fields.push('subclientId')
    fields.push('state')
    fields.push('partnerShipmentId')
    fields.push('mkpPartnerId')
    fields.push('firstName')
    fields.push('lastName')
    fields.push('line1')
    fields.push('city')
    fields.push('state')
    fields.push('zipCode')
    fields.push('country')
    fields.push('partnerLineId')
    fields.push('upc')
    fields.push('quantity')
    fields.push('price')
    fields.push('currencyName')
    puts fields.join(',')

    n.times do | i |
      seq    = i + 1
      refid  = "#{i+1}#{Faker::Number.number(8)}"
      poid   = Faker::Vehicle.vin[0..8]
      clid   = "#{Faker::Number.hexadecimal(3)}".upcase
      sclid  = "#{Faker::Number.hexadecimal(4)}".upcase
      ostate = "CREATED"
      shipid = Faker::Number.number(8)
      mkppid = "#{Faker::Number.hexadecimal(4)}".upcase
      fname  = Faker::Name.first_name
      lname  = Faker::Name.last_name
      addr   = Faker::Address.street_address
      city   = Faker::Address.city
      state  = Faker::Address.state_abbr
      zip    = Faker::Address.zip_code
      ctry   = "USA"
      plid   = "1"
      upc    = "#{Faker::Number.number(8)}"
      qty    = "#{Faker::Number.between(1, 10)}"
      price  = "#{Faker::Number.decimal(2)}"
      cname  = "USD"
      row = [seq,refid,poid,clid,sclid,ostate,shipid,mkppid,fname,lname,addr,city,state,zip,ctry,plid,upc,qty,price,cname]
      puts row.join(',')
    end
  end

end

# execute in terminal with: rake data:generate_order_data > order_data.csv

namespace :data do
  
  desc "Generate Order Data"
  task :generate_order_data do
    DataGenerator.generate_order_data(10000)
  end

end
