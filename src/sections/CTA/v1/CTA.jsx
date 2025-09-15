import Button from "@components/button";
import CardHover from "@components/cardHover";
import CTAStyleWrapper from "./CTA.style";

const CTA = () => {
  return (
    <CTAStyleWrapper>
      <div className="container">
        <div className="cta-area text-center">
          <h2 className="title">
            Launch Your NFT Collection <br />
          </h2>
          <div className="dsc">
            Create and deploy AI-generated NFT collections on Somnia with ease
          </div>
          <Button variant="mint" md href="/igo-apply">
            Launch Collection
          </Button>
          <CardHover />
        </div>
      </div>
    </CTAStyleWrapper>
  );
};

export default CTA;
