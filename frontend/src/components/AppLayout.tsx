import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
