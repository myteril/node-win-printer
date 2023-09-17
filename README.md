# node-win-printer

The Node.js package to access the information of all available printers on Windows. It uses WMIC tool to extract the information.

### Installation

For NPM:
```shell
npm install @myteril/node-win-printer
```

For Yarn:
```shell
yarn add @myteril/node-win-printer
```

### Usage

```javascript
// To import the function, use the following line.
const { getPrinters } = require("@myteril/node-win-printer")

// Call the function to get the array of printer information objects. 
const printerInfoList = await getPrinters()

// You may want to print the list to inspect.
console.dir(printerInfoList)
```