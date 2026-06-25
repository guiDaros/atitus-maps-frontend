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
  IconButton,
} from './Header.styles';
import { FaArrowLeft, FaMap, FaCog } from 'react-icons/fa';

const Header = ({ isMapScreen = false, onSettingsClick }) => {
  const { userName } = useAuth();
  const firstName = userName?.trim().split(/\s+/)[0] || 'Usuário';

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
          <IconButton type="button" aria-label="Ir para o mapa">
            <FaMap />
          </IconButton>
          <IconButton
            type="button"
            aria-label="Abrir configurações"
            onClick={onSettingsClick}
          >
            <FaCog />
          </IconButton>
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
