import { Component, ViewChild } from "@angular/core";
import {
  ApexChart,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexTooltip,
  ApexLegend,
  ChartComponent,
  ApexStates,
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  legend: ApexLegend;
  tooltip: ApexTooltip;
  responsive: ApexResponsive[];
  states: ApexStates;
};

@Component({
  selector: "app-piechart",
  templateUrl: "./piechart.component.html",
  styleUrls: ["./piechart.component.scss"],
})
export class PiechartComponent {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  selectedPeriod = "12 months";

  constructor() {
    this.chartOptions = {
      series: [30, 60, 75],
      chart: {
        type: "pie",
        height: 350,
        fontFamily: "Roboto, sans-serif",
      },
      labels: ["Completed", "Rejected", "Accepted"],
      colors: ["#50BE87", "#A885D8", "#4BB4E6", ],
      legend: {
        position: "bottom",
        horizontalAlign: "left",
        fontSize: "14px",
        fontFamily: "Roboto, sans-serif",
        markers: {
          offsetX: 0,
          offsetY: 0,
          strokeWidth: 0,
        },
        itemMargin: {
          horizontal: 15,
          vertical: 5,
        },
        formatter: function (seriesName: string, opts: any) {
          return `${seriesName}  ${opts.w.globals.series[opts.seriesIndex]}%`;
        },
      },
      states: {
        hover: {
          filter: {
            type: "none",
          },
        },
        active: {
          filter: {
            type: "none",
          },
        },
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: function (value: number) {
            return `${value}%`;
          },
        },
        style: {
          fontSize: "12px",
          fontFamily: "Roboto, sans-serif",
        },
        custom: function ({ series, seriesIndex, w }: any) {
          return `<div class="custom-tooltip">
            <span class="tooltip-label">${w.config.labels[seriesIndex]}</span>
            <span class="tooltip-value">${series[seriesIndex]}%</span>
          </div>`;
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    };
  }
}
