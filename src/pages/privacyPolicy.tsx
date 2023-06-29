import { useEffect, useState } from 'react';
import Styled from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/router';

import TopAppBar from '@/components/appBar/TopAppBar';

const privacyPolicy = `너도해 개인정보처리방침:

제1조 (개인정보의 처리 목적)
"너도해"는 개인정보를 다음의 목적을 위해 처리합니다. 처리한 개인정보는 다음의 목적 이외의 용도로는 사용되지 않습니다.
- 회원 가입의사 확인, 회원제 서비스 제공 등

제2조 (개인정보의 처리 및 보유 기간)
1. "너도해"는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집시에 동의 받은 개인정보 보유, 이용기간 내에서 개인정보를 처리, 보유합니다.
2. 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.


   - 회원 가입 및 관리 : 서비스 이용계약 또는 회원가입 해지 시까지

제3조 (개인정보의 제3자 제공)
"너도해"는 원칙적으로 개인정보를 제3자에게 제공하지 않습니다. 단, 다음의 경우는 예외로 합니다.
- 사용자들이 사전에 동의한 경우
- 법령 등에 의한 경우

제4조 (개인정보처리 위탁)
"너도해"는 원칙적으로 개인정보 처리업무를 위탁하지 않습니다. 향후 그러한 필요가 생길 경우, 사전에 사용자들에게 고지하겠습니다.

제5조 (정보주체의 권리, 의무 및 행사방법)
사용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다.
- 개인정보 열람요구
- 오류 등이 있을 경우 정정 요구
- 삭제요구
- 처리정지 요구

제6조 (개인정보의 파기)
"너도해"는 원칙적으로 개인정보 처리목적이 달성된 경우에는 지체없이 해당 개인정보를 파기합니다. 파기의 절차, 기한 및 방법은 내부 방침에 따릅니다.

제7조 (개인정보 보호책임자)
"너도해"는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
- 이름 : 전현빈
- 연락처 : peterhyun1234@gmail.com(010-5404-7211)

`;

const PrivacyPolicy = () => {
    return (
        <>
            {
                <TopAppBar title="개인정보처리방침"/>
            }
            <WrapBox>
                <PolicyText>{privacyPolicy}</PolicyText>
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
    padding-top: 70px;
  }
`
const PolicyText = Styled.div`
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

export default PrivacyPolicy;