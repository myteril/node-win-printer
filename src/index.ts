import util from 'node:util';
import iconv from "iconv-lite";
import {exec} from "node:child_process"
const execAsync = util.promisify(exec);


const getTerminalCodepage = async () => {
    const { stdout } = await execAsync('chcp', { encoding: 'ascii' })
    return stdout.split(':').pop().trim()
}

/**
 * Returns the list of printers, or null if an error occurred.
 * @returns {Promise<null|Object[]>}
 */
const getPrinters = async (): Promise<null | object[]> => {
    const codepage = await getTerminalCodepage();
    const { stdout, stderr } = await execAsync('wmic printer list /format:list', { encoding: 'binary' })

    if(stderr.length > 0){
        return null;
    }
    // Correct the encoding.
    let result = iconv.decode(Buffer.from(stdout, 'binary'), `cp${codepage}`);
    // Split the text into blocks.
    let blocks = result.replace(/\r/ig, '').split('\n\n\n')
    // Convert each block into object.
    let printerInfos = blocks.map(block => {
        let obj = {};
        // Split the block into lines that contain an attribute and its value.
        let lines = block.trim().split('\n')
        lines.forEach(line => {
            // If the line is empty, ignore it.
            if(line.trim().length < 1)
                return;

            // Get the index of the first equals sign.
            let equalsSignIndex = line.indexOf('=')

            // Extract the name and the value of the attribute.
            let attributeName = line.substring(0, equalsSignIndex)
            let attributeValue : string|boolean|number = line.substring(equalsSignIndex + 1)

            // Ignore attributes that have blank values for compact output.
            if(attributeValue.length < 1)
                return;

            // Array
            if(attributeValue.startsWith('{') && attributeValue.endsWith('}'))
                attributeValue = JSON.parse(`[${attributeValue.substring(1, attributeValue.length - 1)}]`)

            // Boolean
            if(typeof attributeValue === 'string'){
                switch(attributeValue){
                    case 'TRUE':
                        attributeValue = true;
                        break;
                    case 'FALSE':
                        attributeValue = false;
                        break
                }
            }

            // Numbers
            if(typeof attributeValue === 'string' && !isNaN(parseFloat(attributeValue))){
                attributeValue = Number(attributeValue).valueOf()
            }

            // Assign the attribute value by its name into the object.
            obj[attributeName] = attributeValue
        })
        return obj;
    })

    // Ignore the empty printer info objects.
    printerInfos = printerInfos.filter(printerInfo => Object.keys(printerInfo).length > 0)

    return printerInfos;
}


export { getPrinters }