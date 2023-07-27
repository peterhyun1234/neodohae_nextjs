import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Styled from 'styled-components';
import { useRouter } from 'next/router';
import { formatISO } from 'date-fns';
import axios from 'axios';

import TopAppBar from '@/components/appBar/TopAppBar';

import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';

import TitleRoundedIcon from '@mui/icons-material/TitleRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import RepeatRoundedIcon from '@mui/icons-material/RepeatRounded';
import HowToRegRoundedIcon from '@mui/icons-material/HowToRegRounded';

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

const TodoCreate = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [user, setUser] = useState<any>(session?.user || null);
  const [roommates, setRoommates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [title, setTitle] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [endTimeMsg, setEndTimeMsg] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const [repeatType, setRepeatType] = useState<string>('NONE');
  const [repeatEndTime, setRepeatEndTime] = useState<string>('');
  const [repeatEndTimeMsg, setRepeatEndTimeMsg] = useState<string>('');

  const [isRandom, setIsRandom] = useState<boolean>(false);
  const [randomUsersNum, setRandomUsersNum] = useState<number | null>(1);
  const [assignedUserIds, setAssignedUserIds] = useState<number[]>([]);

  const isRepeat = () => {
    return repeatType !== 'NONE';
  };

  const getMaxRepeatEndDate = (repeatType: string, startDate: string) => {
    let maxEndDate = new Date(startDate);

    switch (repeatType) {
      case 'DAILY':
        maxEndDate.setDate(maxEndDate.getDate() + 365); // 1년
        break;
      case 'WEEKLY':
        maxEndDate.setDate(maxEndDate.getDate() + 365 * 5); // 5년
        break;
      case 'MONTHLY':
        maxEndDate.setFullYear(maxEndDate.getFullYear() + 5); // 5년
        break;
      case 'YEARLY':
        maxEndDate.setFullYear(maxEndDate.getFullYear() + 30); // 30년
        break;
      default:
        break;
    }

    return maxEndDate;
  };

  const handleRepeatTypeChange = (event: SelectChangeEvent) => {
    console.log(event.target.value);
    setRepeatType(event.target.value as string);
  };

  const validateDateTimeFormat = (dateTime: string) => {
    const pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
    return pattern.test(dateTime);
  };

  const onSave = async () => {
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

    if (isRepeating) {
      const maxEndDate = getMaxRepeatEndDate(repeatType, startTime);
      if (new Date(repeatEndTime) > maxEndDate) {
        alert(
          `반복 종료 시간이 최대 허용 시간을 초과하였습니다. 최대 허용 시간: ${maxEndDate}`,
        );
        return;
      }
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
      repeatType,
      repeatEndTime: isRepeating ? repeatEndTime : null,
      assignedUserIds: isRandom ? null : assignedUserIds,
      randomUsersNum: isRandom ? randomUsersNum : null,
      userId: user.id,
    };

    setIsLoading(true);
    try {
      const res = await axios.post(
        'https://api-todos.neodohae.com/todos',
        { ...todo },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res) {
        if (res.status === 201) {
          alert('To-do이 생성되었습니다.');
          setIsLoading(false);
          router.back();
        }
      }
    } catch (error) {
      console.error('Error creating todo:', error);
    }
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

  const onCancel = () => {
    router.back();
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

    const isRepeating = isRepeat();
    if (isRepeating) {
      const maxEndDate = getMaxRepeatEndDate(repeatType, startTime);
      if (new Date(repeatEndTime) > maxEndDate) {
        setRepeatEndTimeMsg(
          `반복 종료 시간이 최대 허용 시간을 초과하였습니다. 최대 허용 시간: ${maxEndDate}`,
        );
      } else {
        setRepeatEndTimeMsg('');
      }
    }
  }, [startTime, repeatEndTime, repeatType]);

  useEffect(() => {
    if (!startTime || !endTime) return;
    if (new Date(endTime) <= new Date(startTime)) {
      setEndTimeMsg('끝나는 시간이 시작 시간보다 빠를 수 없습니다.');
    } else {
      setEndTimeMsg('');
    }
  }, [startTime, endTime]);

  useEffect(() => {
    if (!session) return;
    if (!user) return;
    getRoommates();
  }, [user]);

  useEffect(() => {
    if (!session) return;
    if (!session.user) return;
    setUser(session?.user);
  }, [session]);

  useEffect(() => {
    const current = new Date();
    current.setMinutes(Math.ceil(current.getMinutes() / 60) * 60, 0, 0);
    const start = formatISO(current).substring(0, 16);
    const end = formatISO(
      new Date(current.getTime() + 60 * 60 * 1000),
    ).substring(0, 16);
    setStartTime(start);
    setEndTime(end);
    setRepeatEndTime(end);
  }, []);

  return (
    <>
      <TopAppBar title="To-do 생성" />
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
                <ArrowForwardRoundedIcon fontSize="inherit" color="inherit" />
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

            if (isRepeating && new Date(repeatEndTime) <= new Date(startTime)) {
              alert('반복 종료 시간이 시작 시간보다 빠를 수 없습니다.');
              return;
            }

            if (isRepeating) {
              const maxEndDate = getMaxRepeatEndDate(repeatType, startTime);
              if (new Date(repeatEndTime) > maxEndDate) {
                alert(
                  `반복 종료 시간이 최대 허용 시간을 초과하였습니다. 최대 허용 시간: ${maxEndDate}`,
                );
                return;
              }
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

            onSave();
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
    background: ${(props) => (props.isActivated ? '#007bff' : '#999999')};
    border: 1px solid #e8e8e8;;
    border-radius: 10px;
    color: #fff;
    font-size: 16px;
    padding-top: 10px;
    padding-bottom: 10px;
`;

export default TodoCreate;
