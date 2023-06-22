import { useEffect, useState } from 'react';
import Styled from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/router';

import TopAppBar from '@/components/appBar/TopAppBar';

const termsOfService = `너도해 서비스 이용약관:

제1장 총칙

제1조 (목적)
이 약관은 "너도해" 서비스(이하 "서비스")를 운영하는 전현빈(이하 "운영자")와 이를 이용하는 사용자간의 권리, 의무, 책임, 서비스 이용조건과 절차 등 기본적인 사항을 규정함을 목적으로 합니다.

제2조 (용어의 정의)
1. "사용자"란 "서비스"에 접속하여 이 약관에 따라 "운영자"가 제공하는 "서비스"를 이용하는 자를 말합니다.
2. "룸메이트"란 "서비스"를 함께 이용하는 사용자를 말합니다.

제2장 서비스 이용

제3조 (서비스 제공)
1. 운영자는 사용자에게 다음과 같은 서비스를 제공합니다:
   - 룸메이트간 스케줄 관리
   - 룸메이트 할일 관리
   - 룸메이트간 채팅 기능
   - 푸시 알림 서비스
2. 운영자는 서비스의 내용을 추가, 변경할 수 있습니다. 변경된 서비스의 내용 및 제공일자 등은 운영자가 정하는 바에 따라 이를 공지함으로써 효력이 발생합니다.

제3장 사용자의 의무

제4조 (이용자의 의무)
사용자는 이 약관에서 규정하는 사항, 운영자가 공지한 사항, 서비스 이용안내 및 주의사항 등을 준수하여야 합니다. 

제4장 기타

제5조 (분쟁의 해결)
이 약관에 관한 분쟁은 대한민국 법을 기준으로 해결합니다.

`;

const Terms = () => {

    return (
        <>
        {
            <TopAppBar title="서비스 이용약관"/>
        }
        <WrapBox>
            <TermsText>{termsOfService}</TermsText>
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
const TermsText = Styled.div`
    width: 100%;
    padding: 20px;
    font-size: 14px;
    line-height: 1.5;
    white-space: pre-line;
    word-break: break-all;
    word-wrap: break-word;
    color: #333;
    font-weight: 400;
    letter-spacing: -0.02em;
    text-align: left;
`

export default Terms;