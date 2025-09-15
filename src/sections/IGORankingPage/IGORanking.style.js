import styled from "styled-components";

const IGORankingStyleWrapper = styled.div`
  padding: 120px 0 100px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);

  .ranking_list {
    display: block;
  }

  .ranking_list_item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 25px 20px;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    backdrop-filter: blur(5px);
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
    }

    li {
      position: relative;
      display: flex;
      align-items: center;
      width: 10%;
      height: 35px;
      color: #ffffff;
      &:nth-child(2) {
        width: 22%;
      }

      img {
        margin-right: 10px;
      }

      &::before {
        display: none;
        position: absolute;
        left: 0;
        top: -75px;
        content: attr(data-title);
        font-family: "Russo One", sans-serif;
        color: rgba(255, 255, 255, 0.7);
        font-weight: 400;
        text-transform: uppercase;
      }
    }

    &:nth-child(1) {
      li {
        &::before {
          display: block;
        }
      }
    }
  }

  .ranking_list_item + .ranking_list_item {
    margin-top: 10px;
  }

  @media only screen and (max-width: 991px) {
    padding-top: 100px;
    .ranking_list {
      display: flex;
      flex-wrap: wrap;
      column-gap: 10px;
      row-gap: 10px;
    }

    .ranking_list_item {
      width: calc(50% - 10px);
      flex-direction: column;
      align-items: flex-end;
      row-gap: 10px;
      margin: 0 !important;

      li {
        width: 100% !important;
        text-align: right;
        justify-content: flex-end;
        &::before {
          top: auto;
          font-size: 14px;
          display: block;
        }
      }
    }
  }

  @media only screen and (max-width: 767px) {
    .ranking_list_item {
      width: 100%;
    }
  }
  @media only screen and (max-width: 320px) {
    .ranking_list_item {
      li {
        font-size: 11px;
      }
    }
  }
`;

export default IGORankingStyleWrapper;
