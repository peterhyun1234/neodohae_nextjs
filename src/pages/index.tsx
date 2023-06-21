import { useEffect, useState } from 'react';
import Styled from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/router';

import TopAppBarHome from '@/components/appBar/TopAppBarHome';
import BottomNavigation from '@/components/navigation/BottomNav';

const Home = () => {
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
                <TempBoxdiv>오늘의 할일 표시 영역: 공동 TODO 할당 현황 표시</TempBoxdiv>
                <TempBoxdiv>캘린더 뷰 영역: 룸메이트들과의 일정 공유</TempBoxdiv>
                <TempBoxdiv>최근 채팅 리스트: 사용자와 룸메이트간의 채팅 리스트</TempBoxdiv>
            </WrapBox>
            <FooterDiv>
                <FooterContentDiv>
                    <FooterInfoDiv>
                        <FooterInfoTitle>{"연락처"}</FooterInfoTitle>
                        <FooterInfoDescription>{"관리자 이메일: peterhyun1234@gmail.com"}</FooterInfoDescription>
                        {/* <FooterInfoDescription>
                            {"웹사이트: "}
                            <a href="https://peterjeon.co.kr" target="_blank" rel="noopener noreferrer">https://peterjeon.co.kr</a>
                        </FooterInfoDescription> */}
                    </FooterInfoDiv>
                </FooterContentDiv>
            </FooterDiv>
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
  padding-top: calc(60px + 70px);
  padding-bottom: 100px;
  min-height: 100vh;

  @media (max-width: 650px) {
    padding-top: 60px;
  }
`
const FooterDiv = Styled.div`
    padding-top: 20px;
    background-color: #f8f9fa;
    border-top: 1px solid #e9ecef;
    text-align: center;
    padding-bottom: 100px;
`
const FooterContentDiv = Styled.div`
    max-width: 1000px;
    margin: auto;
`
const FooterInfoDiv = Styled.div`
    margin-top: 30px;
    margin-bottom: 30px;
`
const FooterInfoTitle = Styled.div`
    font-weight: bold;
    font-size: 20px;
    margin-bottom: 20px;
`
const FooterInfoDescription = Styled.div`
    font-size: 20px;
    margin-bottom: 10px;
    cursor: pointer;
`
const TempBoxdiv = Styled.div`
    width: calc(100% - 40px);
    padding-top: 150px;
    padding-bottom: 150px;
    background-color: #ffffff;
    margin: 30px 20px 0px 20px;
    border-radius: 15px;
    box-shadow: rgba(0, 0, 0, 0.17) 0px 0px 5px 3px;
    border: 1px dashed #327bff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    font-weight: bold;
    color: #327bff;
`

export default Home;