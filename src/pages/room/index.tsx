import { useEffect, useState } from 'react';
import Styled from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/router';

import TopAppBarHome from '@/components/appBar/TopAppBarHome';

const Room = () => {
    const router = useRouter()

    useEffect(() => {
    }, [])


    return (
        <>
            {
                <TopAppBarHome />
            }
            <WrapBox>
                <h1>너도해 Room 페이지</h1>
                <h1>너도해 Room 페이지</h1>
                <h1>너도해 Room 페이지</h1>
                <h1>너도해 Room 페이지</h1>
                <h1>너도해 Room 페이지</h1>
                <h1>너도해 Room 페이지</h1>
                <h1>너도해 Room 페이지</h1>
                <h1>너도해 Room 페이지</h1>
                <h1>너도해 Room 페이지</h1>
                <h1>너도해 Room 페이지</h1>
                <h1>너도해 Room 페이지</h1>
                <h1>너도해 Room 페이지</h1>
            </WrapBox>
        </>
    )
};

const WrapBox = Styled.div`
  width: 100%;
  display: inline-block;
  max-width: 1000px;
  padding-top: calc(60px + 70px);
  padding-bottom: 100px;
  min-height: 100vh;

  @media (max-width: 650px) {
    padding-top: 60px;
  }
`

export default Room;