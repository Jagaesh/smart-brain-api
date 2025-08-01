export const CLARIFAI = {
  PAT: process.env.CLARIFAI_API_KEY,
  USER_ID: 'jagaesh',
  APP_ID: 'smartbrain-face-detection',
  MODEL_ID: 'face-detection',
  MODEL_VERSION_ID: '6dc7e46bc9124c5c8824be4822abe105'
};

export const buildClarifaiRequestOptions = (imageUrl) => {
  return {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Key ' + CLARIFAI.PAT
    },
    body: JSON.stringify({
      user_app_id: {
        user_id: CLARIFAI.USER_ID,
        app_id: CLARIFAI.APP_ID
      },
      inputs: [
        {
          data: {
            image: {
              url: imageUrl
            }
          }
        }
      ]
    })
  };
};
