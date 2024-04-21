import PDFkitDocument from "pdfkit";
import sharp, {OverlayOptions} from "sharp";
import fs from "fs";
// @ts-ignore
import * as ImageDataUri from "image-data-uri";

export const createFileFromDataUrl = async (inputFileName: string, dataURL: string) => {
    try {
        await ImageDataUri.outputFile(dataURL, inputFileName);
    } catch (error) {
        console.log("Error when creating file from data URL: ", error);
    }
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

export const combineTwoPictures = async (
    underlyingPicture: string,
    upperPicture: string,
    outputFileName: string,
    topOffset: number,
    leftOffset: number,
) => {

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
        console.log("Error when combining two pictures: ", error);
    }
}

export const resizePicture = async (
    pictureFileName: string,
    width: number,
    height: number,
    outputFileName: string
) => {
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

    try {
        await sharp(pictureFileName)
            .resize(width, height)
            .toFormat("png")
            .toFile(outputFileName);
    } catch (error) {
        console.log("Error when resizing picture: ", error);
    }
}

export const getDataURL = (imagePath: string) => {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64 = imageBuffer.toString("base64");
    const mimeType = getMimeType(imagePath);

    return `data:${mimeType};base64,${base64}`;
}

const getMimeType = (imagePath: string) => {
    // @ts-ignore
    const extension = imagePath.split(".").pop().toLowerCase();
    switch (extension) {
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'png':
            return 'image/png';
        case 'gif':
            return 'image/gif';
        case 'svg':
            return 'image/svg+xml';
        default:
            throw new Error('Unsupported image type');
    }
}

export const flipImageAboutTheVerticalYAxis = async (
    imagePath: string,
    width: number,
    height: number,
    outputFilePath: string
) => {
    await sharp(imagePath)
        .flop()
        .resize(width, height)
        .toFile(outputFilePath);
}
