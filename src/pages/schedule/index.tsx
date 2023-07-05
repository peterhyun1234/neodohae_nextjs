import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Styled from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/router';
import moment from 'moment';
import axios from 'axios';

import TopAppBarHome from '@/components/appBar/TopAppBarHome';
import BottomNavigation from '@/components/navigation/BottomNav';
import LoadingPopup from '@/components/popup/LoadingPopup';
import WeeklyCalendar from '@/containers/schedule/WeeklyCalendar';
import MonthlyCalendar from '@/containers/schedule/MonthlyCalendar';

import PunchClockRoundedIcon from '@mui/icons-material/PunchClockRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

const Schedule = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [user, setUser] = useState<any>(session?.user || null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [events, setEvents] = useState<any>([]);
  const [weeklyEvents, setWeeklyEvents] = useState<any>([]);

  const transformEvents = (before: any) => {
    const after = [];

    for (const user of before.users) {
      for (const schedule of user.schedules) {
        after.push({
          id: schedule.id,
          title: schedule.title,
          groupId: user.username,
          start: schedule.startTime,
          end: schedule.endTime,
          backgroundColor: user.color,
        });
      }
    }

    return after;
  }

  const getEvents = async (roomId: number) => {
    if (!session) return;
    const accessToken = (session as any)?.accessToken;
    if (!accessToken) return;

    setIsLoading(true);
    try {
      const res = await axios.get(
        `/rooms/${roomId}/schedules`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res) {
        if (res.status === 200) {
          setIsLoading(false);
          const curEvents = transformEvents(res.data);
          setEvents(curEvents);
        }
      }
    } catch (error) {
      console.error('Error reading schedule:', error);
    }

  };

  useEffect(() => {
    if (events.length > 0) {
      const weeklyEvents = events.filter((event: any) => {
        const eventStart = moment(event.start);
        const eventEnd = moment(event.end);
        const weekStart = moment().startOf('day');
        const weekEnd = moment().add(7, 'days');
        return (
          (eventStart.isSameOrAfter(weekStart) &&
            eventStart.isSameOrBefore(weekEnd)) ||
          (eventEnd.isSameOrAfter(weekStart) &&
            eventEnd.isSameOrBefore(weekEnd))
        );
      }).sort((a: any, b: any) => {
        const startA = moment(a.start);
        const startB = moment(b.start);
        const endA = moment(a.end);
        const endB = moment(b.end);

        if (startA.isSame(startB)) {
          return endA.isAfter(endB) ? 1 : -1;
        }

        return startA.isAfter(startB) ? 1 : -1;
      });

      setWeeklyEvents(weeklyEvents);
    }
  }, [events]);

  useEffect(() => {
    const roomId = user?.roomId;
    if (!roomId) return;
    getEvents(roomId);
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
