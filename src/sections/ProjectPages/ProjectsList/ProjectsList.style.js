import styled from "styled-components";

const ProjectsListStyleWrapper = styled.section`
  height: auto;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  position: relative;

  .previous_projects {
    .section_title {
      margin-bottom: 50px;
    }
  }

  .section_heading {
    position: relative;
    display: flex;
    align-items: center;
    max-width: 333px;
    width: 100%;
    margin-bottom: 50px;
    z-index: 1;
    .title {
      margin: 0;
    }
  }
`;

export default ProjectsListStyleWrapper;
