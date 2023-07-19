import React, { useState, useCallback, useRef, useEffect } from 'react';
import Styled from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCopyToClipboard } from 'react-use';

import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';

const TopAppBarNotification = ({
  title,
  readAllNotifications,
}: {
  title?: string;
  readAllNotifications?: any;
}) => {
  const router = useRouter();

  return (
    <WrapBox>
      <AppBarDetailDiv>
        <AppBarLeftDiv>
          <ArrowBackDiv onClick={() => router.back()}>
            <ArrowBackIosNewRoundedIcon fontSize="inherit" color="inherit" />
          </ArrowBackDiv>
        </AppBarLeftDiv>
        <AppBarCenterDiv>
          {title && <TitleText>{title}</TitleText>}
        </AppBarCenterDiv>
        <AppBarRightDiv>
          <ReadAllNotifications
            onClick={() => {
              readAllNotifications();
            }}
          >
            전체 읽음 처리
          </ReadAllNotifications>
        </AppBarRightDiv>
      </AppBarDetailDiv>
    </WrapBox>
  );
};

const WrapBox = Styled.div`
    background-color: #ffffff;
    border-bottom: 1px solid #e0e0e0;
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
`;
const AppBarDetailDiv = Styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 1000px;
    padding-right: 16px;
    padding-left: 16px;
`;
const AppBarLeftDiv = Styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 25px;
`;
const AppBarCenterDiv = Styled.div`
    width: calc(100% - 140px);
    display: flex;
    justify-content: center;
    align-items: center;
`;
const AppBarDivider = Styled.div`
    width: 20px;
`;
const AppBarRightDiv = Styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 25px;
`;
const ArrowBackDiv = Styled.div`
    height: 40px;
    width: 40px;
    color: #333333;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const TitleText = Styled.div`
    font-size: 18px;
    font-weight: 500;
    color: #333333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;
const WhiteBox = Styled.div`
    height: 40px;
    width: 40px;
`;
const ReadAllNotifications = Styled.div`
    width: fit-content;
    padding: 3px 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 10px;
    font-weight: 600;
    color: #686868;
    background-color: #ffffff;
    border-radius: 10px;
    border: 1px solid #a5a5a5;
    cursor: pointer;
`;

export default TopAppBarNotification;
