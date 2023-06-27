import { useEffect, useState } from 'react';
import Styled from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';

import BottomNavigation from '@/components/navigation/BottomNav';
import TopAppBar from '@/components/appBar/TopAppBar';

const Profile = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [user, setUser] = useState<any>(session?.user || null);

  useEffect(() => {
    if (!session) return;
    if (!session.user) return;
    setUser(session?.user);
  }, [session]);

  return (
    <>
      <TopAppBar title="나의 프로필" />
      <WrapBox>
        {user && (
          <MyPageDiv>
            <ProfileImgDiv>
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
          </MyPageDiv>
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

  text-align: center;
`;
const MyPageDiv = Styled.div`
  width: 100%;
  padding: 20px;
`;
const ProfileImgDiv = Styled.div`
  display: flex;
  justify-content: center;
  align-items: baseline;
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
`;

export default Profile;
