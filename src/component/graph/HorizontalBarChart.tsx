import { useEffect, useRef } from "react";
import { select, scaleBand, scaleLinear, max, Selection, axisLeft, axisTop } from "d3";
import { PRIMARY_MAIN_COLOR } from "theme";
import Paper from "@material-ui/core/Paper";
import { makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: "0 20px 0 20px",
    },
}));

interface Data {
    name: string;
    value: number;
}

export interface BarChartData {
    list: Data[];
    /** y축 포맷
     * d3.format 참고 https://observablehq.com/@d3/d3-format
     */
    format?: string;
    /** y축 라벨 */
    y: string;
    /** 단위 */
    unit: string;
}

interface Props {
    data: BarChartData;
}

export const HorizontalBarChart = ({ data }: Props) => {
    const classes = useStyles();
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        const width = 800;
        const height = 600;
        const margin = { top: 80, right: 80, bottom: 30, left: 40 };
        const svg = select(svgRef.current);
        const x = scaleLinear()
            .domain([0, max(data.list, (d: Data) => d.value) as number])
            .nice()
            .range([margin.left, width - margin.right]);

        const y = scaleBand()
            .domain(data.list.map((d) => d.name))
            .range([margin.top, height - margin.bottom])
            .padding(0.2);

        const xAxis = (g: Selection<SVGGElement, unknown, null, undefined>) =>
            g
                .attr("transform", `translate(0,${margin.top})`)
                .call(axisTop(x).ticks(width / 80, data.format))
                .call((g) => g.select(".domain").remove())
                .call((g) =>
                    g
                        .append("text")
                        .attr("x", width - margin.right)
                        .attr("y", -30)
                        .attr("fill", "currentColor")
                        .attr("text-anchor", "start")
                        .text(data.y)
                        .style("font-size", "1rem")
                );
        const yAxis = (g: Selection<SVGGElement, unknown, null, undefined>) =>
            g
                .attr("transform", `translate(${margin.left},0)`)
                .call(
                    axisLeft(y)
                        .tickFormat((_, i: number) => data.list[i].name)
                        .tickSizeOuter(0)
                )
                .style("font-size", "1rem");

        svg.attr("width", width);
        svg.attr("height", height);

        // bar 그래프 그리기
        svg.append("g")
            .attr("fill", PRIMARY_MAIN_COLOR)
            .selectAll("rect")
            .data(data.list)
            .join("rect")
            .attr("y", (d: Data) => y(d.name) as number)
            .attr("x", margin.left) // 막대 초기 위치는 x축
            .attr("width", 0) // 막대 초기 높이는 0
            .attr("height", y.bandwidth)
            // 아래는 애니메이션
            .transition()
            .duration(500)
            .delay((d, i) => i * 25)
            .attr("width", (d: Data) => x(d.value) - x(0)) // 높이도 설정해줌
            .attr("text", (d: Data) => d.value);

        // bar 그래프 위 데이터 라벨
        svg.selectAll("text")
            .data(data.list)
            .enter()
            .append("text")
            .text((d) => `${d.value.toLocaleString()} ${data.unit}`)
            .attr("class", "text")
            .attr("x", (d) => x(d.value))
            .attr("y", (d) => (y(d.name) as number) + y.bandwidth() / 2)
            .attr("dx", 8)
            .attr("dy", "0.35rem")
            .style("opacity", 0)
            .transition()
            .duration(500)
            .delay((d, i) => i * 25 + data.list.length * 20)
            .style("opacity", 1);

        svg.append("g").call(xAxis);
        svg.append("g").call(yAxis);
    }, [data]);

    return (
        <Paper className={classes.root}>
            <svg ref={svgRef}></svg>
        </Paper>
    );
};
