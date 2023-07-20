import { useEffect, useState } from 'react';
import Styled from 'styled-components';
import { useRouter } from 'next/router';

import PlaylistAddCheckRoundedIcon from '@mui/icons-material/PlaylistAddCheckRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

interface Props {
  events: any;
  todoStatusUpdate: any;
}

const VerticalTodoList = ({ events, todoStatusUpdate }: Props) => {
  const router = useRouter();

  return (
    <>
      {events && events.length > 0 && (
        <WrapBox>
          {events.map((event: any, index: number) => {
            const isDone = event.status === 'DONE';
            return (
              <EventDiv
                key={index}
                onClick={() => {
                  router.push(`/todo/detail/${event.id}`);
                }}
              >
                <EventIconDiv>
                  <PlaylistAddCheckRoundedIcon
                    color="inherit"
                    fontSize="inherit"
                  />
                </EventIconDiv>
                <EventInfoDiv>
                  <EventTitle>{event.title}</EventTitle>
                  <EventDescription>{event.description}</EventDescription>
                </EventInfoDiv>
                <EventStatusIconDiv isDone={isDone}>
                  {
                    isDone ?
                    <CheckRoundedIcon color="inherit" fontSize="inherit" />
                    :
                    <CompleteText onClick={(e) => {
                      e.stopPropagation();
                      todoStatusUpdate(event.id, 'DONE');
                    }}
                    >완료</CompleteText>
                  }
                </EventStatusIconDiv>
              </EventDiv>
            );
          }
          )}
        </WrapBox>
      )}
    </>
  );
};

const WrapBox = Styled.div`
  width: 100%;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 50px;
`;
const EventDiv = Styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0px 15px 40px 0px #EDEEFB;
  margin-bottom: 10px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    transform: scale(1.02);
  }
`;
const EventIconDiv = Styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 35px;
  height: 35px;
  font-size: 30px;
  color: #A1A3F6;
`;
const EventInfoDiv = Styled.div`
  width: calc(100% - 90px);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;
`;
const EventTitle = Styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #0F2851;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const EventDescription = Styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #898D9E;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const EventStatusIconDiv = Styled.div<{ isDone: boolean }>`
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: ${(props) => props.isDone ? '#58C6CD' : '#fff'};
  color: ${(props) => props.isDone ? '#fff' : '#585CE5'};
  border: 2px solid ${(props) => props.isDone ? '#B0B2C3' : '#585CE5'};
  font-size: 25px;
`;
const CompleteText = Styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #585CE5;
`;

export default VerticalTodoList;
