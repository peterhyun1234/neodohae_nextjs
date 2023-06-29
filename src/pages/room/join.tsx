import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Styled from 'styled-components';
import Image from 'next/image';

import LoadingPopup from '@/components/popup/LoadingPopup';

import LOGO from '@/assets/images/neodohae_logo_text.png';

import TextField from '@mui/material/TextField';
import axios from 'axios';

const RoomJoin = () => {
  const { data: session, update } = useSession();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isWantToCreateRoom, setIsWantToCreateRoom] = useState<boolean>(false);

  const [roomName, setRoomName] = useState<string>('');
  const [roomInviteCode, setRoomInviteCode] = useState<string>('');

  const createRoom = async (roomName: string) => {
    if (!session) return;
    const accessToken = (session as any)?.accessToken;
    if (!accessToken) return;
    const user: any = session.user;
    if (!user) return;

    setIsLoading(true);
    try {
      const res = await axios.post(
        '/rooms',
        { roomName },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const roomId = res.data.id;
      await userUpdate(roomId);
      setIsLoading(false);
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const enterToRoom = async (roomInviteCode: string) => {
    if (!session) return;
    const accessToken = (session as any)?.accessToken;
    if (!accessToken) return;

    setIsLoading(true);
    try {
      const res = await axios.get(`/rooms/inviteCode/${roomInviteCode}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const roomId = res.data.id;
      await userUpdate(roomId);
      setIsLoading(false);
    } catch (error) {
      console.error('Error entering room:', error);
    }
  };

  const userUpdate = async (roomId: number) => {
    if (!session) return;
    const user: any = session.user;
    if (!user) return;
    const accessToken = (session as any)?.accessToken;
    if (!accessToken) return;

    try {
      let res = await axios.put(
        `/users/id/${user.id}`,
        { roomId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      res = await axios.get(`/users/id/${user.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const currentUser = res.data;

      if (currentUser.roomId === null || currentUser.roomId === undefined) {
        throw new Error('Error updating user');
      }
      res = await axios.get(`/rooms/id/${currentUser.roomId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const currentRoom = res.data;

      const updatedUser = {
        ...currentUser,
        roomName: currentRoom.roomName,
        roomInviteCode: currentRoom.inviteCode,
      };

      await update({ ...session, user: updatedUser });
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  useEffect(() => {
    if (session) {
      const user: any = session.user;
      if (user.roomId !== null && user.roomId !== undefined) {
        router.push('/');
      }
    }
  }, [session]);

  return (
    <>
      {isLoading && <LoadingPopup />}
      <WrapBox>
        <RoomBox>
          <IntroBox>
            <LogoBox>
              <LogoBtn src={LOGO} alt="Logo" />
            </LogoBox>
          </IntroBox>
          <RoomEnterBox>
            {isWantToCreateRoom ? (
              <>
                <TextField
                  id="room-create"
                  label="방 이름"
                  variant="outlined"
                  placeholder="방 이름을 입력해주세요."
                  sx={{
                    width: '100%',
                    minWidth: '300px',
                    marginBottom: '20px',
                  }}
                  value={roomName}
                  onChange={(e) => {
                    if (e.target.value.length > 7) {
                      alert('방 이름은 7자 이하로 입력해주세요.');
                      return;
                    }
                    setRoomName(e.target.value);
                  }}
                />
                <RoomBtn
                  isActivated={
                    roomName !== '' &&
                    roomName !== undefined &&
                    roomName !== null
                  }
                  onClick={() => {
                    if (
                      roomName === '' ||
                      roomName === undefined ||
                      roomName === null
                    )
                      return;
                    createRoom(roomName);
                  }}
                >
                  {'방 만들기'}
                </RoomBtn>
                <RoomSuggestion
                  onClick={() => {
                    setIsWantToCreateRoom(false);
                  }}
                >
                  이미 다른 룸메의 방이 있으신가요?
                </RoomSuggestion>
              </>
            ) : (
              <>
                <TextField
                  id="room-invete-code"
                  label="룸 초대 코드"
                  variant="outlined"
                  placeholder="룸 초대 코드를 입력해주세요."
                  sx={{
                    width: '100%',
                    minWidth: '300px',
                    marginBottom: '20px',
                  }}
                  value={roomInviteCode}
                  onChange={(e) => {
                    setRoomInviteCode(e.target.value);
                  }}
                />
                <RoomBtn
                  isActivated={
                    roomInviteCode !== '' &&
                    roomInviteCode !== undefined &&
                    roomInviteCode !== null
                  }
                  onClick={() => {
                    if (
                      roomInviteCode === '' ||
                      roomInviteCode === undefined ||
                      roomInviteCode === null
                    )
                      return;
                    enterToRoom(roomInviteCode);
                  }}
                >
                  {'방 입장하기'}
                </RoomBtn>
                <RoomSuggestion
                  onClick={() => {
                    setIsWantToCreateRoom(true);
                  }}
                >
                  새로운 방을 만들고 싶으신가요?
                </RoomSuggestion>
              </>
            )}
          </RoomEnterBox>
        </RoomBox>
      </WrapBox>
    </>
  );
};

const WrapBox = Styled.div`
  z-index: 99;
  position: fixed;
  width: 100%;
  height: 100%;
  min-width: 100vw;
  min-height: 100vh;
  top: 0;
  left: 0;
  background: linear-gradient(
    to bottom right, 
    rgba(115, 186, 210, 0.8),
    rgba(231, 239, 243, 0.8),
    rgba(228, 121, 228, 0.8)
  );
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(9, 30, 66, 0.34);
  }
`;
const RoomBox = Styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: #ffffff;
	box-shadow: 5px 5px 10px rgba(19, 16, 16, 0.25);
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  left: 50%;
  @media (max-width: 650px) {
    width: 100%;
  }
`;
const IntroBox = Styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
	padding: 20px;
  border-bottom: 1px solid #999999;
`;
const LogoBox = Styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const LogoBtn = Styled(Image)`
  width: 160px;
  height: 64px;
	margin-bottom: 10px;
`;
const RoomEnterBox = Styled.div`
  width: 100%;
	padding: 30px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
`;
const RoomBtn = Styled.button<{ isActivated: boolean }>`
  width: 100%;
  height: 50px;
  border-radius: 10px;
  border: none;
  background-color: ${(props) => (props.isActivated ? '#73BAD2' : '#999999')};
  color: #ffffff;
  font-size: 18px;
  font-weight: 700;
  cursor: ${(props) => (props.isActivated ? 'pointer' : 'default')};
  &:hover {
    background-color: ${(props) => (props.isActivated ? '#73BAD2' : '#999999')};
  }
`;
const RoomSuggestion = Styled.div`
  width: 100%;
  height: 50px;
  border-radius: 10px;
  border: none;
  background-color: #ffffff;
  color: #999999;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: #ffffff;
  }
`;

export default RoomJoin;
