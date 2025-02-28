import { useState } from "react";
import { FaTelegramPlane, FaTwitter, FaUpload, FaMagic } from "react-icons/fa";
import Button from "@components/button";
import ApplyFormStyleWrapper from "./ApplyFrom.style";
import axios from "axios";
import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({
  pinataJwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlMGU0YTYzZC1kYzk1LTQyYTEtOTAyMC1iYzAwZWU2MmVhYTciLCJlbWFpbCI6ImZhaXRoZnVsMW9mYWxsQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIxYmM2YWI5OTQwZTYxMmQ5MDEyYSIsInNjb3BlZEtleVNlY3JldCI6ImI0NzFhM2YyYmUxM2YzYTEzNmM1ODIwNTg5OWM2YjMyMmRkMjQyYmFlOGRlNzE5N2VlMTVmMTdlMzI5ZWEzYTciLCJleHAiOjE3NzIzMDU0OTV9.3pwBiPx80mfxjup7rffIvC0j-SSF-lcrt68njQrU810",
  pinataGateway: "example-gateway.mypinata.cloud",
});

const ApplyForm = () => {
    const [layers, setLayers] = useState([]);
    const [nftCount, setNftCount] = useState(1);
    const [imageCID, setImageCID] = useState(null);
    const [metadataCID, setMetadataCID] = useState(null);

    const handleLayerUpload = (event, layerIndex) => {
        const files = event.target.files;
        if (files.length === 0) return;

        setLayers(prevLayers => {
            const updatedLayers = [...prevLayers];
            const newTraits = [...updatedLayers[layerIndex].traits];

            for (let file of files) {
                newTraits.push({ image: file, rarity: "" });
            }

            updatedLayers[layerIndex].traits = newTraits;
            return updatedLayers;
        });
    };

    const handleTraitChange = (layerIndex, traitIndex, field, value) => {
        setLayers(prevLayers => {
            const updatedLayers = [...prevLayers];
            updatedLayers[layerIndex].traits[traitIndex][field] = value;
            return updatedLayers;
        });
    };

    const addLayer = () => {
        setLayers([...layers, { name: "", traits: [] }]);
    };

    const validateRarity = () => {
        for (const layer of layers) {
            const totalRarity = layer.traits.reduce((sum, trait) => sum + Number(trait.rarity || 0), 0);
            if (totalRarity !== 100) {
                alert(`Rarity percentages for layer "${layer.name}" must sum up to 100%.`);
                return false;
            }
        }
        return true;
    };

    const generateNFTs = async () => {
        if (!validateRarity()) return;

        let imageFiles = [];
        let metadataFiles = [];
        let imageCIDs = [];

        for (let i = 0; i < nftCount; i++) {
            let nftMetadata = {
                name: `NFT #${i + 1}`,
                attributes: [],
                image: "",
            };

            for (const layer of layers) {
                // Randomly select an image based on weighted rarity
                let randomValue = Math.random() * 100;
                let accumulatedRarity = 0;
                let selectedTrait = null;

                for (const trait of layer.traits) {
                    accumulatedRarity += Number(trait.rarity);
                    if (randomValue <= accumulatedRarity) {
                        selectedTrait = trait;
                        break;
                    }
                }

                if (selectedTrait) {
                    const file = new File([selectedTrait.image], `${i + 1}_${layer.name}.png`, { type: selectedTrait.image.type });
                    imageFiles.push(file);

                    nftMetadata.attributes.push({ trait_type: layer.name, value: selectedTrait.rarity });
                }
            }

            metadataFiles.push(new File([JSON.stringify(nftMetadata)], `${i + 1}.json`, { type: "application/json" }));
        }

        try {
            // Upload images
            const imageUpload = await pinata.upload.fileArray(imageFiles);
            if (!imageUpload.IpfsHash) return alert("Failed to upload images to IPFS");

            imageCIDs = imageUpload.IpfsHash;
            setImageCID(imageCIDs);

            // Assign correct image CID to metadata
            metadataFiles.forEach((file, index) => {
                let jsonData = JSON.parse(file.text());
                jsonData.image = `ipfs://${imageCIDs}/${index + 1}.png`;
                metadataFiles[index] = new File([JSON.stringify(jsonData)], file.name, { type: "application/json" });
            });

            // Upload metadata
            const metadataUpload = await pinata.upload.fileArray(metadataFiles);
            if (!metadataUpload.IpfsHash) return alert("Failed to upload metadata");

            setMetadataCID(metadataUpload.IpfsHash);
            alert(`NFTs generated!\nImages: ipfs://${imageCIDs}\nMetadata: ipfs://${metadataUpload.IpfsHash}`);
        } catch (error) {
            console.error("Error uploading to IPFS:", error);
            alert("Upload failed!");
        }
    };

    return (
        <ApplyFormStyleWrapper>
            <form>
                <div className="form_widgets">
                    <div className="form-group">
                        <label htmlFor="CollectionName">Collection Name</label>
                        <input type="text" id="CollectionName" placeholder="Collection Name" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" placeholder="Email" className="form-control" />
                    </div>
                </div>

                <div className="form_widgets">
                    <h5>NFT Layer Management</h5>
                    {layers.map((layer, layerIndex) => (
                        <div key={layerIndex} className="layer-group">
                            <input
                                type="text"
                                placeholder="Layer Name"
                                value={layer.name}
                                onChange={(e) => {
                                    let newLayers = [...layers];
                                    newLayers[layerIndex].name = e.target.value;
                                    setLayers(newLayers);
                                }}
                                className="form-control"
                            />
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => handleLayerUpload(e, layerIndex)}
                                className="form-control"
                            />

                            {layer.traits.map((trait, traitIndex) => (
                                <div key={traitIndex} className="trait-group">
                                    <span>{trait.image?.name || "No file selected"}</span>
                                    <input
                                        type="number"
                                        placeholder="Rarity %"
                                        value={trait.rarity}
                                        onChange={(e) => handleTraitChange(layerIndex, traitIndex, "rarity", e.target.value)}
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

                <div className="form_widgets">
                    <h5>Generate NFTs</h5>
                    <input
                        type="number"
                        value={nftCount}
                        onChange={(e) => setNftCount(Number(e.target.value))}
                        className="form-control"
                        placeholder="Number of NFTs to Generate"
                    />
                    <Button variant="blue" onClick={generateNFTs}>
                        <FaMagic /> Generate & Upload
                    </Button>

                    {imageCID && metadataCID && (
                        <div className="cid_display">
                            <h5>Uploaded CIDs</h5>
                            <p><strong>Images CID:</strong> <a href={`https://gateway.pinata.cloud/ipfs/${imageCID}`} target="_blank" rel="noopener noreferrer">ipfs://{imageCID}</a></p>
                            <p><strong>Metadata CID:</strong> <a href={`https://gateway.pinata.cloud/ipfs/${metadataCID}`} target="_blank" rel="noopener noreferrer">ipfs://{metadataCID}</a></p>
                        </div>
                    )}
                </div>
            </form>
        </ApplyFormStyleWrapper>
    );
};

export default ApplyForm;
