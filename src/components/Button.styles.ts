import styled, { css } from 'styled-components';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';

interface ButtonContainerProps {
  variant: ButtonVariant
};

const buttonVariats = {
  primary: 'purple',
  secondary: 'orange',
  danger: 'red',
  success: 'green'
};

export const ButtonContainer = styled.button<ButtonContainerProps>`
  width: 100px;
  height: 40px;
  border-radius: 0.25rem;
  border: 0;
  margin: 0.5rem;

  background-color: ${props => props.theme['green-500']};
  color: ${props => props.theme.white};

  /* ${props => {
    return css`background: ${buttonVariats[props.variant]}`
  }} */
`