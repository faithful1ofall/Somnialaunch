import styled from "styled-components";

const TeamDetailsStyleWrapper = styled.div`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding-top: 70px;
  padding-bottom: 140px;

  .left_content_thumb {
    width: 470px;
    height: 578px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    backdrop-filter: blur(15px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
  }

  .right_content {
    padding-left: 20px;

    p + p {
      margin-bottom: 17px;
    }
  }

  .member_title {
    font-size: 30px;
    line-height: 1.4;
    color: #ffffff;
    margin-bottom: 21px;
    text-transform: uppercase;

    span {
      display: block;
      font-size: 18px;
      color: rgba(255, 255, 255, 0.7);
      margin-top: 7px;
    }
  }

  .member_details {
    li {
      display: flex;
      font-size: 16px;
      align-items: center;
      strong {
        font-family: "Russo One", sans-serif;
        font-style: normal;
        font-weight: 500;
        line-height: 40px;
        width: 150px;
      }

      span {
        font-family: "Inter";
        line-height: 40px;
        color: #ffffff;
      }

      &.social_items {
        a {
          img {
            height: 18px;
            width: 18px;
          }
          &:hover {
            opacity: 0.6;
          }
        }

        a + a {
          margin-left: 20px;
        }
      }
    }
  }

  @media only screen and (max-width: 768px) {
    .left_content_thumb {
      max-width: auto !important;
      width: 100%;
      margin-bottom: 40px;
    }

    .right_content {
      padding: 0 15px 0 0;
    }
  }

  @media only screen and (max-width: 480px) {
    .member_title {
      font-size: 24px;
      span {
        font-size: 17px;
      }
    }

    .member_details {
      li {
        font-size: 14px;
        strong {
          width: 120px;
        }
      }
    }
  }
`;

export default TeamDetailsStyleWrapper;
