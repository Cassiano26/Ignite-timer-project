import styled from 'styled-components';

interface ButtonContainerProps {
  variant: 'primary' | 'secondary' | 'danger' | 'success';
}

export const ButtonContainer = styled.button`
  width: 100px;
  height: 100px;
` 