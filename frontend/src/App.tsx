import React from 'react';
import { BarChartOutlined, DashboardOutlined } from '@ant-design/icons';
import { MenuProps, Card, ConfigProvider, Layout, Menu, theme } from 'antd';

import ChargePointStatus from './components/ChargePointStatus';
import SessionData from './components/SessionData';


const { Header, Content, Sider } = Layout;


/** Define sider menu items and create nav elements */
const siderMenuItems = [
  {icon: DashboardOutlined, label: "Charge Point Status",},
  {icon: BarChartOutlined, label: "Session Data",},
  // {icon: ControlOutlined, label: "Application Log",},
]
const siderMenuNavi: MenuProps['items'] = siderMenuItems.map(
  (item, index) => {
    return {
      key: `navi-${index}`,
      icon: React.createElement(item.icon),
      label: item.label,
    };
  },
);

/** Main Application output */
const App: React.FC = () => {
  const { token } = theme.useToken();
  const [selectedNavItem, setSelectedNavItem] = React.useState(0);


  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#C81E82',
        },
        components: {
          Spin: { // Default value, just here to show how
            contentHeight: 400,
          }
        }
      }}
    >
      <Layout style={{minHeight: "100vh"}}>
        <Header 
          style={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            background: token.Layout?.colorBgTrigger, // colorBgContainer,
            fontFamily: 'font-family: -apple-system,BlinkMacSystemFont,Open Sans,Helvetica Neue,Helvetica,Arial,sans-serif',
            fontSize: '42px',
            color: token.colorTextLightSolid,
          }}
        >
          <div style={{paddingLeft: "20px"}}>CPO Integration Dashboard</div>
          {/* <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={headerMenuItems} /> */}
        </Header>
        <Layout>
          <Sider width={220} style={{ background: token.colorBgContainer }} collapsible={true}>
            <Menu
              mode="inline"
              defaultSelectedKeys={[`navi-${selectedNavItem}`]}
              onClick={({key}) =>  setSelectedNavItem(parseInt(key.split("navi-")[1]))}
              style={{ height: '100%', borderRight: 0 }}
              items={siderMenuNavi}
            />
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Content
              style={{
                padding: 24,
              }}
            >
              <Card title={siderMenuItems[selectedNavItem].label}>
                {
                    selectedNavItem === 0 ? (
                      <ChargePointStatus />
                    ) : (selectedNavItem === 1 ? (
                      <SessionData />
                    ) : (
                      <span>Please select a nav item.</span>
                    ) )
                }
              </Card>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;