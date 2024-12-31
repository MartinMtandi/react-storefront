import styled from 'styled-components';

interface PillProps {
  backgroundColor?: string;
  textColor?: string;
}

const Pill = styled.div<PillProps>`
  background-color: ${props => props.backgroundColor || '#C09578'};
  color: ${props => props.textColor || '#FFFFFF'};
  border-radius: 12px;
  padding: 3px 6px;
  font-size: 10px;
  font-weight: bold;
  min-width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default Pill;
