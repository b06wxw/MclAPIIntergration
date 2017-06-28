# azure-mcpoc

Macys China Proof-of-Concept, the POC becomes a backbone for July 2017 release

This repository is intended to be deployed as a Node.js Azure Web App,
but other files related to this POC are also stored here.

The root directory of this repository should only contain files
related to the Web App, but the following subdirectories may contain
other files related to the POC, as follows:

## Directory Structure

```
bin/           Node.js files
data/          Data files
doc/           Documentation
functions/     Azure Functions
httpclient/    HTTP client to POST similated data to this Web App
log/           Log files
node_modules/  Node.js files
package.json   Node.js file
scripts/       Bash and other shell scripts
tasks/         Node.js files
tmp/           Temporary files
views/         Node.js files
```

Ben was here

## Git

```
git pull
git gui
git status
git pull
git add --all
git status
git commit -m "Added a comment to the README"
git push
```

## Links

- https://pypi.python.org/pypi

## Workstation Development and Testing 

Install Node.js.

Install the libraries specified in package.json with these commands:

```
npm i -g npm-check-updates
npm i -g nodemon
npm install
```

Run the app on your workstation with this command:
```
nodemon bin/www
```

Invoke the endpoints of the Web App with these curls:
```
curl -v "http://127.0.0.1:3000/admin/ping"
curl -v "http://127.0.0.1:3000/admin/build"
curl -v "http://127.0.0.1:3000/admin/queue_info/inventory"
curl -v "http://127.0.0.1:3000/admin/queue_info/orderscollect"
curl -v "http://127.0.0.1:3000/admin/queue_info/ordersupdate"

curl -X POST -d @data/sample_inventory_update.json http://127.0.0.1:3000/inventory/update
curl -X POST -d @data/sample_order_collect.json    http://127.0.0.1:3000/orders/collect
curl -X POST -d @data/sample_order_update.json     http://127.0.0.1:3000/orders/update

curl -v "http://127.0.0.1:3000/swagger"
```

## Azure URLs

```
curl -v "http://mcpocweb.azurewebsites.net/admin/ping"
curl -v "http://mcpocweb.azurewebsites.net/admin/build"
curl -v "http://mcpocweb.azurewebsites.net/admin/queue_info/inventory"
curl -v "http://mcpocweb.azurewebsites.net/admin/queue_info/orderscollect"
curl -v "http://mcpocweb.azurewebsites.net/admin/queue_info/ordersupdate"

curl -X POST -d @data/sample_inventory_update.json http://mcpocweb.azurewebsites.net/inventory/update
curl -X POST -d @data/sample_order_collect.json    http://mcpocweb.azurewebsites.net/orders/collect
curl -X POST -d @data/sample_order_update.json     http://mcpocweb.azurewebsites.net/orders/update

curl -v "http://mcpocweb.azurewebsites.net/swagger"
```

## Swagger

See http://editor.swagger.io/#!/

Upload swagger.json to it to validate.
