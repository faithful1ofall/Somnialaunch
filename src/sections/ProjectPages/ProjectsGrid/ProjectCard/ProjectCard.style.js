import bgShape from "@assets/images/bg/shape-bg.png";
import styled from "styled-components";

const ProjectCardStyleWrapper = styled.div`
  padding: 30px 30px 10px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  transition: all 0.4s;
  position: relative;
  z-index: 2;
  overflow: hidden;

  &::before {
    position: absolute;
    background: linear-gradient(135deg, rgba(163, 255, 18, 0.1) 0%, rgba(102, 126, 234, 0.1) 100%);
    height: 50px;
    width: 100%;
    left: 0px;
    bottom: 0px;
    content: "";
    border-radius: 0 0 16px 16px;
  }

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 20px auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

  .project-info {
    margin-bottom: 28px;
    column-gap: 20px;
    a {
      color: #ffffff;
    }

    .project-auother {
      h4 {
        margin-bottom: 10px;
      }
    }
  }

  .project-content {
    .project-header {
      position: relative;
      margin-bottom: 40px;

      &::before {
        position: absolute;
        width: 197px;
        height: 35px;
        background: url(${bgShape.src});
        background-position: center;
        background-repeat: no-repeat;
        left: -30px;
        top: 0px;
        content: "";
        z-index: 111;
      }
    }
    .heading-title {
      h4 {
        font-size: 16px;
        margin-bottom: 0;
        position: relative;
      }
    }
  }

  .project-listing {
    display: flex;
    flex-direction: column;
    row-gap: 15px;
    margin-bottom: 50px;
    li {
      display: flex;
      justify-content: space-between;
      span {
        color: #fff;
      }
    }
  }

  .social-links {
    display: flex;
    align-items: center;
    column-gap: 25px;
    padding-bottom: 4px;
    a {
      color: #b5b5ba;
      svg {
        font-size: 17px;
      }
      img {
        opacity: 0.6;
        height: 17px;
        transition: all 0.3s;
      }

      &:hover {
        color: #ffffff;
        img {
          opacity: 0.8;
        }
      }
    }
  }

  &:hover {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    border-color: rgba(163, 255, 18, 0.3);

    .card-hover-wrapper {
      opacity: 1;
      visibility: visible;
    }
  }

  @media only screen and (max-width: 1199px) {
    padding-left: 20px;
    padding-right: 20px;

    .project-info {
      .project-auother {
        h4 {
          font-size: 20px;
        }
      }
    }

    .project-content {
      .project-header {
        &::before {
          left: -20px;
        }
      }
    }
  }

  @media only screen and (max-width: 480px) {
    .project-info {
      flex-direction: column;
      row-gap: 20px;
    }
  }
  .collection-address a {
  display: inline-block;
  font-weight: bold;
  word-break: break-word;
}

/* Truncate address for mobile view */
@media (max-width: 768px) {
  .truncate-address {
    display: inline-block;
    max-width: 150px; /* Adjust width as needed */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
`;

export default ProjectCardStyleWrapper;
