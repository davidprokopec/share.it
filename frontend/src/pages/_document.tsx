import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <title>Share.it</title>
        <link rel="shortcut icon" href="/public/favicon.ico" />
        <meta name="viewport" content="width=320, initial-scale=1"></meta>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
