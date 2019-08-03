import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MetricFindValue,
} from '@grafana/ui';

import { BackendSrv } from '@grafana/runtime';

import { AtlasQuery, AtlasOptions, AtlasResponse } from './types';
import { TemplateSrv } from './grafana/app/features/templating';

export class AtlasDatasource extends DataSourceApi<AtlasQuery, AtlasOptions> {
  type: string;
  url: string;

  /** @ngInject */
  constructor(
    instanceSettings: DataSourceInstanceSettings<AtlasOptions>,
    private backendSrv: BackendSrv,
    private templateSrv: TemplateSrv
  ) {
    super(instanceSettings);
    this.type = 'atlas';
    this.url = instanceSettings.jsonData.url;
  }

  testDatasource() {
    return this.doRequest('/api/v1/tags').then(response => {
      if (response.status === 200) {
        return { status: 'success', message: 'Data source is working', title: 'Success' };
      }
      return { status: 'error', message: response.error };
    });
  }

  query(options: DataQueryRequest<AtlasQuery>): Promise<DataQueryResponse> {
    options.targets = options.targets
      .filter(target => target.expr && target.expr.length > 0)
      .filter(target => !target.hide);

    if (options.targets.length <= 0) {
      return Promise.resolve({ data: [] });
    }

    const adhocFilters = this.templateSrv.getAdhocFilters(this.name);
    const adhocFilterExpr = adhocFilters.map(filter => {
      const { key, value } = filter;
      const args = `${key},${value}`;
      switch (filter.operator) {
        case '!=':
          return `${args},:eq,:not`;
        case '<':
          return `${args},:lt`;
        case '>':
          return `${args},:gt`;
        case '=~':
          return `${args},:reic`;
        case '!~':
          return `${args},:reic,:not`;
        case '=':
        default:
          return `${args},:eq`;
      }
    }).join(',') + new Array(Math.max(0, adhocFilters.length - 1)).fill(',:and').join('') + ',:cq';

    const q = options.targets
      .map(t => t.expr.split('\n')
        .filter(line => !line.trim().startsWith('#'))
        .map(line => line.replace(/'([^\s]*)\s+([^']*)'/, '$1+$2'))
        .map(line => line.replace(/"([^\s]*)\s+([^"]*)"/, '$1+$2'))
        .map(line => line.replace(/'([^']*)'/, '$1'))
        .map(line => line.replace(/"([^"]*)"/, '$1'))
        .map(line => line.replace(/\s/, ''))
        .map(line => this.templateSrv.replace(line, options.scopedVars, this.interpolateQueryExpr))
        .join('')
      )
      .filter(expr => expr.length > 0)
      .map(expr => adhocFilters.length > 0 ? `${expr},${adhocFilterExpr}` : expr)
      .join(',');

    return this.doRequest('/api/v1/graph', `q=${q}`, 'format=std.json',
      `tz=${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
      `s=${options.range.from.unix()}`,
      `e=${options.range.to.unix()}`)
      .then((response: AtlasResponse) => {
        const { start, step } = response;
        return {
          data: response.legend.map((legend, i) => ({
            target: legend,
            datapoints: response.values.map((points, j) => [points[i], start + step * j]),
          }))
        };
      })
      .catch(() => Promise.resolve({ data: [] }));
  }

  getTagKeys(options: any): Promise<MetricFindValue[]> {
    return this.doRequest('/api/v1/tags').then((result: string[]) =>
      result.map(tag => ({ text: tag }))
    );
  }

  getTagValues(options: any): Promise<MetricFindValue[]> {
    return this.doRequest(`/api/v1/tags/${options.key}`)
      .then((tags: string[]) => tags.map(tag => ({ text: tag })));
  }

  metricFindQuery(query: string, options: { variable: { regex: string } }): Promise<MetricFindValue[]> {
    let tagsQueryResponse = query.includes(',') ?
      this.doRequest(`/api/v1/tags`, `q=${query}`) :
      this.doRequest(`/api/v1/tags/${query}`);

    tagsQueryResponse = tagsQueryResponse.then((tags: string[]) => tags.map(tag => ({ text : tag })));

    const { regex } = options.variable;
    if (regex && regex.length > 0) {
      tagsQueryResponse = tagsQueryResponse.then(tags => tags.filter(tag => tag.text.match(regex)));
    }

    return tagsQueryResponse;
  }

  interpolateQueryExpr(value: any, variable: any, defaultFormatFn: any) {
    if (variable.multi) {
      return `(,${Array.isArray(value) ? value.join(',') : value},)`;
    }
    return value;
  }

  doRequest(path: string, ...q: string[]) {
    return this.backendSrv.get(this.url + path + (q ? `?${q.join('&')}` : ''));
  }
}
