import React from "react";
import { createBrowserRouter } from "react-router-dom";
// import Chat from "../pages/chat";
// import Dashboard from "../pages/dashboard";

const ChatWrapper = React.lazy(
    async () => await import("../pages/chat")
);
const DashboardWrapper = React.lazy(
    async () => await import("../pages/dashboard")
);
const AboutWrapper = React.lazy(
    async () => await import("../pages/about")
);

const router = createBrowserRouter([
    {
        path: '/',
        element: <ChatWrapper />,
    },
    {
        path: '/dashboard',
        element: <DashboardWrapper />,
    },
    {
        path: '/about',
        element: (
            <AboutWrapper />
        ),
    },
    // {
    //     path: Utils.EndPoint.profile,
    //     element: (
    //         <PrivateRoute>
    //             <ProfileWrapper />
    //         </PrivateRoute>
    //     ),
    // },
]);

export default router;
