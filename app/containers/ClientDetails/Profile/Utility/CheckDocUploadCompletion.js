export default function checkDocUploadCompletion(imageArray, uploadType) {
  if (imageArray && Object.keys(imageArray).length === 2 && (uploadType === 'NRIC' || uploadType === 'POID' || uploadType === 'ARID')) {
        //   console.log('Upload type', uploadType, imageArray.length);
      return true;
    } else if ((uploadType === 'PSPORT') && imageArray.length === 3) {
      return true;
    }
  return false;
}
