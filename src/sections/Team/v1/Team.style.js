import styled from "styled-components";
import teamBg from "@assets/images/bg/team-bg.jpg";

const TeamStyleWrapper = styled.section`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  background: url(${teamBg.src});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  padding: 115px 0 85px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(26, 26, 46, 0.8) 0%, rgba(22, 33, 62, 0.8) 100%);
    z-index: 1;
  }

  .section_title {
    text-align: center;
    margin-bottom: 55px;
    position: relative;
    z-index: 2;
  }
  
  .container {
    position: relative;
    z-index: 2;
  }
`;

export default TeamStyleWrapper;
