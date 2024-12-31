import styled from 'styled-components';

interface DividerProps {
  height?: string;
  $margin?: string;
}

const Divider = styled.div<DividerProps>`
  width: 1px;
  height: ${props => props.height || '16px'};
  background-color: #ddd;
  margin: ${props => props.$margin || '0'};
`;

export default Divider;
