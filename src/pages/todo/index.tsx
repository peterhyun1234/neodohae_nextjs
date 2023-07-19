import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Styled from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/router';

import TopAppBarHome from '@/components/appBar/TopAppBarHome';
import BottomNavigation from '@/components/navigation/BottomNav';
import LoadingPopup from '@/components/popup/LoadingPopup';
import axios from 'axios';

const Todo = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [user, setUser] = useState<any>(session?.user || null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [notiNumToRead, setNotiNumToRead] = useState<any>(0);

  const getNotifications = async () => {
    if (!session) return;
    const accessToken = (session as any)?.accessToken;
    if (!accessToken) return;

    try {
      const res = await axios.get(`/notifications/user/${user.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res) {
        if (res.status === 200) {
          const notifications = res.data;
          let numToRead = 0;
          for (const noti of notifications) {
            if (!noti.isRead) {
              numToRead++;
            }
          }
          setNotiNumToRead(numToRead);
        }
      }
    } catch (error) {
      console.error('Error reading notifications:', error);
    }
  };

  useEffect(() => {
    if (!session) return;
    if (!user) return;
    getNotifications();
  }, [user]);

  useEffect(() => {
    if (!session) return;
    if (!session.user) return;
    setUser(session?.user);
    setIsLoading(false);
  }, [session]);

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#FAFAFF',
      }}
    >
      {isLoading && <LoadingPopup />}
      {user && user.id && user.roomName && (
        <>
          <TopAppBarHome
            roomInviteCode={user.roomInviteCode}
            notiNumToRead={notiNumToRead}
          />
          <WrapBox>
            <h1>너도해 Todo 페이지</h1>
            <h1>너도해 Todo 페이지</h1>
            <h1>너도해 Todo 페이지</h1>
            <h1>너도해 Todo 페이지</h1>
            <h1>너도해 Todo 페이지</h1>
            <h1>너도해 Todo 페이지</h1>
            <h1>너도해 Todo 페이지</h1>
          </WrapBox>
        </>
      )}
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
`;

export default Todo;
