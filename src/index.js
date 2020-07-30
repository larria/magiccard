import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import * as serviceWorker from './serviceWorker';
import 'antd/dist/antd.css'
import { Layout, Menu, Breadcrumb } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  SettingOutlined,
} from '@ant-design/icons';

import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import getData from './getData';
import getURL from './getURL';

import PannelMuseum from './component/PannelMuseum'
import ThemeCards from './component/ThemeCards'

// console.log(getData.getCardsByThemeId(965));
// console.log(getData.getCardById(14762));
// console.log(getData.getCombineRulesByThemeId(893));
// console.log(getData.getCombineRuleByCardId(13688));
// console.log(getURL.getCardSmall(13688));

/* ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
); */

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();

// ReactDOM.render(<DatePicker />, document.getElementById('root'));
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

  render() {
    return (
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
              <Menu.Item key="1" icon={<PieChartOutlined />}>
                Main
            </Menu.Item>
              <Menu.Item key="2" icon={<DesktopOutlined />}>
                Option
            </Menu.Item>
              <SubMenu key="sub1" icon={<UserOutlined />} title="User">
                <Menu.Item key="3">Tom</Menu.Item>
                <Menu.Item key="4">Bill</Menu.Item>
                <Menu.Item key="5">Alex</Menu.Item>
              </SubMenu>
              <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
                <Menu.Item key="6">Team 1</Menu.Item>
                <Menu.Item key="8">Team 2</Menu.Item>
              </SubMenu>
              <Menu.Item key="9" icon={<FileOutlined />} />
              <Menu.Item key="10" icon={<SettingOutlined />} />
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding: 0 }}>
              <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                <Menu.Item key="1">
                  <Link to="/">Home</Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link to="/topics">Topics</Link>
                </Menu.Item>
                <Menu.Item key="3">
                  <Link to="/museum">Museum</Link>
                </Menu.Item>
              </Menu>
            </Header>
            <Content style={{ margin: '0 16px' }}>
              <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Main</Breadcrumb.Item>
                <Breadcrumb.Item>Theme</Breadcrumb.Item>
              </Breadcrumb>
              <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                <Switch>
                  <Route exact path="/museum">
                    <PannelMuseum></PannelMuseum>
                  </Route>
                  <Route exact path="/topics">
                    topics
                    {/* <Card isSmall={true}></Card>
                    <Card showName={true}></Card>
                    <Card isSmall={true} showName={true}></Card>
                    <Card id={12345}></Card> */}
                    {/* <ThemeCards theme_id="275"></ThemeCards> */}
                  </Route>
                  <Route path="/theme_card/:card_id" component={_getThemeCards}>
                    {/* <ThemeCards></ThemeCards> */}
                  </Route>
                  <Route exact path="/">
                    Home
                  </Route>
                </Switch>
              </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Created by Larkin</Footer>
          </Layout>
        </Layout>
      </Router>
    );
  }
}

function _getThemeCards({ match }) {
  return (
    <ThemeCards theme_id={match.params.card_id}></ThemeCards>
  )
}

ReactDOM.render(<MagicCard />, document.getElementById('root'));


serviceWorker.register();