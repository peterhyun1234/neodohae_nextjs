import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Styled from 'styled-components';
import { useRouter } from 'next/router';
import axios from 'axios';

import TopAppBarHome from '@/components/appBar/TopAppBarHome';
import BottomNavigation from '@/components/navigation/BottomNav';
import LoadingPopup from '@/components/popup/LoadingPopup';
import TodoKanbanBoard from '@/containers/todo/TodoKanbanBoard';
import VerticalTodoList from '@/containers/todo/VerticalTodoList';

import PunchClockRoundedIcon from '@mui/icons-material/PunchClockRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import moment from 'moment';

const Todo = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [user, setUser] = useState<any>(session?.user || null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [notiNumToRead, setNotiNumToRead] = useState<any>(0);

  const [roommates, setRoommates] = useState<any>([]);
  const [selectedRoommateIds, setSelectedRoommateIds] = useState<any>([]);

  const [todoList, setTodoList] = useState<any>([]);
  const [todayTodoList, setTodayTodoList] = useState<any>([]);
  const [filteredTodoList, setFilteredTodoList] = useState<any>(null);

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

  const getTodoList = async () => {
    if (!session) return;
    const accessToken = (session as any)?.accessToken;
    if (!accessToken) return;
    const roomId = user.roomId;

    await axios
      .get(`https://api-todos.neodohae.com/todos/room/${roomId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setTodoList(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getRoommates = async () => {
    if (!session) return;
    const accessToken = (session as any)?.accessToken;
    if (!accessToken) return;
    const roomId = user.roomId;

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

  const todoStatusUpdate = async (todoId: number, status: string) => {
    if (!todoId) return;
    if (!status) return;
    if (status !== 'TODO' && status !== 'DOING' && status !== 'DONE') return;

    if (!session) return;
    const accessToken = (session as any)?.accessToken;
    if (!accessToken) return;

    if (window.confirm('정말로 To-Do 상태를 변경하시겠습니까?') === false) return;

    try {
      const res = await axios.put(
        `https://api-todos.neodohae.com/todos/${todoId}`,
        {
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res) {
        if (res.status === 200) {
          getTodoList();
        }
      }
    }
    catch (error) {
      console.error('Error updating todo status:', error);
    }
  };

  const getNotifications = async () => {
    if (!session) return;
    const accessToken = (session as any)?.accessToken;
    if (!accessToken) return;

    try {
      const res = await axios.get(`/notifications/user/${user.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
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
  };

  const getAssignedUsers = (assignedUserIds: number[]) => {
    const assignedUsers = [];
    for (const roommate of roommates) {
      if (assignedUserIds.includes(roommate.id)) {
        assignedUsers.push(roommate);
      }
    }
    return assignedUsers;
  };

  useEffect(() => {
    if (!todoList || todoList.length === 0) return;
    if (selectedRoommateIds.length === 0) {
      setFilteredTodoList([]);
      return;
    }
    const filtered = [];

    for (const todo of todoList) {
      for (const id of selectedRoommateIds) {
        if (todo.assignedUserIds.includes(id)) {
          const curTodo = {
            id: todo.id,
            title: todo.title,
            description: todo.description,
            startTime: todo.startTime,
            endTime: todo.endTime,
            status: todo.status,
            assignedUsers: getAssignedUsers(todo.assignedUserIds),
          };
          filtered.push(curTodo);
          break;
        }
      }
    }

    setFilteredTodoList(filtered);
  }, [selectedRoommateIds, todoList]);

  useEffect(() => {
    if (roommates && roommates.length > 0) {
      const ids = [];
      for (const roommate of roommates) {
        ids.push(roommate.id);
      }
      setSelectedRoommateIds(ids);
    }
  }, [roommates]);

  useEffect(() => {
    if (!user) return;
    if (!todoList || todoList.length === 0) return;
    const today = [];
    const userId = user.id;

    for (const todo of todoList) {
      if (todo.assignedUserIds.includes(userId)) {
        if (
          moment(todo.startTime).isSameOrBefore(moment(), 'day') &&
          moment(todo.endTime).isSameOrAfter(moment(), 'day')
        ) {
          today.push(todo);
        }
      }
    }

    setTodayTodoList(today);
  }, [todoList]);

  useEffect(() => {
    if (!session) return;
    if (!user) return;
    getTodoList();
    getRoommates();
    getNotifications();
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
          <TopAppBarHome
            roomInviteCode={user.roomInviteCode}
            notiNumToRead={notiNumToRead}
          />
          <WrapBox>
            <TodoDiv>
              {todayTodoList && (
                <>
                  <TitleDiv>
                    <Title>{' 오늘 내가 할 일'}</Title>
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
              {todoList && (
                <>
                  <TitleDiv>
                    <Title>
                      <RoomNameSpan>{user.roomName}</RoomNameSpan>
                      {' To-Do'}
                    </Title>
                  </TitleDiv>
                  <UserFilterSelect>
                    {roommates.map((roommate: any) => {
                      const isSelected = selectedRoommateIds.includes(
                        roommate.id,
                      );
                      return (
                        <UserFilterOption
                          bgColor={hexToRgbA(roommate.color, 0.4)}
                          selected={isSelected}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedRoommateIds(
                                selectedRoommateIds.filter(
                                  (id: number) => id !== roommate.id,
                                ),
                              );
                            } else {
                              setSelectedRoommateIds([
                                ...selectedRoommateIds,
                                roommate.id,
                              ]);
                            }
                          }}
                        >
                          <UserName>{roommate.username}</UserName>
                          {isSelected ? (
                            <FilterIconDiv>
                              <CloseRoundedIcon
                                color="inherit"
                                fontSize="inherit"
                              />
                            </FilterIconDiv>
                          ) : (
                            <FilterIconDiv>
                              <AddRoundedIcon
                                color="inherit"
                                fontSize="inherit"
                              />
                            </FilterIconDiv>
                          )}
                        </UserFilterOption>
                      );
                    })}
                  </UserFilterSelect>
                  {
                    filteredTodoList && <>
                    {filteredTodoList.length > 0 ? (
                      <TodoKanbanBoard events={filteredTodoList} todoStatusUpdate={todoStatusUpdate}/>
                    ) : (
                      <EmptyDiv>
                        <ScheduleIcon />
                        <EmptyText>{'예정된 To-Do가 없습니다.'}</EmptyText>
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
                  }
                </>
              )}
            </TodoDiv>
          </WrapBox>
          <AddEventWrapper>
            <AddEventBtn
              onClick={() => {
                router.push('/todo/create');
              }}
            >
              <AddIcon />
            </AddEventBtn>
          </AddEventWrapper>
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
const TodoDiv = Styled.div`
  width: 100%;
  display: inline-block;
  padding: 20px 0;
`;
const TitleDiv = Styled.div`
  text-align: left;
  width: 100%;
  padding-left: 20px;
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
const AddEventWrapper = Styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 1000px;
  margin: 0 auto;
  z-index: 100;
`;
const AddEventBtn = Styled.div`
  position: absolute;
  bottom: calc(50px + env(safe-area-inset-bottom));
  right: 50px;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: #7252ff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: rgba(0, 0, 0, 0.17) 0px 0px 2px 2px;
  cursor: pointer;
  @media (max-width: 650px) {
    width: 50px;
    height: 50px;
    bottom: calc(90px + env(safe-area-inset-bottom));
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
const UserFilterSelect = Styled.div`
  width: 100%;
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  padding-left: 20px;
  padding-top: 2px;
  padding-bottom: 2px;
  margin-bottom: 10px;
  @media (max-width: 650px) {
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;
const UserFilterOption = Styled.div<{ bgColor: string; selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 3px 6px;
  margin-right: 10px;
  border-radius: 10px;
  background-color: ${(props) => (props.selected ? props.bgColor : '#fff')};
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 2px 2px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    transform: scale(1.10);
  }
`;
const UserName = Styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  @media (max-width: 650px) {
    font-size: 10px;
  }
`;
const FilterIconDiv = Styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 15px;
  background-color: transparent;
`;

export default Todo;
