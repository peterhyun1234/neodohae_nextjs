import { useEffect, useState, useRef, FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import Styled from 'styled-components';
import axios from 'axios';
import { useRouter } from 'next/router';
import { io } from 'socket.io-client';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

import TopAppBar from '@/components/appBar/TopAppBar';

const API_SERVER_URI = publicRuntimeConfig.API_SERVER_URI;

const Chat = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const messageEndRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<any>(session?.user || null);

  const [socket, setSocket] = useState<any>(null);
  const [message, setMessage] = useState<any>('');
  const [messages, setMessages] = useState<any>([]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const newSocket = io(API_SERVER_URI + '/chat');
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!session) return;
    const accessToken = (session as any)?.accessToken;
    if (!accessToken) return;
    axios
      .get('/messages', {
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
  }, []);

  useEffect(() => {
    if (socket == null) return;
    socket.on('newMessage', (message: any) => {
      setMessages((oldMsgs: any) => [...oldMsgs, message]);
    });

    return () => {
      socket.off('newMessage');
    };
  }, [socket]);

  const sendMessage = (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;

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
    const sedingMessage = {
        senderId,
        roomId,
        content: message,
    };
    socket.emit('message', sedingMessage);
    setMessage('');
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (!session) return;
    if (!session.user) return;
    setUser(session?.user);
  }, [session]);

  return (
    <div style={{ width: '100%', backgroundColor: '#FAFAFF' }}>
      <TopAppBar title={'🏠 ' + '우리 집'}/>
      <WrapBox>
        {messages.map(
          (
            msg: any,
            idx: string,
          ) => (
            <Message 
              key={idx} 
              isMine={user.id === msg.senderId}
            >
              {msg.content}
            </Message>
          ),
        )}
        <div ref={messageEndRef} />
        <ChatInput onSubmit={sendMessage}>
          <MessageInput
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
          />
          <SendButton type="submit">전송</SendButton>
        </ChatInput>
      </WrapBox>
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
  padding: 20px;
  min-height: 100vh;
  margin: 0 auto;
  flex-grow: 1;
  flex-shrink: 1;
`;
const ChatInput = Styled.form`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const MessageInput = Styled.input`
  flex-grow: 1;
  margin-right: 10px;
  padding: 10px;
  border-radius: 4px;
`;
const SendButton = Styled.button`
  padding: 10px 20px;
  border-radius: 4px;
  background-color: #007BFF;
  color: #fff;
  font-weight: bold;
  border: none;
`;
const Message = Styled.p<{ isMine: boolean }>`
  align-self: ${props => props.isMine ? 'flex-end' : 'flex-start'};
  margin: 5px 0;
  padding: 10px;
  border-radius: 4px;
  background-color: ${props => props.isMine ? '#DCF8C6' : '#f8f8f8'};
  color: ${props => props.isMine ? '#000' : '#222'};
`;

export default Chat;
