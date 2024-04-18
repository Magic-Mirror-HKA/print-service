import sharp from "sharp";
// @ts-ignore
import * as ImageDataUri from "image-data-uri";

const processAndSaveImage = async (inputFileName: string, outputFileName: string) => {

    // Resize and sharpen the image
    // sharp(inputFileName)
    //     //.resize(800, 600) // Resize the image to 800x600 pixels
    //     .sharpen({ sigma: 1, m2: 10 }) // Apply sharpening to the image
    //     .modulate({ brightness: 1.2 })
    //     .toFile(outputFileName, (err, info) => {
    //         if (err) {
    //             console.error(err);
    //             return;
    //         }
    //         console.log(info);
    //     });
}

const sharpTransform = (inputFileName: string, outputFileName: string) => {
    // Resize and sharpen the image
    sharp(inputFileName)
        .resize(3260, 1724) // Resize the image to 800x600 pixels
        //.sharpen({ sigma: 1, m2: 10 }) // Apply sharpening to the image
        //.modulate({ brightness: 1.2 })
        .toFormat("png", { quality: 100 })
        .toFile(`sharp/${outputFileName}`, (err, info) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(info);
        });
}
const time = new Date().getTime();
sharpTransform(`image-2.png`, `image-${time}-processed.png`);

// processAndSaveImage(`image-2.png`, `image-2-processed.png`);