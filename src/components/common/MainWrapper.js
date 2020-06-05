import styled from 'styled-components';
export const MainWrapper = styled.div`
  margin: 10px auto;
  padding: ${(props) => (props.nopadding ? '0px' : '32px')};
`;
