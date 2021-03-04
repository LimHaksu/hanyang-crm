import { useState } from "react";
import { HorizontalBarChart, BarChartData } from "component/graph";
import { descending } from "d3";
export const StatisticsPage = () => {
    const [data, setData] = useState(() => ({
        list: [
            { name: "1월", value: 30000000 },
            { name: "2월", value: 25753588 },
            { name: "3월", value: 40135488 },
            { name: "4월", value: 35426582 },
            { name: "5월", value: 26845756 },
            { name: "6월", value: 35687485 },
            { name: "7월", value: 41235754 },
            { name: "8월", value: 35486755 },
            { name: "9월", value: 23542685 },
            { name: "10월", value: 35486581 },
            { name: "11월", value: 46526852 },
            { name: "12월", value: 41358562 },
        ],
        format: "s",
        y: "매출",
        unit: "원",
    }));
    return (
        <div style={{ height: "calc(100vh - 128px)", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <HorizontalBarChart data={data} />
        </div>
    );
};
