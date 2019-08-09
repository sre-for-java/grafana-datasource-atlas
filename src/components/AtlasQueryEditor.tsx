import React, { useState } from 'react';
import { QueryEditorProps, FormLabel, makeValue } from '@grafana/ui';
import { Editor, OnChangeParam } from 'slate-react';
import PluginPrism from 'slate-prism';
import Plain from 'slate-plain-serializer';
import Prism from 'prismjs';

import AtlasLanguage from './atlas_language';
import { AtlasDatasource } from '../datasource';
import { AtlasQuery, AtlasOptions } from '../types';

export type Props = QueryEditorProps<AtlasDatasource, AtlasQuery, AtlasOptions>;

Prism.languages['atlas'] = AtlasLanguage;

const plugins = [
  PluginPrism({
    onlyIn: (node: any) => node.type === 'code_block',
    getSyntax: (node: any) => 'atlas',
  }),
];

export const AtlasQueryEditor = (props: Props) => {
  const { query, onRunQuery, onChange } = props;
  const [legend, setLegend] = useState(query.legend || '');
  const [expr, setExpr] = useState(makeValue(query.expr || ''));

  const executeOnChangeAndRunQueries = () => {
    onChange({ ...query, expr: Plain.serialize(expr), legend: legend });
    onRunQuery();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'f':
      case 'n':
      case ' ':
        event.stopPropagation();
        break;
      case 'Enter':
        if (!event.shiftKey) {
          executeOnChangeAndRunQueries();
        }
        break;
    }
  };

  return (
    <>
      <div className="gf-form-inline gf-form-inline--nowrap">
        <div className="gf-form flex-shrink-0">
          <FormLabel width={7}>Query</FormLabel>
        </div>
        <div className="gf-form gf-form--grow flex-shrink-1">
          <div className="slate-query-field__wrapper">
            <div className="slate-query-field">
              <Editor
                spellCheck={false}
                autoCorrect={false}
                plugins={plugins}
                readOnly={false}
                value={expr}
                placeholder="Enter an Atlas query"
                onChange={(e: OnChangeParam) => setExpr(e.value)}
                onBlur={executeOnChangeAndRunQueries}
                onKeyDown={onKeyDown}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="gf-form-inline gf-form-inline--nowrap">
        <div className="gf-form flex-shrink-0">
          <FormLabel width={7}>Legend</FormLabel>
        </div>
        <div className="gf-form gf-form--grow flex-shrink-1">
          <input type="text"
            className="gf-form-input"
            placeholder="text $tagKey"
            value={legend}
            onChange={e => setLegend(e.target.value)}
            onBlur={executeOnChangeAndRunQueries} />
        </div>
      </div>
    </>
  );
};
