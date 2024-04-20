import {getPrinters, print as printDocument, Printer} from "pdf-to-printer";

export const print = async (file: string) => {
    try {
        console.log("Document to be printed", file);
        await printDocument(file);
    } catch (error) {
        console.error("Could not print document: ", error);
    }
}

export const getAllPrinters = async (): Promise<Printer[]> => {
    return await getPrinters();
}
