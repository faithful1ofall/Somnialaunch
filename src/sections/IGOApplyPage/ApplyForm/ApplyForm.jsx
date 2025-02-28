import { useState } from "react";

import { FaTelegramPlane, FaTwitter, FaUpload, FaMagic } from "react-icons/fa";

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

// Handle layer image upload
const handleLayerUpload = (event, layerIndex) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
        setLayers(prevLayers => {
            const newLayers = [...prevLayers];
            if (!newLayers[layerIndex].images) {
                newLayers[layerIndex].images = [];
            }
            files.forEach(file => {
                newLayers[layerIndex].images.push({ file, rarity: "" });
            });
            return newLayers;
        });
    }
};

// Handle rarity change per image
const handleTraitChange = (layerIndex, imageIndex, value) => {
    setLayers(prevLayers => {
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

// Add a new layer
const addLayer = () => {
    setLayers([...layers, { name: "", images: [] }]);
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

                    "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlMGU0YTYzZC1kYzk1LTQyYTEtOTAyMC1iYzAwZWU2MmVhYTciLCJlbWFpbCI6ImZhaXRoZnVsMW9mYWxsQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIxYmM2YWI5OTQwZTYxMmQ5MDEyYSIsInNjb3BlZEtleVNlY3JldCI6ImI0NzFhM2YyYmUxM2YzYTEzNmM1ODIwNTg5OWM2YjMyMmRkMjQyYmFlOGRlNzE5N2VlMTVmMTdlMzI5ZWEzYTciLCJleHAiOjE3NzIzMDU0OTV9.3pwBiPx80mfxjup7rffIvC0j-SSF-lcrt68njQrU810`

                }

            });

            return response.data.IpfsHash;

        } catch (error) {

            console.error(`Error uploading ${type} to IPFS:`, error);

            return null;

        }

    };



    const generateNFTs = async () => {

    if (layers.length === 0) return alert("No layers added!");



    let imageFiles = [];

    let metadataFiles = [];

    let imageCIDs = [];



    // Collect all images

    for (let i = 0; i < nftCount; i++) {

        let selectedLayers = new Set();

        let selectedImage = null;


      layers.forEach(layer => {
        if (selectedLayers.has(layer.name)) return; // Prevent duplicate layers

            selectedLayers.add(layer.name);
    layer.images.forEach((img, index) => {
        const file = img.file;
        imageFiles.push(new File([file], `${index + 1}.png`, { type: file.type }));
    });
});

     /*   layers.forEach(layer => {

            


            const file = new File([layer.image], `${i + 1}.png`, { type: layer.image.type });

            imageFiles.push(file);

        });

    }*/



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

                image: `ipfs://${imageCIDs}/${i + 1}.png`

            };



            layers.forEach(layer => {

                nftMetadata.attributes.push({ trait_type: layer.name, value: layer.rarity });

            });



             // Create metadata file (specify type as JSON in File constructor)

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

        alert(`NFTs generated!\nImages: ipfs://${imageCIDs}\nMetadata: ipfs://${metadataUpload.IpfsHash}`);

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

                  {/*  {layers.map((layer, index) => (

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

                    </Button>*/}

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

                            <p><strong>Images CID:</strong> <a href={`https://gateway.pinata.cloud/ipfs/${imageCID}`} target="_blank" rel="noopener noreferrer">ipfs://{imageCID}</a></p>

                            <p><strong>Metadata CID:</strong> <a href={`https://gateway.pinata.cloud/ipfs/${metadataCID}`} target="_blank" rel="noopener noreferrer">ipfs://{metadataCID}</a></p>

                        </div>

                    )}

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
