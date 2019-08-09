export default {
  'comment': {
    pattern: /(^|[^\\$])\/\/.*/,
    lookbehind: true,
    inside: {
      'italic': /\b(?:TODO|FIXME)\b/
    }
  },
  'regex': /[^,]+(?=,:(?:reic|re))/,
  'constant': /[^,]+(?=,:(?:set|nlist|pick|offset|trend))/,
  'string': [
    /'[^']*'/,
    /"[^"]*"/,
    /[^,]+(?=,:(?:eq|fcall|get|named-rewrite|time|legend))/,
    {
      pattern: /[^,]+(?=,[^,]+,:(?:set|time-span))/,
      greedy: true,
    },
  ],
  'keyword': [
    // style
    /(?::limit|:head|:offset|:sort|:order|:legend|:decode)/,

    // stateful
    // tslint:disable-next-line max-line-length
    /(?::delay|:derivative|:des-epic-signal|:des-fast|:des-simple|:des-slower|:des-slow|:des|:integral|:rolling-count|:rolling-max|:rolling-mean|:rolling-min|:sdes|:sdes-fast|:sdes-simple|:sdes-slow|:sdes-slower|:trend)/,

    // std
    // tslint:disable-next-line max-line-length
    /(?::-rot|:2over|:call|:clear|:depth|:drop|:dup|:each|:fcall|:format|:freeze|:get|:list|:map|:ndrop|:nip|:nlist|:over|:pick|:roll|:rot|:set|:sset|:swap|:tuck)/,

    // query
    /(?::and|:eq|:ge|:gt|:le|:lt|:not|:or|:reic|:re|:true|:false|:has|:in)/,

    // data
    /(?::all|:by|:cf-avg|:cf-max|:cf-min|:cf-sum|:count|:max|:min|:offset|:sum)/,

    // math
    // tslint:disable-next-line max-line-length
    /(?::abs|:add|:and|:avg|:by|:clamp-max|:clamp-min|:const|:count|:cq|:dist-avg|:dist-max|:dist-stddev|:div|:fadd|:fdiv|:fmul|:fsub|:ge|:gt|:le|:lt|:max|:median|:min|:mul|:named-rewrite|:neg|:or|:pct|:per-step|:percentiles|:pow|:random|:sqrt|:srandom|:stddev|:sub|:sum|:time|:time-span)/,

    // filter
    /(?::filter|:stat-avg-mf|:stat-avg|:stat-last|:stat-max-mf|:stat-max|:stat-min-mf|:stat-min|:stat-total|:stat)/,

    // more style
    /(?::s)/,
  ],
  'number': /\b(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
  'punctuation': /[\(\),]/
};
