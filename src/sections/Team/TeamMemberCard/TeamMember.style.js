import styled from "styled-components";

const TeamMemberStyleWrapper = styled.article`
  position: relative;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(5px);
  margin-bottom: 30px;
  padding: 35px 0 30px 0;
  text-align: center;
  transition: all 0.4s ease;

  &.team-item {
    img {
      margin-bottom: 45px;
      border-radius: 50%;
      transition: transform 0.3s ease;
    }
    .dsc {
      margin-bottom: 15px;
    }
  }
  .team-title {
    margin-bottom: 8px;
    a {
      color: #ffffff;
      transition: 0.4s;
    }
  }

  .team-icon-list {
    li {
      display: inline-block;
      padding: 0 7px;
      a {
        color: rgba(255, 255, 255, 0.5);
        transition: 0.4s;
        svg {
          font-size: 20px;
        }
      }
    }
  }

  &:hover {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    
    img {
      transform: scale(1.05);
    }
    
    .card-hover-wrapper {
      opacity: 1;
      visibility: visible;
    }
  }

  @media only screen and (max-width: 991px) {
    &.team-item {
      img {
        margin-bottom: 30px;
      }
    }
  }
  @media only screen and (max-width: 480px) {
    &.team-item {
      margin-bottom: 20px;
    }
  }
`;

export default TeamMemberStyleWrapper;
