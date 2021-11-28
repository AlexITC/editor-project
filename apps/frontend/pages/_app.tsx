// I have no idea why this is required, the sample from stale-collaborative didn't had it, it is
// possibly that this is caused by using a newer node version, solution based in:
// - https://github.com/JamesBrill/react-speech-recognition#regeneratorruntime-is-not-defined
//
// Needed for the generator functions which are transpiled from your async await keywords
import 'regenerator-runtime/runtime'

import Head from 'next/head'
import type { AppProps } from 'next/app'
import CssBaseline from '@mui/material/CssBaseline'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>
      <CssBaseline />
      <Component {...pageProps} />
    </>
  )
}
export default MyApp
