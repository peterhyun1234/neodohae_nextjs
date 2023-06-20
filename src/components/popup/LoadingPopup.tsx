import React from 'react';
import Styled from 'styled-components';
import Image from 'next/image';

import LOADING from '@/assets/images/loading.gif';


interface Props {
    loadingText?: string;
}

const LoadingPopup = ({loadingText}: Props) => {
    return (
        <Loading>
            <div>
                <LoadingImg src={LOADING} alt="LOADING"/>
                {
                    loadingText !== null && loadingText !== undefined &&
                    <LoadingText>{loadingText}</LoadingText>
                }
            </div>
        </Loading>
    )
}

const Loading = Styled.div`
    z-index: 99;
    position: fixed;
    width: 100%;
    height: 100%;
    min-width: 100vw;
    min-height: 100vh;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.3);
    &>div{
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        left: 50%;
    }
`
const LoadingImg = Styled(Image)`
    width: 200px;
    height: 200px;
`
const LoadingText = Styled.div`
    width: 100%;
    font-size: 24px;
    color: #ffffff;
    background-color: rgba(0,0,0,0.5);
    margin-top: 10px;
    font-weight: 500;
    padding: 5px;
    border-radius: 10px;
`


export default LoadingPopup
