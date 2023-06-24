import { SetStateAction, useEffect, useState } from 'react';
import Styled from 'styled-components'
import { useRouter } from 'next/router'

import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { styled } from '@mui/material/styles';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import FormatListNumberedRoundedIcon from '@mui/icons-material/FormatListNumberedRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import ChatRoundedIcon from '@mui/icons-material/ChatRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';


const CustomBottomNavigation = styled(BottomNavigation)({
  "& .Mui-selected": {
    color: "#5a5adc",
  },
  "& .MuiBottomNavigationAction-label": {
    fontSize: "0.8rem",
    marginTop: "4px",
  },
  "& .MuiButtonBase-root": {
    minWidth: "70px",
  },
});

const BottomNav = () => {
    const router = useRouter();
    const [value, setValue] = useState(0);

    const paths = ['/', '/todo', '/schedule', '/chat', '/myPage'];

    useEffect(() => {
        setValue(paths.indexOf(router.pathname));
    }, [router]);

    return (
        <WrapBox>
            <CustomBottomNavigation
                value={value}
                onChange={(event: any, newValue: any) => {
                    setValue(newValue);
                    router.push(paths[newValue]);
                }}
                showLabels
            >
                <BottomNavigationAction label="홈" icon={<HomeRoundedIcon />} />
                <BottomNavigationAction label="To-Do" icon={<FormatListNumberedRoundedIcon />} />
                <BottomNavigationAction label="스케줄" icon={<CalendarMonthRoundedIcon />} />
                <BottomNavigationAction label="채팅" icon={<ChatRoundedIcon />} />
                <BottomNavigationAction label="마이" icon={<PersonRoundedIcon />} />
            </CustomBottomNavigation>
        </WrapBox>
    );
};

const WrapBox = Styled.div`
    display: none;
    @media (max-width: 650px) {
      box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
      border-radius: 20px 20px 0 0;
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