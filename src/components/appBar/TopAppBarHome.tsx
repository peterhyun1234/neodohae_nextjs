import React, { useState, useCallback, useRef, useEffect } from 'react';
import Styled from 'styled-components'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useCopyToClipboard } from 'react-use';

import LOGO from '@/assets/images/neodohae_logo.png';
import LOGO_TEXT from '@/assets/images/neodohae_logo_text.png';

import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

interface Props {
    roomInviteCode?: string
}

const TopAppBarHome = ({roomInviteCode}: Props) => {
    const router = useRouter();

    const [pageYOffset, setPageYOffset] = useState<any>(0);
    const [innerWidth, setInnerWidth] = useState<any>(1000);
    const [isCopied, copyToClipboard] = useCopyToClipboard()

    const handleCopyClick = () => {
        if (!roomInviteCode) return
        copyToClipboard(roomInviteCode);
        if (isCopied) {
            alert('룸 초대 링크가 복사되었습니다. "' + roomInviteCode + '"')
        }
    }
    const onClickLogo = () => {
        router.push('/')
        scrollTo(0, 0)
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
                            {
                                roomInviteCode &&
                                <MenuBtnDiv onClick={handleCopyClick}
                                >
                                    <MenuBtnText>{"룸 초대"}</MenuBtnText>
                                    <ShareRoundedIcon fontSize='inherit' color='inherit' />
                                </MenuBtnDiv>
                            }
                            <MenuBtnDiv onClick={() => router.push('/notification')}
                            >
                                <NotificationsNoneRoundedIcon fontSize='inherit' color='inherit' />
                            </MenuBtnDiv>
                        </AppBarRightDiv>
                    </AppBarDetailDiv>
                    :
                    <AppBarDetailDiv>
                        <AppBarLeftDiv>
                            <LogoTextBtn alt="Logo" src={LOGO_TEXT} onClick={() => onClickLogo()} />
                            <AppBarDivider />
                            <MenuBtn 
                                isSelected={router.pathname === '/todo'}
                                onClick={() => router.push('/todo')}
                            >To-Do 확인</MenuBtn>
                            <MenuBtn
                                isSelected={router.pathname === '/schedule'}
                                onClick={() => router.push('/schedule')}
                            >룸메 일정 확인</MenuBtn>
                            <MenuBtn
                                isSelected={router.pathname === '/chat'}
                                onClick={() => router.push('/chat')}
                            >룸 채팅</MenuBtn>
                        </AppBarLeftDiv>
                        <AppBarCenterDiv>
                        </AppBarCenterDiv>
                        <AppBarRightDiv>
                            {
                                roomInviteCode &&
                                <MenuBtnDiv onClick={handleCopyClick}
                                >
                                    <MenuBtnText>{"룸 초대"}</MenuBtnText>
                                    <ShareRoundedIcon fontSize='inherit' color='inherit' />
                                </MenuBtnDiv>
                            }
                            <MenuBtnDiv onClick={() => router.push('/notification')}
                            >
                                <NotificationsNoneRoundedIcon fontSize='inherit' color='inherit' />
                            </MenuBtnDiv>
                            <MenuBtnDiv onClick={() => router.push('/myPage')}
                            >
                                <PersonRoundedIcon fontSize='inherit' color='inherit' />
                            </MenuBtnDiv>
                        </AppBarRightDiv>
                    </AppBarDetailDiv>
            }
        </WrapBox>
    )
};

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
    
    @media(max-width: 650px) {
        height: 70px;
    }
`
const LogoBtn = Styled(Image)`
    width: 40px;
    height: 40px;
`
const LogoTextBtn = Styled(Image)`
    width: 100px;
    height: 40px;
`
const AppBarDetailDiv = Styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 1000px;
    padding-right: 25px;
    padding-left: 25px;
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
const MenuBtnDiv = Styled.div`
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    color: #666666;
    background-color: #ffffff;
    border-radius: 10px;
    font-size: 23px;
    padding-left: 5px;
    padding-right: 5px;
    box-shadow: rgba(0, 0, 0, 0.17) 0px 0px 5px 3px;
    cursor: pointer;
`
const MenuBtnText = Styled.div`
    font-size: 17px;
    font-weight: 500;
    color: inherit;
`
const MenuBtn = Styled.div<{ isSelected: boolean }>`
    ${props => props.isSelected === true && `background: linear-gradient(65deg, rgba(153,196,190,1) 0%, rgba(1,99,49,1) 33%, rgba(25,153,149,1) 70%, rgba(2,129,154,1) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;`}
    font-size: 16px;
    font-weight: 500;
    color: #333;
    word-spacing: -2px;
    cursor: pointer;
    &:hover {
        font-size: 17px;
        font-weight: 600;
        background: linear-gradient(65deg, rgba(153,196,0,1) 0%, rgba(1,99,49,1) 33%, rgba(25,153,149,1) 70%, rgba(2,129,154,1) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
`

export default TopAppBarHome;