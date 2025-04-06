import "../styles/globals.scss";
import "prism-themes/themes/prism-nord.css";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;

