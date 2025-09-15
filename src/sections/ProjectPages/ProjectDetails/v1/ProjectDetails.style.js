import styled from "styled-components";

const ProjectDetailsStyleWrapper = styled.div`
  position: relative;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);

  .page_header_wrapper {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: auto;
  }

  .token_info_row {
    margin-top: 30px 0 55px;
    row-gap: 30px;
  }
`;

export default ProjectDetailsStyleWrapper;
