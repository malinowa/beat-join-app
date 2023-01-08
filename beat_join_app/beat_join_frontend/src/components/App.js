import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { CreateRoomPage } from "./CreateRoomPage";
import { HomePage } from "./HomePage";
import { JoinRoomPage } from "./JoinRoomPage";
import { Room } from "./Room";
import {
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
    Outlet
} from "react-router-dom";

export default function App (props) {
    return <Outlet/>;
}

const router = createBrowserRouter(
    createRoutesFromElements(
                <Route path="" element={<App/>}>
                        <Route path="/" element={<HomePage/>}/>
                        <Route path="create" element={<CreateRoomPage/>}/>
                        <Route path="join" element={<JoinRoomPage/>}/>
                        <Route path="room/:roomCode" element={<Room />}/>
                </Route>
    )
);

ReactDOM.createRoot(document.getElementById("app")).render(<RouterProvider router={router} />)

