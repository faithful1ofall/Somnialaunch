import styled from "styled-components";

const FeaturesStyleWrapper = styled.section`
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  margin: 0 20px;
  position: relative;
  z-index: 2;
  padding-top: 115px;
  padding-bottom: 105px;
  .key_points_conttent {
    margin-top: 50px;
    z-index: 1;
  }
  .key_points_item {
    &_img {
      img {
        min-height: 50px;
      }
      margin-bottom: 26px;
    }

    &_text {
      h4 {
        line-height: 27px;
        margin-bottom: 21px;
        color: #ffffff;
        text-transform: capitalize;
      }
      p {
        max-width: 90%;
      }
    }
  }

  @media only screen and (max-width: 991px) {
    .items-row {
      row-gap: 15px;
    }
  }
  @media only screen and (max-width: 767px) {
    padding: 100px 0;
    .key_points_item {
      &_text {
        h4 {
          font-size: 20px;
        }
        p {
          font-size: 15px;
        }
      }
    }
  }
`;

export default FeaturesStyleWrapper;
