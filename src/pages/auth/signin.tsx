import React, { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Styled from 'styled-components';
import Image from 'next/image';

import LoadingPopup from '@/components/popup/LoadingPopup';

import LOGO from '@/assets/images/neodohae_logo_text.png';
import KAKAO_LOGO from '@/assets/images/kakao_logo.png';
import NAVER_LOGO from '@/assets/images/naver_logo.png';
import GOOGLE_LOGO from '@/assets/images/google_logo.png';
import GITHUB_LOGO from '@/assets/images/github_logo.png';

const SignIn = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session]);

  return (
    <>
    {
      isLoading && (
        <LoadingPopup/>
      )
    }
    <WrapBox>
      <SignInBox>
        <IntroBox>
          <LogoBox>
            <LogoBtn src={LOGO} alt="Logo" />
          </LogoBox>
          <ServiceDescription>
            편안한 공동 생활을 도와주는 서비스
          </ServiceDescription>
        </IntroBox>
        <SignButtonBox>
          <SignInTitle>다른 서비스로 로그인:</SignInTitle>
          <ProviderListBox>
            <ProviderDiv 
              onClick={() => {
                setIsLoading(true)
                signIn('kakao')
              }}
              bgColor={'#fee601'}
            >
              <ProviderLogoImage src={KAKAO_LOGO} alt={'KAKAO_LOGO'} />
              <ProviderText
                color={'#3c1e1e'}
              >
                카카오로 로그인
              </ProviderText>
            </ProviderDiv>
            <ProviderDiv
              onClick={() => {
                setIsLoading(true)
                signIn('naver')
              }}
              bgColor={'#04c75a'}
            >
              <ProviderLogoImage src={NAVER_LOGO} alt={'NAVER_LOGO'} />
              <ProviderText
                color={'#ffffff'}
              >
                네이버로 로그인
              </ProviderText>
            </ProviderDiv>
            <ProviderDiv
              onClick={() => {
                setIsLoading(true)
                signIn('google')
              }}
              bgColor={'#ffffff'}
            >
              <ProviderLogoImage src={GOOGLE_LOGO} alt={'GOOGLE_LOGO'} />
              <ProviderText
                color={'#7d8487'}
              >
                구글로 로그인
              </ProviderText>
            </ProviderDiv>
            <ProviderDiv
              onClick={() => {
                setIsLoading(true)
                signIn('github')
              }}
              bgColor={'#ffffff'}
            >
              <ProviderLogoImage src={GITHUB_LOGO} alt={'GITHUB_LOGO'} />
              <ProviderText
                color={'#151515'}
              >
                깃허브로 로그인
              </ProviderText>
            </ProviderDiv>
          </ProviderListBox>
        </SignButtonBox>
      </SignInBox>
    </WrapBox>
    </>
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
  background: linear-gradient(
    to bottom right, 
    rgba(115, 186, 210, 0.8),
    rgba(231, 239, 243, 0.8),
    rgba(228, 121, 228, 0.8)
  );
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(9, 30, 66, 0.34);
  }
`;
const SignInBox = Styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: #ffffff;
	box-shadow: 5px 5px 10px rgba(19, 16, 16, 0.25);
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  left: 50%;
  @media (max-width: 650px) {
    width: 100%;
  }
`;
const IntroBox = Styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
	padding: 20px;
  border-bottom: 1px solid #999999;
`;
const LogoBox = Styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const LogoBtn = Styled(Image)`
  width: 160px;
  height: 64px;
	margin-bottom: 10px;
`;
const ServiceDescription = Styled.div`
  text-align: center;
	font-size: 1rem;
	font-weight: 400;
	color: #666666;
`;
const SignButtonBox = Styled.div`
  width: 100%;
	padding: 30px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
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
const ProviderDiv = Styled.div<{ bgColor?: string }>`
    background-color: ${({ bgColor }) => bgColor || '#ffffff'};
    width: 100%;
    min-width: 300px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #999999;
    border-radius: 5px;
    margin-bottom: 15px;
    padding: 10px 15px;
    height: auto;
    cursor: pointer;
`;
const ProviderLogoImage = Styled(Image)`
    width: 40px;
    height: 40px;
`;
const ProviderText = Styled.div`
    font-size: 1rem;
    font-weight: 700;
    color: ${({ color }) => color || '#ffffff'};
    text-align: right;
`;

export default SignIn;
