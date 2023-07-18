import { Metadata } from 'next';
import type { NextPage } from 'next';
import Head from 'next/head';
import { Game } from '../components/Game';
import styles from '../styles/Home.module.scss';
export const metadata: Metadata = {
  title: `20 Questions with GPT-3`,
  icons: {
    icon: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  themeColor: [
    {
      color: '#ffffff',
    },
  ],
};

const Home: NextPage = () => {
  return (
    <>
      <Head>
        {/* title was removed */}
        {/* link was removed */}
        {/* link was removed */}
        {/* link was removed */}
        {/* link was removed */}
        {/* link was removed */}
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        {/* meta was removed */}
      </Head>

      {/* <NavBar /> */}
      <main className={styles.main}>
        <div className="">
          <h1 className="text-4xl m-5">
            Play{' '}
            <a
              href="https://en.wikipedia.org/wiki/Twenty_questions"
              target="_blank"
              rel="noreferrer"
              className={styles.mainlink}>
              20 Questions
            </a>{' '}
            with Sassy GPT-3
          </h1>
          <h2 className="text-lg">
            Can you defeat the world&apos;s{' '}
            <a
              href="https://en.wikipedia.org/wiki/GPT-3"
              target="_blank"
              rel="noreferrer"
              className={styles.mainlink}>
              smartest AI
            </a>{' '}
            ?
          </h2>
          <p className="text-sm text-gray-400 my-1 mx-4">
            By playing, you agree to the&nbsp;
            <a
              className={styles.mainlink}
              href="https://openai.com/api/policies/terms/"
              target="_blank"
              rel="noreferrer">
              terms of service
            </a>
            , and acklowledge the AI might say wild stuff.
          </p>
        </div>
      </main>

      <Game />
    </>
  );
};

export default Home;
