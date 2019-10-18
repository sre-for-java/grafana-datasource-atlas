import { ScopedVars } from '@grafana/ui';

export interface TemplateSrv {
  replace(target: string, scopedVars?: ScopedVars, format?: string | Function): any;
  getAdhocFilters(datasourceName: string): TemplateFilter[];
}

export interface TemplateFilter {
  key: string;
  operator: string;
  value: string;
}
