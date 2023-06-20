import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import Script from 'next/script';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext,
  ): Promise<DocumentInitialProps> {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: [
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>,
        ],
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <meta name="theme-color" content="#ffffff" />
          <meta name="author" content="너도해" />
          <meta
            name="description"
            content="너도해는 룸메이트와의 관계를 개선하고, 편안한 공동 생활을 도와주는 서비스입니다. 잘 정리된 관리 방법으로 모두가 행복한 쉐어하우스 생활을 누릴 수 있게 도와드립니다!"
          />
          <meta name="keywords" content="룸메이트, 공동 생활, 관리 방법, 서비스, 생활 팁, 이해관계, 쉐어하우스" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://neodohae.com" />
          <meta
            property="og:title"
            content="모두가 행복한 쉐어하우스를 위한, 너도해 | 룸메이트 관계 개선 서비스"
          />
          <meta property="og:image" content="/neodohae_profile.png" />
          <meta
            property="og:description"
            content="너도해는 룸메이트와의 관계를 개선하고, 편안한 공동 생활을 도와주는 서비스입니다. 잘 정리된 관리 방법으로 모두가 행복한 쉐어하우스 생활을 누릴 수 있게 도와드립니다!"
          />
          <meta property="og:site_name" content="너도해" />
          <meta property="og:locale" content="ko_KR" />
          <meta property="og:image:width" content="800" />
          <meta property="og:image:height" content="400" />
          <link rel="manifest" href="/manifest.json" />
          {/* <meta
            name="naver-site-verification"
            content="2a66d49903f97caf7fc50100567da84038ad77d8"
          /> */}
          {/* <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=G-4JQKSR8VFJ`}
          />
          <Script
            id="gtag-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-4JQKSR8VFJ');
                    `,
            }}
          /> */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
