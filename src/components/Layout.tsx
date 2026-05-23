import React, { type ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-screen">
      <div className="h-[90%] flex">
        <Sidebar />
        <div className="custom-scrollbar w-full m-2 px-6 pt-4 rounded-2xl bg-[#1F1F1F] text-white overflow-y-auto lg:w-[75%] lg:ml-0">
          <Navbar />
          {children}
        </div>
      </div>
      {/* ✅ Player yahan se hataya — ab App.tsx mein Routes ke bahar render hoga */}
    </div>
  );
};

export default Layout;