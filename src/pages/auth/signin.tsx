import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Styled from 'styled-components';
import Image from 'next/image';

import LOGO from '@/assets/images/neodohae_logo.png';
import GOOGLE_SIGNIN from '@/assets/images/google_signin.png';
import KAKAO_SIGNIN from '@/assets/images/kakao_signin.png';
import NAVER_SIGNIN from '@/assets/images/naver_signin.png';
import GITHUB_SIGNIN from '@/assets/images/github_signin.png';

const SignIn = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log('session', session);
    // if (session) {
    //   router.back();
    // }
  }, [session]);

  return (
    <WrapBox>
      <SignInBox>
        <IntroBox>
          <LogoBox>
            <LogoBtn src={LOGO} alt="Logo" />
          </LogoBox>
          <ServiceName>너도해</ServiceName>
          <ServiceDescription>
            편안한 공동 생활을 도와주는 서비스
          </ServiceDescription>
        </IntroBox>
        <SignButtonBox>
          <SignInTitle>다른 서비스로 로그인</SignInTitle>
          <ProviderListBox>
            <ProviderDiv
            // onClick={() => signIn("kakao")}
            >
              <ProviderImage src={KAKAO_SIGNIN} alt={'KAKAO_SIGNIN'} />
            </ProviderDiv>
            <ProviderDiv
            // onClick={() => signIn("naver")}
            >
              <ProviderImage src={NAVER_SIGNIN} alt={'NAVER_SIGNIN'} />
            </ProviderDiv>
            <ProviderDiv onClick={() => signIn('google')}>
              <ProviderImage src={GOOGLE_SIGNIN} alt={'GOOGLE_SIGNIN'} />
            </ProviderDiv>
            <ProviderDiv
            // onClick={() => signIn("github")}
            >
              <ProviderImage src={GITHUB_SIGNIN} alt={'GITHUB_SIGNIN'} />
            </ProviderDiv>
          </ProviderListBox>
        </SignButtonBox>
      </SignInBox>
    </WrapBox>
  );
};

const WrapBox = Styled.div`
    z-index: 99;
    position: fixed;
    width: 100%;
    height: 100%;
    min-width: 100vw;
    min-height: 100vh;
    top: 0;
    left: 0;
    background-color: #f8f8fc;
    &>div{
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        left: 50%;
    }
`;

const SignInBox = Styled.div`
  display: flex;
  flex-direction: row;
	box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.25);
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const IntroBox = Styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
	background-color: #842d7d;
	padding: 20px;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const LogoBox = Styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LogoBtn = Styled(Image)`
  width: 80px;
  height: 80px;
	margin-bottom: 10px;
`;

const ServiceName = Styled.div`
  text-align: center;
	font-size: 1.5rem;
	font-weight: 700;
	color: #ffffff;
	margin-bottom: 10px;
`;

const ServiceDescription = Styled.div`
  text-align: center;
	font-size: 0.8rem;
	font-weight: 400;
	color: #ffffff;
`;

const SignButtonBox = Styled.div`
	background-color: #ffffff;
  width: 50%;
	padding: 30px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const SignInTitle = Styled.div`
		font-size: 1rem;
		font-weight: 700;
		color: #666666;
		margin-bottom: 20px;
`;
const ProviderListBox = Styled.div`
    max-width: 300px;
    width: 100%;
    height: auto;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const ProviderDiv = Styled.div`
    width: 100%;
    padding: 3px 15px;
    height: auto;
    cursor: pointer;
`;
const ProviderImage = Styled(Image)`
    width: 100%;
    height: auto;
    aspect-ratio: 4.15 / 1;
    box-shadow: rgba(0, 0, 0, 0.27) 0px 0px 15px 3px;
    border-radius: 10px;
`;

export default SignIn;
