# node-win-printer

The Node.js package to access the information of all available printers on Windows. It uses WMIC tool to extract the information.

### Installation

For NPM:
```shell
npm install @myteril/node-win-printer
```

### Usage

```typescript
// Import the function.
const { getPrinters } = require("@myteril/node-win-printer")

// Call the function to get the array of printer information objects. 
const printerInfoList = await getPrinters()

// You may want to print the list to inspect.
console.dir(printerInfoList)
```

#### Example Output (in JSON)

```json
[
  {
    "Attributes": 580,
    "AveragePagesPerMinute": 0,
    "Capabilities": [ 4, 2 ],
    "CapabilityDescriptions": [ "Copies", "Color" ],
    "Caption": "Microsoft Print to PDF",
    "Default": true,
    "DefaultPriority": 0,
    "DetectedErrorState": 0,
    "DeviceID": "Microsoft Print to PDF",
    "Direct": false,
    "DoCompleteFirst": true,
    "DriverName": "Microsoft Print To PDF",
    "EnableBIDI": false,
    "EnableDevQueryPrint": false,
    "ExtendedDetectedErrorState": 0,
    "ExtendedPrinterStatus": 2,
    "Hidden": false,
    "HorizontalResolution": 600,
    "JobCountSinceLastReset": 0,
    "KeepPrintedJobs": false,
    "LanguagesSupported": [ 48 ],
    "Local": true,
    "Name": "Microsoft Print to PDF",
    "PaperSizesSupported": [
       7,  1,  8,  1,  1,
      21, 22, 23, 54, 55
    ],
    "PortName": "PORTPROMPT:",
    "PrinterPaperNames": [
      "Letter",    "Tabloid",
      "Legal",     "Statement",
      "Executive", "A3",
      "A4",        "A5",
      "B4 (JIS)",  "B5 (JIS)"
    ],
    "PrinterState": 0,
    "PrinterStatus": 3,
    "PrintJobDataType": "RAW",
    "PrintProcessor": "winprint",
    "SpoolEnabled": true,
    "Status": "Unknown",
    "SystemName": "MSI",
    "VerticalResolution": 600
  }
]
```