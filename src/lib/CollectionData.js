import { useReadContract } from "thirdweb/react";
import { getContract } from "thirdweb";
import { client } from "./client";
import { sonicTestnet } from "./Customchains";
import factoryabi from "./factoryabi.json";
import nftabi from "./nftabi.json";






// Function to fetch baseURI from a collection contract
const fetchBaseURI = async (collectionAddress) => {
  try {
    const nftcontract = getContract({
  address: collectionAddress,
  chain: sonicTestnet,
  abi: nftabi,
  client,
});
    const { data, isLoading } = useReadContract({
nftcontract,
method: "baseURI"
});
    console.log('baseuri', data, isLoading);
if(data){
    return data;
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
    const metadata = await response.json();

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
    const factorycontract = getContract({
  address: process.env.NEXT_PUBLIC_FACTORY,
  chain: sonicTestnet,
  abi: factoryabi,
  client,
});
    const { data, isLoading } = useReadContract({
         factorycontract,
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
