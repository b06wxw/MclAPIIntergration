import requests
import json

import csv
import json
import sys
import time
import os
import jinja2
import time
import random

from time import gmtime, strftime

'''
header = dict()
header['referringId'] = randomdata.referringId
header['partnerOrderId'] = "s1284"

order = dict()
order['header'] = header

body = dict()
body['order'] = order



jstr = json.dumps(body, sort_keys=True, indent=2))

requests.post(body)
'''
#import ggps

VERSION = 'v20170323a'

#url = "http://todoapiapp.azurewebsites.net/api/todo/"
#url= "https://mcpoc.azure-api.net/echo/resource"

#url= "http://mcpocweb.azurewebsites.net/orders/update"
url="http://mcpoc.azure-api.net/orders/orders/collect"



def print_options(msg):
    print(msg)
    # arguments = docopt(__doc__, version=VERSION)
    # print(arguments)

def read_csv_file(infile):
    csv_rows = list()
    with open(infile, 'rt') as csvfile:
        reader = csv.DictReader(csvfile, delimiter=',', quoting=csv.QUOTE_NONE)
        for row in reader:
            csv_rows.append(row)
    return csv_rows


jinja_env = jinja2.Environment(
    loader = jinja2.FileSystemLoader(os.path.dirname (__file__)), 
    autoescape=True)
template = jinja_env.get_template("templates/order_tmpl.json")

if __name__ == "__main__":

    start_time = time.time()
    if len(sys.argv) > 2:
        func  = sys.argv[1].lower()
        count = int(sys.argv[2])

        if func == 'test':
            infile = 'data/order_data.csv'
            rows = read_csv_file(infile)
            print("{} rows read from file {}".format(len(rows), infile))

            for idx, row in enumerate(rows):
                if idx < count:
                    #time.sleep(0.5)
                    values = dict()             # Jinga will merge these values into the template
                    values['orderTime'] = strftime("%Y-%m-%d %H:%M:%S", gmtime())
                    values['referringId'] = row['referringId']  # numeric value - note no quotes in the template
                    values['partnerOrderId'] = int(row['partnerLineId'])
                    values['clientId'] =  row['clientId']
                    values['subclientId'] =  row['subclientId']
                    
                    values ['partnerShipmentId'] =int(row ['partnerShipmentId'])
                    values ['mkpPartnerId'] = row ['mkpPartnerId']               	
                    values['firstName'] = row['firstName']
                    values['lastName'] = row['lastName']
                    values['line1'] = row['line1']
                    values['city'] = row['city']
                    values['state'] = row['state']
                    values['zipCode'] = row['zipCode']
                    values['country'] = row['country']
                   
                    
                    values['partnerLineId'] = row['partnerLineId']
                    values['upc'] = row['upc']
                    values['quantity'] = random.randint(1,10)
                    values['price'] = float(row['price'])
                    values['currencyName'] = row['currencyName']
                  					
                    jstr = template.render(values)
                    jstr.encode('utf-8')
                    #print(jstr)
                    headers = {'Content-type':'application/json','Ocp-Apim-Subscription-Key':'53436f0d75fd496c81e092e5d2a0c68a','Ocp-Apim-Trace':'true'}
                    r=requests.post(url,jstr,headers=headers)
                    print (r.status_code)
                    #
                    #print (r.content)
                    print (str(r.text))


'''
jinja_env = jinja2.Environment(
    loader = jinja2.FileSystemLoader(os.path.dirname (__file__)), 
    autoescape=True)

if __name__ == "__main__":
    start_time = time.time()
    template = jinja_env.get_template("templates/order_tmpl.json")
    values = dict()             # Jinga will merge these values into the template
    values['referringId'] = 42  # numeric value - note no quotes in the template
    values['city'] = 'Atlanta'  # string value - note the quotes in the template
    jstr = template.render(values)
    print(jstr)
'''

# header = dict()
# header['referringId'] = 
# header['partnerOrderId'] = "s1284"

# order = dict()
# order['header'] = header

# body = dict()
# body['order'] = order