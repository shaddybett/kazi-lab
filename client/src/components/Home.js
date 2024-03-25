import React, { useState, useEffect } from 'react';

function Home() {
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const generateImage = async () => {
      try {
        const response = await fetch('https://modelslab.com/api/v6/images/text2img', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "key": "api-key",
            "model_id": "sdxlceshi",
            "prompt": "ultra realistic close up portrait ((beautiful pale cyberpunk female with heavy black eyeliner)), blue eyes, shaved side haircut, hyper detail, cinematic lighting, magic neon, dark red city, Canon EOS R3, nikon, f/1.4, ISO 200, 1/160s, 8K, RAW, unedited, symmetrical balance, in-frame, 8K",
            "negative_prompt": "painting, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, deformed, ugly, blurry, bad anatomy, bad proportions, extra limbs, cloned face, skinny, glitchy, double torso, extra arms, extra hands, mangled fingers, missing lips, ugly face, distorted face, extra legs, anime",
            "width": "512",
            "height": "512",
            "samples": "1",
            "num_inference_steps": "30",
            "seed": null,
            "guidance_scale": 7.5,
            "webhook": null,
            "track_id": null
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setImageUrl(data.image_url);
        } else {
          const errorMessage = await response.json();
          setError(errorMessage.error || 'An error occurred');
        }
      } catch (error) {
        setError('An error occurred. Please try again later.');
      }
    };

    generateImage();
  }, []);

  return (
    <div>
      {imageUrl && (
        <img src={imageUrl} alt="Generated Image" />
      )}
      {error && <p>{error}</p>}
    </div>
  );
}

export default Home;
