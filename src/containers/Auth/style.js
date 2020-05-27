import styled from 'styled-components';
export const HeaderText = styled.div`
  font-weight: bold;
  font-size: ${(props) => (props.fontsize ? props.fontsize : '22px')};
  display: ${(props) => (props.display ? props.display : 'block')};
`;

export const ParaText = styled.p`
  font-weight: 500;
  font-size: ${(props) => (props.fontsize ? props.fontsize : '14px')};
  text-align: ${(props) => (props.center ? props.center : 'left')};
  color: ${(props) => (props.color ? props.color : 'inherit')};
`;
