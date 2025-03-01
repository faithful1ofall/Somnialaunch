import { useState, useEffect} from "react";
import { FaTelegramPlane, FaTwitter, FaUpload, FaMagic } from "react-icons/fa";
import Button from "@components/button";
import ApplyFormStyleWrapper from "./ApplyFrom.style";
import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATAJWT,
  pinataGateway: "example-gateway.mypinata.cloud",
});

const ApplyForm = () => {
//  const [layers, setLayers] = useState([]);
  const [layers, setLayers] = useState([
  { name: "Background", images: []}
]);
  const [nftCount, setNftCount] = useState(1);
  const [imageCID, setImageCID] = useState(null);
  const [metadataCID, setMetadataCID] = useState(null);
  const [totalCombinations, setTotalCombinations] = useState(0);
  const [imagePreviews, setImagePreviews] = useState({});

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
      });

      // Remove previews for deleted images
      newPreviews[layerIndex] = newPreviews[layerIndex].slice(0, layer.images.length);
    });

    return newPreviews;
  });

  return () => {
    Object.values(imagePreviews)
      .flat()
      .forEach((url) => URL.revokeObjectURL(url));
  };
}, [layers]);
  // Compute total combinations dynamically
  useEffect(() => {
    let combinations = layers[0].images.length || 1; // Ensure at least one background
    layers.forEach(layer => {
      if (layer.images.length > 0) {
        combinations *= layer.images.length;
      }
    });
    setTotalCombinations(combinations);
  }, [layers]);

  // Handle layer image upload
/*  const handleLayerUpload = (event, layerIndex) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setLayers((prevLayers) => {
        const newLayers = [...prevLayers];
        if (!newLayers[layerIndex].images) {
          newLayers[layerIndex].images = [];
        }
        files.forEach((file) => {
          newLayers[layerIndex].images.push({ file, rarity: "" });
        });
        return newLayers;
      });
    }
  };*/

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
  
  const handleLayerUpload = (event, layerIndex) => {
  const files = Array.from(event.target.files);
  if (files.length > 0) {
    setLayers((prevLayers) => {
      const newLayers = prevLayers.map((layer, index) => {
        if (index === layerIndex) {
          return {
            ...layer,
            images: [...layer.images, ...files.map(file => ({ file, rarity: "" }))]
          };
        }
        return layer;
      });
      return newLayers;
    });
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

  // Add a new layer
  const addLayer = () => {
    setLayers([...layers, { name: "", images: [] }]);
  };

  const generateNFTs = async () => {
    if (!validateRarity()) {
      return alert("Rarity percentages must sum to 100% per layer.");
    }

    if (layers.length === 0) return alert("No layers added!");

    let imageFiles = [];
    let metadataFiles = [];
    let imageCIDs = [];

    // Collect all images
    for (let i = 0; i < nftCount; i++) {
      let selectedLayers = new Set();

      layers.forEach((layer) => {
        if (selectedLayers.has(layer.name)) return; // Prevent duplicate layers

        selectedLayers.add(layer.name);

        layer.images.forEach((img, index) => {
          const file = img.file;
          imageFiles.push(new File([file], `${index + 1}.png`, { type: file.type }));
        });
      });
    }

    try {
      // Upload images first
      const imageUpload = await pinata.upload.fileArray(imageFiles);
      if (!imageUpload.IpfsHash) return alert("Failed to upload images to IPFS");

      imageCIDs = imageUpload.IpfsHash; // Store uploaded image CID
      setImageCID(imageCIDs);

      // Generate metadata using the correct image IPFS URLs
      for (let i = 0; i < nftCount; i++) {
        let nftMetadata = {
          name: `NFT #${i + 1}`,
          attributes: [],
          image: `ipfs://${imageCIDs}/${i + 1}.png`,
        };

        layers.forEach((layer) => {
          nftMetadata.attributes.push({ trait_type: layer.name, value: layer.rarity });
        });

        // Create metadata file
        const metadataFile = new File(
          [JSON.stringify(nftMetadata, null, 2)],
          `${i + 1}.json`,
          { type: "application/json" }
        );

        metadataFiles.push(metadataFile);
      }

      // Upload all metadata
      const metadataUpload = await pinata.upload.fileArray(metadataFiles);
      if (!metadataUpload.IpfsHash) return alert("Failed to upload metadata");

      setMetadataCID(metadataUpload.IpfsHash);

      alert(
        `NFTs generated!\nImages: ipfs://${imageCIDs}\nMetadata: ipfs://${metadataUpload.IpfsHash}`
      );
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      alert("Upload failed!");
    }
  };

  return (
    <ApplyFormStyleWrapper>
      <form>
        {/* Existing Collection Form Fields */}
        <div className="form_widgets">
          <div className="form-group">
            <label htmlFor="CollectionName">Collection Name</label>
            <input
              type="text"
              id="CollectionName"
              placeholder="Collection Name"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Email" className="form-control" />
          </div>
        </div>

        {/* NFT Layer Management */}
        <div className="form_widgets">
          <h5>NFT Layer Management</h5>
          {layers.map((layer, layerIndex) => (
            <div key={layerIndex} className="layer-group">
              <input
                type="text"
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
                accept="image/*"
                multiple
                onChange={(e) => handleLayerUpload(e, layerIndex)}
                className="form-control"
              />

              {/* Display Images with Rarity Inputs */}
              {layer.images.map((image, imageIndex) => (
                <div key={imageIndex} className="image-group">
                  <p>{image.file.name}</p>
                  <img src={imagePreviews[layerIndex]?.[imageIndex]} alt="Layer Preview" className="preview-img" />
                  <button onClick={() => removeImage(layerIndex, imageIndex)}>Remove</button>
                  <input
                    type="number"
                    placeholder="Rarity %"
                    value={image.rarity}
                    onChange={(e) => handleTraitChange(layerIndex, imageIndex, e.target.value)}
                    className="form-control"
                  />
                </div>
              ))}
            </div>
          ))}

            {/* Display Total Combinations */}
        <h4>Total Possible Combinations: {totalCombinations}</h4>

          <Button variant="blue" onClick={addLayer}>
            <FaUpload /> Add Layer
          </Button>
        </div>

        {/* NFT Generation Options */}
        <div className="form_widgets">
          <h5>Generate NFTs</h5>
          <input
            type="number"
            value={nftCount}
            onChange={(e) => setNftCount(e.target.value)}
            className="form-control"
            placeholder="Number of NFTs to Generate"
          />
          <Button variant="blue" onClick={generateNFTs}>
            <FaMagic /> Generate & Upload
          </Button>

          {/* Display CIDs after generation */}
          {imageCID && metadataCID && (
            <div className="cid_display">
              <h5>Uploaded CIDs</h5>
              <p>
                <strong>Images CID:</strong>{" "}
                <a href={`https://gateway.pinata.cloud/ipfs/${imageCID}`} target="_blank" rel="noopener noreferrer">
                  ipfs://{imageCID}
                </a>
              </p>
              <p>
                <strong>Metadata CID:</strong>{" "}
                <a href={`https://gateway.pinata.cloud/ipfs/${metadataCID}`} target="_blank" rel="noopener noreferrer">
                  ipfs://{metadataCID}
                </a>
              </p>
            </div>
          )}
        </div>

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
