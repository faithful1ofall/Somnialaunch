import { useState } from "react";
import { FaTelegramPlane, FaTwitter, FaUpload, FaMagic } from "react-icons/fa";
import Button from "@components/button";
import ApplyFormStyleWrapper from "./ApplyFrom.style";
import axios from "axios";

const ApplyForm = () => {
    const [layers, setLayers] = useState([]);
    const [nftCount, setNftCount] = useState(1);
    const [cids, setCIDs] = useState({ images: "", metadata: "" });

    const handleLayerUpload = (event, index) => {
        const files = Array.from(event.target.files);
        if (files.length > 0) {
            const newLayers = [...layers];
            if (!newLayers[index].images) newLayers[index].images = [];
            newLayers[index].images.push(...files);
            setLayers(newLayers);
        }
    };

    const handleTraitChange = (index, field, value) => {
        const newLayers = [...layers];
        newLayers[index][field] = value;
        setLayers(newLayers);
    };

    const addLayer = () => {
        setLayers([...layers, { name: "", rarity: "", images: [] }]);
    };

    const uploadToIPFS = async (files, type) => {
        const formData = new FormData();
        files.forEach(file => formData.append("file", file));

        const pinataOptions = JSON.stringify({ cidVersion: 0 });
        formData.append("pinataOptions", pinataOptions);

        try {
            const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlMGU0YTYzZC1kYzk1LTQyYTEtOTAyMC1iYzAwZWU2MmVhYTciLCJlbWFpbCI6ImZhaXRoZnVsMW9mYWxsQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIxYmM2YWI5OTQwZTYxMmQ5MDEyYSIsInNjb3BlZEtleVNlY3JldCI6ImI0NzFhM2YyYmUxM2YzYTEzNmM1ODIwNTg5OWM2YjMyMmRkMjQyYmFlOGRlNzE5N2VlMTVmMTdlMzI5ZWEzYTciLCJleHAiOjE3NzIzMDU0OTV9.3pwBiPx80mfxjup7rffIvC0j-SSF-lcrt68njQrU810`
                }
            });
            return response.data.IpfsHash;
        } catch (error) {
            console.error(`Error uploading ${type} to IPFS:`, error);
            return null;
        }
    };

    const getRandomImage = (layer) => {
        if (layer.images.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * layer.images.length);
        return layer.images[randomIndex];
    };

    const generateNFTs = async () => {
        if (layers.length === 0) return alert("No layers added");

        let nftImages = [];
        let metadataFiles = [];

        for (let i = 0; i < nftCount; i++) {
            let selectedImages = layers.map(layer => getRandomImage(layer)); // Ensure one image per layer
            nftImages.push(...selectedImages);

            let metadata = {
                name: `NFT #${i + 1}`,
                attributes: layers.map((layer, index) => ({
                    trait_type: layer.name,
                    value: selectedImages[index] ? selectedImages[index].name : "None"
                }))
            };
            metadataFiles.push(metadata);
        }

        const imageCID = await uploadToIPFS(nftImages, "images");
        if (!imageCID) return alert("Failed to upload images");

        const metadataBlob = new Blob([JSON.stringify(metadataFiles, null, 2)], { type: "application/json" });
        const metadataCID = await uploadToIPFS([metadataBlob], "metadata");
        if (!metadataCID) return alert("Failed to upload metadata");

        setCIDs({ images: `ipfs://${imageCID}`, metadata: `ipfs://${metadataCID}` });
        alert(`NFTs generated! Images: ipfs://${imageCID}, Metadata: ipfs://${metadataCID}`);
    };

    return (
        <ApplyFormStyleWrapper>
            <form>
                <div className="form_widgets">
                    <h5>NFT Layer Management</h5>
                    {layers.map((layer, index) => (
                        <div key={index} className="layer-group">
                            <input
                                type="text"
                                placeholder="Layer Name"
                                value={layer.name}
                                onChange={(e) => handleTraitChange(index, "name", e.target.value)}
                                className="form-control"
                            />
                            <input
                                type="number"
                                placeholder="Rarity Percentage"
                                value={layer.rarity}
                                onChange={(e) => handleTraitChange(index, "rarity", e.target.value)}
                                className="form-control"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleLayerUpload(e, index)}
                                className="form-control"
                            />
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
                        onChange={(e) => setNftCount(e.target.value)}
                        className="form-control"
                        placeholder="Number of NFTs to Generate"
                    />
                    <Button variant="blue" onClick={generateNFTs}>
                        <FaMagic /> Generate & Upload
                    </Button>
                </div>

                {cids.images && cids.metadata && (
                    <div className="cid-display">
                        <h5>Uploaded IPFS CIDs</h5>
                        <p><strong>Images CID:</strong> {cids.images}</p>
                        <p><strong>Metadata CID:</strong> {cids.metadata}</p>
                    </div>
                )}

                <Button variant="blue" lg>
                    Submit Collection
                </Button>
            </form>
        </ApplyFormStyleWrapper>
    );
};

export default ApplyForm;
