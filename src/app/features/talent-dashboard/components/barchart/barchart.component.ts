import { Component, ViewChild } from "@angular/core";
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexPlotOptions,
  ApexDataLabels,
  ApexGrid,
  ApexYAxis,
  ApexTooltip,
  ApexLegend,
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  colors: string[];
  yaxis: ApexYAxis;
  tooltip: ApexTooltip;
  legend: ApexLegend;
};

@Component({
  selector: "app-barchart",
  templateUrl: "./barchart.component.html",
  styleUrls: ["./barchart.component.scss"],
})
export class BarchartComponent {
  @ViewChild("chart") chart: ChartComponent | undefined;
  public chartOptions: Partial<ChartOptions>;
  selectedPeriod = "12 months";

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "Applicants",
          data: [475, 400, 430],
        },
        {
          name: "Hires",
          data: [350, 275, 365],
        },
      ],
      chart: {
        height: 350,
        type: "bar",
        toolbar: {
          show: false,
        },
      },
      colors: ["#4BB4E6", "#50BE87"],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "35%",
          borderRadius: 2,
          borderRadiusApplication: "end",
        },
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
        borderColor: "#f0f0f0",
        strokeDashArray: 3,
      },
      legend: {
        position: "bottom",
        horizontalAlign: "left",
        floating: false,
        offsetY: 0,
        offsetX: 0,
        itemMargin: {
          horizontal: 25,
          vertical: 0,
        },
        markers: {
          strokeWidth: 0,
          offsetX: 0,
          offsetY: 0,
        },
      },
      xaxis: {
        categories: ["JavaScript", "Python", "Java"],
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          style: {
            colors: "#666666",
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        min: 0,
        max: 500,
        tickAmount: 8,
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          style: {
            colors: "#666666",
            fontSize: "12px",
          },
        },
      },
      tooltip: {
        theme: "light",
        x: {
          show: true,
        },
        y: {
          formatter: function (value) {
            return value.toString();
          },
        },
      },
    };
  }
}
