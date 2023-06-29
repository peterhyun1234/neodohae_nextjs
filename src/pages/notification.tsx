import { useEffect, useState } from 'react';
import Styled from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/router';

import TopAppBar from '@/components/appBar/TopAppBar';

const Notification = () => {
  useEffect(() => {}, []);

  return (
    <>
      {<TopAppBar title="알림" />}
      <WrapBox>
        <h1>너도해 Notification 페이지</h1>
        <h1>너도해 Notification 페이지</h1>
        <h1>너도해 Notification 페이지</h1>
        <h1>너도해 Notification 페이지</h1>
        <h1>너도해 Notification 페이지</h1>
        <h1>너도해 Notification 페이지</h1>
        <h1>너도해 Notification 페이지</h1>
        <h1>너도해 Notification 페이지</h1>
        <h1>너도해 Notification 페이지</h1>
        <h1>너도해 Notification 페이지</h1>
        <h1>너도해 Notification 페이지</h1>
        <h1>너도해 Notification 페이지</h1>
      </WrapBox>
    </>
  );
};

const WrapBox = Styled.div`
  width: 100%;
  display: inline-block;
  max-width: 1000px;
  padding-top: calc(80px + 70px);
  padding-bottom: 100px;
  min-height: 100vh;

  @media (max-width: 650px) {
    padding-top: 70px;
  }
`;

export default Notification;
