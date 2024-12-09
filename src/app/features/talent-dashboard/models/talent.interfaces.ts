 export interface StatTrend {
  value: number;
  label: string;
  isPositive?: boolean;
}

 export interface StatCardData {
  id: string;
  icon: string;
  value: number | string;
  label: string;
  trend?: StatTrend;
}
