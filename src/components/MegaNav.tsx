import React from 'react';
import styled from 'styled-components';
import Typography from './Typography'
import Divider from './Divider';
import Searchbox from './Searchbox'; 
import { Link } from 'react-router-dom';

interface MegaNavProps {
    onSearch?: (term: string) => void;
}

const MegaNav: React.FC<MegaNavProps> = ({ onSearch }) => {
    return (
        <Container>
            <NavWrapper>
                <ContactInfo>
                    <ContactItem>
                        <Typography fontSize={"12px"} color="#212121" fontWeight={"bold"}>LOCATION</Typography>
                        <Typography fontSize={"12px"} color='#5A5A5A'>Street 12345 - Johannesburg</Typography>
                    </ContactItem>
                    <Divider height="36px" />
                    <ContactItem>
                        <Typography fontSize={"12px"} color="#212121" fontWeight={"bold"}>CALL FREE</Typography>
                        <Typography fontSize={"12px"} color='#5A5A5A'>123 456 789 000</Typography>
                    </ContactItem>
                </ContactInfo>
                <LogoLink to="/">
                    <Logo src="https://www.dvt.co.za/images/25-years/dvt-gold-25-ribbon.svg" alt="DVT Logo" />
                </LogoLink>
                <RightContent>
                    <Searchbox onSearch={onSearch} />
                </RightContent>
            </NavWrapper>
        </Container>
    );
};

const Container = styled.div`
    background-color: #FFFFFF;
    border-bottom: 1px solid #ddd;
    position: relative;
`;

const NavWrapper = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
`;

const Logo = styled.img`
  height: 130px;
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 22px;
`;

const ContactItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

const RightContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export default MegaNav;
