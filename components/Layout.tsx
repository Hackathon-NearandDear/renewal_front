import { useEffect, useState } from "react";
import Head from "next/head";
import Header from "./Header";
import FooterBar from "./FooterBar";
import { LayoutProps } from "@/utils/interface";
import { useRouter } from "next/router";
import Sidebar from "./chat/Sidebar";

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // AI 채팅 페이지인지 확인
  const isAIChat = /^\/ai\/[^/]+\/chat/.test(router.asPath);

  return (
    <div className="max-w-[600px] mx-auto h-screen flex justify-center">
      <Head>
        <title>{title} | ApptoS</title>
        <meta name="description" content="AI Chat Application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full h-full flex flex-col">
        <Header
          title={title}
          onToggleSidebar={isAIChat ? toggleSidebar : undefined}
        />

        <main className="flex-grow overflow-y-auto px-4 scrollbar-hide">
          {children}
        </main>
        <FooterBar />
      </div>

      {isAIChat && (
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
