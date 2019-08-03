import { AtlasDatasource } from './datasource';
import { AtlasQueryEditor } from './components';

class AtlasConfigCtrl {
  static templateUrl = 'partials/config.html';
}

export {
  AtlasDatasource as Datasource,
  AtlasQueryEditor as QueryEditor,
  AtlasConfigCtrl as ConfigCtrl,
};
