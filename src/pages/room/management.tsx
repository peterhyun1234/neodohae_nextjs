import { useEffect, useState } from 'react';
import Styled from 'styled-components';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useCopyToClipboard } from 'react-use';

import TopAppBar from '@/components/appBar/TopAppBar';
import axios from 'axios';
import LoadingPopup from '@/components/popup/LoadingPopup';

const confirmation = `룸을 나가시면 룸에 저장한 데이터가 모두 삭제됩니다.
정말로 룸을 나가시겠습니까?`;

const RoomManagement = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

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
      //TODO:
      alert('개발 중');
    }
  };

  const joinAnotherRoom = async () => {
    if (!session) return;
    if (!user) return;
    const accessToken = (session as any)?.accessToken;
    if (!accessToken) return;

    if (window.confirm(confirmation)) {
      //TODO:
      alert('개발 중');
    }
  };

  const handleCopyClick = () => {
    if (!user) return;
    console.log(user);
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
      <TopAppBar title="룸 초대/관리" />
      <WrapBox>
        {user !== null && user !== undefined && (
          <>
            <Section>
              <SubTitle>룸 초대 영역:</SubTitle>
              <Button onClick={handleCopyClick}>룸코드 복사 버튼</Button>
            </Section>
            <Section>
              <SubTitle>현재 룸메이트의 목록:</SubTitle>
              {isLoading ? (
                <LoadingPopup />
              ) : (
                roommates?.map((roommate: any) => (
                  <Roommate key={roommate.id}>
                    <p>{roommate.name}</p>
                    <p>{roommate.email}</p>
                    <ProfileImg
                      loader={() => roommate.picture}
                      src={roommate.picture}
                      alt="roommate's picture"
                      width={50}
                      height={50}
                    />
                  </Roommate>
                ))
              )}
            </Section>
            <Section>
              <SubTitle>다른 룸 들어가기:</SubTitle>
              <Button onClick={() => joinAnotherRoom()}>
                다른 룸 들어가기
              </Button>
            </Section>
            <Section>
              <SubTitle>룸 나가기:</SubTitle>
              <Button onClick={() => leaveRoom()}>룸 나가기</Button>
            </Section>
          </>
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
    padding-top: 80px;
  }
`;
const SubTitle = Styled.h2`
  font-size: 1.5rem;
  color: #666;
`;
const Button = Styled.button`
  font-size: 1rem;
  padding: 10px 20px;
  color: #fff;
  background-color: #0070f3;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;
const Section = Styled.div`
  margin-bottom: 2rem;
`;
const Roommate = Styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  
  & > p {
    margin-right: 1rem;
  }
`;
const ProfileImg = Styled(Image)`
  height: 50px;
  width: 50px;
  object-fit: cover;
  background-color: #fff;
  border-radius: 50%;
  border: solid 1px #9e9e9e;
  display: inline-block;
`;

export default RoomManagement;
