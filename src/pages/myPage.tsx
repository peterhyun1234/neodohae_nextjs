import { useEffect, useState } from 'react';
import Styled from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import axios from 'axios';

import TopAppBarHome from '@/components/appBar/TopAppBarHome';
import BottomNavigation from '@/components/navigation/BottomNav';

const deleteConfirmation = `정말로 탈퇴하시겠습니까?
탈퇴하시면 모든 정보가 삭제되며 복구할 수 없습니다.
`;

const MyPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [user, setUser] = useState<any>(session?.user || null);

  const handleSignOut = () => {
    signOut();
  };

  const handleEditProfile = () => {
    alert('기능 구현 예정입니다.');
    //TODO: edit profile
    // router.push('/profile');
  };

  const handleManageRoom = () => {
    router.push('/room/management');
  };

  const handleDeleteUser = () => {
    if (!confirm(deleteConfirmation)) return;

    deleteUser();
  };

  const deleteUser = async () => {
    if (!session) return;
    if (!user) return;
    const accessToken = (session as any)?.accessToken;
    if (!accessToken) return;

    const userId = user.id;
    await axios.delete(`/users/id/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    signOut();
  };

  useEffect(() => {
    if (!session) return;
    if (!session.user) return;
    setUser(session?.user);
  }, [session]);

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#FAFAFF',
      }}
    >
      <TopAppBarHome />
      <WrapBox>
        {user && (
          <MyPageDiv>
            <ProfileImgDiv onClick={handleEditProfile}>
              {user?.picture && (
                <ProfileImg
                  loader={() => user.picture}
                  src={user.picture}
                  alt="User profile image"
                  width={80}
                  height={80}
                />
              )}
            </ProfileImgDiv>
            <UserName>{user?.username}</UserName>
            <Email>{user?.email}</Email>
            <Divider />
            <Button onClick={handleEditProfile}>개인정보수정</Button>
            <Button onClick={handleManageRoom}>룸 초대/관리</Button>
            <Button onClick={handleSignOut}>로그아웃</Button>
            <Button onClick={handleDeleteUser}>탈퇴하기</Button>
          </MyPageDiv>
        )}
      </WrapBox>
      <BottomNavigation />
    </div>
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

  text-align: center;
`;
const MyPageDiv = Styled.div`
  width: 100%;
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
`;
const ProfileImgDiv = Styled.div`
  display: flex;
  justify-content: center;
  align-items: baseline;
  cursor: pointer;
`;
const ProfileImg = Styled(Image)`
  height: 80px;
  width: 80px;
  object-fit: cover;
  background-color: #fff;
  border-radius: 50%;
  border: solid 1px #9e9e9e;
  display: inline-block;
`;
const UserName = Styled.div`
  font-size: 24px;
  font-weight: 500;
  margin-top: 10px;
`;
const Email = Styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-top: 10px;
`;
const Divider = Styled.div`
  width: 100%;
  height: 1px;
  background-color: #9e9e9e;
  margin: 20px 0;
`;
const Button = Styled.button`
  display: block;
  width: 100%;
  font-size: 16px;
  font-weight: 600;
  padding: 12px 0;
  height: 40px;
  margin-bottom: 16px;
  border: none;
  border-radius: 10px;
  background-color: #7876fb;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #49489a;
  }
`;

export default MyPage;
