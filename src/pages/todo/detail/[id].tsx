import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import axios from 'axios';

import TopAppBarTodoDetail from '@/components/appBar/TopAppBarTodoDetail';
import Styled from 'styled-components';
import LoadingPopup from '@/components/popup/LoadingPopup';

import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import TitleRoundedIcon from '@mui/icons-material/TitleRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import RepeatRoundedIcon from '@mui/icons-material/RepeatRounded';
import HowToRegRoundedIcon from '@mui/icons-material/HowToRegRounded';
import PlaylistAddCheckRoundedIcon from '@mui/icons-material/PlaylistAddCheckRounded';

const repeatTypeList = [
  {
    value: 'NONE',
    label: '반복 안함',
  },
  {
    value: 'DAILY',
    label: '매일',
  },
  {
    value: 'WEEKLY',
    label: '매주',
  },
  {
    value: 'MONTHLY',
    label: '매월',
  },
  {
    value: 'YEARLY',
    label: '매년',
  },
];

const TodoDetail = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = router.query;

  const [user, setUser] = useState<any>(session?.user || null);
  const [roommates, setRoommates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdatePopupOpen, setIsUpdatePopupOpen] = useState<boolean>(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState<boolean>(false);

  const [todoId, setTodoId] = useState<number | null>(null);
  const [title, setTitle] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [endTimeMsg, setEndTimeMsg] = useState<string>('');
  const [status, setStatus] = useState<string>('TODO');
  const [description, setDescription] = useState<string>('');

  const [repeatGroupId, setRepeatGroupId] = useState<number | null>(null);
  const [repeatType, setRepeatType] = useState<string>('NONE');
  const [repeatEndTime, setRepeatEndTime] = useState<string>('');
  const [repeatEndTimeMsg, setRepeatEndTimeMsg] = useState<string>('');

  const [isRandom, setIsRandom] = useState<boolean>(false);
  const [randomUsersNum, setRandomUsersNum] = useState<number | null>(1);
  const [assignedUserIds, setAssignedUserIds] = useState<number[]>([]);


  const handleClickUpdatePopupOpen = () => {
    setIsUpdatePopupOpen(true);
  };

  const handleUpdatePopupClose = () => {
    setIsUpdatePopupOpen(false);
  };

  const handleClickDeletePopupOpen = () => {
    setIsDeletePopupOpen(true);
  };

  const handleDeletePopupClose = () => {
    setIsDeletePopupOpen(false);
  };

  const isRepeat = () => {
    return repeatType !== 'NONE';
  };

  const handleRepeatTypeChange = (event: SelectChangeEvent) => {
    console.log(event.target.value);
    setRepeatType(event.target.value as string);
  };

  const validateDateTimeFormat = (dateTime: string) => {
    const pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/;
    return pattern.test(dateTime);
  };

  const onSave = async (isForAll ?: boolean) => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (
      !validateDateTimeFormat(startTime) ||
      !validateDateTimeFormat(endTime)
    ) {
      alert('시작 시간 또는 끝나는 시간이 잘못된 형식입니다.');
      return;
    }
    if (new Date(endTime) <= new Date(startTime)) {
      alert('끝나는 시간이 시작 시간보다 빠를 수 없습니다.');
      return;
    }

    const isRepeating = isRepeat();
    if (isRepeating && !validateDateTimeFormat(repeatEndTime)) {
      alert('반복 종료 시간이 잘못된 형식입니다.');
      return;
    }

    if (isRepeating && new Date(repeatEndTime) <= new Date()) {
      alert('반복 종료 시간이 현재 시간보다 빠를 수 없습니다.');
      return;
    }

    if (isRepeating && new Date(repeatEndTime) <= new Date(startTime)) {
      alert('반복 종료 시간이 시작 시간보다 빠를 수 없습니다.');
      return;
    }

    if (isRandom && !randomUsersNum) {
      alert('랜덤 지정 인원 수를 입력해주세요.');
      return;
    }

    if (isRandom && randomUsersNum && randomUsersNum < 1) {
      alert('1명 이상 지정해주세요.');
      return;
    }

    if (isRandom && randomUsersNum && randomUsersNum > roommates.length) {
      alert(
        '룸메이트 수보다 많이 지정할 수 없습니다. (룸메이트: ' +
          roommates.length +
          '명)',
      );
      return;
    }

    if (!isRandom && assignedUserIds.length === 0) {
      alert('지정할 인원을 선택해주세요.');
      return;
    }

    if (!session) return;
    const accessToken = (session as any)?.accessToken;
    if (!accessToken) return;

    const todo = {
      title,
      description,
      startTime,
      endTime,
      status,
      repeatType,
      repeatEndTime: isRepeating ? repeatEndTime : null,
      assignedUserIds: isRandom ? null : assignedUserIds,
      randomUsersNum: isRandom ? randomUsersNum : null,
      userId: user.id,
    };
    setIsLoading(true);
    try {
      const res = await axios.put(
        `https://api-todos.neodohae.com/todos/${todoId}${isForAll ? '/all' : ''}`,
        { ...todo },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res) {
        if (res.status === 200) {
          alert('To-do이 수정되었습니다.');
          setIsLoading(false);
          router.back();
        }
      }
    } catch (error) {
      console.error('Error modifying todo:', error);
    }
  };

  const onCancel = () => {
    router.back();
  };

  const getTodo = async (id: number) => {
    const curId = id;

    if (!session) return;
    const accessToken = (session as any)?.accessToken;
    if (!accessToken) return;

    setIsLoading(true);
    try {
        const res = await axios.get(
            `https://api-todos.neodohae.com/todos/${curId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );
        if (res) {
            if (res.status === 200) {
                const data = res.data;
                setTodoId(data.id);
                setTitle(data.title);
                setDescription(data.description);
                setStartTime(data.startTime);
                setEndTime(data.endTime);
                setStatus(data.status);
                setRepeatGroupId(data.repeatGroupId);
                setRepeatType(data.repeatType);
                setRepeatEndTime(data.repeatEndTime);
                setAssignedUserIds(data.assignedUserIds);
                setRandomUsersNum(data.randomUsersNum);
                setIsRandom(data.randomUsersNum !== null);
            }
        }
    } catch (error) {
        console.error('Error getting todo:', error);
    }
    setIsLoading(false);
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

  const deleteTodo = async (isForAll ?: boolean) => {
    if (!session) return;
    const accessToken = (session as any)?.accessToken;
    if (!accessToken) return;

    if (todoId === undefined) {
      alert('잘못된 To-do 아이디입니다.');
      return;
    }

    if (window.confirm('정말로 To-do를 삭제하시겠습니까?')) {
      setIsLoading(true);
      try {
        const res = await axios.delete(
        `https://api-todos.neodohae.com/todos/${todoId}${isForAll ? '/all' : ''}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        if (res) {
          if (res.status === 200) {
            alert('To-do가 삭제되었습니다.');
            setIsLoading(false);
            router.back();
          }
        }
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    }
  };

  useEffect(() => {
    if (!repeatEndTime) return;
    if (!startTime) return;
    const current = new Date();

    if (new Date(repeatEndTime) <= current) {
      setRepeatEndTimeMsg('반복 종료 시간이 현재 시간보다 빠를 수 없습니다.');
    } else {
      setRepeatEndTimeMsg('');
    }

    if (new Date(repeatEndTime) <= new Date(startTime)) {
      setRepeatEndTimeMsg('반복 종료 시간이 시작 시간보다 빠를 수 없습니다.');
    } else {
      setRepeatEndTimeMsg('');
    }
  }, [startTime, repeatEndTime]);

  useEffect(() => {
    if (!startTime || !endTime) return;
    if (new Date(endTime) <= new Date(startTime)) {
      setEndTimeMsg('끝나는 시간이 시작 시간보다 빠를 수 없습니다.');
    } else {
      setEndTimeMsg('');
    }
  }, [startTime, endTime]);

  useEffect(() => {
    if (!id) return;
    if (!user) return;
    if (id && Number.isInteger(Number(id)) && Number(id) >= 1) {
      getTodo(Number(id));
      getRoommates();
    } else {
      alert('잘못된 To-do 아이디입니다.');
      router.back();
    }
  }, [id, user]);

  useEffect(() => {
    if (!session) return;
    if (!session.user) return;
    setUser(session?.user);
  }, [session]);

  return (
    <>
      {isLoading && <LoadingPopup />}
      {title && (
        <>
        {
          isRepeat() ? (
            <TopAppBarTodoDetail title={title} deleteTodo={handleClickDeletePopupOpen} />
          ) : (
            <TopAppBarTodoDetail title={title} deleteTodo={deleteTodo} />
          )
        }
          <WrapBox>
            <InputBoxList>
              <InputBox>
                <InputBoxIconDiv>
                  <TitleRoundedIcon fontSize="inherit" color="inherit" />
                </InputBoxIconDiv>
                <TextField
                  id="todo-title"
                  label="제목"
                  variant="outlined"
                  placeholder="제목을 입력해주세요."
                  fullWidth
                  value={title}
                  onChange={(e) => {
                    if (e.target.value.length > 10) {
                      alert('제목은 10자 이하로 입력해주세요.');
                      return;
                    }
                    setTitle(e.target.value);
                  }}
                />
              </InputBox>
              <InputBoxDivider />
              <InputBox>
                <InputBoxIconDiv>
                  <DescriptionRoundedIcon fontSize="inherit" color="inherit" />
                </InputBoxIconDiv>
                <TextField
                  id="todo-description"
                  label="설명(선택)"
                  variant="outlined"
                  placeholder="설명을 입력해주세요."
                  fullWidth
                  value={description}
                  onChange={(e) => {
                    if (e.target.value.length > 100) {
                      alert('설명은 100자 이하로 입력해주세요.');
                      return;
                    }
                    setDescription(e.target.value);
                  }}
                />
              </InputBox>
              <InputBoxDivider />
              <InputBox>
                <InputBoxIconDiv>
                  <AccessTimeRoundedIcon fontSize="inherit" color="inherit" />
                </InputBoxIconDiv>
                <InputBoxTitle>시간 설정</InputBoxTitle>
              </InputBox>
              <InputBox>
                <TimeDiv>
                  <Input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => {
                      setStartTime(e.target.value);
                    }}
                  />
                  <InputMessage />
                </TimeDiv>
                <ArrowIconDiv>
                  <InputBoxIconDiv>
                    <ArrowForwardRoundedIcon
                      fontSize="inherit"
                      color="inherit"
                    />
                  </InputBoxIconDiv>
                  <InputMessage />
                </ArrowIconDiv>
                <TimeDiv>
                  <Input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => {
                      setEndTime(e.target.value);
                    }}
                  />
                  <InputMessage>{endTimeMsg}</InputMessage>
                </TimeDiv>
              </InputBox>
              <InputBoxDivider />
              <InputBox>
                <InputBoxIconDiv>
                  <PlaylistAddCheckRoundedIcon fontSize="inherit" color="inherit" />
                </InputBoxIconDiv>
                <InputBoxSelectDiv>
                  <FormControl fullWidth>
                    <InputLabel id="status-label">상태 설정</InputLabel>
                    <Select
                      labelId="status-label"
                      id="status"
                      value={status}
                      label="상태 설정"
                      onChange={(e) => {
                        setStatus(e.target.value as string);
                      }}
                    >
                      <MenuItem value="TODO">할 일</MenuItem>
                      <MenuItem value="DOING">진행 중</MenuItem>
                      <MenuItem value="DONE">완료</MenuItem>
                    </Select>
                  </FormControl>
                </InputBoxSelectDiv>
              </InputBox>
              <InputBoxDivider />
              <InputBox>
                <InputBoxIconDiv>
                  <RepeatRoundedIcon fontSize="inherit" color="inherit" />
                </InputBoxIconDiv>
                <InputBoxSelectDiv>
                  <FormControl fullWidth>
                    <InputLabel id="repeat-type-label">반복 설정</InputLabel>
                    <Select
                      labelId="repeat-type-label"
                      id="repeat-type"
                      value={repeatType}
                      label="반복 설정"
                      onChange={handleRepeatTypeChange}
                    >
                      {repeatTypeList.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </InputBoxSelectDiv>
              </InputBox>
              {isRepeat() && (
                <RepeatEndTimeDiv>
                  <RepeatEndTimeTitle>반복 종료 시간</RepeatEndTimeTitle>
                  <RepeatTimeDiv>
                    <Input
                      type="datetime-local"
                      value={repeatEndTime}
                      onChange={(e) => {
                        setRepeatEndTime(e.target.value);
                      }}
                    />
                    <InputMessage>{repeatEndTimeMsg}</InputMessage>
                  </RepeatTimeDiv>
                </RepeatEndTimeDiv>
              )}
              <InputBoxDivider />
              <InputBox>
                <InputBoxIconDiv>
                  <HowToRegRoundedIcon fontSize="inherit" color="inherit" />
                </InputBoxIconDiv>
                <InputBoxTitleDiv>
                  <InputBoxTitle>룸메이트 지정</InputBoxTitle>
                  <RandomAssignActivateButton
                    onClick={() => {
                      setIsRandom(!isRandom);
                    }}
                  >
                    {isRandom ? '직접 지정' : '랜덤 지정'}
                  </RandomAssignActivateButton>
                </InputBoxTitleDiv>
              </InputBox>
              <RandomAssignDiv>
                {isRandom ? (
                  <TextField
                    id="random-users-num"
                    label="랜덤 지정 인원 수"
                    variant="outlined"
                    placeholder="랜덤 지정 인원 수를 입력해주세요."
                    fullWidth
                    value={randomUsersNum}
                    onChange={(e) => {
                      if (e.target.value === '') {
                        setRandomUsersNum(null);
                        return;
                      }
                      const num = Number(e.target.value);

                      if (isNaN(num)) {
                        alert('숫자만 입력해주세요.');
                        return;
                      }
                      if (num < 1) {
                        alert('1명 이상 지정해주세요.');
                        return;
                      }
                      if (num > roommates.length) {
                        alert(
                          '룸메이트 수보다 많이 지정할 수 없습니다. (룸메이트: ' +
                            roommates.length +
                            '명)',
                        );
                        return;
                      }

                      setRandomUsersNum(num);
                    }}
                  />
                ) : (
                  <FormControl fullWidth>
                    <InputLabel id="user-multiple-checkbox-label">
                      지정할 인원 선택
                    </InputLabel>
                    <Select
                      labelId="user-multiple-checkbox-label"
                      id="user-multiple-checkbox"
                      multiple
                      value={assignedUserIds}
                      onChange={(e) => {
                        setAssignedUserIds(e.target.value as number[]);
                      }}
                      inputProps={{
                        username: 'user',
                        id: 'user-multiple-checkbox',
                      }}
                      renderValue={(selected) => {
                        const selectedRoommates = roommates.filter((roommate) =>
                          selected.includes(roommate.id),
                        );
                        return selectedRoommates
                          .map((roommate) => roommate.username)
                          .join(', ');
                      }}
                    >
                      {roommates.map((roommate) => (
                        <MenuItem key={roommate.id} value={roommate.id}>
                          <Checkbox
                            checked={assignedUserIds.includes(roommate.id)}
                          />
                          {roommate.username}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </RandomAssignDiv>
            </InputBoxList>
          </WrapBox>
          <ButtonBar>
            <CancelButton onClick={onCancel}>취소</CancelButton>
            <SaveButton
              onClick={() => {
                if (!title.trim()) {
                  alert('제목을 입력해주세요.');
                  return;
                }
                if (
                  !validateDateTimeFormat(startTime) ||
                  !validateDateTimeFormat(endTime)
                ) {
                  alert('시작 시간 또는 끝나는 시간이 잘못된 형식입니다.');
                  return;
                }
                if (new Date(endTime) <= new Date(startTime)) {
                  alert('끝나는 시간이 시작 시간보다 빠를 수 없습니다.');
                  return;
                }
                const isRepeating = isRepeat();
                if (isRepeating && !validateDateTimeFormat(repeatEndTime)) {
                  alert('반복 종료 시간이 잘못된 형식입니다.');
                  return;
                }

                if (isRepeating && new Date(repeatEndTime) <= new Date()) {
                  alert('반복 종료 시간이 현재 시간보다 빠를 수 없습니다.');
                  return;
                }

                if (
                  isRepeating &&
                  new Date(repeatEndTime) <= new Date(startTime)
                ) {
                  alert('반복 종료 시간이 시작 시간보다 빠를 수 없습니다.');
                  return;
                }

                if (isRandom && !randomUsersNum) {
                  alert('랜덤 지정 인원 수를 입력해주세요.');
                  return;
                }

                if (isRandom && randomUsersNum && randomUsersNum < 1) {
                  alert('1명 이상 지정해주세요.');
                  return;
                }

                if (
                  isRandom &&
                  randomUsersNum &&
                  randomUsersNum > roommates.length
                ) {
                  alert(
                    '룸메이트 수보다 많이 지정할 수 없습니다. (룸메이트: ' +
                      roommates.length +
                      '명)',
                  );
                  return;
                }

                if (!isRandom && assignedUserIds.length === 0) {
                  alert('지정할 인원을 선택해주세요.');
                  return;
                }
                if (isRepeat()) {
                  handleClickUpdatePopupOpen();
                } else {
                  onSave();
                }
              }}
              isActivated={
                title.trim() &&
                validateDateTimeFormat(startTime) &&
                validateDateTimeFormat(endTime) &&
                new Date(endTime) > new Date(startTime) &&
                (!isRepeat() ||
                  (validateDateTimeFormat(repeatEndTime) &&
                    new Date(repeatEndTime) > new Date(startTime) &&
                    new Date(repeatEndTime) > new Date())) &&
                (!isRandom ||
                  (randomUsersNum &&
                    randomUsersNum > 0 &&
                    randomUsersNum <= roommates.length)) &&
                (isRandom || assignedUserIds.length > 0)
                  ? true
                  : false
              }
            >
              저장
            </SaveButton>
          </ButtonBar>
        </>
      )}
      {
        <Dialog
          open={isUpdatePopupOpen}
          onClose={handleUpdatePopupClose}
        >
          <DialogTitle>
            {"이 To-do를 수정하시겠습니까?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentSelectDiv onClick={() => {
              handleUpdatePopupClose();
              onSave();
            }}>
              이 To-do만 수정
            </DialogContentSelectDiv>
            <DialogContentSelectDiv onClick={() => {
              handleUpdatePopupClose();
              onSave(true);
            }}>
              연관된 To-do 모두 수정
            </DialogContentSelectDiv>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleUpdatePopupClose}>
              취소
            </Button>
          </DialogActions>
        </Dialog>
      }
      {
        <Dialog
          open={isDeletePopupOpen}
          onClose={handleDeletePopupClose}
        >
          <DialogTitle>
            {"이 To-do를 삭제하시겠습니까?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentSelectDiv onClick={() => {
              handleDeletePopupClose();
              deleteTodo();
            }}>
              이 To-do만 삭제
            </DialogContentSelectDiv>
            <DialogContentSelectDiv onClick={() => {
              handleDeletePopupClose();
              deleteTodo(true);
            }}>
              연관된 To-do 모두 삭제
            </DialogContentSelectDiv>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              handleDeletePopupClose();
            }
            }>
              취소
            </Button>
          </DialogActions>
        </Dialog>
      }
    </>
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
const InputBoxList = Styled.div`
    width: 100%;
    max-width: 700px;
    margin: 0 auto;
    padding: 16px;
`;
const InputBox = Styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 16px;
`;
const InputBoxDivider = Styled.div`
    width: 100%;
    height: 1px;
    background-color: #e2e2e2;
    margin-bottom: 16px;
`;
const InputBoxIconDiv = Styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    font-size: 25px;
    color: #999;
    height: 50px;
`;
const InputBoxTitleDiv = Styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`;
const InputBoxTitle = Styled.div`
    display: flex;
    justify-content: left;
    align-items: center;
    width: 100%;
    font-size: 16px;
    color: #999;
    height: 40px;
`;
const InputBoxSelectDiv = Styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;
const ArrowIconDiv = Styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 40px;
`;
const TimeDiv = Styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: calc(50% - 25px);
`;
const Input = Styled.input`
    width: 100%;
    padding: 5px;
`;
const InputMessage = Styled.div`
    height: 50px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    color: #c05e5e;
    text-align: left;
`;
const RepeatEndTimeDiv = Styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: left;
    margin-bottom: 16px;
`;
const RepeatEndTimeTitle = Styled.div`
    width: 100%;
    display: flex;
    justify-content: left;
    align-items: center;
    font-size: 16px;
    color: #999;
    height: 40px;
    margin-bottom: 8px;
`;
const RepeatTimeDiv = Styled.div`
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const RandomAssignActivateButton = Styled.div`
    width: fit-content;
    padding: 5px 7px;
    min-width: 80px;
    border-radius: 5px;
    background-color: #007bff;
    color: #fff;
    font-size: 12px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    user-select: none;

    &:hover {
      background-color: #0069d9;
    }
`;
const RandomAssignDiv = Styled.div`
    width: 100%;
`;
const ButtonBar = Styled.div`
    position: fixed;
    max-width: 1000px;
    width: 100%;
    margin: 0 auto;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    background: white;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-top: 1px solid #f6f6f6;
    padding: 10px;
    padding-bottom: calc(10px + env(safe-area-inset-bottom));
    gap: 10px;
    z-index: 1;
`;
const CancelButton = Styled.button`
    width: 100%;
    flex: 1;
    background: #f8f8f8;
    border: 1px solid #e8e8e8;;
    border-radius: 10px;
    color: #999;
    font-size: 16px;
    padding-top: 10px;
    padding-bottom: 10px;
`;
const SaveButton = Styled.button<{ isActivated: boolean }>`
    width: 100%;
    flex: 1;
    background: ${(props) => (props.isActivated ? '#00b624' : '#999999')};
    border: 1px solid #e8e8e8;;
    border-radius: 10px;
    color: #fff;
    font-size: 16px;
    padding-top: 10px;
    padding-bottom: 10px;
`;
const DialogContentSelectDiv = Styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    border-radius: 10px;
    background-color: #9c9c9c;
    color: #fff;
    margin-bottom: 10px;
    cursor: pointer;
    user-select: none;

    &:hover {
      background-color: #e8e8e8;
    }
`;

export default TodoDetail;
