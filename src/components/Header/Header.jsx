import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
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
  const { userName } = useAuth();
  const firstName = userName ? userName.split(' ')[0] : 'Usuário';

  return (
    <HeaderContainer isMapScreen={isMapScreen}>
      <GreetingSection>
        <div>
          <GreetingTitle>{`Olá, ${firstName}!`}</GreetingTitle>
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
