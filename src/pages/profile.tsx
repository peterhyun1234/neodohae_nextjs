import { useEffect, useState } from 'react';
import Styled from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/router';
import axios from 'axios';
import { signOut, useSession } from 'next-auth/react';

import BottomNavigation from '@/components/navigation/BottomNav';
import TopAppBar from '@/components/appBar/TopAppBar';

import TextField from '@mui/material/TextField';

const Profile = () => {
  const { data: session, update } = useSession();
  const router = useRouter();

  const [user, setUser] = useState<any>(session?.user || null);

  const [changingName, setChangingName] = useState<string>('');
  const [isReadyToEdit, setIsReadyToEdit] = useState<boolean>(false);

  const changeName = async (name: string) => {
    if (!name || name === '' || name.length > 8) {
      alert('이름은 1글자 이상 8글자 이하로 설정해주세요.');
      return;
    }

    if (!session) return;
    if (!user) return;
    const accessToken = (session as any)?.accessToken;
    if (!accessToken) return;

    const userId = user.id;
    const res = await axios.put(
      `/users/id/${userId}`,
      { username: name },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (res) {
      if (res.status === 200) {
        const updatedUser = user;
        updatedUser.username = name;
        await update({ ...session, user: updatedUser });
        setUser(updatedUser);
        setIsReadyToEdit(false);
        setChangingName('');
      }
    }
  };

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
            {isReadyToEdit ? (
              <UserNameDiv>
                <TextField
                  label="이름"
                  variant="outlined"
                  value={changingName}
                  onChange={(e) => setChangingName(e.target.value)}
                />
                <EditButtonDiv
                  onClick={() => {
                    if (changingName === user.roomName) {
                      setIsReadyToEdit(false);
                      setChangingName('');
                      return;
                    }
                    changeName(changingName);
                  }}
                >
                  저장
                </EditButtonDiv>
              </UserNameDiv>
            ) : (
              <UserNameDiv>
                <UserName>{user?.username}</UserName>
                <EditButtonDiv
                  onClick={() => {
                    setIsReadyToEdit(true);
                    setChangingName(user.username);
                  }}
                >
                  이름 수정
                </EditButtonDiv>
              </UserNameDiv>
            )}
            <Email>{user?.email}</Email>
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
const UserNameDiv = Styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 20px;
  margin-bottom: 20px;
`;
const UserName = Styled.div`
  font-size: 24px;
  font-weight: 500;
`;
const Email = Styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-top: 10px;
`;
const EditButtonDiv = Styled.div`
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2px 7px;
  border-radius: 10px;
  background-color: #fff;
  color: #333333;
  font-size: 0.8rem;
  border: dashed 1px #0f0a0a;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f2f2f2;
  }
`;

export default Profile;
