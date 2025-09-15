import styled from "styled-components";

const ContactStyleWrapper = styled.div`
  padding-top: 56px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding-bottom: 140px;

  .contact_info_title {
    font-size: 22px;
    line-height: 40px;
    text-transform: uppercase;
    color: #ffffff;
  }

  .contact_info_item {
    display: flex;
    align-items: baseline;
    column-gap: 20px;

    h6 {
      font-size: 16px;
      color: #ffffff;
      margin-bottom: 15px;
      text-transform: uppercase;
    }

    p {
      margin-bottom: 5px;
    }

    a {
      color: #6d4afe;
    }
  }

  .contact_info_item + .contact_info_item {
    margin-top: 20px;
  }

  @media only screen and (max-width: 767px) {
    .contact_info {
      margin-top: 40px;
    }
  }
`;

export default ContactStyleWrapper;
