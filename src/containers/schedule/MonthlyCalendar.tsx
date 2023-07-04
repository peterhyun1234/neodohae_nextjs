import { useEffect, useState } from 'react';
import Styled from 'styled-components';
import { useRouter } from 'next/router';

import {
  EventApi,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
  formatDate,
} from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import koLocale from '@fullcalendar/core/locales/ko';

interface Props {
  events: any;
}

const MonthlyCalendar = ({ events }: Props) => {
  const router = useRouter();

  const handleEventClick = (clickInfo: EventClickArg) => {
    router.push(`/schedule/detail/${clickInfo.event.id}`);
  };

  const renderEventContent = (eventContent: EventContentArg) => {
    return (
      <EventContentDiv bgColor={eventContent.event.backgroundColor}>
        <EventContentTitle>{eventContent.event.title}</EventContentTitle>
      </EventContentDiv>
    );
  };

  return (
    <>
      {events && events.length > 0 && (
        <WrapBox>
          <FullCalendar
            timeZone="Asia/Seoul"
            locales={[koLocale]}
            locale="ko"
            plugins={[dayGridPlugin, timeGridPlugin]}
            headerToolbar={{
              left: 'title',
              center: '',
              right: 'prev,next',
            }}
            initialView="dayGridMonth"
            height={'700px'}
            editable={true}
            selectable={true}
            selectMirror={true}
            // dateClick={handleDateClick}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            eventBorderColor={'#fff'}
            events={events}
          />
        </WrapBox>
      )}
    </>
  );
};

const WrapBox = Styled.div`
  width: calc(100% - 10px);
  margin: 5px;
  padding: 20px 5px;
  border-top: 3px solid #7252ff;
  background-color: #fff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;
const EventContentDiv = Styled.div<{ bgColor: any }>`
  width: 100%;
  padding-top: 3px;
  padding-bottom: 3px;
  border-radius: 5px;
  background-color: ${(props) => props.bgColor || '#7252ff'};
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  @media (max-width: 650px) {
    font-size: 12px;
  }
`;
const EventContentTitle = Styled.div`
  overflow: hidden;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  text-overflow: ellipsis;
  white-space: normal;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: keep-all;
  @media (max-width: 650px) {
    font-size: 10px;
  }
`;

export default MonthlyCalendar;
