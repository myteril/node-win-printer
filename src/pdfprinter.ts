import * as fs from "node:fs";
import {execFile} from "node:child_process";
import util from "node:util";
const execFileAsync = util.promisify(execFile);

type PDFPrinterConfiguration = {
    /**
     * The absolute path of Sumatra PDF executable.
     */
    sumatraPdfPath: string
}

type PaperSize =  "A2"|"A3"|"A4"|"A5"|"A6"|"letter"|"legal"|"tabloid"|"statement"

type Range = {
    start: number,
    end: number
}

type DuplexMode = "duplex"|"short-edge"|"long-edge"|"simplex";

type Color = "color"|"monochrome"|boolean;

type Scaling = "none"|"shrink"|"fit";

type Orientation = "landscape"|"portrait";

type PDFPrintingSettings = {
    /**
     * The path of the PDF file.
     */
    file: string
    /**
     * The name of the printer. If not provided, the system's default printer will be used.
     */
    printer?: string,
    /**
     * The pages to print. The value should be an array that contains page numbers and range objects (like "{start:1,end:10}").
     */
    pages?: (Range|number)[],
    /**
     * Determines which pages to print.
     */
    pageSelection?: "all"|"even"|"odd"
    /**
     * The paper size. Possible values: "A2", "A3", "A4", "A5", "A6", "letter", "legal", "tabloid" and "statement"
     */
    paperSize?: PaperSize,
    /**
     * The duplex mode. Possible values: "duplex", "short-edge", "long-edge" and "simplex"
     */
    duplexMode?: DuplexMode,
    /**
     * The page orientation.
     */
    orientation?: Orientation,
    /**
     * The color type.
     */
    color?: Color,
    /**
     * The scaling type.
     */
    scale?: Scaling
    /**
     * The number of copies.
     */
    numberOfCopies: number
}

class PDFPrinter {
    private configuration: PDFPrinterConfiguration;

    public constructor(configuration: PDFPrinterConfiguration) {
        this.configuration = { ...configuration };
        this.checkConfiguration();
    }

    private checkConfiguration (){
        if(!fs.existsSync(this.configuration.sumatraPdfPath)){
            throw new Error('The Sumatra PDF executable could not be found. ');
        }
    }

    public async print(settings: PDFPrintingSettings){

        let printSettingsParameter: string[] = [];

        // region Selected Pages

        settings.pages?.forEach(value => {
            if(typeof value === "number"){
                printSettingsParameter.push(value.toString())
            }else{
                printSettingsParameter.push(`${Math.max(1, Math.round(value.start))}-${Math.max(1, Math.round(value.end))}`)
            }
        });

        // endregion Selected Pages

        // region Page Selection

        if(settings.pageSelection && settings.pageSelection !== 'all'){
            printSettingsParameter.push(settings.pageSelection);
        }

        // endregion Page Selection

        // region Number of Copies

        if(settings.numberOfCopies){
            printSettingsParameter.push(`${Math.max(1, Math.round(settings.numberOfCopies))}x`)
        }

        // endregion Number of Copies

        // region Scaling

        if(settings.scale){
            printSettingsParameter.push(settings.scale);
        }else{
            printSettingsParameter.push("fit");
        }

        // endregion Scaling

        // region Color

        if(typeof settings.color !== 'undefined'){
            if(typeof settings.color === 'boolean'){
                if(settings.color){
                    printSettingsParameter.push('color');
                }else{
                    printSettingsParameter.push('monochrome');
                }
            }else{
                printSettingsParameter.push(settings.color);
            }
        }else{
            printSettingsParameter.push('color');
        }

        // endregion Color

        // region Duplex Mode

        if(settings.duplexMode){
            let value: string = settings.duplexMode;
            if(value === 'long-edge'){
                value = 'duplexlong'
            }else if(value === 'short-edge'){
                value = 'duplexshort'
            }
            printSettingsParameter.push(value)
        }

        // endregion Duplex Mode

        // region Orientation

        if(settings.orientation) {
            printSettingsParameter.push(settings.orientation)
        }

        // endregion Orientation

        // region Paper Size

        if(settings.paperSize) {
            printSettingsParameter.push(`paper=${settings.paperSize}`)
        }

        // endregion Paper Size

        // region Printer

        let printer = 'default';

        if(settings.printer){
            printer = JSON.stringify(settings.printer)
        }

        // endregion Printer

        return await execFileAsync(this.configuration.sumatraPdfPath, [
            `-print-to${printer === 'default' ? '-' : ' '}${printer}`,
            `-print-settings "${printSettingsParameter.join(',')}"`,
            '-silent',
            JSON.stringify(settings.file)
        ])
    }
}

export { PDFPrinter }