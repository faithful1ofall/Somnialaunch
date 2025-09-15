import styled from "styled-components";

const PartnerStyleWrapper = styled.div`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding-bottom: 110px;

  .section_title {
    text-align: center;
    .subtitle {
      color: #ffffff;
    }
    margin-bottom: 45px;
  }

  .slick-slider {
    .slick-list {
      position: relative;

      &::before {
        width: 50px;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background: rgb(10, 11, 26);
        background: linear-gradient(
          90deg,
          rgba(10, 11, 26, 1) 0%,
          rgba(10, 11, 26, 0.5942752100840336) 52%,
          rgba(10, 11, 26, 0) 100%
        );

        content: "";
        z-index: 1;
      }
      &::after {
        width: 50px;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        background: rgb(10, 11, 26);
        background: linear-gradient(
          267deg,
          rgba(10, 11, 26, 1) 0%,
          rgba(10, 11, 26, 0.5942752100840336) 52%,
          rgba(10, 11, 26, 0) 100%
        );

        content: "";
        z-index: 1;
      }
    }
  }

  .slick__slider__item {
    img {
      cursor: pointer;
      transition: all 0.4s;
    }
    &:hover {
      img {
        opacity: 0.7;
      }
    }
  }

  @media only screen and (max-width: 991px) {
    padding-bottom: 80px;
  }
`;

export default PartnerStyleWrapper;
