import Styled from 'styled-components';
import { useRouter } from 'next/router';

const Footer = () => {
  const router = useRouter();

  return (
    <WrapBox>
      <FooterContentDiv>
        <FooterInfoDiv>
          <FooterInfoTitle>{'연락처'}</FooterInfoTitle>
          <FooterInfoDescription>
            {'관리자 이메일: peterhyun1234@gmail.com'}
          </FooterInfoDescription>
          <TermsDiv>
            <TermDiv onClick={() => router.push('/privacyPolicy')}>
              {'개인정보처리방침'}
            </TermDiv>
            <TermDiv onClick={() => router.push('/terms')}>
              {'이용약관'}
            </TermDiv>
          </TermsDiv>
        </FooterInfoDiv>
      </FooterContentDiv>
    </WrapBox>
  );
};

const WrapBox = Styled.div`
  padding-top: 20px;
  background-color: #f2f2f2;
  text-align: center;
  padding-bottom: 100px;
`;
const FooterContentDiv = Styled.div`
  max-width: 1000px;
  margin: auto;
`;
const FooterInfoDiv = Styled.div`
  margin-top: 30px;
  margin-bottom: 30px;
`;
const FooterInfoTitle = Styled.div`
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 20px;
`;
const FooterInfoDescription = Styled.div`
  font-size: 20px;
  margin-bottom: 10px;
  cursor: pointer;
`;
const TermsDiv = Styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;
const TermDiv = Styled.div`
  font-size: 20px;
  text-decoration: underline;
  cursor: pointer;
`;
export default Footer;
