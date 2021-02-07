import React from "react";
import {
    CustomerManagementPage,
    OrderListPage,
    OrderRegistryPage,
    PhoneCallRecordPage,
    PreferencesPage,
    ProductManagementPage,
    StatisticsPage,
} from "page";

interface TabRoute {
    name: string;
    path: string;
    component: React.FC;
}

export const tabRoutes: TabRoute[] = [
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
