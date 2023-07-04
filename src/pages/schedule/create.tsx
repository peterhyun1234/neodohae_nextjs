import { useEffect, useState } from 'react';
import Styled from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { formatISO } from 'date-fns';
import TopAppBar from '@/components/appBar/TopAppBar';

import TextField from '@mui/material/TextField';
import TitleRoundedIcon from '@mui/icons-material/TitleRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';


const ScheduleCreate = () => {
    const router = useRouter()

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [title, setTitle] = useState<string>('')
    const [startTime, setStartTime] = useState<string>('')
    const [endTime, setEndTime] = useState<string>('')
    const [endTimeMsg, setEndTimeMsg] = useState<string>('')
    const [description, setDescription] = useState<string>('')

    const validateDateTimeFormat = (dateTime: string) => {
        const pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
        return pattern.test(dateTime);
    };

    const onSave = async () => {
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

        alert('저장 기능 구현 중입니다.');
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoading(false);

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

    useEffect(() => {
        const current = new Date();
        current.setMinutes(Math.ceil(current.getMinutes() / 60) * 60, 0, 0);
        const start = formatISO(current).substring(0, 16);
        const end = formatISO(new Date(current.getTime() + 60 * 60 * 1000)).substring(0, 16);
        setStartTime(start);
        setEndTime(end);
    }, []);

    return (
        <>
            <TopAppBar title='스케줄 생성' />
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
                                <InputMessage/>
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
                <SaveButton onClick={() => {
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
                }} isActivated={title.trim() && (validateDateTimeFormat(startTime) && validateDateTimeFormat(endTime)) && (new Date(endTime) > new Date(startTime)) ? true : false}>저장</SaveButton>
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
    background: ${props => props.isActivated ? '#007bff' : '#999999'};
    border: 1px solid #e8e8e8;;
    border-radius: 10px;
    color: #fff;
    font-size: 16px;
    padding-top: 10px;
    padding-bottom: 10px;
`

export default ScheduleCreate;
