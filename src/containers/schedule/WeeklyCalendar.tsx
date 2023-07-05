import { useEffect, useState } from 'react';
import Styled from 'styled-components';
import { useRouter } from 'next/router';

import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import moment from 'moment';

interface Props {
  events: any;
}

const WeeklyCalendar = ({events}: Props) => {
  const router = useRouter();

  const hexToRgbA = (hex: string, alpha: number) => {
    const currentHex = hex || '#da990e';
    let c: any;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(currentHex)) {
      c = currentHex.substring(1).split('');
      if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(
        ',',
      )}, ${alpha})`;
    }
    throw new Error('Bad Hex');
  };

  return (
    <>
    {
      events && events.length > 0 &&
      <WrapBox>
        {events.map((event: any, index: number) => {
          return (
            <EventDiv
              key={index}
              bgColor={hexToRgbA(event.backgroundColor, 0.4)}
              onClick={() => {
                router.push(`/schedule/detail/${event.id}`);
              }}
            >
              <EventIconDiv bgColor={hexToRgbA(event.backgroundColor, 0.5)}>
                <EventAvailableRoundedIcon
                  color="inherit"
                  fontSize="inherit"
                />
              </EventIconDiv>
              <EventTitle>{event.title}</EventTitle>
              <EventUser>{event.groupId + '님'}</EventUser>
              <EventTime>
                {moment(event.start).format('MM/DD HH:mm')} ~{' '}
              </EventTime>
              <EventTime>
                {moment(event.end).format('MM/DD HH:mm')}
              </EventTime>
            </EventDiv>
          );
        })}
      </WrapBox>
    }
    </>
  );
};

const WrapBox = Styled.div`
  width: 100%;
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  padding-left: 20px;
  padding-top: 2px;
  padding-bottom: 2px;
  margin-bottom: 80px;
  @media (max-width: 650px) {
    margin-bottom: 40px;
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;
const EventDiv = Styled.div<{ bgColor: string }>`
  min-width: 150px;
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
  padding: 15px;
  margin-right: 14px;
  border-radius: 15px;
  background-color: ${(props) => props.bgColor};
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  box-shadow: rgba(0, 0, 0, 0.17) 0px 0px 2px 2px;
`;
const EventIconDiv = Styled.div<{ bgColor: string }>`
  width: 50px;
  height: 50px;
  font-size: 35px;
  margin-bottom: 10px;
  border-radius: 15px;
  background-color: ${(props) => props.bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
`;
const EventTitle = Styled.div`
  overflow: hidden;
  text-align: left;
  font-size: 15px;
  font-weight: 700;
  color: #343434;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 7px;
`;
const EventUser = Styled.div`
  text-align: left;
  font-size: 14px;
  color: #515151;
  margin-bottom: 5px;
`;
const EventTime = Styled.div`
  text-align: left;
  font-size: 14px;
  color: #515151;
`;

export default WeeklyCalendar;
