import { useEffect, useState } from 'react';
import Styled from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/router';

import TopAppBarHome from '@/components/appBar/TopAppBarHome';

const Home = () => {
    const router = useRouter()

    useEffect(() => {
    }, [])

    return (
        <>
            {
                <TopAppBarHome />
            }
            <WrapBox>
                <h1>너도해 메인 페이지</h1>
                <h1>너도해</h1>
                <h1>너도해</h1>
                <h1>너도해</h1>
                <h1>너도해</h1>
                <h1>너도해</h1>
                <h1>너도해</h1>
                <h1>너도해</h1>
                <h1>너도해</h1>
                <h1>너도해</h1>
                <h1>너도해</h1>
                <h1>너도해</h1>
                <h1>너도해</h1>
                <h1>너도해</h1>
                <h1>너도해</h1>
                <h1>너도해</h1>
                <h1>너도해</h1>
                <h1>너도해</h1>
                <h1>너도해</h1>
            </WrapBox>
            <FooterDiv>
                <FooterContentDiv>
                    <FooterInfoDiv>
                        <FooterInfoTitle>{"연락처"}</FooterInfoTitle>
                        <FooterInfoDescription>{"이메일: ??????"}</FooterInfoDescription>
                        {/* <FooterInfoDescription>
                            {"웹사이트: "}
                            <a href="https://peterjeon.co.kr" target="_blank" rel="noopener noreferrer">https://peterjeon.co.kr</a>
                        </FooterInfoDescription> */}
                    </FooterInfoDiv>
                </FooterContentDiv>
            </FooterDiv>
        </>
    )
};

const WrapBox = Styled.div`
    width: 100%;
    display: inline-block;
    max-width: 1000px;
    padding-top: calc(80px + 100px);
    padding-bottom: 100px;
    min-height: 100vh;
`
const FooterDiv = Styled.div`
    padding: 20px;
    background-color: #f8f9fa;
    text-align: center;
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
    font-size: 30px;
    margin-bottom: 20px;
`
const FooterInfoDescription = Styled.div`
    font-size: 20px;
    margin-bottom: 10px;
    cursor: pointer;
`

export default Home;