import Head from "next/head";
import { ConfigProvider, theme } from "antd";
import Checker from "./Checker";
import { Analytics } from "@vercel/analytics/react"
import { useEffect } from "react"
export default function Home() {

  useEffect(() => {
    // 客户端相关代码在这里执行
    const script = document.createElement('script');
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return (
    <>

      <Head>
        <title>Nimble Balance Checker</title>
        <meta name="description" content="Nimble balance checker" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main >
        <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
          <Checker></Checker>
        </ConfigProvider>
        <Analytics/>
      </main>
    </>
  );

}
