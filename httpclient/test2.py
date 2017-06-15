import math
import requests
import json

#url = "http://todoapiapp.azurewebsites.net/api/todo/"
url  = "https://mcpoc.azure-api.net/echo/resource"
direct_url = "http://mcpocweb.azurewebsites.net/orders/update"

"""
Usage:
  python test2.py test 1
Options:
  -h --help     Show this screen.
  --version     Show version.
"""

import csv
import json
import sys
import time
import os

from docopt import docopt

VERSION = 'v20170325a'


def print_options(msg):
    print(msg)

def read_csv_file(infile):
    csv_rows = list()
    with open(infile, 'rt') as csvfile:
        reader = csv.DictReader(csvfile, delimiter=',', quoting=csv.QUOTE_NONE)
        for row in reader:
            csv_rows.append(row)
    return csv_rows

if __name__ == "__main__":

    start_time = time.time()

    if len(sys.argv) > 2:
        func  = sys.argv[1].lower()
        count = int(sys.argv[2])

        if func == 'test':
            infile = 'data/order_data.csv'
            rows = read_csv_file(infile)
            print("{} rows read from file {}".format(len(rows), infile))

            # Each row is an OrderedDict that looks like this; keys corresponding to csv header fields:
            # OrderedDict([('seq', '10000'), ('referringId', '1000052404923'), ('partnerOrderId', 'WD2MH0X85'), ('clientId', '021'), ('subclientId', '6D8C'), ('state', 'PA'), ('partnerShipmentId', '46342146'), ('mkpPartnerId', 'ECD2'), ('firstName', 'Amparo'), ('lastName', 'Hayes'), ('line1', '239 Gayle Knolls'), ('city', 'Keeblerland'), ('zipCode', '52317-0146'), ('country', 'USA'), ('partnerLineId', '1'), ('upc', '34846781'), ('quantity', '3'), ('price', '33.18'), ('currencyName', 'USD')])

            for idx, row in enumerate(rows):
                if idx < count:
                    header = dict()
                    header['referringId'] = int(row['referringId'])
                    header['partnerOrderId'] = row['partnerOrderId']
                    header['clientId'] = row['clientId']
                    header['subclientId'] = row['subclientId']
                    header['State'] = "CREATED"
                    
                    shipmentList = list()
                    shipmentDic = dict()
                    shipmentDic ['partnerShipmentId'] =int(row ['partnerShipmentId'])
                    shipmentDic ['mkpPartnerId'] = row ['mkpPartnerId']
                    
                    shipmentContact = dict()
                    name = dict()
                    name ['firstName'] = row['firstName']
                    name['lastname'] = row['lastName']
                    
                    address= dict()
                    address['line1'] = row['line1']
                    address['city'] = row['city']
                    address['state'] = row['state']
                    address['zipCode'] = row['zipCode']
                    address['country'] = row['country']

                    shipmentContact ['name'] =  name
                    shipmentContact['address'] = address
                    shipmentDic['shipmentContact'] = shipmentContact
                    
                    lineItemList = list()
                    lineItem = dict()
                    lineItem['partnerLineId'] = int(row['partnerLineId'])
                    lineItem['upc'] = int(row['upc'])
                    lineItem['quantity'] = row['quantity']
                    unitPrice = dict()
                    unitPrice['price'] = float(row['price'])
                    unitPrice['currencyName'] = row['currencyName']
                    lineItem['unitPrice']=unitPrice
                    lineItemList = [lineItem]  
                    shipmentDic['lineItemList'] = lineItemList
                 
                    shipmentList = [shipmentDic]


                    order = dict()
                    order['header'] = header
                    order['shipmentList'] = shipmentList

                    body = dict()
                    body["order"] = order

                    data = str(json.dumps(body, sort_keys=True))
                    print(type(data))

                    headers = {'Content-type':'application/json', 'Ocp-Apim-Subscription-Key':'53436f0d75fd496c81e092e5d2a0c68a','Ocp-Apim-Trace':'true'}
                    r = requests.post(direct_url, data, headers=headers)
                    print (r.status_code)
                    print (r.content)

        elif func == 'post':
            print('post not yet implemented')

        else:
            print_options('Error: invalid function: {}'.format(func))
    else:
        print_options('Error: no function argument provided.')


































'''
i=10
while (i>0):
    
    data = {'name':"feed dog","isComplete":'true'}
    headers = {'Content-type': 'application/json'}
    r = requests.post(url, data=json.dumps(data), headers=headers)
    print (r.status_code)
    i=i-1
print ("done")
'''
