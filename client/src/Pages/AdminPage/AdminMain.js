import React from 'react';
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards } from "react-icons/hi";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminPage from './AdminPage';
import BlockedUsers from './BlockedUsers';

function AdminMain() {
    return (
        <Router>
            <div className="flex h-screen">
                {/* Sidebar */}
                <Sidebar aria-label="Sidebar with logo branding example">
                    <Sidebar.Logo href="#" img="/favicon.svg" imgAlt="kq">
                        KaziQonnect
                    </Sidebar.Logo>
                    <Sidebar.Items>
                        <Sidebar.ItemGroup>
                            <Sidebar.Item href="" icon={HiChartPie}>
                                Dashboard
                            </Sidebar.Item>
                            <Sidebar.Item href="" icon={HiViewBoards}>
                                Kanban
                            </Sidebar.Item>
                            <Sidebar.Item href="" icon={HiInbox}>
                                Inbox
                            </Sidebar.Item>
                            <Sidebar.Item href="/users" icon={HiUser}>
                                Users   
                            </Sidebar.Item>
                            <Sidebar.Item href="/blocked" icon={HiShoppingBag}>
                                Blocked
                            </Sidebar.Item>
                            <Sidebar.Item href="" icon={HiArrowSmRight}>
                                Sign In
                            </Sidebar.Item>
                            <Sidebar.Item href="" icon={HiTable}>
                                Sign Up
                            </Sidebar.Item>
                        </Sidebar.ItemGroup>
                    </Sidebar.Items>
                </Sidebar>

                {/* Main Content Area */}
                <div className="flex-grow p-4">
                    <Routes>
                        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
                        {/* <Route path="/kanban" element={<Kanban />} /> */}
                        {/* <Route path="/inbox" element={<Inbox />} /> */}
                        <Route path="/users" element={<AdminPage />} />
                        <Route path="/blocked" element={<BlockedUsers/>} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default AdminMain;
