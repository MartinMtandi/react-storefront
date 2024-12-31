import { Outlet, useOutletContext } from 'react-router-dom'
import Navbar from './GenericBanner'
import styled from 'styled-components'
import MegaNav from './MegaNav'
import { useState } from 'react'

type ContextType = { searchTerm: string };

function Layout() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <>
      <Navbar />
      <MegaNav onSearch={handleSearch} />
      <MainContainer>
        <Outlet context={{ searchTerm }} />
      </MainContainer>
    </>
  )
}

const MainContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 0;
`

export function useSearch() {
  return useOutletContext<ContextType>();
}

export default Layout
