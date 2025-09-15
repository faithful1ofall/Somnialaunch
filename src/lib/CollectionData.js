import { getContract, readContract } from "thirdweb";
import { client } from "./client";
import { SomniaTestnet } from "./Customchains";
import factoryabi from "./factoryabi.json";
import nftabi from "./nftabi.json";


// Function to fetch baseURI from a collection contract
const fetchCollection = async (collectionAddress) => {
  try {
    const contract = getContract({
      address: collectionAddress,
      chain: SomniaTestnet,
      abi: nftabi,
      client,
    });

    const data = await readContract({
      contract,
      method: "baseURI",
    });
    const basePrice = await readContract({
      contract,
      method: "basePrice",
    });
    const totalSupplyLimit = await readContract({
      contract,
      method: "totalSupplyLimit",
    });
    const totalSupply = await readContract({
      contract,
      method: "totalSupply",
    });

    const creator = await readContract({
      contract,
      method: "creator",
    });

    

      return {
  baseURI: data.startsWith("ipfs://")
    ? data.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")
    : data,
  basePrice,
  totalSupplyLimit,
  totalSupply,
  creator,
  address: collectionAddress
        
}; // Return as is if it's already a complete URL

  } catch (error) {
    console.error(`Error fetching baseURI for ${collectionAddress}:`, error);
    return null;
  }
};

// Fetch metadata.json from baseURI
const fetchCollectionMetadata = async (collection) => {
  try {
    const response = await fetch(`${collection.baseURI}metadata.json`);
    const responsenft = await fetch(`${collection.baseURI}1.json`);
    
    const metadata = await response.json();

    const metadatanft = await responsenft.json();

    const image = metadatanft.image.startsWith("ipfs://")
    ? metadatanft.image.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")
    : metadatanft.image

    const imagesrc = { src: image }
    const rooticonsrc = { src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAclBMVEUAAAAaDQCuZAC2aAAqFwDcgwD/lwD/lQDniQAPBwAsGgDsjQD/kAD0kQBIKgAJAwA8IgDMeACESwDCdAD/mgDUfgB0QgD/kgD/mwAwHQCLTwAeEQBvQABbMwDGcQCXWQBRLgBkOQCjXwCrYQAjEQB9RgBv97J/AAAAqUlEQVR4AdXQMRqCMBBE4QFJNpIFSGQNKAFVvf8VLexWOQB/+5r5BvtVlIcKW4wlV+CfI2rP3LTooPXBRJwGKzib0KoolMYJ8YKrTeRUdImHGVWNPHJqVIwNOVm8X8RRs0LpM27ETHfkFlqecfSJfY05Q1ktCc6JIgLR48+gFpcnJsusBwXisXwtUq0jk1GxXiSWNiV7eEvo8Wv63rdBhsF02NA9ngV26wPPsQmlLxuqvAAAAABJRU5ErkJggg==' }
    console.log('metadata base uri && nft1', metadata, metadatanft);

    return {
      thumb: imagesrc,
      title: metadata.CollectionName,
      price: collection.basePrice ? `${collection.basePrice}` : "N/A",
      saleEnd: `${collection.totalSupplyLimit - collection.totalSupply}`  || "N/A",
      coinIcon: rooticonsrc,
      address: collection.address,
      projectDetails: [
        { title: "Current Mints", text: collection.totalSupply ? collection.totalSupply.toString() : "N/A", },
        { title: "Max Mints", text: collection.totalSupplyLimit ? collection.totalSupplyLimit.toString() : "N/A"},
        { title: "Targeted raise", text: `${collection.totalSupplyLimit * collection.basePrice}` || "N/A" },
        { title: "Access type", text: metadata.accessType || "Public" },
      ],
      socialLinks: metadata.socialLinks || [],
    };
  } catch (error) {
    console.error(`Error fetching metadata from ${collection}:`, error);
    return null;
  }
};

// Load NFT collections and format data
const loadNFTCollections = async (onUpdate) => {
  try {
    
    const contract = getContract({
  address: process.env.NEXT_PUBLIC_FACTORY, // TODO: Update with deployed Somnia contract address
  chain: SomniaTestnet,
  abi: factoryabi,
  client,
});
    const data = await readContract({
         contract,
         method: "getAllCollections"
     });
   // const collectionAddresses = await factorycontract.call("getCollections");
    console.log('collectionadd', data);
    const collectionAddresses = data;
    
       let projects = [];

    for (const collectionAddress of collectionAddresses) {
      const collect = await fetchCollection(collectionAddress);
      console.log('collect', collect);

      if (collect) {
        const collectionData = await fetchCollectionMetadata(collect);
 if (collectionData) {
          projects.push(collectionData);

          // Call the callback function with updated data
          if (onUpdate) {
            onUpdate({
              data: [
                {
                  projectStatus: "On Going",
                  projects: [...projects], // Send a copy of the array
                },
              ],
            });
          }
        }
      }
    }

    return {
      data: [
        {
          projectStatus: "On Going",
          projects,
        },
      ],
    };
  } catch (error) {
    console.error("Error loading NFT collections:", error);
    return { data: [] };
  }
};

export default loadNFTCollections;
