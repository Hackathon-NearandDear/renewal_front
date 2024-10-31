import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import "../styles/globals.css";
import { Wallet, NearContext } from "@/components/wallet/Near";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import { NetworkId } from "@/utils/config";

type PageComponentProps = {
  title: string;
};

const wallet = new Wallet({ networkId: NetworkId });

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const PageComponent = Component as React.ComponentType<PageComponentProps>;
  const [signedAccountId, setSignedAccountId] = useState("");

  useEffect(() => {
    wallet.startUp(setSignedAccountId);
  }, []);

  const isLandingPage = router.pathname === "/";
  const isSetProfilePage = router.pathname === "/setprofile";

  if (isLandingPage || isSetProfilePage) {
    return (
      <NearContext.Provider value={{ wallet, signedAccountId }}>
        <PageComponent {...pageProps} />
      </NearContext.Provider>
    );
  }

  return (
    <NearContext.Provider value={{ wallet, signedAccountId }}>
      <Layout title={pageProps.title || "Near N Dear"}>
        <PageComponent {...pageProps} />
      </Layout>
    </NearContext.Provider>
  );
}

export default MyApp;
