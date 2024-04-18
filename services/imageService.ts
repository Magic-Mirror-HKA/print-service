import PDFkitDocument from "pdfkit";
import sharp, { OverlayOptions } from "sharp";
import fs from "fs";
import { v4 as uuid } from "uuid";
// @ts-ignore
import * as ImageDataUri from "image-data-uri";

export const preProcessPicture = async (inputFileName: string, dataURL: string) => {
    await ImageDataUri.outputFile(dataURL, inputFileName);

    // processAndSaveImage(
    //     inputFile,
    //     `${inputFile.replace(".png", "-processed.png")}`
    // );
}

export const processAndSaveImage = (inputFileName: string, outputFileName: string) => {
    // Resize and sharpen the image
    sharp(inputFileName)
        //.resize(800, 600) // Resize the image to 800x600 pixels
        .sharpen({ sigma: 1, m2: 10 }) // Apply sharpening to the image
        .modulate({ brightness: 1 })
        .toFile(outputFileName, (err, info) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(info);
        });
}
export const convertPictureToPdf = (pictureFilePath: string, outputFileName: string) => {
    const doc = new PDFkitDocument({ size: [419, 283] });

    try {
        doc.image(pictureFilePath, 0, 0, {
            cover: [419, 283],
            align: "center",
            valign: "center"
        });
        // generate pdf
        doc.pipe(fs.createWriteStream(outputFileName));
        doc.end();
    } catch (error) {
        console.error("Could not convert picture to pdf: ", error);
    }
};

export const combineTwoPictures = async (underlyingPicture: string, upperPicture: string, outputFileName: string) => {

    const topOffset = 118;
    const leftOffset = 118;

    const compositeOptions: OverlayOptions[] = [
        {
            input: upperPicture,
            top: topOffset,
            left: leftOffset,
        },
    ];

    try {
        await sharp(underlyingPicture)
            .composite(compositeOptions)
            .toFile(outputFileName);
    } catch (error) {
        console.log("An error occured when combining two pictures: ", error);
    }
}

export const resizePicture = async (pictureFileName: string, width: number, height: number, outputFileName: string) => {
    if (!width || !height) {
        throw new Error("Can not resize picture. Width and height doesn't exist");
    }
    if (width < 0 || height < 0) {
        throw new Error("Can not resize picture. Width and height can not be negative");
    }
    if (width === Infinity || width === -Infinity || height === Infinity || height === -Infinity) {
        throw new Error("Can not resize picture. Width and height can not be Infinity");
    }
    if (width === 0 || height === 0) {
        throw new Error("Can not resize picture. Width and height can not be 0");
    }

    await sharp(pictureFileName)
        .resize(width, height)
        .toFormat("png")
        .toFile(outputFileName);
}

// combineTwoPictures(
//     "assets/landscape-frame.png",
//     "processedPictures/image-test.png",
//     `processedPictures/combined-output-${uuid()}.png`
//     );