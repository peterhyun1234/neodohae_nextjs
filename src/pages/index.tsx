import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Styled from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/router';
import moment from 'moment';
import axios from 'axios';

import TopAppBarHome from '@/components/appBar/TopAppBarHome';
import Footer from '@/components/footer/Footer';
import BottomNavigation from '@/components/navigation/BottomNav';
import LoadingPopup from '@/components/popup/LoadingPopup';
import VerticalTodoList from '@/containers/todo/VerticalTodoList';
import WeeklyCalendar from '@/containers/schedule/WeeklyCalendar';
import MonthlyCalendar from '@/containers/schedule/MonthlyCalendar';

import FormatListNumberedRoundedIcon from '@mui/icons-material/FormatListNumberedRounded';
import PunchClockRoundedIcon from '@mui/icons-material/PunchClockRounded';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const VAPID_PUBLIC_KEY = publicRuntimeConfig.VAPID_PUBLIC_KEY;

const dummyTodoList = [
{
  id: 1,
  title: '빨래',
  description: '흰색 옷 빨래하기',
  startTime: '2023-07-20T13:00:00Z',
  endTime: '2023-07-27T14:00:00Z',
  status: 'TODO',
  assignedUserIds: [1, 2],
},
{
  id: 2,
  title: '청소',
  description: '각자 방 청소하기',
  startTime: '2023-07-20T14:00:00Z',
  endTime: '2023-07-27T15:00:00Z',
  status: 'TODO',
  assignedUserIds: [1, 2, 3, 4],
},
{
  id: 3,
  title: '아침 밥하기',
  description: '아침 밥하기(랜덤 할당)',
  startTime: '2023-07-28T15:00:00Z',
  endTime: '2023-07-28T16:00:00Z',
  status: 'TODO',
  assignedUserIds: [1],
},
{
  id: 4,
  title: '점심 밥하기',
  description: '점심 밥하기(랜덤 할당)',
  startTime: '2023-07-29T16:00:00Z',
  endTime: '2023-07-29T17:00:00Z',
  status: 'TODO',
  assignedUserIds: [2],
},
];

const Home = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [user, setUser] = useState<any>(session?.user || null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [notiNumToRead, setNotiNumToRead] = useState<any>(0);

  const [todoList, setTodoList] = useState<any>([]);
  const [todayTodoList, setTodayTodoList] = useState<any>([]);

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

  const todoStatusUpdate = async (todoId: number, status: string) => {
    //TODO: update todo status
    alert(`todoId: ${todoId}, status: ${status} update 준비 중`);
  };

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

  const getTodoList = async () => {
    // TODO: get todo list from server
    setTodoList(dummyTodoList);
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
  }

  useEffect(() => {
    if (!todoList || todoList.length === 0) return;
    const today = [];

    for(const todo of todoList) {
      if (
        moment(todo.startTime).isSameOrBefore(moment(), 'day') &&
        moment(todo.endTime).isSameOrAfter(moment(), 'day')
      ) {
        today.push(todo);
      }
    }

    setTodayTodoList(today);
  }, [todoList]);

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
    getTodoList();
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
    <div
      style={{
        width: '100%',
        backgroundColor: '#FAFAFF',
      }}
    >
      {isLoading && <LoadingPopup />}
      {user && user.id && user.roomName && (
        <>
          <TopAppBarHome roomInviteCode={user.roomInviteCode} notiNumToRead={notiNumToRead}/>
          <WrapBox>
            <TodoDiv>
              {todayTodoList && (
                <>
                  <TitleDiv>
                    <Title>{' 오늘 할 일'}</Title>
                    <FunctionDiv>
                      <FunctionIcon>
                        <FormatListNumberedRoundedIcon color="inherit" fontSize="inherit" />
                      </FunctionIcon>
                      <FunctionText
                        onClick={() => {
                          router.push('/todo');
                        }}
                      >
                        {'더보기'}
                      </FunctionText>
                    </FunctionDiv>
                  </TitleDiv>
                  {todayTodoList.length > 0 ? (
                    <VerticalTodoList
                      events={todayTodoList}
                      todoStatusUpdate={todoStatusUpdate}
                    />
                  ) : (
                    <EmptyDiv>
                      <ScheduleIcon />
                      <EmptyText>{'오늘 예정된 To-Do가 없습니다.'}</EmptyText>
                      <ScheduleAddText
                        onClick={() => {
                          router.push('/todo/create');
                        }}
                      >
                        {'새로운 To-Do 등록'}
                      </ScheduleAddText>
                    </EmptyDiv>
                  )}
                </>
              )}
            </TodoDiv>
            <CalendarDiv>
              {weeklyEvents && (
                <>
                  <TitleDiv>
                    <Title>
                      {'한 주 '}
                      <RoomNameSpan>{user.roomName}</RoomNameSpan>
                      {' 스케줄'}
                    </Title>
                    <FunctionDiv>
                      <FunctionIcon>
                        <CalendarMonthIcon color="inherit" fontSize="inherit" />
                      </FunctionIcon>
                      <FunctionText
                        onClick={() => {
                          router.push('/schedule');
                        }}
                      >
                        {'더보기'}
                      </FunctionText>
                    </FunctionDiv>
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
                    <FunctionDiv>
                      <FunctionIcon>
                        <AddRoundedIcon color="inherit" fontSize="inherit" />
                      </FunctionIcon>
                      <FunctionText
                        onClick={() => {
                          router.push('/schedule/create');
                        }}
                      >
                        {'스케줄 추가'}
                      </FunctionText>
                    </FunctionDiv>
                  </TitleDiv>
                  <MonthlyCalendar events={events} />
                </>
              )}
            </CalendarDiv>
          </WrapBox>
          <Footer />
        </>
      )}
      {<BottomNavigation />}
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
const TodoDiv = Styled.div`
  width: 100%;
  display: inline-block;
  padding-top: 20px;
  padding-bottom: 20px;
`;
const CalendarDiv = Styled.div`
  width: 100%;
  display: inline-block;
  padding-bottom: 20px;
`;
const TitleDiv = Styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-left: 20px;
  padding-right: 20px;
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
const FunctionDiv = Styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;
const FunctionIcon = Styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7876fb;
  font-size: 20px;
  cursor: pointer;
  @media (max-width: 650px) {
    font-size: 17px;
  }
`;
const FunctionText = Styled.div`
  font-size: 18px;
  line-height: 0px;
  font-weight: bold;
  color: #7876fb;
  cursor: pointer;
  @media (max-width: 650px) {
    font-size: 15px;
  }
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
  margin-bottom: 40px;
  padding: 20px 0;
  box-shadow: rgba(0, 0, 0, 0.17) 0px 0px 2px 2px;
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
const TempBoxdiv = Styled.div`
    width: calc(100% - 40px);
    padding-top: 150px;
    padding-bottom: 150px;
    background-color: #ffffff;
    margin: 30px 20px 40px 20px;
    border-radius: 15px;
    box-shadow: rgba(0, 0, 0, 0.17) 0px 0px 5px 3px;
    border: 1px dashed #80acff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    font-weight: bold;
    color: #80acff;
`;

export default Home;
