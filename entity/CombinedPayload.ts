import Picture from "./Picture";

type CombinedPayload = {
    underlyingPicture: Picture;
    onTopPicture: Picture;
}

export default CombinedPayload;