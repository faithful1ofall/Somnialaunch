import styled from "styled-components";

const StatisticsCounterStyleWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  min-height: 158px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(5px);
  padding: 20px;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
  &::before,
  &::after {
    position: absolute;
    height: 5px;
    width: 50%;
    content: "";
    border-radius: 4px;
  }
  &::before {
    left: 0;
    top: 0;
    background: linear-gradient(
      90deg,
      rgba(163, 255, 18, 0.5) 0%,
      rgba(102, 126, 234, 0) 100%
    );
  }
  &::after {
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      rgba(102, 126, 234, 0) 0%,
      rgba(118, 75, 162, 0.5) 100%
    );
  }
  .counter-number {
    font-size: 22px;
    line-height: 45px;
    color: #6d4afe;
    text-transform: uppercase;
    margin-bottom: 0px;
  }

  .counter-title {
    font-size: 16px;
    line-height: 45px;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 0px;
  }
  @media only screen and (max-width: 767px) {
    .counter-row {
      row-gap: 30px;
    }

    .counter-title {
      font-size: 14px;
    }
    .counter-number {
      font-size: 18px;
    }
  }
`;

export default StatisticsCounterStyleWrapper;
