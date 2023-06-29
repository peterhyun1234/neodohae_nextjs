import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Styled from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/router';
import moment from 'moment';

import TopAppBarHome from '@/components/appBar/TopAppBarHome';
import BottomNavigation from '@/components/navigation/BottomNav';
import LoadingPopup from '@/components/popup/LoadingPopup';
import WeeklyCalendar from '@/containers/schedule/WeeklyCalendar';
import MonthlyCalendar from '@/containers/schedule/MonthlyCalendar';

import PunchClockRoundedIcon from '@mui/icons-material/PunchClockRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

//TODO: 룸 내에 user별로 색깔 다르게 하기
// user 생성 시 룸 내 지정된 colors 아닌 color 랜덤 지정하면 될듯
const tempColors = [
  '#327bff',
  '#ff327b',
  '#da990e',
  '#00b179',
  '#bf32ff',
  '#0081bd',
  '#ff20b9',
  '#6d9c09',
];

const Schedule = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [user, setUser] = useState<any>(session?.user || null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [events, setEvents] = useState<any>([]);
  const [weeklyEvents, setWeeklyEvents] = useState<any>([]);

  const getEvents = () => {
    setEvents([
      {
        title: '전현빈 약속 1',
        groupId: '전현빈',
        start: '2023-06-22T10:30:00',
        end: '2023-06-26T11:30:00',
        backgroundColor: '#00b179',
      },
      {
        title: '전현빈 약속 2',
        groupId: '전현빈',
        start: '2023-06-26T14:00:00',
        end: '2023-06-26T15:00:00',
        backgroundColor: '#00b179',
      },
      {
        title: '목주영 약속 5',
        groupId: '목주영',
        start: '2023-06-22T10:30:00',
        end: '2023-06-27T11:30:00',
        backgroundColor: '#327bff',
      },
      {
        title: '목주영 약속 4',
        groupId: '목주영',
        start: '2023-06-22T10:30:00',
        end: '2023-06-27T11:30:00',
        backgroundColor: '#327bff',
      },
      {
        title: '목주영 약속 6',
        groupId: '목주영',
        start: '2023-06-22T10:30:00',
        end: '2023-06-27T11:30:00',
        backgroundColor: '#327bff',
      },
      {
        title: '목주영 약속 3',
        groupId: '목주영',
        start: '2023-06-22T10:30:00',
        end: '2023-06-27T11:30:00',
        backgroundColor: '#327bff',
      },
      {
        title: '목주영 약속 1',
        groupId: '목주영',
        start: '2023-06-27T10:30:00',
        end: '2023-06-27T11:30:00',
        backgroundColor: '#327bff',
      },
      {
        title: '목주영 약속 2',
        groupId: '목주영',
        start: '2023-06-28T14:00:00',
        end: '2023-06-28T15:00:00',
        backgroundColor: '#327bff',
      },
      {
        title: '홍솔 약속 1',
        groupId: '홍솔',
        start: '2023-06-18T14:00:00',
        end: '2023-06-29T15:00:00',
        backgroundColor: '#da990e',
      },
      {
        title: '홍솔 약속 2',
        groupId: '홍솔',
        start: '2023-06-22T14:00:00',
        end: '2023-06-24T15:00:00',
        backgroundColor: '#da990e',
      },
      {
        title: '홍솔 약속 2',
        groupId: '홍솔',
        start: '2023-06-27T14:00:00',
        end: '2023-06-28T15:00:00',
        backgroundColor: '#da990e',
      },
      {
        title: '홍솔 약속 2',
        groupId: '홍솔',
        start: '2023-06-28T14:00:00',
        end: '2023-06-28T15:00:00',
        backgroundColor: '#da990e',
      },
    ]);
  };

  useEffect(() => {
    if (events.length > 0) {
      const weeklyEvents = events.filter((event: any) => {
        const eventStart = moment(event.start);
        const eventEnd = moment(event.end);
        const weekStart = moment().startOf('week');
        const weekEnd = moment().endOf('week');
        return (
          (eventStart.isSameOrAfter(weekStart) &&
            eventStart.isSameOrBefore(weekEnd)) ||
          (eventEnd.isSameOrAfter(weekStart) &&
            eventEnd.isSameOrBefore(weekEnd))
        );
      });
      setWeeklyEvents(weeklyEvents);
    }
  }, [events]);

  useEffect(() => {
    if (!session) return;
    if (!session.user) return;
    setUser(session?.user);
    setIsLoading(false);
  }, [session]);

  useEffect(() => {
    getEvents();
  }, []);

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
          <TopAppBarHome roomInviteCode={user.roomInviteCode} />
          <WrapBox>
            <CalendarDiv>
              {weeklyEvents && (
                <>
                  <TitleDiv>
                    <Title>
                      {'한 주 '}
                      <RoomNameSpan>{user.roomName}</RoomNameSpan>
                      {' 스케줄'}
                    </Title>
                  </TitleDiv>
                  {weeklyEvents.length > 0 ? (
                    <WeeklyCalendar events={weeklyEvents} />
                  ) : (
                    <EmptyDiv>
                      <ScheduleIcon />
                      <EmptyText>
                        {'한 주 동안 예정된 스케줄이 없습니다.'}
                      </EmptyText>
                      <ScheduleAddText
                        onClick={() => {
                          router.push('/schedule/create');
                        }}
                      >
                        {'새로운 스케줄 등록'}
                      </ScheduleAddText>
                    </EmptyDiv>
                  )}
                </>
              )}
              {events && (
                <>
                  <TitleDiv>
                    <Title>
                      {'이번 달 '}
                      <RoomNameSpan>{user.roomName}</RoomNameSpan>
                      {' 스케줄'}
                    </Title>
                  </TitleDiv>
                  <MonthlyCalendar events={events} />
                </>
              )}
            </CalendarDiv>
          </WrapBox>
          <AddEventBtn
            onClick={() => {
              router.push('/schedule/create');
            }}
          >
            <AddIcon />
          </AddEventBtn>
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
const CalendarDiv = Styled.div`
  width: 100%;
  display: inline-block;
  padding: 20px 0;
`;
const TitleDiv = Styled.div`
  text-align: left;
  width: 100%;
  padding-left: 10px;
  margin-bottom: 20px;
`;
const Title = Styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #364a6d;
  @media (max-width: 650px) {
    font-size: 20px;
  }
`;
const RoomNameSpan = Styled.span`
    color: #7876fb;
`;
const EmptyDiv = Styled.div`
  width: calc(100% - 20px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: #fff;
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 80px;
  padding: 20px 0;
  box-shadow: rgba(0, 0, 0, 0.17) 0px 0px 2px 2px;
  @media (max-width: 650px) {
    margin-bottom: 40px;
  }
`;
const ScheduleIcon = Styled(PunchClockRoundedIcon)`
  color: #364a6d;
  font-size: 35px;
  margin-right: 10px;
`;
const EmptyText = Styled.div`
  font-size: 22px;
  color: #364a6d;
  word-break: keep-all;
  white-space: break-spaces;
  @media (max-width: 650px) {
    font-size: 20px;
  }
`;
const ScheduleAddText = Styled.div`
  font-size: 18px;
  color: #fff;
  background-color: #7876fb;
  box-shadow: rgba(0, 0, 0, 0.17) 0px 0px 2px 2px;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    background-color: #364a6d;
    color: #fff;
  }
  @media (max-width: 650px) {
    font-size: 16px;
  }
`;
const AddEventBtn = Styled.div`
  position: fixed;
  bottom: 100px;
  right: 100px;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: #7252ff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: rgba(0, 0, 0, 0.17) 0px 0px 2px 2px;
  cursor: pointer;
  z-index: 100;
  @media (max-width: 650px) {
    width: 50px;
    height: 50px;
    bottom: 90px;
    right: 20px;
  }
`;
const AddIcon = Styled(AddRoundedIcon)`
  font-size: 55px;
  color: #fff;
  @media (max-width: 650px) {
    font-size: 30px;
  }
`;

export default Schedule;
