# node-win-printer

The package to print PDF files and get the information of all available printers on Windows. 

It uses [WMIC](https://learn.microsoft.com/en-us/windows/win32/wmisdk/wmic) tool to extract the detailed printer information and [Sumatra PDF](https://github.com/sumatrapdfreader/sumatrapdf) to print PDF files.

## Requirements

You need to install Sumatra PDF or save its portable version in a folder. After installation you can use `PDFPrinter` class by providing the path of the executable file.

You can download the installer and the portable version from https://www.sumatrapdfreader.org/download-free-pdf-viewer

## Installation

For NPM:
```shell
npm install @myteril/node-win-printer
```

## Usage

### Printing PDF Files

```typescript
// Import the class.
const { PDFPrinter } = require("@myteril/node-win-printer")

// Create an instance with a configuration.
const printer = new PDFPrinter({
    // Specify the path of the Sumatra PDF executable.
    sumatraPdfPath: "C:\\sumatra-pdf-executable.exe"
})

// Print a PDF file. (Note: You should use the below call in an asynchronous context.)
await printer.print({
    // The path of the PDF file.
    file: "C:\\pdf-file.pdf",
    // The name of the printer.
    printer: "Microsoft Print to PDF",
    // Only the pages 1, 3, 5-10.
    pages: [1, 3, {start: 5, end: 10}],
    // The pages will be printed as monochrome.
    color: false,
    // The pages will be scaled so that they will fit into the printable area of the paper.
    scale: "fit"
})
```

### Getting Printer Information

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