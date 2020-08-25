import React from 'react';
import { connect } from 'react-redux';
import './App.css';
import 'antd/dist/antd.css'
import { Layout, Menu } from 'antd';
import {
    DesktopOutlined,
    FileOutlined,
    // TeamOutlined,
    // UserOutlined,
    SettingOutlined,
} from '@ant-design/icons';

import {
    HashRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
} from "react-router-dom";
import { createHashHistory } from 'history';

// import getData from './getData'
// import getURL from './getURL'

import PannelMuseum from './components/PannelMuseum'
import ThemeCards from './components/ThemeCards'
import PageRegister from './components/PageRegister'
import PanelHome from './components/PanelHome'
import PanelBook from './components/PanelBook'
import PanelSettings from './components/PanelSettings'
import PanelAlter from './components/PanelAlter';

const { Header, Content, Sider } = Layout;
// const { SubMenu } = Menu;

class App extends React.Component {
    state = {
        collapsed: true,
    };

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
    };

    componentDidMount() {
        // console.log(history.location.pathname)
    }

    render() {
        // 如果没有本地数据，先初始化
        // let loc = local.getLocObj()
        // if (!loc) {
        //     local.initLoc()
        // }
        // let userName = local.getLocUserName()
        // let avatar = local.getLocAvatar()
        let history = createHashHistory()
        let pathName = history.location.pathname
        // 如果没有用户信息，先前往注册
        if (this.props.userName === null || this.props.avatar === null) {
            // museum可无需用户信息访问
            if (!pathName.includes('/museum')) {
                history.replace('/register')
            }
        }
        return (
            <Router>
                <Switch>
                    <Route exact path="/register">
                        <PageRegister />
                    </Route>
                    <Route path="/">
                        <Layout style={{ minHeight: '100vh' }}>
                            <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                                <div className="logo_main">
                                    <img src="logo.png" alt="" />
                                </div>
                                <Menu theme="dark" defaultSelectedKeys={[pathName]} mode="inline">
                                    <Menu.Item key="/home" icon={<DesktopOutlined />}>
                                        <Link to="/home">我的</Link>
                                    </Menu.Item>
                                    {/* <SubMenu key="/friends" icon={<UserOutlined />} title="好友">
                                        <Menu.Item key="3">心月</Menu.Item>
                                        <Menu.Item key="4">泠泠弦上</Menu.Item>
                                        <Menu.Item key="5">Lynn</Menu.Item>
                                        <Menu.Item key="6">蜂蜜小黄鱼</Menu.Item>
                                        <Menu.Item key="7">落雪无痕</Menu.Item>
                                    </SubMenu>
                                    <SubMenu key="/normalfriends" icon={<TeamOutlined />} title="卡友">
                                        <Menu.Item key={Math.random()}>3646785456</Menu.Item>
                                        <Menu.Item key={Math.random()}>3646785450</Menu.Item>
                                        <Menu.Item key={Math.random()}>3646785450</Menu.Item>
                                        <Menu.Item key={Math.random()}>3646785450</Menu.Item>
                                        <Menu.Item key={Math.random()}>3646785450</Menu.Item>
                                        <Menu.Item key={Math.random()}>3646785450</Menu.Item>
                                        <Menu.Item key={Math.random()}>3646785450</Menu.Item>
                                        <Menu.Item key={Math.random()}>3646785450</Menu.Item>
                                    </SubMenu> */}
                                    <Menu.Item key="/museum" icon={<FileOutlined />}>
                                        <Link to="/museum">博物馆</Link>
                                    </Menu.Item>
                                    <Menu.Item key="/settings" icon={<SettingOutlined />}>
                                        <Link to="/settings">设置</Link>
                                    </Menu.Item>
                                </Menu>
                            </Sider>
                            <Layout className="site-layout">
                                <Switch>
                                    <Route path="/home">
                                        <Header className="site-layout-background" style={{ padding: 0 }}>
                                            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={pathName.includes('/home') ? [pathName] : ['/home']}>
                                                < Menu.Item key="/home/book" >
                                                    <Link to="/home/book">集卡册</Link>
                                                </Menu.Item>
                                                <Menu.Item key="/home">
                                                    <Link to="/home">卡片合成</Link>
                                                </Menu.Item>
                                                <Menu.Item key="/home/alter">
                                                    <Link to="/home/alter">变卡</Link>
                                                </Menu.Item>
                                                {/* <Menu.Item key="/home/bonus">
                                                    <Link to="/home/bonus">道具</Link>
                                                </Menu.Item>
                                                <Menu.Item key="/home/user">
                                                    <Link to="/home/user">个人信息</Link>
                                                </Menu.Item> */}
                                            </Menu>
                                        </Header>
                                    </Route>
                                    <Route path="/museum">
                                    </Route>
                                </Switch>
                                <Content style={{ margin: '0 16px' }}>
                                    <div className="site-layout-background" style={{ padding: '24px 8px', minHeight: 'calc(100vh - 64px)' }}>
                                        <Switch>
                                            <Route exact path="/">
                                                <Redirect to="/home" />
                                            </Route>
                                            <Route exact path="/home">
                                                <PanelHome />
                                            </Route>
                                            <Route exact path="/home/book">
                                                <PanelBook />
                                            </Route>
                                            <Route exact path="/home/alter">
                                                <PanelAlter />
                                            </Route>
                                            <Route exact path="/home/user">
                                                <PageRegister checkRegistered={false} />
                                            </Route>
                                            <Route exact path="/museum">
                                                <PannelMuseum />
                                            </Route>
                                            <Route exact path="/settings">
                                                <PanelSettings />
                                            </Route>
                                            <Route path="/theme_card/:theme_id" component={_getThemeCards}>
                                            </Route>
                                        </Switch>
                                    </div>
                                </Content>
                            </Layout>
                        </Layout>
                    </Route>
                </Switch>
            </Router >
        );
    }
}

function _getThemeCards({ match }) {
    return (
        <ThemeCards theme_id={match.params.theme_id}></ThemeCards>
    )
}

App.defaultProps = {
}

const mapStateToProps = (state) => {
    return {
        userName: state.userName,
        avatar: state.avatar
    }
}

export default connect(mapStateToProps, null)(App);