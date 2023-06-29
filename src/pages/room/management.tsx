import { useEffect, useState } from 'react';
import Styled from 'styled-components';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useCopyToClipboard } from 'react-use';
import axios from 'axios';

import TopAppBar from '@/components/appBar/TopAppBar';
import LoadingPopup from '@/components/popup/LoadingPopup';

import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';

const confirmation = `룸을 나가시면 룸에 저장한 데이터가 모두 삭제됩니다.
정말로 룸을 나가시겠습니까?`;

const RoomManagement = () => {
  const { data: session, update } = useSession();
  const router = useRouter();

  const [isCopied, copyToClipboard] = useCopyToClipboard();
  const [user, setUser] = useState<any>(session?.user || null);

  const getRoommates = async () => {
    if (!session) return;
    if (!user) return;
    const accessToken = (session as any)?.accessToken;
    if (!accessToken) return;
    const res = await axios.get(`/rooms/${user.roomId}/users`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data;
  };

  const leaveRoom = async () => {
    if (!session) return;
    if (!user) return;
    const accessToken = (session as any)?.accessToken;
    if (!accessToken) return;

    if (window.confirm(confirmation)) {
      const userId = user.id;
      const roomId = user.roomId;
      const res = await axios.delete(`/users/${userId}/rooms/${roomId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const updatedUser = res.data;
      if (
        updatedUser &&
        updatedUser.id !== undefined &&
        updatedUser.id !== null &&
        updatedUser.roomId === null
      ) {
        await update({ ...session, user: updatedUser });
        setUser(updatedUser);
      }
    }
  };

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

  const { data: roommates, isLoading } = useQuery('roommates', getRoommates, {
    enabled: !!user,
  });

  useEffect(() => {
    if (!session) return;
    if (!session.user) return;
    setUser(session?.user);
  }, [session]);

  return (
    <>
      {isLoading && <LoadingPopup />}
      <TopAppBar title="룸 초대/관리" />
      <WrapBox>
        {user !== null && user !== undefined && (
          <RoomManagementDiv>
            {roommates !== undefined &&
              roommates !== null &&
              roommates.length > 0 && (
                <>
                  <Section>
                    {/*TODO: 방이름 수정 */}
                    <RoomNameDiv>
                      <RoomName>{'🏠 ' + user.roomName}</RoomName>
                    </RoomNameDiv>
                  </Section>
                  <Section>
                    <RoommateDiv>
                      <RoommateTitle>{`${user.username}님과 함께 ${roommates.length}명이 함께하는 룸이에요.`}</RoommateTitle>
                      <RoommateListDiv>
                        {isLoading ? (
                          <LoadingPopup />
                        ) : (
                          roommates?.map((roommate: any, i: number) => (
                            <>
                              <Roommate key={roommate.id}>
                                <ProfileImg
                                  loader={() => roommate.picture}
                                  borderColor={
                                    roommate.color !== null &&
                                    roommate.color !== undefined
                                      ? roommate.color
                                      : '#fff'
                                  }
                                  src={roommate.picture}
                                  alt="roommate's picture"
                                  width={40}
                                  height={40}
                                />
                                <RoommateName>{roommate.username}</RoommateName>
                                {roommate.id === user.id && <Self>본인</Self>}
                              </Roommate>
                              {i !== roommates.length - 1 && <RoommateDivier />}
                            </>
                          ))
                        )}
                      </RoommateListDiv>
                    </RoommateDiv>
                  </Section>
                  <Section>
                    <Button onClick={handleCopyClick}>
                      {'룸코드 복사(초대)'}
                    </Button>
                  </Section>
                  <Section>
                    <Button onClick={() => leaveRoom()}>{'룸 나가기'}</Button>
                  </Section>
                </>
              )}
          </RoomManagementDiv>
        )}
      </WrapBox>
    </>
  );
};

const WrapBox = Styled.div`
  width: 100%;
  display: inline-block;
  max-width: 1000px;
  padding-top: calc(80px + 70px);
  padding-bottom: 100px;
  min-height: 100vh;

  @media (max-width: 650px) {
    padding-top: 70px;
  }
`;
const RoomManagementDiv = Styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 1rem;
`;
const Section = Styled.div`
  margin-bottom: 1rem;
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
  font-size: 1.2rem;
  font-weight: 600;
  color: #333333;
  line-height: 0px;
`;
const Self = Styled.div`
  font-size: 0.8rem;
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
const ProfileImg = Styled(Image)<{ borderColor: string }>`
  height: 40px;
  width: 40px;
  object-fit: cover;
  background-color: #fff;
  border-radius: 50%;
  border: solid 3px ${(props) => props.borderColor};
  display: inline-block;
`;
const RoommateDiv = Styled.div`
  margin-bottom: 3rem;
`;
const RoommateTitle = Styled.div`
  width: 100%;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
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

export default RoomManagement;
