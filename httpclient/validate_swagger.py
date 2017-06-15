import json

if __name__ == "__main__":
    infile = '../swagger.json'
    jstr = None
    with open(infile, 'r') as f:
        jstr = f.read()
    obj1 = json.loads(jstr)
    obj2 = json.dumps(obj1)

    print('swagger: {}'.format(obj1['swagger']))
    print('host: {}'.format(obj1['host']))

    paths = obj1['paths']
    for key in sorted(paths):
        print('path: {}'.format(key))

    defs = obj1['definitions']
    for key in sorted(defs):
        print('def: {}'.format(key))
