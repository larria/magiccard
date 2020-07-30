import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import './index.css';
import 'antd/dist/antd.css'
import { Layout, Menu, Breadcrumb } from 'antd';
import {
  DesktopOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  SettingOutlined,
} from '@ant-design/icons';

import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import {
  createHashHistory
} from 'history';

import getData from './getData'
import getURL from './getURL'
import * as local from './local'

import PannelMuseum from './component/PannelMuseum'
import ThemeCards from './component/ThemeCards'
import PageRegister from './component/PageRegister'

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class MagicCard extends React.Component {
  state = {
    collapsed: true,
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  componentDidMount() {
    let loc = local.getLocObj()
    let userInfo = local.getLocUser()
    let history = createHashHistory()
    if (!loc) {
      local.initLoc()
    }
    if (!userInfo) {
      history.replace('/register')
    }
    // console.log(history.location.pathname)
    console.log(history)
  }

  render() {
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
                  <img src="logo_small.jpeg" alt="" />
                </div>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                  <Menu.Item key="1" icon={<DesktopOutlined />}>
                    <Link to="/home">首页</Link>
                  </Menu.Item>
                  <SubMenu key="sub1" icon={<UserOutlined />} title="好友">
                    <Menu.Item key="3">心月</Menu.Item>
                    <Menu.Item key="4">泠泠弦上</Menu.Item>
                    <Menu.Item key="5">Alex</Menu.Item>
                  </SubMenu>
                  <SubMenu key="sub2" icon={<TeamOutlined />} title="卡友">
                    <Menu.Item key="6">3646785456</Menu.Item>
                    <Menu.Item key={Math.random()}>3646785450</Menu.Item>
                    <Menu.Item key={Math.random()}>3646785450</Menu.Item>
                    <Menu.Item key={Math.random()}>3646785450</Menu.Item>
                    <Menu.Item key={Math.random()}>3646785450</Menu.Item>
                    <Menu.Item key={Math.random()}>3646785450</Menu.Item>
                    <Menu.Item key={Math.random()}>3646785450</Menu.Item>
                    <Menu.Item key={Math.random()}>3646785450</Menu.Item>
                  </SubMenu>
                  <Menu.Item key="9" icon={<FileOutlined />}>
                    <Link to="/museum">博物馆</Link>
                  </Menu.Item>
                  <Menu.Item key="10" icon={<SettingOutlined />}>
                    <Link to="/settings">设置</Link>
                  </Menu.Item>
                </Menu>
              </Sider>
              <Layout className="site-layout">
                <Switch>
                  <Route path="/home">
                    <Header className="site-layout-background" style={{ padding: 0 }}>
                      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                        <Menu.Item key="1">
                          <Link to="/home/book">集卡册</Link>
                        </Menu.Item>
                        <Menu.Item key="2">
                          <Link to="/home/">卡片合成</Link>
                        </Menu.Item>
                        <Menu.Item key="3">
                          <Link to="/home/change">变卡</Link>
                        </Menu.Item>
                        <Menu.Item key="4">
                          <Link to="/home/bonus">道具</Link>
                        </Menu.Item>
                        <Menu.Item key="5">
                          <Link to="/home/user">个人信息</Link>
                        </Menu.Item>
                      </Menu>
                    </Header>
                  </Route>
                  <Route path="/museum">
                  </Route>
                </Switch>
                <Content style={{ margin: '0 16px' }}>
                  <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Main</Breadcrumb.Item>
                    <Breadcrumb.Item>Theme</Breadcrumb.Item>
                  </Breadcrumb>
                  <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                    <Switch>
                      <Route exact path="/museum">
                        <PannelMuseum />
                      </Route>
                      <Route exact path="/topics">
                        topics
                  </Route>
                      <Route path="/theme_card/:theme_id" component={_getThemeCards}>
                      </Route>
                      <Route exact path="/">
                        <Redirect to="/home" />
                      </Route>
                    </Switch>
                  </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Created by Larkin, 2020</Footer>
              </Layout>
            </Layout>
          </Route>
        </Switch>
      </Router>
    );
  }
}

function _getThemeCards({ match }) {
  return (
    <ThemeCards theme_id={match.params.theme_id}></ThemeCards>
  )
}

ReactDOM.render(<MagicCard />, document.getElementById('root'));


serviceWorker.register();