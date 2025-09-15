import styled from "styled-components";
import bgShape from "@assets/images/bg/card-bg-shape-big.png";

const CTAStyleWrapper = styled.section`
  .cta-area {
    position: relative;
    padding: 70px 0 80px 0;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
    border-radius: 20px;
    margin: 0 20px;
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
    z-index: 1;
    .card-hover-wrapper {
      opacity: 1;
      visibility: visible;
    }

    &::before {
      position: absolute;
      height: 100%;
      width: 100%;
      left: 0%;
      top: 0;
      background: url(${bgShape.src});
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      content: "";
      opacity: 0.3;
      z-index: -1;
      border-radius: 20px;
    }
  }

  .title {
    margin-bottom: 15px;
    text-transform: uppercase;
    background: linear-gradient(45deg, #fff, #a3ff12);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .dsc {
    margin-bottom: 40px;
    font-size: 18px;
    opacity: 0.9;
  }
  .btn_wrapper {
    margin: 0 auto;
  }

  @media only screen and (max-width: 991px) {
    .title {
      font-size: 30px;
    }
  }
  @media only screen and (max-width: 767px) {
    .title {
      font-size: 26px;
    }
  }
  @media only screen and (max-width: 480px) {
    .title {
      font-size: 22px;
    }
    .dsc {
      padding: 0 10px;
    }
  }
`;

export default CTAStyleWrapper;
