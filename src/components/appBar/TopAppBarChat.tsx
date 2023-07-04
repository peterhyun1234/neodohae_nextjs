import React, { useState, useCallback, useRef, useEffect } from 'react';
import Styled from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCopyToClipboard } from 'react-use';

import Drawer from '@mui/material/Drawer';

import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded';

interface Props {
  title?: string;
  user?: any;
  roommates?: any;
}

const TopAppBarChat = ({ title, user, roommates }: Props) => {
  const router = useRouter();

  const [isCopied, copyToClipboard] = useCopyToClipboard();
  const [state, setState] = useState(false);

  const handleCopyClick = () => {
    if (!user) return;
    const roomInviteCode = user.roomInviteCode;
    if (!roomInviteCode) {
      alert('룸 초대 링크가 없습니다.');
      return;
    }
    copyToClipboard(roomInviteCode);
    if (isCopied) {
      alert('룸 초대 링크가 복사되었습니다. "' + roomInviteCode + '"');
    }
  };

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setState(open);
    };

  const groupDrawerList = () => {
    if (!user || !roommates) return;
    return (
      <GroupChatInfoDiv>
        <RoomNameDiv>
          <RoomName>{'🏠 ' + user.roomName}</RoomName>
        </RoomNameDiv>
        <RoommateDiv>
          <RoommateTitle>{`${user.username}님과 함께 ${roommates.length}명이 함께하는 룸이에요.`}</RoommateTitle>
          <RoommateListDiv>
            {roommates?.map((roommate: any, i: number) => (
              <>
                <Roommate key={roommate.id}>
                  <ProfileImg
                    loader={() => roommate.picture}
                    bordercolor={
                      roommate.color !== null && roommate.color !== undefined
                        ? roommate.color
                        : '#fff'
                    }
                    src={roommate.picture}
                    alt="roommate's picture"
                    width={30}
                    height={30}
                  />
                  <RoommateName>{roommate.username}</RoommateName>
                  {roommate.id === user.id && <Self>본인</Self>}
                </Roommate>
                {i !== roommates.length - 1 && <RoommateDivier />}
              </>
            ))}
          </RoommateListDiv>
        </RoommateDiv>
        <Button onClick={handleCopyClick}>{'룸코드 복사(초대)'}</Button>
      </GroupChatInfoDiv>
    );
  };

  return (
    <>
      <WrapBox>
        <AppBarDetailDiv>
          <AppBarLeftDiv>
            <ArrowBackDiv onClick={() => router.back()}>
              <ArrowBackIosNewRoundedIcon fontSize="inherit" color="inherit" />
            </ArrowBackDiv>
            {title && <TitleText>{title}</TitleText>}
          </AppBarLeftDiv>
          <AppBarCenterDiv></AppBarCenterDiv>
          <AppBarRightDiv>
            <GroupAddDiv onClick={toggleDrawer(true)}>
              <GroupAddRoundedIcon fontSize="inherit" color="inherit" />
            </GroupAddDiv>
          </AppBarRightDiv>
        </AppBarDetailDiv>
      </WrapBox>
      {
        <Drawer anchor={'right'} open={state} onClose={toggleDrawer(false)}>
          {groupDrawerList()}
        </Drawer>
      }
    </>
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
  width: calc(100% - 80px);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 25px;
`;
const AppBarCenterDiv = Styled.div`
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
const GroupAddDiv = Styled.div`
  height: 40px;
  width: 40px;
  background-color: #7876fb;
  border-radius: 50%;
  color: #fff;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: rgba(0, 0, 0, 0.17) 0px 0px 5px 3px;
  cursor: pointer;

  &:hover {
    background-color: #49489a;
  }
`;
const GroupChatInfoDiv = Styled.div`
  width: 100%;
  max-width: 300px;
  height: 100%;
  background-color: #fff;
  border-left: 1px solid #e0e0e0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
`;
const RoomNameDiv = Styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
`;
const RoomName = Styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333333;
  border-radius: 10px;
  padding: 3px 10px;
  box-shadow: rgb(231 206 255) 0px -3px 5px 0px inset;
`;
const Button = Styled.button`
  width: 100%;
  font-size: 1rem;
  font-weight: 600;
  padding: 12px 0;
  color: #fff;
  background-color: #7876fb;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #49489a;
  }
`;
const Roommate = Styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  padding-left: 1rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
`;
const RoommateName = Styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #333333;
  line-height: 0px;
`;
const Self = Styled.div`
  font-size: 0.6rem;
  font-weight: 600;
  color: #7876fb;
  padding: 0.1rem 0.3rem;
  border-radius: 5px;
  background-color: #fff;
  border: solid 1px #7876fb;
`;
const RoommateDivier = Styled.div`
  background-color: #eaeaea;
  height: 1px;
  width: 100%;
`;
const ProfileImg = Styled(Image)<{ bordercolor: string }>`
  height: 30px;
  width: 30px;
  object-fit: cover;
  background-color: #fff;
  border-radius: 50%;
  border: solid 2px ${(props) => props.bordercolor};
  display: inline-block;
`;
const RoommateDiv = Styled.div`
  margin-bottom: 3rem;
`;
const RoommateTitle = Styled.div`
  width: 100%;
  font-size: 0.8rem;
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 10px;
  color: #333333;
  background-color: #f2f2f2;
  text-align: center;
`;
const RoommateListDiv = Styled.div`
  width: 100%;
  padding: 1rem;
  border-radius: 15px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

export default TopAppBarChat;
