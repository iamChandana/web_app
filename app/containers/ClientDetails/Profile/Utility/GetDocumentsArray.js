export default function getDocumentsArray(imageObj) {
    let imageArray = [];
    imageArray = Object.keys(imageObj).map((imageItem) => imageObj[`${imageItem}`].id);
    return imageArray;
}