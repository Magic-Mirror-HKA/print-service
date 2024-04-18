import {print as printDocument, getPrinters, Printer} from "pdf-to-printer";
import PDFkitDocument from "pdfkit";
import fs from "fs";

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
