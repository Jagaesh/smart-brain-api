import { CLARIFAI, buildClarifaiRequestOptions } from '../config/apiConfig.js';

const handleApiCall = (req, res) => {
  const { imageUrl } = req.body;
  const clarifaiUrl = `https://api.clarifai.com/v2/models/${CLARIFAI.MODEL_ID}/versions/${CLARIFAI.MODEL_VERSION_ID}/outputs`;
  const requestOptions = buildClarifaiRequestOptions(imageUrl);

  fetch(clarifaiUrl, requestOptions)
    .then(response => response.json())
    .then(data => {
      const regions = data?.outputs?.[0]?.data?.regions || [];
      res.json(regions);
    })
    .catch(err => res.status(400).json('Unable to work with Clarifai API'));
}

export default handleApiCall;
