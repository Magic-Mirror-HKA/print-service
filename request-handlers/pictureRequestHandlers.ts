import { NextFunction, Request, Response } from "express";
import Picture from "../entity/Picture";
import { findAllPictures } from "../controllers/pictureController";
import { v4 as uuid } from "uuid";
import { print } from "../services/printService";
import {combineTwoPictures, convertPictureToPdf, preProcessPicture, resizePicture} from "../services/imageService";

const PATH_OUTPUT_PROCESSED_PICTURES = "./processedPictures"

const PATH_ASSETS = "./assets"

export const handlePostPictureRequest = async (req: Request, res: Response, next: NextFunction) => {
  const picture: Picture = req.body;

  const id = uuid();

  const inputFileName = `image-input-${id}.png`;
  const inputFilePath = `${PATH_OUTPUT_PROCESSED_PICTURES}/${inputFileName}`;

  // For printing
  const outputPdfFileName = `image-output-${id}.pdf`;
  const outputPdfFilePath = `${PATH_OUTPUT_PROCESSED_PICTURES}/${outputPdfFileName}`;

  // For resizing
  const outputResizedPictureFileName = `image-resized-${id}.png`;
  const outputResizedPictureFilePath = `${PATH_OUTPUT_PROCESSED_PICTURES}/${outputResizedPictureFileName}`;

  // For combining pictures
  const outputCombinedPictureFileName = `combined-image-${id}.png`;
  const outputCombinedPictureFilePath = `${PATH_OUTPUT_PROCESSED_PICTURES}/${outputCombinedPictureFileName}`;


  // Create a new picture from Baser64 string
  await preProcessPicture(inputFilePath, picture.source);

  // Resize picture so that it fits into the desired foto frame
  await resizePicture(inputFilePath, 3260, 1725, outputResizedPictureFilePath);

  // Combine picture and picture frame together
  await combineTwoPictures(
      `${PATH_ASSETS}/landscape-frame.png`,
      outputResizedPictureFilePath,
      outputCombinedPictureFilePath
  );

  // Convert created picture to pdf
  convertPictureToPdf(outputCombinedPictureFilePath, outputPdfFilePath);

  // Print pdf
  setTimeout(async () => {
    await print(outputPdfFilePath);
  }, 2000);

  res.status(201).json({
    message: "It worked!. Document successfully printed!"
  });
  next();
};

export const handleGetPicturesRequest = async (_req: Request, res: Response, next: NextFunction) => {
  const pictures = await findAllPictures();
  res.status(200).json(pictures);
  next();
}
