import { css } from "@emotion/css";

export const Reset = css`
  html,
  body {
    margin: 0 !important;
    padding: 0;
  }

  * {
    box-sizing: border-box;
  }
`;

export const Content = css`
  background-color: white;
`;

export const MobileStyles = css`
  display: flex;
  color: white;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  height: fit-content;
  width: 100vw;
`;

export const Card = css`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 40px auto;

  @media (min-width: 768px) {
    border-radius: 0;
  }

  button {
    margin-top: 50px;
  }
`;

export const Toggle = css`
  background-color: #d50152;
  border-radius: 4px;
  color: white;
  border: 0;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  outline: none;
  transition: all 0.25s linear;

  &:active {
    transform: scale(0.9);
  }
`;

export const modal = css`
  position: absolute;
  top: 30px;
  background-color: white;
  width: 100%;
  max-width: 700px;
  min-height: 100%;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`;

export const Sidebar = css`
  ${modal} top: 0;
  max-width: 300px;
  border-radius: 0;
  left: 0;
`;

export const CrazyStyle = css`
  ${modal} top: auto;
  min-height: 100%;
  width: 100%;
  max-width: 100%;
  display: flex;
  align-items: center;
`;

export const ModalElement = css`
  ${modal} text-align: center;

  @media (max-width: 767px) {
    width: 100%;
  }
`;

export const HugeList = css`
  ${modal} text-align: center;
  overflow: auto;

  @media (max-width: 767px) {
    width: 100%;
  }
`;

export const Container = css`
  margin: 0 auto;
  max-width: 100%;
  font-family: arial;
  max-width: 600px;
  padding: 48px 16px;

  @media (max-width: 767px) {
    padding: 80px 16px;
  }
`;

export const InfoComponent = css``;

export const Break = css`
  width: 100%;
  margin-bottom: 20px;
  margin-top: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`;

export const Code = css`
  background-color: rgba(0, 0, 0, 0.05);
  padding: 8px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
`;
