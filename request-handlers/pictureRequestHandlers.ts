import {NextFunction, Request, Response} from "express";
import Picture from "../entity/Picture";
import {findAllPictures} from "../controllers/pictureController";
import {v4 as uuid} from "uuid";
import {print} from "../services/printService";
import {
  combineTwoPictures,
  convertPictureToPdf, flipImageAboutTheVerticalYAxis,
  getDataURL,
  preProcessPicture,
  resizePicture
} from "../services/imageService";
import CombinedPayload from "../entity/CombinedPayload";

const PATH_OUTPUT_PROCESSED_PICTURES = "./processedPictures"

const PATH_ASSETS = "./assets"

export const handlePostPicturePrintRequest = async (req: Request, res: Response, next: NextFunction) => {
  const picture: Picture = req.body;

  console.log("picture: ", picture);

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
  const topOffset = 118;
  const leftOffset = 118;
  await combineTwoPictures(
      `${PATH_ASSETS}/landscape-frame.png`,
      outputResizedPictureFilePath,
      outputCombinedPictureFilePath,
      topOffset,
      leftOffset,
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

export const handleCombineRequest = async (req: Request, res: Response, next: NextFunction) => {
  const combinedPayload = req.body as CombinedPayload;

  const id = uuid();
  const outputUnderlyingPictureFileName = `underlying-image-${id}.png`;
  const outputUnderlyingPictureFilePath = `${PATH_OUTPUT_PROCESSED_PICTURES}/${outputUnderlyingPictureFileName}`;

  const outputOnTopPictureFileName = `ontop-image-${id}.png`;
  const outputOnTopPictureFilePath = `${PATH_OUTPUT_PROCESSED_PICTURES}/${outputOnTopPictureFileName}`;

  const outputCombinedName = `combined-image-${id}.png`;
  const outputCombinedFilePath = `${PATH_OUTPUT_PROCESSED_PICTURES}/${outputCombinedName}`;

  // Resized pictures
  const outputOnTopResizedPictureFileName = `ontop-resized-image-${id}.png`;
  const outputOnTopResizedPictureFilePath = `${PATH_OUTPUT_PROCESSED_PICTURES}/${outputOnTopResizedPictureFileName}`;

  const outputUnderlyingResizedPictureFileName = `underlying-resized-image-${id}.png`;
  const outputUnderlyingResizedPictureFilePath = `${PATH_OUTPUT_PROCESSED_PICTURES}/${outputUnderlyingResizedPictureFileName}`;

  console.log("Combined PAYLOAD: ", combinedPayload);

  // Create a new picture from Baser64 string
  await preProcessPicture(outputUnderlyingPictureFilePath, combinedPayload.underlyingPicture.source);
  await preProcessPicture(outputOnTopPictureFilePath, combinedPayload.onTopPicture.source);

  // Resize onTop and underlying pictures
  await resizePicture(outputOnTopPictureFilePath, 3260, 1725, outputOnTopResizedPictureFilePath);
  await resizePicture(outputUnderlyingPictureFilePath, 3260, 1725, outputUnderlyingResizedPictureFilePath);

  // Flip onTop picture (mask) picture.
  const outputFlippedPictureFileName = `ontop-resized-flipped-image-${id}.png`;
  const outputFlippedPictureFilePath = `${PATH_OUTPUT_PROCESSED_PICTURES}/${outputFlippedPictureFileName}`;
  await flipImageAboutTheVerticalYAxis(outputOnTopPictureFilePath, 3260, 1725, outputFlippedPictureFilePath);

  await combineTwoPictures(
      outputUnderlyingResizedPictureFilePath,
      outputFlippedPictureFilePath,
      outputCombinedFilePath,
      0,
      0,
  );

  res.status(200).json({
    id,
    source: getDataURL(outputCombinedFilePath),
  });

}

export const handleGetPicturesRequest = async (_req: Request, res: Response, next: NextFunction) => {
  const pictures = await findAllPictures();
  res.status(200).json(pictures);
  next();
}
