import styled from "styled-components";
import bannerBG from "@assets/images/bg/banner-bg.jpg";

const BannerStyleWrapper = styled.section`
  position: relative;
  overflow: hidden;
  padding: 170px 0 225px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 9;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: -1;
  }

  .banner-content {
    max-width: 700px;
    margin: 0 auto;
    position: relative;
    z-index: 1;

    .banner-icon {
      margin: 0 0 24px;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
    }

    .banner-title {
      margin: 0 0 20px;
      text-transform: uppercase;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
      background: linear-gradient(45deg, #fff, #a3ff12);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .description {
      color: #ffffff;
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 40px;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    }
  }

  .banner-btn {
    margin: 0 auto;
    transform: translateY(0);
    transition: transform 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
    }
  }

  @media only screen and (max-width: 991px) {
    padding: 150px 0 200px;
    .banner-content {
      .banner-title {
        margin: 0 0 20px;
        font-size: 40px;
      }
    }
  }

  @media only screen and (max-width: 767px) {
    .banner-content {
      .banner-title {
        font-size: 30px;
      }
    }
  }

  @media only screen and (max-width: 575px) {
    .banner-content {
      .banner-title {
        font-size: 28px;
        margin-bottom: 10px;
      }

      .description {
        font-size: 16px;
        margin: 0 0 30px;
      }
    }
  }

  @media only screen and (max-width: 480px) {
    padding-top: 120px;

    .banner-content {
      .banner-title {
        font-size: 24px;
      }
    }
  }
`;

export default BannerStyleWrapper;
