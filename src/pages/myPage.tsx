import { useEffect, useState } from 'react';
import Styled from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';

import TopAppBarHome from '@/components/appBar/TopAppBarHome';
import BottomNavigation from '@/components/navigation/BottomNav';

const MyPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [user, setUser] = useState<any>(session?.user || null);

  useEffect(() => {
    if (!session) return;
    if (!session.user) return;
    setUser(session?.user);
  }, [session]);

  const handleSignOut = () => {
    signOut();
  };

  const handleEditProfile = () => {
    router.push('/profile');
  };

  const handleManageRoom = () => {
    router.push('/room/management');
  };

  const handleOtherRoom = () => {
    alert('기능 구현 예정입니다.');
    //TODO: 기존 방 정리 후 다른 방으로 이동
    // router.push('/room');
  };

  const handleDeleteUser = () => {
    alert('기능 구현 예정입니다.');
    //TODO: deleteUser(user);
  };

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
            <ProfileImgDiv>
              {user?.picture && (
                <ProfileImg src={user.picture} alt="User profile image" width={80} height={80} />
              )}
            </ProfileImgDiv>
            <UserName>{user?.username}</UserName>
            <Email>{user?.email}</Email>
            <Divider />
            <Button onClick={handleEditProfile}>개인정보수정</Button>
            <Button onClick={handleManageRoom}>룸 초대/관리</Button>
            <Button onClick={handleOtherRoom}>다른 룸 들어가기</Button>
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
    padding-top: 80px;
  }

  text-align: center;
`
const MyPageDiv = Styled.div`
  width: 100%;
  padding: 20px;
`
const ProfileImgDiv = Styled.div`
  display: flex;
  justify-content: center;
  align-items: baseline;
`
const ProfileImg = Styled(Image)`
  height: 80px;
  width: 80px;
  object-fit: cover;
  background-color: #fff;
  border-radius: 50%;
  border: solid 1px #9e9e9e;
  display: inline-block;
`
const UserName = Styled.div`
  font-size: 24px;
  font-weight: 500;
  margin-top: 10px;
`
const Email = Styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-top: 10px;
`
const Divider = Styled.div`
  width: 100%;
  height: 1px;
  background-color: #9e9e9e;
  margin: 20px 0;
`
const Button = Styled.button`
  display: block;
  width: 100%;
  max-width: 500px;
  font-size: 16px;
  font-weight: 500;
  height: 40px;
  margin: 15px auto;
  border: none;
  border-radius: 20px;
  background-color: #842d7d;
  color: #ffffff;
  cursor: pointer;

  &:hover {
    background-color: #682a69;
  }
`

export default MyPage;
