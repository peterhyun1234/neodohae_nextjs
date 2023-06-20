import React, { useState, useCallback, useRef, useEffect } from 'react';
import Styled from 'styled-components'
import Image from 'next/image'
import { useRouter } from 'next/router'

import LOGO from '@/assets/images/neodohae_logo.png';

const TopAppBarHome = () => {
    const router = useRouter();

    const [pageYOffset, setPageYOffset] = useState<any>(0);
    const [innerWidth, setInnerWidth] = useState<any>(1000);

    const onClickLogo = () => {
        router.push('/')
    }

    const handleScroll = () => {
        const curScrollTop = window.pageYOffset
        setPageYOffset(curScrollTop)
    }

    const handleResize = () => {
        const curInnerWidth = window.innerWidth
        setInnerWidth(curInnerWidth)
    }

    useEffect(() => {
        //TODO: 스크롤 이벤트, 리사이즈 이벤트 media query로 대체
        setInnerWidth(window.innerWidth)
        setPageYOffset(window.pageYOffset)
        window.addEventListener('scroll', handleScroll)
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('scroll', handleScroll)
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <WrapBox scrollTop={pageYOffset}>
            {
                innerWidth <= 650 ?
                    <AppBarDetailDiv>
                        <AppBarLeftDiv>
                            <LogoBtn alt="Logo" src={LOGO} onClick={() => onClickLogo()} />
                        </AppBarLeftDiv>
                        <AppBarCenterDiv>
                        </AppBarCenterDiv>
                        <AppBarRightDiv>
                        </AppBarRightDiv>
                    </AppBarDetailDiv>
                    :
                    <AppBarDetailDiv>
                        <AppBarLeftDiv>
                            <LogoBtn alt="Logo" src={LOGO} onClick={() => onClickLogo()} />
                        </AppBarLeftDiv>
                        <AppBarCenterDiv>
                        </AppBarCenterDiv>
                        <AppBarRightDiv>
                        </AppBarRightDiv>
                    </AppBarDetailDiv>
            }
        </WrapBox>
    )
};

const LogoBtn = Styled(Image)`
    width: 100px;
    height: 40px;
`
const WrapBox = Styled.div<{ scrollTop: number }>`
    background-color: rgba(255, 255, 255, ${props => props.scrollTop >= 80 && props.scrollTop <= 160 ? (props.scrollTop - 80) / 80 : props.scrollTop > 160 ? 1 : 0});
    border-bottom: 1px solid rgba(0, 0, 0, ${props => props.scrollTop >= 80 && props.scrollTop <= 160 ? (props.scrollTop - 80) / 800 : props.scrollTop > 160 ? 0.1 : 0});
    height: 80px;
    width: 100%;
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 5;
`
const AppBarDetailDiv = Styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 1000px;
    padding-right: 16px;
    padding-left: 16px;
`
const AppBarLeftDiv = Styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 25px;
`
const AppBarCenterDiv = Styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`
const AppBarDivider = Styled.div`
    width: 20px;
`
const AppBarRightDiv = Styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 25px;
`

export default TopAppBarHome;