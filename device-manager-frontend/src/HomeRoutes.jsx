import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ViewLocation from "./components/ViewLocation";
import NoContent from "./Nocontent";
import ViewDevices from "./components/ViewDevices";

export default function HomeRoutes() {

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<ViewLocation />} />
                    <Route path="/home" element={<ViewLocation />} />
                    <Route path="/showDevices" element={<ViewDevices />} />
                    <Route path="*" element={<NoContent />} />
                </Routes>

                
            </BrowserRouter>
        </>

        

    );

}
