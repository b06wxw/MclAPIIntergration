"""
Usage:
  python orders.py test 10000
  python orders.py post 42
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

#import ggps

VERSION = 'v20170323a'


def print_options(msg):
    print(msg)
    arguments = docopt(__doc__, version=VERSION)
    print(arguments)

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
            infile = '/Users/cjoakim/github/azure-mcpoc/data/order_data.csv'
            rows = read_csv_file(infile)
            print("{} rows read from file {}".format(len(rows), infile))

            # Each row is an OrderedDict that looks like this; keys corresponding to csv header fields:
            # OrderedDict([('seq', '10000'), ('referringId', '1000052404923'), ('partnerOrderId', 'WD2MH0X85'), ('clientId', '021'), ('subclientId', '6D8C'), ('state', 'PA'), ('partnerShipmentId', '46342146'), ('mkpPartnerId', 'ECD2'), ('firstName', 'Amparo'), ('lastName', 'Hayes'), ('line1', '239 Gayle Knolls'), ('city', 'Keeblerland'), ('zipCode', '52317-0146'), ('country', 'USA'), ('partnerLineId', '1'), ('upc', '34846781'), ('quantity', '3'), ('price', '33.18'), ('currencyName', 'USD')])

            for idx, row in enumerate(rows):
                if idx < count:
                    print(row)
                    firstName = row['firstName']
                    lastName  = row['firstName']
                    print("{}".format(firstName, lastName))

        elif func == 'post':
            print('post not yet implemented')

        else:
            print_options('Error: invalid function: {}'.format(func))
    else:
        print_options('Error: no function argument provided.')
