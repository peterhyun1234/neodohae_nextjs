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
    //TODO: 이벤트 수정할지 삭제할 지 선택하는 모달 띄우기
    // - 그냥 각 이벤트 페이지로 이동하는게 나을듯
    // if (confirm(`이벤트를 정말 삭제하실건가요? '${clickInfo.event.title}'`)) {
    //   //TODO: delete event API needed
    //   clickInfo.event.remove();
    // }
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
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  text-overflow: ellipsis;
  white-space: nowrap;
  @media (max-width: 650px) {
    font-size: 12px;
  }
`;

export default MonthlyCalendar;
