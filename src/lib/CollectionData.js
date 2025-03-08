import { getContract, readContract } from "thirdweb";
import { client } from "./client";
import { sonicTestnet } from "./Customchains";
import factoryabi from "./factoryabi.json";
import nftabi from "./nftabi.json";


// Function to fetch baseURI from a collection contract
const fetchBaseURI = async (collectionAddress) => {
  try {
    const contract = getContract({
      address: collectionAddress,
      chain: sonicTestnet,
      abi: nftabi,
      client,
    });

    const data = await readContract({
      contract,
      method: "baseURI",
    });

    

    if (data) {
      // Check if it's an IPFS URI and replace it with the Pinata gateway
      if (data.startsWith("ipfs://")) {
        return data.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
      }
      console.log('baseuri', data);
      return data; // Return as is if it's already a complete URL
    }
  } catch (error) {
    console.error(`Error fetching baseURI for ${collectionAddress}:`, error);
    return null;
  }
};

// Fetch metadata.json from baseURI
const fetchCollectionMetadata = async (baseURI) => {
  try {
    const response = await fetch(`${baseURI}metadata.json`);
    console.log('response base uri', response);
    const metadata = await response.json();

    console.log('metadata base uri', metadata);

    return {
      thumb: metadata.image,
      title: metadata.name,
      price: metadata.price || "N/A",
      saleEnd: metadata.saleEnd || "N/A",
      coinIcon: metadata.icon || metadata.image,
      projectDetails: [
        { title: "Min allocation", text: metadata.minAllocation || "N/A" },
        { title: "Max allocation", text: metadata.maxAllocation || "N/A" },
        { title: "Targeted raise", text: metadata.targetedRaise || "N/A" },
        { title: "Access type", text: metadata.accessType || "N/A" },
      ],
      socialLinks: metadata.socialLinks || [],
    };
  } catch (error) {
    console.error(`Error fetching metadata from ${baseURI}:`, error);
    return null;
  }
};

// Load NFT collections and format data
const loadNFTCollections = async () => {
  try {
    console.log(sonicTestnet);
    const contract = getContract({
  address: process.env.NEXT_PUBLIC_FACTORY,
  chain: sonicTestnet,
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
      const baseURI = await fetchBaseURI(collectionAddress);
      console.log('baseURI', baseURI);

      if (baseURI) {
        const collectionData = await fetchCollectionMetadata(baseURI);
        if (collectionData) projects.push(collectionData);
      }
    }

    return {
      data: [
        {
       //   projectStatus: "On Going",
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
