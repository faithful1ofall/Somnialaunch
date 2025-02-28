import { useState } from "react";
import { FaUpload } from "react-icons/fa";
import Button from "@components/button";
import ApplyFormStyleWrapper from "./ApplyFrom.style";
import axios from "axios";
import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({
  pinataJwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlMGU0YTYzZC1kYzk1LTQyYTEtOTAyMC1iYzAwZWU2MmVhYTciLCJlbWFpbCI6ImZhaXRoZnVsMW9mYWxsQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIxYmM2YWI5OTQwZTYxMmQ5MDEyYSIsInNjb3BlZEtleVNlY3JldCI6ImI0NzFhM2YyYmUxM2YzYTEzNmM1ODIwNTg5OWM2YjMyMmRkMjQyYmFlOGRlNzE5N2VlMTVmMTdlMzI5ZWEzYTciLCJleHAiOjE3NzIzMDU0OTV9.3pwBiPx80mfxjup7rffIvC0j-SSF-lcrt68njQrU810',
  pinataGateway: "example-gateway.mypinata.cloud",
});

const ApplyForm = () => {
  const [layers, setLayers] = useState([]);
  const [nftCount, setNftCount] = useState(1);
  const [imageCID, setImageCID] = useState(null);
  const [metadataCID, setMetadataCID] = useState(null);

  // Handle layer addition
  const addLayer = () => {
    setLayers([...layers, { name: "", images: [] }]);
  };

  // Handle file uploads per layer
  const handleLayerUpload = (event, layerIndex) => {
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
  };

  // Handle rarity input
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
      const totalRarity = layer.images.reduce((sum, img) => sum + Number(img.rarity || 0), 0);
      if (totalRarity !== 100) {
        return false;
      }
    }
    return true;
  };

  // Upload images & metadata to IPFS via Pinata
  const uploadToIPFS = async (files, type) => {
    try {
      const response = await pinata.upload.fileArray(files);
      return response.IpfsHash;
    } catch (error) {
      console.error(`Error uploading ${type} to IPFS:`, error);
      return null;
    }
  };

  // Generate NFTs
  const generateNFTs = async () => {
    if (layers.length === 0) return alert("No layers added!");
    if (!validateRarity()) return alert("Each layer's rarity must sum to 100%!");

    let imageFiles = [];
    let metadataFiles = [];

    // Collect images for NFT generation
    layers.forEach((layer) => {
      layer.images.forEach((img, index) => {
        const file = img.file;
        imageFiles.push(new File([file], `${layer.name}-${index + 1}.png`, { type: file.type }));
      });
    });

    try {
      // Upload images
      const imageCID = await uploadToIPFS(imageFiles, "images");
      if (!imageCID) return alert("Failed to upload images to IPFS.");
      setImageCID(imageCID);

      // Generate and upload metadata
      for (let i = 0; i < nftCount; i++) {
        let metadata = {
          name: `NFT #${i + 1}`,
          attributes: layers.map((layer) => ({
            trait_type: layer.name,
            value: layer.images[i % layer.images.length].rarity, // Rotate rarity values
          })),
          image: `ipfs://${imageCID}/${i + 1}.png`,
        };

        const metadataFile = new File([JSON.stringify(metadata, null, 2)], `${i + 1}.json`, { type: "application/json" });
        metadataFiles.push(metadataFile);
      }

      const metadataCID = await uploadToIPFS(metadataFiles, "metadata");
      if (!metadataCID) return alert("Failed to upload metadata.");

      setMetadataCID(metadataCID);
      alert(`NFTs generated!\nImages: ipfs://${imageCID}\nMetadata: ipfs://${metadataCID}`);
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      alert("Upload failed!");
    }
  };

  return (
    <ApplyFormStyleWrapper>
      <form>
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

              {/* Display uploaded images with rarity inputs */}
              {layer.images.map((image, imageIndex) => (
                <div key={imageIndex} className="image-group">
                  <p>{image.file.name}</p>
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
          <Button variant="blue" onClick={addLayer}>
            <FaUpload /> Add Layer
          </Button>
        </div>

        {/* NFT Generation Button */}
        <div className="form_widgets">
          <label>NFT Count</label>
          <input type="number" value={nftCount} onChange={(e) => setNftCount(Number(e.target.value))} className="form-control" />
          <Button variant="blue" onClick={generateNFTs}>
            Generate NFTs
          </Button>
        </div>
      </form>
    </ApplyFormStyleWrapper>
  );
};

export default ApplyForm;
