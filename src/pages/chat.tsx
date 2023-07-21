import { useEffect, useState, useRef, FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import Styled from 'styled-components';
import axios from 'axios';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { io } from 'socket.io-client';

import TopAppBarChat from '@/components/appBar/TopAppBarChat';
import LoadingPopup from '@/components/popup/LoadingPopup';

import SendIcon from '@mui/icons-material/Send';

import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const API_SERVER_URI = publicRuntimeConfig.API_SERVER_URI;

const Chat = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const messageEndRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<any>(session?.user || null);
  const [roommates, setRoommates] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [socket, setSocket] = useState<any>(null);
  const [message, setMessage] = useState<any>('');
  const [messages, setMessages] = useState<any>([]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getDayOfWeek = (date: Date) => {
    const day = date.getDay();
    const daysInKorean = ['일', '월', '화', '수', '목', '금', '토'];
    return daysInKorean[day] + '요일';
  };

  const formatMessageDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = getDayOfWeek(date);

    return `${year}년 ${month.toString().padStart(2, '0')}월 ${day
      .toString()
      .padStart(2, '0')}일 ${dayOfWeek}`;
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours < 12 ? '오전' : '오후';
    const formattedHours = hours < 12 ? hours : hours - 12;
    return `${period} ${formattedHours}:${minutes.toString().padStart(2, '0')}`;
  };

  const sendMessage = (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      alert('메시지를 입력해주세요.');
      return;
    }

    if (trimmedMessage.length > 255) {
      alert('메시지는 255자 이내로 입력해주세요.');
      return;
    }

    const senderId = user.id;
    const roomId = user.roomId;
    if (!senderId) {
      alert('로그인 후 메시지를 보낼 수 있습니다.');
      router.push('/auth/signin');
      return;
    }
    if (!roomId) {
      alert('룸에 입장한 상태에서 메시지를 보낼 수 있습니다.');
      router.push('/room');
      return;
    }
    const sendingMessage = {
      senderId,
      roomId,
      content: trimmedMessage,
    };
    socket.emit('message', sendingMessage);
    setMessage('');
  };

  const getRoommates = async (accessToken: string) => {
    const roomId = user.roomId;
    socket.emit('joinRoom', roomId);

    await axios
      .get(`/rooms/${roomId}/users`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setRoommates(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getMessages = async (accessToken: string) => {
    const roomId = user.roomId;
    await axios
      .get(`/messages/room/${roomId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setMessages(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    if (socket === null) return;
    socket.on('newMessage', (message: any) => {
      setMessages((oldMsgs: any) => [...oldMsgs, message]);
    });

    return () => {
      socket.off('newMessage');
    };
  }, [socket]);

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (!user) return;
    if (!user.id) return;
    if (!user.roomId) return;

    if (!session) return;
    const accessToken = (session as any)?.accessToken;
    if (!accessToken) return;

    if (socket === null) return;

    getRoommates(accessToken);
    getMessages(accessToken);
  }, [user, socket]);

  useEffect(() => {
    if (!session) return;
    if (!session.user) return;
    setUser(session?.user);
    setIsLoading(false);
  }, [session]);

  useEffect(() => {
    const newSocket = io(API_SERVER_URI + '/chat', {
      transports: ['websocket'],
    });
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <div style={{ width: '100%', backgroundColor: '#FAFAFF' }}>
      {isLoading && <LoadingPopup />}
      {user &&
        user.id &&
        user.roomName &&
        roommates &&
        roommates.length > 0 && (
          <>
            <TopAppBarChat
              title={'🏠 ' + user.roomName}
              user={user}
              roommates={roommates}
            />
            <WrapBox>
              {messages.map((msg: any, idx: number) => {
                const roommate = roommates.find(
                  (rm: any) => rm.id === msg.senderId,
                );
                const time = formatTime(new Date(msg.timestamp));
                const isMine = user.id === msg.senderId;
                const isProfileNeeded =
                  (!idx || messages[idx - 1].senderId !== msg.senderId) &&
                  roommate;

                const currentDate = formatMessageDate(new Date(msg.timestamp));
                const previousDate =
                  idx > 0
                    ? formatMessageDate(new Date(messages[idx - 1].timestamp))
                    : null;
                const isDateChanged = currentDate !== previousDate;

                return (
                  <div key={idx}>
                    {isDateChanged && <DateDivider>{currentDate}</DateDivider>}
                    <MessageDiv isMine={isMine}>
                      <Message isMine={isMine}>
                        {!isMine && (
                          <>
                            {isProfileNeeded ? (
                              <ProfileImg
                                loader={() => roommate.picture}
                                bordercolor={
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
                            ) : (
                              <WhiteBox />
                            )}
                          </>
                        )}
                        <MessageContentDiv isMine={isMine}>
                          {!isMine && isProfileNeeded ? (
                            <RoommateName>{roommate?.username}</RoommateName>
                          ) : null}
                          <MessageContent isMine={isMine}>
                            {msg.content}
                          </MessageContent>
                        </MessageContentDiv>
                      </Message>
                      <MessageTime>{time}</MessageTime>
                    </MessageDiv>
                  </div>
                );
              })}
              <div ref={messageEndRef} />
              <BottomNavBarChat>
                <ChatInput onSubmit={sendMessage}>
                  <MessageInput
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="메시지 보내기"
                  />

                  <SendButton
                    type="submit"
                    isReady={
                      message.length > 0 && message.length < 255 ? true : false
                    }
                  >
                    <SendIcon color="inherit" fontSize="inherit" />
                  </SendButton>
                </ChatInput>
              </BottomNavBarChat>
            </WrapBox>
          </>
        )}
    </div>
  );
};

const WrapBox = Styled.div`
  width: 100%;
  max-width: 1000px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-top: 80px;
  padding-bottom: calc(80px + env(safe-area-inset-bottom));
  padding-left: 20px;
  padding-right: 20px;
  min-height: 100vh;
  margin: 0 auto;
  flex-grow: 1;
  flex-shrink: 1;
`;
const BottomNavBarChat = Styled.div`
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 10px 20px;
  padding-bottom: calc(10px + env(safe-area-inset-bottom)); 
  background-color: #fff;
  border-top: 1px solid #ddd;
`;
const ChatInput = Styled.form`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const MessageInput = Styled.input`
  width: calc(100% - 80px);
  padding: 10px 20px;
  border-radius: 4px;
  background-color: #f5f5f5;
  border-radius: 15px;
  color: #555555;
  font-size: 15px;
  border: none;
  ::placeholder {
    color: #777777;
    font-size: 15px;
  }
`;
const SendButton = Styled.button<{ isReady: boolean }>`
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  color: ${(props) => (props.isReady ? '#7876fb' : '#999999')};
  font-size: 25px;
  border: none;
`;
const MessageDiv = Styled.div<{ isMine: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: ${(props) => (props.isMine ? 'row-reverse' : 'row')};
  align-items: flex-end;
  justify-content: flex-start;
  margin: 5px 0;
`;
const Message = Styled.div<{ isMine: boolean }>`
  max-width: ${(props) => (props.isMine ? '80%' : '70%')};
  display: flex;
  flex-direction: ${(props) => (props.isMine ? 'row-reverse' : 'row')};
  align-items: flex-start;
`;
const MessageContentDiv = Styled.div<{ isMine: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const MessageContent = Styled.p<{ isMine: boolean }>`
  text-align: ${(props) => (props.isMine ? 'right' : 'left')};
  padding: 10px;
  border-radius: 10px;
  font-size: 0.9em;
  font-weight: 500;
  word-break: break-all;
  background-color: ${(props) => (props.isMine ? '#7876fb' : '#f8f8f8')};
  color: ${(props) => (props.isMine ? '#fff' : '#222')};
`;
const ProfileImg = Styled(Image)<{ bordercolor: string }>`
  height: 40px;
  width: 40px;
  object-fit: cover;
  background-color: #fff;
  border-radius: 50%;
  border: solid 3px ${(props) => props.bordercolor};
  display: inline-block;
`;
const WhiteBox = Styled.div`
  height: 46px;
  width: 46px;
  background-color: #fff;
`;
const RoommateName = Styled.div`
  width: 100%;
  text-align: left;
  font-size: 0.8em;
  padding-left: 10px;
  font-weight: bold;
`;
const MessageTime = Styled.div`
  text-align: right;
  font-size: 0.6em;
  color: #888;
  margin: 0 10px;
`;
const DateDivider = Styled.div`
  width: fit-content;
  margin: 0 auto;
  background-color: rgba(0,0,0,0.3);
  text-align: center;
  color: #fff;
  font-size: 0.8em;
  font-weight: bold;
  border-radius: 5px;
  padding: 5px 13px;
  margin-bottom: 20px;
  margin-top: 20px;
`;

export default Chat;
