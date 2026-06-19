import React from 'react';
import {
  HeaderContainer,
  GreetingSection,
  GreetingTitle,
  GreetingSubtitle,
  IconGroup,
  BackButton,
  BackText,
} from './Header.styles';
import { FaArrowLeft, FaMap, FaCog } from 'react-icons/fa';

const Header = ({ isMapScreen = false }) => {
  return (
    <HeaderContainer isMapScreen={isMapScreen}>
      <GreetingSection>
        <div>
          <GreetingTitle>Olá, João!</GreetingTitle>
          <GreetingSubtitle>
            Seu carro merece um cuidado especial.
          </GreetingSubtitle>
        </div>

        <IconGroup aria-label="Atalhos do cabeçalho">
          <FaMap />
          <FaCog />
        </IconGroup>
      </GreetingSection>

      <BackButton type="button" aria-label="Voltar para o mapa">
        <FaArrowLeft />
        <BackText>Mapa</BackText>
      </BackButton>
    </HeaderContainer>
  );
};

export default Header;
