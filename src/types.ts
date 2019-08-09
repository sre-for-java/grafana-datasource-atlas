import { DataQuery, DataSourceJsonData } from '@grafana/ui';

export interface AtlasQuery extends DataQuery {
  expr: string;
  legend: string;
}

export interface AtlasOptions extends DataSourceJsonData {
  url: string;
}

// responses from the Atlas API
export interface AtlasResponse {
  values: Array<Array<number | string>>;
  legend: string[];
  start: number;
  step: number;
}

export interface AtlasMetric {
  atlas: AtlasMetricOption;
  name: string;
}

export interface AtlasMetricOption {
  offset: string;
}
