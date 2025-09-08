import { Outlet } from "react-router-dom";
import Header from "@/components/header";

const AppLayout = () => {
    return (
        <div>
            <main className="min-h-screen container px-10 py-3 ">
            <Header />
            <Outlet />
            {/*body*/}
            </main>
            
            <div className="p-10 text-center bg-gray-800 mt-10">
                Made with ❤️ by Sri Hari L 
            </div>
        </div>
    );
};

export default AppLayout;