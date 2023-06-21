import React from 'react';
import Styled from 'styled-components'
import { useRouter } from 'next/router'
import { BottomNavigation, BottomNavigationAction } from '@mui/material';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import FormatListNumberedRoundedIcon from '@mui/icons-material/FormatListNumberedRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import ChatRoundedIcon from '@mui/icons-material/ChatRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

const BottomNav = () => {
    const router = useRouter();
    const [value, setValue] = React.useState(0);

    return (
        <WrapBox>
            <BottomNavigation
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                showLabels
            >
                <BottomNavigationAction label="홈" icon={<HomeRoundedIcon />} onClick={() => router.push('/')} />
                <BottomNavigationAction label="To-Do" icon={<FormatListNumberedRoundedIcon />} onClick={() => router.push('/todo')} />
                <BottomNavigationAction label="스케줄" icon={<CalendarMonthRoundedIcon />} onClick={() => router.push('/schedule')} />
                <BottomNavigationAction label="채팅" icon={<ChatRoundedIcon />} onClick={() => router.push('/chat')} />
                <BottomNavigationAction label="마이" icon={<PersonRoundedIcon />} onClick={() => router.push('/profile')} />
            </BottomNavigation>
        </WrapBox>
    );
};

const WrapBox = Styled.div`
    display: none;
    @media (max-width: 650px) {
        height: 80px;
        width: 100%;
        position: fixed;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 5;
        background: #ffffff;
    }
`

export default BottomNav;