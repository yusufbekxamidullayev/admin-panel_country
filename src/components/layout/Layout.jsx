import React, { useState } from 'react';
import {
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, message, Popconfirm, Select, theme } from 'antd';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { BsGlobe2 } from 'react-icons/bs';
import { GoPeople } from 'react-icons/go';
import { MdDateRange } from 'react-icons/md';
import { VscBook } from 'react-icons/vsc';
import { toast } from 'react-toastify';

const { Header, Sider, Content } = Layout;

const LayoutAdmin = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [messageApi] = message.useMessage();
    const navigate = useNavigate();

    const confirmLogout = () => {
        messageApi.success("Logout successful!");
        navigate("/");  
        toast.success("Tizimdan muvaffaqiyatli chiqildi")
    };

    const cancelLogout = () => {
        messageApi.error("Logout canceled!");
        toast.warning("Logout bekor qilindi", {
            position: "top-right",
            autoClose: 2500,
            pauseOnHover: true,
            draggable: true,
        });
    };

    return (
        <Layout style={{ height: "100vh" }}>
            <Sider style={{ paddingTop: "35px" }} trigger={null} collapsible collapsed={collapsed}>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={[
                        {
                            key: '1',
                            icon: <BsGlobe2 />,
                            label: <NavLink to={"/countries"}>Countries</NavLink>,
                        },
                        {
                            key: '2',
                            icon: <GoPeople />,
                            label: <NavLink to={"/cities"}>Tours and cities</NavLink>,
                        },
                        {
                            key: '3',
                            icon: <MdDateRange />,
                            label: <NavLink to={"/tours"}>Tour paketlar</NavLink>,
                        },
                        {
                            key: '4',
                            icon: <VscBook />,
                            label: <NavLink to={"/hotels"}>Hotel</NavLink>,
                        },
                        {
                            key: '5',
                            icon: <VscBook />,
                            label: <NavLink to={"/destinations"}>Destination</NavLink>,
                        },
                    ]}
                />
            </Sider>

            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingRight: "40px",
                    }}
                >
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />

                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Select
                            defaultValue="English"
                            style={{ width: 120 }}
                            options={[
                                { value: 'English', label: 'English' },
                                { value: 'Uzbek', label: 'Uzbek' },
                            ]}
                        />

                        <Popconfirm
                            placement="leftTop"
                            title="Confirmation"
                            description="Are you sure you want to logout?"
                            onConfirm={confirmLogout}
                            onCancel={cancelLogout}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                type="primary"
                                icon={<LogoutOutlined />}
                                style={{ display: "flex", alignItems: "center" }}
                            />
                        </Popconfirm>
                    </div>
                </Header>

                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        height: "100%",
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default LayoutAdmin;
