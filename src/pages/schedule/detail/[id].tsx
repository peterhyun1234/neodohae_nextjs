import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import TopAppBarScheduleDetail from '@/components/appBar/TopAppBarScheduleDetail';
import Styled from 'styled-components';
import LoadingPopup from '@/components/popup/LoadingPopup';

import TextField from '@mui/material/TextField';
import TitleRoundedIcon from '@mui/icons-material/TitleRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';

const tempSchedule = {
    id: 1,
    title: '전현빈 일정 Temp',
    startTime: '2023-07-10T10:10',
    endTime: '2023-07-10T11:10',
    description: '부산으로 자전거 타고 여행가고 싶다',
};

const ScheduleDetail = () => {
    const router = useRouter();
    const { id } = router.query;

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isModified, setIsModified] = useState<boolean>(false);
    const [inputSchedule, setInputSchedule] = useState<any>(null);

    const [title, setTitle] = useState<string>('')
    const [startTime, setStartTime] = useState<string>('')
    const [endTime, setEndTime] = useState<string>('')
    const [endTimeMsg, setEndTimeMsg] = useState<string>('')
    const [description, setDescription] = useState<string>('')

    const validateDateTimeFormat = (dateTime: string) => {
        const pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
        return pattern.test(dateTime);
    };

    const onSave = () => {
        if (!isModified) {
            alert('수정된 내용이 없습니다.');
            return;
        }
        if (!title.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }
        if (!validateDateTimeFormat(startTime) || !validateDateTimeFormat(endTime)) {
            alert('시작 시간 또는 끝나는 시간이 잘못된 형식입니다.');
            return;
        }
        if (new Date(endTime) <= new Date(startTime)) {
            alert('끝나는 시간이 시작 시간보다 빠를 수 없습니다.');
            return;
        }

        // TODO:
        // fetch('/api/save', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         title,
        //         startTime,
        //         endTime,
        //         description,
        //     }),
        // });
    }

    const onCancel = () => {
        router.back();
    }

    const getSchedule = async (id: number) => {
        //TODO: api needed
        setIsLoading(true);
        const fetchedSchedule = tempSchedule;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setInputSchedule(fetchedSchedule);
        setIsLoading(false);
    };

    const deleteSchedule = async () => {
        //TODO: api needed
        alert('삭제하시겠습니까?(기능 구현 중)');
    };

    useEffect(() => {
        const updatingSchedule = {
            id: inputSchedule?.id,
            title,
            startTime,
            endTime,
            description,
        };
        if (JSON.stringify(updatingSchedule) !== JSON.stringify(inputSchedule)) {
            setIsModified(true);
        } else {
            setIsModified(false);
        }
    }, [title, startTime, endTime, description, inputSchedule]);

    useEffect(() => {
        if (!inputSchedule) return;
        setTitle(inputSchedule?.title);
        setStartTime(inputSchedule?.startTime);
        setEndTime(inputSchedule?.endTime);
        setDescription(inputSchedule?.description);
    }, [inputSchedule]);

    useEffect(() => {
        if (!id) return;
        console.log('id: ', id)
        if (id && Number.isInteger(Number(id)) && Number(id) >= 1) {
            getSchedule(Number(id));
        } else {
            alert("잘못된 스케줄 아이디입니다.");
        }
    }, [id]);

    return (
        <>
            {isLoading && <LoadingPopup />}
            {
                inputSchedule &&
                <>
                    <TopAppBarScheduleDetail title={inputSchedule?.title} deleteSchedule={deleteSchedule} />
                    <WrapBox>
                        <InputBoxList>
                            <InputBox>
                                <InputBoxIconDiv>
                                    <TitleRoundedIcon fontSize='inherit' color='inherit' />
                                </InputBoxIconDiv>
                                <TextField
                                    id="schedule-title"
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
                                    <DescriptionRoundedIcon fontSize='inherit' color='inherit' />
                                </InputBoxIconDiv>
                                <TextField
                                    id="schedule-description"
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
                                    <AccessTimeRoundedIcon fontSize='inherit' color='inherit' />
                                </InputBoxIconDiv>
                                <InputBoxTitle>시간 설정</InputBoxTitle>
                            </InputBox>
                            {
                                startTime !== '' && endTime !== '' &&
                                <InputBox>
                                    <TimeDiv>
                                        <Input type="datetime-local" value={startTime} onChange={(e) => {
                                            setStartTime(e.target.value)
                                        }
                                        } />
                                        <InputMessage />
                                    </TimeDiv>
                                    <ArrowIconDiv>
                                        <InputBoxIconDiv>
                                            <ArrowForwardRoundedIcon fontSize='inherit' color='inherit' />
                                        </InputBoxIconDiv>
                                        <InputMessage />
                                    </ArrowIconDiv>
                                    <TimeDiv>
                                        <Input type="datetime-local" value={endTime} onChange={(e) => {
                                            const selectedTime = new Date(e.target.value);
                                            if (selectedTime < new Date(startTime)) {
                                                setEndTimeMsg('끝나는 시간이 시작 시간보다 빠릅니다.');
                                            } else {
                                                setEndTimeMsg('');
                                            }
                                            setEndTime(e.target.value)
                                        }
                                        } />
                                        <InputMessage>{endTimeMsg}</InputMessage>
                                    </TimeDiv>
                                </InputBox>
                            }
                        </InputBoxList>
                    </WrapBox>
                    <ButtonBar>
                        <CancelButton onClick={onCancel}>취소</CancelButton>
                        <SaveButton 
                            onClick={() => {
                                if (!isModified) {
                                    alert('수정된 내용이 없습니다.');
                                    return;
                                }
                                if (!title.trim()) {
                                    alert('제목을 입력해주세요.');
                                    return;
                                }
                                if (!validateDateTimeFormat(startTime) || !validateDateTimeFormat(endTime)) {
                                    alert('시작 시간 또는 끝나는 시간이 잘못된 형식입니다.');
                                    return;
                                }
                                if (new Date(endTime) <= new Date(startTime)) {
                                    alert('끝나는 시간이 시작 시간보다 빠를 수 없습니다.');
                                    return;
                                }
                                onSave();
                            }} 
                            isActivated={isModified && title.trim() && (validateDateTimeFormat(startTime) && validateDateTimeFormat(endTime)) && (new Date(endTime) > new Date(startTime)) ? true : false}>수정</SaveButton>
                    </ButtonBar>
                </>
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
`
const InputBoxList = Styled.div`
    width: 100%;
    max-width: 700px;
    margin: 0 auto;
    padding: 16px;
`
const InputBox = Styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 16px;
`
const InputBoxDivider = Styled.div`
    width: 100%;
    height: 1px;
    background-color: #e2e2e2;
    margin-bottom: 16px;
`
const InputBoxIconDiv = Styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    font-size: 25px;
    color: #999;
    height: 50px;
`
const InputBoxTitle = Styled.div`
    display: flex;
    justify-content: left;
    align-items: center;
    width: 100%;
    font-size: 16px;
    color: #999;
    height: 40px;
`
const ArrowIconDiv = Styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 40px;
`
const TimeDiv = Styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: calc(50% - 25px);
`
const Input = Styled.input`
    width: 100%;
    padding: 5px;
`
const InputMessage = Styled.div`
    height: 50px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    color: #c05e5e;
    text-align: left;
`
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
    gap: 10px;
`
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
`
const SaveButton = Styled.button<{ isActivated: boolean }>`
    width: 100%;
    flex: 1;
    background: ${props => props.isActivated ? '#00b624' : '#999999'};
    border: 1px solid #e8e8e8;;
    border-radius: 10px;
    color: #fff;
    font-size: 16px;
    padding-top: 10px;
    padding-bottom: 10px;
`

export default ScheduleDetail;
