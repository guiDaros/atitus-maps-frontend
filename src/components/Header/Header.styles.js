import styled, { css } from 'styled-components';

export const HeaderContainer = styled.header`
  width: 100%;
  padding: 22px 20px 18px;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  background: linear-gradient(180deg, #0072bb 0%, #005b99 100%);
  box-shadow: 0 10px 18px rgba(0, 0, 0, 0.14);
  color: #ffffff;

  ${({ isMapScreen }) =>
    isMapScreen &&
    css`
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    `}

  @media (min-width: 768px) {
    padding: 26px 32px 22px;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
  }
`;

export const GreetingSection = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
`;

export const GreetingTitle = styled.h1`
  margin: 0;
  font-size: 1.35rem;
  line-height: 1.15;
  font-weight: 700;
  letter-spacing: -0.02em;

  @media (min-width: 768px) {
    font-size: 1.55rem;
  }
`;

export const GreetingSubtitle = styled.p`
  margin: 6px 0 0;
  font-size: 0.95rem;
  line-height: 1.35;
  font-weight: 400;
  opacity: 0.92;

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

export const IconGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding-top: 2px;
  font-size: 1.15rem;
  line-height: 1;

  svg {
    display: block;
  }
`;

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 18px;
  padding: 10px 16px;
  border: 0;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  color: #ffffff;
  font: inherit;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  transition: transform 0.15s ease, background-color 0.15s ease,
    box-shadow 0.15s ease;

  svg {
    font-size: 0.95rem;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.22);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.95);
    outline-offset: 2px;
  }

  @media (min-width: 768px) {
    margin-top: 20px;
    padding: 11px 18px;
  }
`;

export const BackText = styled.span`
  font-size: 0.95rem;
`;
