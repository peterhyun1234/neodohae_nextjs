import { useEffect, useState } from 'react';
import Styled from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/router';

import TopAppBar from '@/components/appBar/TopAppBar';

const RoomManagement = () => {
    const router = useRouter()

    useEffect(() => {
    }, [])

    return (
        <>
            {
                <TopAppBar title='룸 초대/관리'/>
            }
            <WrapBox>
                <h1>너도해 RoomManagement 페이지</h1>
                <h1>- 룸 초대 영역: 룸코드 복사 버튼</h1>
                <h1>- 현재 룸메이트의 목록</h1>
                <h1>- 룸 나가기: 사람이 나갈 때 마지막이면 룸은 정리됨(룸 삭제는 no) + 해당 인원의 데이터들 정리 + /room 이둉</h1>
                <h1>- 다른 룸 들어가기: 나가는 것과 같은 로직 + /room/join 이둉</h1>
            </WrapBox>
        </>
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

export default RoomManagement;