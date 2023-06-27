import { useEffect, useState } from 'react';
import Styled from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/router';

import TopAppBarHome from '@/components/appBar/TopAppBarHome';
import BottomNavigation from '@/components/navigation/BottomNav';

const ScheduleCreate = () => {
    const router = useRouter()

    useEffect(() => {
    }, [])


    return (
        <div style={
            {
                width: '100%',
                backgroundColor: '#FAFAFF',
            }
        }>
            {
                <TopAppBarHome />
            }
            <WrapBox>
                <h1>너도해 ScheduleCreate 페이지</h1>
                <h1>너도해 ScheduleCreate 페이지</h1>
                <h1>너도해 ScheduleCreate 페이지</h1>
                <h1>너도해 ScheduleCreate 페이지</h1>
                <h1>너도해 ScheduleCreate 페이지</h1>
                <h1>너도해 ScheduleCreate 페이지</h1>
                <h1>너도해 ScheduleCreate 페이지</h1>
                <h1>너도해 ScheduleCreate 페이지</h1>
                <h1>너도해 ScheduleCreate 페이지</h1>
                <h1>너도해 ScheduleCreate 페이지</h1>
                <h1>너도해 ScheduleCreate 페이지</h1>
                <h1>너도해 ScheduleCreate 페이지</h1>
            </WrapBox>
            {
                <BottomNavigation/>
            }
        </div>
    )
};

const WrapBox = Styled.div`
  width: 100%;
  display: inline-block;
  max-width: 1000px;
  padding-top: calc(80px + 70px);
  padding-bottom: 100px;
  min-height: 100vh;

  @media (max-width: 650px) {
    padding-top: 80px;
  }
`

export default ScheduleCreate;