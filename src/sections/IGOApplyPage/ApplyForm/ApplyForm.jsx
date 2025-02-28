import { useState } from "react";
import { FaTelegramPlane, FaTwitter, FaUpload, FaMagic } from "react-icons/fa";
import Button from "@components/button";
import ApplyFormStyleWrapper from "./ApplyFrom.style";
import axios from "axios";

const ApplyForm = () => {
    const [layers, setLayers] = useState([]);
    const [nftCount, setNftCount] = useState(1);

    const handleLayerUpload = (event, index) => {
        const files = event.target.files;
        if (files.length > 0) {
            const newLayers = [...layers];
            newLayers[index].image = files[0];
            setLayers(newLayers);
        }
    };

    const handleTraitChange = (index, field, value) => {
        const newLayers = [...layers];
        newLayers[index][field] = value;
        setLayers(newLayers);
    };

    const addLayer = () => {
        setLayers([...layers, { name: "", rarity: "", image: null }]);
    };

    const uploadToIPFS = async (files, type) => {
        const formData = new FormData();
        for (let file of files) {
            formData.append("file", file);
        }

        const pinataOptions = JSON.stringify({ cidVersion: 0 });
        formData.append("pinataOptions", pinataOptions);

        try {
            const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer YOUR_PINATA_JWT`
                }
            });
            return response.data.IpfsHash;
        } catch (error) {
            console.error(`Error uploading ${type} to IPFS:`, error);
            return null;
        }
    };

    const generateNFTs = async () => {
        const imageFiles = layers.map(layer => layer.image);
        const imageCID = await uploadToIPFS(imageFiles, "images");

        if (!imageCID) return alert("Failed to upload images");

        const metadataFiles = layers.map((layer, index) => ({
            name: `NFT #${index + 1}`,
            attributes: [{ trait_type: layer.name, value: layer.rarity }],
            image: `ipfs://${imageCID}/${index + 1}.png`
        }));

        const metadataBlob = new Blob([JSON.stringify(metadataFiles, null, 2)], { type: "application/json" });
        const metadataCID = await uploadToIPFS([metadataBlob], "metadata");

        if (!metadataCID) return alert("Failed to upload metadata");

        alert(`NFTs generated! Images: ipfs://${imageCID}, Metadata: ipfs://${metadataCID}`);
    };

    return (
        <ApplyFormStyleWrapper>
            <form>
                {/* Existing Collection Form Fields */}
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

                {/* NFT Layer Management */}
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
                                onChange={(e) => handleLayerUpload(e, index)}
                                className="form-control"
                            />
                        </div>
                    ))}
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
                </div>

                {/* Social Links */}
                <div className="form_widgets">
                    <div className="form-group">
                        <label htmlFor="telegram">TELEGRAM GROUP</label>
                        <div className="input_with_icon">
                            <div className="input_social_icon"><FaTelegramPlane /></div>
                            <input type="text" id="telegram" placeholder="Enter telegram group link" className="form-control" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="twitter">COLLECTION Twitter</label>
                        <div className="input_with_icon">
                            <div className="input_social_icon"><FaTwitter /></div>
                            <input type="text" id="twitter" placeholder="Enter twitter link" className="form-control" />
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
