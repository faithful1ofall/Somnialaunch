import { useState, useEffect} from "react";
import { FaTelegramPlane, FaTwitter, FaUpload, FaMagic } from "react-icons/fa";
import Button from "@components/button";
import ApplyFormStyleWrapper from "./ApplyFrom.style";
import { PinataSDK } from "pinata-web3";
import { generateImage, generateCollectionTheme, generateNFTCollection } from '../../../utils/openaigen';
import imglyRemoveBackground from "@imgly/background-removal";
//import Image from "next/image";

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATAJWT,
  pinataGateway: "example-gateway.mypinata.cloud",
});

const ApplyForm = () => {
 const [layers, setLayers] = useState([]);
  const [nftCount, setNftCount] = useState(1);
  const [imageCID, setImageCID] = useState(null);
  const [metadataCID, setMetadataCID] = useState(null);
  const [totalCombinations, setTotalCombinations] = useState(0);
  const [imagePreviews, setImagePreviews] = useState({});
  const [loading, setLoading] = useState(false);

  const [useCustomLinks, setUseCustomLinks] = useState(false);
  
  const [useAI, setUseAI] = useState(false);
  const [idea, setIdea] = useState("");
  const [collectionTheme, setCollectionTheme] = useState("");
 // const [nftCount, setNftCount] = useState(1);
  const [previewNFTs, setPreviewNFTs] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState(1);

  const handleGenerateTheme = async () => {
    if (!idea.trim()) return alert("Enter an idea first!");
    setIsGenerating(true);

    try {
      // Call AI function to get collection theme
      
      const theme = await generateCollectionTheme(idea);
      console.log(theme)
      setCollectionTheme(theme.collectionTheme);
      setStep(2); // Move to next step
    } catch (error) {
      console.error("Error generating theme:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGeneratePreview = async () => {
    setIsGenerating(true);
    try {
      const previews = await generateNFTCollection(collectionTheme, nftCount, true); // True for preview mode
      console.log(previews);
      setPreviewNFTs(previews.nftCollection);
      setStep(3); // Move to review step
    } catch (error) {
      console.error("Error generating previews:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConfirmAndUpload = async () => {
    setIsGenerating(true);
    try {
      let imageFiles = [];
        let metadataFiles = [];
      
      for (let i = 0; i < previewNFTs.length; i++){
        
      imageFiles.push(new File([previewNFTs[i].blob], `${i + 1}.png`, { type: "image/png" }));
      }
      const imageUpload = await uploadFiles(imageFiles, 'imageFiles');
    if (!imageUpload.IpfsHash) return alert("Failed to upload images to IPFS");
    
    const imageCID = imageUpload.IpfsHash;
    setImageCID(imageCID);

      for (let i = 0; i < previewNFTs.length; i++) {
      let metadata = {
        ...previewNFTs[i].metadata,
        image: `ipfs://${imageCID}/${i + 1}.png`,
        
      };

      metadataFiles.push(new File([JSON.stringify(metadata, null, 2)], `${i + 1}.json`, { type: "application/json" }));
    }

    const metadataCollection = collectionTheme;

    const metadataCollectionFile = new File([metadataCollection], "metadata.json", {
      type: "application/json",
    });

    metadataFiles.push(metadataCollectionFile);

    // Upload metadata in parallel
    const metadataUpload = await uploadFiles(metadataFiles, 'metadataFiles');
    if (!metadataUpload.IpfsHash) return alert("Failed to upload metadata");

    setMetadataCID(metadataUpload.IpfsHash);
  
    
    alert(`NFTs generated!\nImages: ipfs://${imageCID}\nMetadata: ipfs://${metadataUpload.IpfsHash}`);
      
   //   await uploadNFTs(collectionTheme, nftCount);
   //   alert("NFTs successfully uploaded!");
    } catch (error) {
      console.error("Error uploading NFTs:", error);
    } finally {
      setIsGenerating(false);
    }
  };


  const AIgenerateImage = async (prompt) => {
  try {
    setLoading(true);
    const imageData = await generateImage(prompt, 2);
  //  const imageUrl = imageData.data[0].url;

    // Fetch the image while handling CORS issues
//    const response = await fetch(imageUrl, { mode: "no-cors" });

//    if (!response.ok) throw new Error("Failed to fetch image");
//   const blob = await response.blob();
    console.log('logged data', imageData);
    
    
  //  const imageFile = new File([imageData], `${Date.now()}ai.png`, { type: "image/png" });

    return imageData;
  } catch (error) {
    console.error("Error generating AI image:", error);
    alert("AI image generation failed due to CORS restrictions.");
    return null;
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
  setImagePreviews((prevPreviews) => {
    const newPreviews = { ...prevPreviews };

    layers.forEach((layer, layerIndex) => {
      if (!newPreviews[layerIndex]) {
        newPreviews[layerIndex] = [];
      }

      layer.images.forEach((image, imageIndex) => {
        if (!newPreviews[layerIndex][imageIndex] && image.file) {
          newPreviews[layerIndex][imageIndex] = URL.createObjectURL(image.file);
        }
        if (!newPreviews[layerIndex][imageIndex] && image.url) {
          newPreviews[layerIndex][imageIndex] = image.url;
        }
      });

      // Remove previews for deleted images
      newPreviews[layerIndex] = newPreviews[layerIndex].slice(0, layer.images.length);
    });

    return newPreviews;
  });
}, [layers]);
  
  // Compute total combinations dynamically
  useEffect(() => {
  if (layers.length === 0) {
    setTotalCombinations(0);
    return;
  }

  let combinations = 1;
  layers.forEach((layer) => {
    if (layer.images.length > 0) {
      combinations *= layer.images.length;
    }
  });

  setTotalCombinations(combinations);
}, [layers]);

  const removeImage = (layerIndex, imageIndex) => {
  setLayers((prevLayers) => {
    return prevLayers.map((layer, lIdx) => {
      if (lIdx === layerIndex) {
        return {
          ...layer,
          images: layer.images.filter((_, iIdx) => iIdx !== imageIndex),
        };
      }
      return layer;
    });
  });

  setImagePreviews((prevPreviews) => {
    const newPreviews = { ...prevPreviews };

    if (newPreviews[layerIndex] && newPreviews[layerIndex][imageIndex]) {
      URL.revokeObjectURL(newPreviews[layerIndex][imageIndex]); // Clean up URL
    }

    newPreviews[layerIndex] = newPreviews[layerIndex]?.filter((_, iIdx) => iIdx !== imageIndex) || [];

    return newPreviews;
  });
};

   const refineBackground = async (imgUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imgUrl;
    img.crossOrigin = "anonymous"; // Handle CORS issues

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return reject("Canvas context not available");

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Get the first pixel color (assuming solid background)
      const firstPixel = ctx.getImageData(0, 0, 1, 1).data;
      const targetColor = { r: firstPixel[0], g: firstPixel[1], b: firstPixel[2] };

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];

        // Check if the pixel color is close to the background color
        if (
          Math.abs(r - targetColor.r) < 20 &&
          Math.abs(g - targetColor.g) < 20 &&
          Math.abs(b - targetColor.b) < 20
        ) {
          data[i + 3] = 0; // Make pixel transparent
        }
      }

      ctx.putImageData(imgData, 0, 0);
      // Convert canvas to Blob
      canvas.toBlob((blob) => {
        if (!blob) return reject("Failed to create Blob");
        resolve(blob); // Return Blob
      }, "image/png");
    };

    img.onerror = (err) => reject("Image failed to load: " + err);
  });
};
  
  const handleLayerUpload = async (event, layerIndex, useAI = false) => {
  if (useAI) {
    const layerName = layers[layerIndex]?.name || "this layer"; // Use the layer name if available
    const prePrompt = `You are generating an image layer for an NFT. The layer name is "${layerName}". `;
    const userPrompt = window.prompt(prePrompt + "Describe your NFT image:");

    if (userPrompt && userPrompt.trim()) {
      try {
        const aiImage = await AIgenerateImage(userPrompt);

        if (aiImage) {
  let bgrm = aiImage.blob; // Default to AI blob
  if (layers[layerIndex]?.name !== "Background" && aiImage.proxyUrl) {
    bgrm = await refineBackground(aiImage.proxyUrl);
  }
        console.log('bgrm', bgrm);
        const aifile = new File([bgrm], `${Date.now()}ai.png`, { type: "image/png" });
        console.log('aifile', aifile);
        if (aiImage) {
          setLayers((prevLayers) =>
            prevLayers.map((layer, index) =>
              index === layerIndex
                ? { ...layer, images: [...layer.images, { file: aifile, rarity: "" }] }
                : layer
            )
          );
        }
      } catch (error) {
        console.error("Error generating AI image:", error);
      }
    }
    return;
  }

  const files = Array.from(event.target.files);
  const newImages = files.map((file) => ({ file, rarity: "" }));

  if (newImages.length > 0) {
    setLayers((prevLayers) =>
      prevLayers.map((layer, index) =>
        index === layerIndex
          ? { ...layer, images: [...layer.images, ...newImages] }
          : layer
      )
    );
  }
};


  
  // Handle rarity change per image
  const handleTraitChange = (layerIndex, imageIndex, value) => {
    setLayers((prevLayers) => {
      const newLayers = [...prevLayers];
      newLayers[layerIndex].images[imageIndex].rarity = value;
      return newLayers;
    });
  };

  // Validate rarity sum to be 100%
  const validateRarity = () => {
    for (const layer of layers) {
      const totalRarity = layer.images.reduce(
        (sum, img) => sum + Number(img.rarity || 0),
        0
      );
      if (totalRarity !== 100) {
        return false;
      }
    }
    return true;
  };

  const addLayer = () => {
  setLayers((prevLayers) => [
    ...prevLayers,
    { name: prevLayers.length === 0 ? "Background" : "", images: [] },
  ]);
};

  const uploadFiles = async (files, type) => {
  try {
    return await pinata.upload.fileArray(files, {
      metadata: {
            name: `MiniLaunch_${type}_${Date.now()}`, // Unique name
      },
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    throw error;
  }
};
  

const generateNFTs = async () => {
  setLoading(true);
  if (imageCID && metadataCID) {
  try {
    await pinata.unpin([imageCID, metadataCID]);
  } catch (error) {
    console.warn("Error unpinning old IPFS data:", error);
  }
  }
  try {
    // Fetch collection name and description from form
    const collectionName = document.getElementById("CollectionName").value.trim();
    const collectionDescription = document.getElementById("CollectionDescription").value.trim();

    if (!collectionName || !collectionDescription) {
      return alert("Please enter collection name and description.");
    }
  if (!validateRarity()) return alert("Rarity percentages must sum to 100% per layer.");
  if (layers.length === 0) return alert("No layers added!");

  let imageFiles = [];
  let metadataFiles = [];

  // Create and configure canvas
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  // Generate all unique NFT combinations
  let uniqueCombinations = [];
  function generateCombinations(currentCombo = [], depth = 0) {
    if (depth === layers.length) {
      uniqueCombinations.push(currentCombo);
      return;
    }
    layers[depth].images.forEach(image => generateCombinations([...currentCombo, image], depth + 1));
  }
  generateCombinations();

  // Preload all images asynchronously
  const preloadImage = (image) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      if(image.file){
      img.src = URL.createObjectURL(image.file);
      } 
      if(image.url){
        img.src = image.url;
      }
      img.onload = () => resolve(img);
      img.onerror = reject;
    });

  const loadedImages = await Promise.all(
    uniqueCombinations.flat().map((img) => preloadImage(img))
  );

  // Generate images
  for (let i = 0; i < Math.min(nftCount, uniqueCombinations.length); i++) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    uniqueCombinations[i].forEach((image, index) => {
      ctx.drawImage(loadedImages[i * layers.length + index], 0, 0, canvas.width, canvas.height);
    });

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    imageFiles.push(new File([blob], `${i + 1}.png`, { type: "image/png" }));
  }

  
    // Upload images in parallel
    const imageUpload = await uploadFiles(imageFiles, 'imageFiles');
    if (!imageUpload.IpfsHash) return alert("Failed to upload images to IPFS");
    
    const imageCID = imageUpload.IpfsHash;
    setImageCID(imageCID);

    // Generate metadata
    for (let i = 0; i < Math.min(nftCount, uniqueCombinations.length); i++) {
      let metadata = {
        name: `${collectionName}  #${i + 1}`,
        description: collectionDescription,
        image: `ipfs://${imageCID}/${i + 1}.png`,
        attributes: uniqueCombinations[i].map((image, index) => ({
          trait_type: layers[index].name,
          value: image.rarity
        })),
      };

      metadataFiles.push(new File([JSON.stringify(metadata, null, 2)], `${i + 1}.json`, { type: "application/json" }));
    }

    const metadataCollection = {
      name: collectionName,
      description: collectionDescription
    };

    const metadataCollectionFile = new File([JSON.stringify(metadataCollection, null, 2)], "_metadata.json", {
      type: "application/json",
    });

    metadataFiles.push(metadataCollectionFile);

    // Upload metadata in parallel
    const metadataUpload = await uploadFiles(metadataFiles, 'metadataFiles');
    if (!metadataUpload.IpfsHash) return alert("Failed to upload metadata");

    setMetadataCID(metadataUpload.IpfsHash);
  
    
    alert(`NFTs generated!\nImages: ipfs://${imageCID}\nMetadata: ipfs://${metadataUpload.IpfsHash}`);
  } catch (error) {
  
    console.error("Error uploading to IPFS:", error);
    alert("Upload failed!");
  } finally {
    setLoading(false); // Ensures loading state resets regardless of success or failure
}
};
  
  return (
    <ApplyFormStyleWrapper>
      <form>
        
        {/* Existing Collection Form Fields */}
        <div className="form_widgets">
          {!useAI && (
          <div className="form-group">
            <label htmlFor="CollectionName">Collection Name</label>
            <input
              type="text"
              id="CollectionName"
              placeholder="Collection Name"
              className="form-control"
            />
          </div>
      )}
          {!useAI && (
          <div className="form-group">
    <label htmlFor="CollectionDescription">Description</label>
      <input
      type="text"
      id="CollectionDescription"
      placeholder="Enter a short description of your collection"
      className="form-control"
      rows="3"
    />
  </div>
      )}
          {!useAI && (

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Email" className="form-control" />
          </div>
      )}
        </div>
      

        <div className="ai-nft-generator">
      <label>
        <input type="checkbox" checked={useAI} onChange={() => setUseAI(!useAI)} />
        Use AI-Generated NFTs
      </label>

      {useAI && (
        <div>
          <label>
           Step 1
      </label>
          <input
            type="text"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Enter your idea..."
          />
          <Button variant="blue" style={{ marginTop: '10px' }} onClick={(e) => { e.preventDefault(); handleGenerateTheme();}} disabled={isGenerating}>
            Generate Theme
          </Button>
        </div>
      )}

      {useAI && (
        <div>
          <label>
           Step 2
      </label>
          <textarea
            value={collectionTheme}
            style={{ marginTop: '10px' }}
            onChange={(e) => setCollectionTheme(e.target.value)}
          />
          <input
            type="number"
            value={nftCount}
            onChange={(e) => setNftCount(Math.max(1, parseInt(e.target.value)))}
            min="1"
          />
          <Button  variant="blue" style={{ marginTop: '10px' }} onClick={ (e) => { e.preventDefault(); handleGeneratePreview();}} disabled={isGenerating}>
            Generate Preview
          </Button>
        </div>
      )}

      {useAI && step === 3 && (
        <div>
          <h3>Preview</h3>
          <div className="nft-previews">
            {previewNFTs.map((nft, index) => (
              <img key={index} src={nft.proxyUrl} alt={`NFT ${index}`} style={{ marginTop: '10px' }} />
        ))}
          </div>
          <Button style={{ marginTop: '10px' }} variant="blue" onClick={(e) => { e.preventDefault(); handleConfirmAndUpload();}} disabled={isGenerating}>
            Confirm & Upload
          </Button>
        </div>
      )}
    </div>

        {!useAI && (
        <label>
        <input type="checkbox" checked={useCustomLinks} onChange={() => setUseCustomLinks(!useCustomLinks)} />
        Use custom links
      </label>
      )}

        {/* NFT Layer Management */}
        {(!useAI && !useCustomLinks) && (
        <div className="form_widgets">
          
          <h5>NFT Layer Management</h5>
          {layers.map((layer, layerIndex) => (
            <div key={layerIndex} className="layer-group">
              <input
                type="text"
                style={{ marginTop: '10px' }}
                placeholder="Layer Name"
                value={layer.name}
                onChange={(e) => {
                  const newLayers = [...layers];
                  newLayers[layerIndex].name = e.target.value;
                  setLayers(newLayers);
                }}
                className="form-control"
              />
              <input
                type="file"
                style={{ marginTop: '10px' }}
                accept="image/*"
                multiple
                onChange={(e) => handleLayerUpload(e, layerIndex)}
                className="form-control"
              />
              <Button variant="blue" style={{ marginTop: '10px' }} onClick={(e) => { e.preventDefault(); handleLayerUpload(e, layerIndex, true); }}>
  <FaMagic /> AI Generate
</Button>

              {/* Display Images with Rarity Inputs */}
              {layer.images.map((image, imageIndex) => (
                <div key={imageIndex} className="image-group">
                  <p>{image?.file?.name || 'ai generated'}</p>
                  <img src={imagePreviews[layerIndex]?.[imageIndex]} alt="Layer Preview" className="preview-img" />
                  <button onClick={(e) => removeImage(layerIndex, imageIndex)}>Remove</button>
                  <input
                    type="number"
                    placeholder="Rarity %"
                    value={image.rarity}
                    onChange={(e) => { e.preventDefault(); handleTraitChange(layerIndex, imageIndex, e.target.value); }}
                    className="form-control"
                  />
                </div>
              ))}
            </div>
          ))}

            {/* Display Total Combinations */}
        <h4>Total Possible Combinations: {totalCombinations}</h4>

          <Button variant="blue" onClick={(e) => { e.preventDefault(); addLayer(); }}>
            <FaUpload /> Add Layer
          </Button>
        </div>
      )}
        

        {/* NFT Generation Options */}
        {(!useAI && !useCustomLinks) && (
        <div className="form_widgets">
          <h5>Generate NFTs</h5>
          <input
            type="number"
            value={nftCount}
            onChange={(e) => setNftCount(e.target.value)}
            className="form-control"
            placeholder="Number of NFTs to Generate"
          />
          <Button variant="blue" style={{ marginTop: '10px' }} onClick={(e) => { e.preventDefault(); generateNFTs(); }} disabled={loading}>
  {loading ? (
    <>
      <span className="spinner"></span> Generating...
    </>
  ) : (
    <>
      <FaMagic /> Generate & Upload
    </>
  )}
</Button>
        </div>
      )}

        {/* Display CIDs after generation */}
          {imageCID && metadataCID && (
  <div className="cid_display">
    <h5>Uploaded CIDs</h5>
    <p>
      <strong>Images CID:</strong>{" "}
      <a
        href={`https://gateway.pinata.cloud/ipfs/${imageCID}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        ipfs://{`${imageCID.substring(0, 6)}...${imageCID.slice(-6)}`}
      </a>
    </p>
    <p>
      <strong>Metadata CID:</strong>{" "}
      <a
        href={`https://gateway.pinata.cloud/ipfs/${metadataCID}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        ipfs://{`${metadataCID.substring(0, 6)}...${metadataCID.slice(-6)}`}
      </a>
    </p>
  </div>
)}
  {useCustomLinks && (      
<div className="form_widgets">
          <div className="form-group">
            <label htmlFor="nftfile">NFT files link</label>
            <div className="input_with_icon">
              <div className="input_social_icon">
                <FaTelegramPlane />
              </div>
              <input type="text" id="nftfile" placeholder="Enter nft files link ipfs/anylink type: json" className="form-control" />
            </div>
          </div>
        </div>
      )}
        {useCustomLinks && (
        
        <div className="form_widgets">
          <div className="form-group">
            <label htmlFor="nftmeta">NFT metadata link</label>
            <div className="input_with_icon">
              <div className="input_social_icon">
                <FaTelegramPlane />
              </div>
              <input type="text" id="nftmeta" placeholder="Enter nft metadata link ipfs/anylink type: json" className="form-control" />
            </div>
          </div>
        </div>
      )}
        
        {/* Social Links */}
        <div className="form_widgets">
          <div className="form-group">
            <label htmlFor="telegram">TELEGRAM GROUP</label>
            <div className="input_with_icon">
              <div className="input_social_icon">
                <FaTelegramPlane />
              </div>
              <input type="text" id="telegram" placeholder="Enter telegram group link" className="form-control" />
            </div>
          </div>
        </div>

        <Button variant="blue" lg>
          Submit Collection
        </Button>
      </form>
    </ApplyFormStyleWrapper>
  );
};

export default ApplyForm;
