import Head from "next/head";
import { ConfigProvider, theme } from "antd";
import Checker from "./Checker";
export default function Home() {
  const openSourceUrl = "https://github.com/chenlike/nimble-checker"
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
      </main>
    </>
  );
}
