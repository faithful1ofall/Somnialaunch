import styled from "styled-components";

const AboutStyleWrapper = styled.section`
    position: relative;
    padding-top: 188px;
    padding-bottom: 80px;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);

    .live_project_wrapper {
        position: absolute;
        width: 100%;
        height: auto;
        top: -152px;
        z-index: 99;
    }

    @media only screen and (max-width: 991px) {
        padding-top: 465px;
        padding-bottom: 45px;
         
    }
`
    



export default AboutStyleWrapper;