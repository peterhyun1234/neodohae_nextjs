import { useEffect, useState } from 'react';
import Styled from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/router';

import TopAppBarHome from '@/components/appBar/TopAppBarHome';

const Chat = () => {
    const router = useRouter()

    useEffect(() => {
    }, [])


    return (
        <>
            {
                <TopAppBarHome />
            }
            <WrapBox>
                <h1>너도해 Chat 페이지</h1>
                <h1>너도해 Chat 페이지</h1>
                <h1>너도해 Chat 페이지</h1>
                <h1>너도해 Chat 페이지</h1>
                <h1>너도해 Chat 페이지</h1>
                <h1>너도해 Chat 페이지</h1>
                <h1>너도해 Chat 페이지</h1>
                <h1>너도해 Chat 페이지</h1>
                <h1>너도해 Chat 페이지</h1>
                <h1>너도해 Chat 페이지</h1>
                <h1>너도해 Chat 페이지</h1>
                <h1>너도해 Chat 페이지</h1>
            </WrapBox>
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

export default Chat;