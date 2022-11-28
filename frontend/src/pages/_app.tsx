import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import theme from "../theme";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ChakraProvider resetCSS theme={theme}>
        <Head>
          <title>Share.it</title>
          <meta name="viewport" content="width=320, initial-scale=1"></meta>
        </Head>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}

export default MyApp;
