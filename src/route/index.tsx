import React from "react";
import {
    CustomerManagementPage,
    OrderListPage,
    OrderRegistryPage,
    PhoneCallRecordPage,
    PreferencesPage,
    PreferencesCidPage,
    PreferencesPrinterPage,
    ProductManagementPage,
    StatisticsPage,
} from "page";

export interface tabRouteType {
    name: string;
    path: string;
    component: React.FC;
}

export const tabRoutes: tabRouteType[] = [
    {
        name: "주문 목록",
        path: "/",
        component: OrderListPage,
    },
    {
        name: "전화 수신 기록",
        path: "/phone-call-record",
        component: PhoneCallRecordPage,
    },
    {
        name: "주문 작성",
        path: "/order-registry",
        component: OrderRegistryPage,
    },
    {
        name: "통계",
        path: "/statistics",
        component: StatisticsPage,
    },
    {
        name: "상품 관리",
        path: "/product-management",
        component: ProductManagementPage,
    },
    {
        name: "회원 관리",
        path: "/customer-management",
        component: CustomerManagementPage,
    },
    {
        name: "환경 설정",
        path: "/preferences",
        component: PreferencesPage,
    },
];

export const preferencesTabRoutes: tabRouteType[] = [
    {
        name: "CID(전화 발신 표시)설정",
        path: "/preferences/cid",
        component: PreferencesCidPage,
    },
    {
        name: "프린터 설정",
        path: "/preferences/printer",
        component: PreferencesPrinterPage,
    },
];
