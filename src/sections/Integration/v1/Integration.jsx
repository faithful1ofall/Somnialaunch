import { FaCheck } from "react-icons/fa";
import { SectionTitle } from "@components/sectionTitle";
import rightThumb from "@assets/images/homeV2/Multi_Chain_Support.png";
import IntegrationStyleWrapper from "./Integration.style";

const Integration = () => {
  return (
    <IntegrationStyleWrapper>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="integration_left">
              <img src={rightThumb.src} alt="integration thumb " />
            </div>
          </div>
          <div className="col-md-6">
            <div className="integration_content_right">
              <SectionTitle
                title="SOMNIA BLOCKCHAIN"
                subtitle="INTEGRATION "
              />
              <div className="integration_content">
                <p>
                  Built on Somnia's high-performance blockchain, offering lightning-fast 
                  transactions, minimal fees, and seamless NFT deployment for creators 
                  and collectors worldwide.
                </p>
                <div className="integration_features">
                  <span>
                    {" "}
                    <FaCheck /> High Performance
                  </span>
                  <span>
                    {" "}
                    <FaCheck />
                    Low Fees
                  </span>
                  <span>
                    {" "}
                    <FaCheck />
                    Fast Transactions
                  </span>
                  <span>
                    {" "}
                    <FaCheck />
                    Secure Smart Contracts
                  </span>
                  <span>
                    {" "}
                    <FaCheck />
                    AI Integration
                  </span>
                  <span>
                    {" "}
                    <FaCheck />
                    IPFS Storage
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </IntegrationStyleWrapper>
  );
};

export default Integration;
