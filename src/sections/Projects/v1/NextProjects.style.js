import styled from "styled-components";
import sectionBg from "@assets/images/bg/project-bg.jpg";
const NextProjectsStyleWrapper = styled.div`
  background: url(${sectionBg.src});
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  padding-top: 115px;
  padding-bottom: 105px;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  border-radius: 20px;
  margin: 0 20px;
  backdrop-filter: blur(10px);

  .single-project-row {
    row-gap: 30px;
  }

  @media only screen and (max-width: 991px) {
    padding: 75px 0; 
  }
`;

export default NextProjectsStyleWrapper;
