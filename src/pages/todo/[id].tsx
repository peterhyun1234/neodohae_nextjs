import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';

import TopAppBar from '@/components/appBar/TopAppBar';
import Styled from 'styled-components';
import LoadingPopup from '@/components/popup/LoadingPopup';

const TodoDetail = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <>
            <TopAppBar />
            <WrapBox>
                <h1>TODO 개별 페이지</h1>
                <h1>TODO 개별 페이지</h1>
                <h1>TODO 개별 페이지</h1>
                <h1>TODO 개별 페이지</h1>
                <h1>TODO 개별 페이지</h1>
                <h1>TODO 개별 페이지</h1>
                <h1>TODO 개별 페이지</h1>
                <h1>TODO 개별 페이지</h1>
                <h1>TODO 개별 페이지</h1>
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

export default TodoDetail;
