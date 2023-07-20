import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Styled from 'styled-components';
import Image from 'next/image';
import axios from 'axios';

import TopAppBarNotification from '@/components/appBar/TopAppBarNotification';
import LoadingPopup from '@/components/popup/LoadingPopup';

import LOGO from '@/assets/images/neodohae_logo.png';

import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const VAPID_PUBLIC_KEY = publicRuntimeConfig.VAPID_PUBLIC_KEY;

const NotificationPage = () => {
  const { data: session } = useSession();

  const [user, setUser] = useState<any>(session?.user || null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [notificationList, setNotificationList] = useState<any>([]);

  const readAllNotifications = async () => {
    if (notificationList.filter((notification: any) => !notification.isRead).length === 0) {
      alert('이미 모든 알림을 읽으셨습니다.');
      return;
    }
    if (!session) return;
    const accessToken = (session as any)?.accessToken;
    if (!accessToken) return;

    try {
      const res = await axios.put(
        `/notifications/read/${user.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res) {
        if (res.status === 200) {
          getNotifications();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getNotifications = async () => {
    if (!session) return;
    const accessToken = (session as any)?.accessToken;
    if (!accessToken) return;

    try {
      const res = await axios.get(
        `/notifications/user/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res) {
        if (res.status === 200) {
          setNotificationList(res.data);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const requestNotificationPermissionAndSubscribe = async () => {
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') return;
  
    const serviceWorker = await navigator.serviceWorker.ready;
    const subscription = await serviceWorker.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: VAPID_PUBLIC_KEY,
    });

    if (!session) return;
    const accessToken = (session as any)?.accessToken;
    if (!accessToken) return;

    await axios.post(
        '/subscriptions',
        {
          userId: user.id,
          subscription: subscription,
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    );
  }

  useEffect(() => {
    const roomId = user?.roomId;
    if (!roomId) return;
    getNotifications();
    requestNotificationPermissionAndSubscribe();
  }, [user]);

  useEffect(() => {
    if (!session) return;
    if (!session.user) return;
    setUser(session?.user);
    setIsLoading(false);
  }, [session]);

  return (
    <>
      {isLoading && <LoadingPopup />}
      {<TopAppBarNotification title="알림" readAllNotifications={readAllNotifications}/>}
      <WrapBox>
          {
            notificationList && notificationList.length > 0 ?
            <NotificationList>
              {
                notificationList.map((notification: any) => {
                  return (
                    <NotificationItem key={notification.id} isRead={notification.isRead}>
                      <LogoBtn alt="Logo" src={LOGO}/>
                      <NotiInfoDiv>
                        <NotificationItemTitle>
                          {notification.title}
                        </NotificationItemTitle>
                        <NotificationItemBody>
                          {notification.body}
                        </NotificationItemBody>
                        <NotificationItemDate>
                          {notification.createdAt.toLocaleString()}
                        </NotificationItemDate>
                      </NotiInfoDiv>
                    </NotificationItem>
                  );
                })
              }
            </NotificationList>
            :
            <NoNotification>
              표시할 알림이 없습니다.
            </NoNotification>
          }
      </WrapBox>
    </>
  );
};

const WrapBox = Styled.div`
  width: 100%;
  display: inline-block;
  max-width: 600px;
  padding-top: calc(80px + 70px);
  padding-bottom: 100px;
  min-height: 100vh;

  @media (max-width: 650px) {
    padding-top: 70px;
  }
`;
const NotificationList = Styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
`;
const NotificationItem = Styled.div<{isRead: boolean}>`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e0e0e0;
  background-color: ${(props) => props.isRead ? '#ffffff' : '#e5e4ff'};
  cursor: pointer;
`;
const LogoBtn = Styled(Image)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #e0e0e0;
  background-color: #ffffff;
`;
const NotiInfoDiv = Styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 5px;
  margin-left: 15px;
`;
const NotificationItemTitle = Styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: keep-all;
`;
const NotificationItemBody = Styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #666666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: keep-all;
`;
const NotificationItemDate = Styled.div`
  font-size: 10px;
  font-weight: 400;
  color: #999999;
`;
const NoNotification = Styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  padding: 20px 0px;
`;



export default NotificationPage;
