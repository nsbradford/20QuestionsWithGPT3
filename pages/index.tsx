import type { NextPage } from 'next';
import Head from 'next/head';
import { Game } from '../components/Game';
import styles from '../styles/Home.module.scss';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>20 Questions with GPT-3</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>

      {/* <NavBar /> */}
      <main className={styles.main}>
        <div className="">
          <h1 className="text-4xl m-5">Play 20 Questions with GPT-3</h1>
          <h2 className="text-lg">Can you defeat the world's smartest AI?</h2>
          <p className="text-xs italic p-4">
            By playing, I agree to the{' '}
            <a className="hover:underline text-violet-400" href="">
              terms of service
            </a>
            , mainly acklowledging the AI might say some pretty wild stuff.
          </p>
        </div>
      </main>

      <Game />
    </>
  );
};

export default Home;
