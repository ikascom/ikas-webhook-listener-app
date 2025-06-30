import React from 'react';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import { WithRouterProps } from 'next/dist/client/with-router';
import { action, observable, makeObservable } from 'mobx';
import { BaseApiRequests, TokenHelpers } from '@ikas-apps/common-client';
import { textSMMedium, SECTION_LINE_MARGIN_SIZE } from '@ikas/components';

import { Section } from '@ikas/components';
import SectionSkeleton from '@/components/skeleton';

export const dynamicOption = {
  ssr: false,
  loading: () => (
    <Section customContent>
      <SectionSkeleton />
    </Section>
  ),
};
// const DynamicOptionLoading = () => (
//   <Section customContent>
//     <SectionSkeleton />
//   </Section>
// );
const ShippingAppSettingsPage = dynamic(() => import('@/components/shipping-app-settings'), {
  ssr: false,
  loading: () => (
    <Section customContent>
      <SectionSkeleton />
    </Section>
  ),
});
const Shipments = dynamic(() => import('@/components/shipment'), {
  ssr: false,
  loading: () => (
    <Section customContent>
      <SectionSkeleton />
    </Section>
  ),
});
const IkasShippingPrice = dynamic(() => import('@/components/ikas-shipping-price'), {
  ssr: false,
  loading: () => (
    <Section customContent>
      <SectionSkeleton />
    </Section>
  ),
});

export const Tabs = styled.div`
  padding: 14px ${SECTION_LINE_MARGIN_SIZE}px;
`;

export const TabButton = styled.button`
  padding: 4px 10px;
  cursor: pointer;
  ${textSMMedium};
  border: none;

  color: ${(props) => props.theme.colors['gray-blue-6']};
  background-color: ${(props) => props.theme.colors.white};

  &[data-selected='true'] {
    color: ${(props) => props.theme.colors.purple};
    border-radius: ${(props) => props.theme.borderRadius.rounded};
    background-color: ${(props) => props.theme.colors['purple-0']};
  }

  :not(:last-child) {
    margin-right: 12px;
  }
`;

type TabKey = 'settings' | 'orders' | 'prices';
type TabItem = {
  key: TabKey;
  tab: string;
  children: () => JSX.Element;
};

type Props = {} & WithRouterProps;

@observer
class Dashboard extends React.Component<Props> {
  @observable token: string | null = null;
  @observable storeName = '';
  @observable activeTab: TabKey = 'settings';

  @observable tabsVisible = true;

  constructor(props: Props) {
    super(props);

    makeObservable(this);
  }

  componentDidMount() {
    this.init();
  }

  @action.bound
  async init() {
    this.token = (await TokenHelpers.getTokenForIframeApp(this.props.router)) || null;
    await this.fillStoreName();
    onmessage = (event) => {
      // console.log('AAA', event);
    };
  }

  @action.bound
  async fillStoreName() {
    if (this.token) {
      const res = await BaseApiRequests.getMerchant(this.token!);
      if (res.status === 200 && res.data?.data && res.data?.data.merchantInfo) {
        const merchantInfo = res.data.data.merchantInfo;
        if (merchantInfo?.storeName) {
          this.storeName = merchantInfo.storeName;
        }
      }
    }
  }

  @action.bound
  toggleTabsVisiblity(visible: boolean) {
    this.tabsVisible = visible;
  }

  get tabItems(): TabItem[] {
    if (!this.token) return [];
    return [
      {
        key: 'settings',
        tab: 'Ayarlar',
        children: () => <ShippingAppSettingsPage token={this.token} toggleTabsVisibility={this.toggleTabsVisiblity} />,
      },
      {
        key: 'orders',
        tab: 'Siparişler',
        children: () => <Shipments storeName={this.storeName} token={this.token} />,
      },
      {
        key: 'prices',
        tab: 'Fiyatlar',
        children: () => <IkasShippingPrice token={this.token} />,
      },

      // {
      //   key: "5",
      //    tab: "Lisans",
      //    children: <div />
      // },
    ];
  }

  @action.bound
  onTabChange(key: TabKey) {
    this.activeTab = key;
  }

  render() {
    const activeTabIndex = this.tabItems.findIndex((tabItem) => tabItem.key === this.activeTab);

    return (
      <>
        {this.tabsVisible && (
          <Section customContent marginTop={false}>
            <Tabs>
              {this.tabItems.map((tab) => (
                <TabButton key={tab.key} data-selected={this.activeTab === tab.key} onClick={() => this.onTabChange(tab.key)}>
                  {tab.tab}
                </TabButton>
              ))}
            </Tabs>
          </Section>
        )}
        {activeTabIndex > -1 && this.tabItems[activeTabIndex].children()}
      </>
    );
  }
}

export default withRouter(Dashboard);
