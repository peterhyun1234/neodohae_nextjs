import React from 'react';
import Styled from 'styled-components';
import { useRouter } from 'next/router';

import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';

const TopAppBar = ({
  title,
  deleteTodo,
}: {
  title?: string;
  deleteTodo: any;
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
          {deleteTodo !== undefined ? (
            <DeleteBtnDiv onClick={() => deleteTodo()}>
              <DeleteForeverRoundedIcon fontSize="inherit" color="inherit" />
            </DeleteBtnDiv>
          ) : (
            <WhiteBox />
          )}
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
    width: calc(100% - 120px);
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
const DeleteBtnDiv = Styled.div`
    height: 40px;
    width: 40px;
    color: #fff;
    background-color: #cd4d4d;
    border-radius: 50%;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: rgba(0,0,0,0.17) 0px 0px 5px 3px;
    cursor: pointer;
`;
const WhiteBox = Styled.div`
    height: 40px;
    width: 40px;
`;

export default TopAppBar;
