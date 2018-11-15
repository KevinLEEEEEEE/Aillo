import '../css/main.css';
import '../css/CSS_exp1.css';
import '../css/CSS_exp2.css';
import '../css/CSS_exp2plus.css';
// import '../css/CSS_pipeline.css';

import GlobalExp1 from './exp1/Global_exp1';
import GlobalExp2 from './exp2/Global_exp2';
import GlobalExp2plus from './exp2plus/Global_exp2plus';
// import GlobalExp3 from './exp3/Global_exp3';
// import Global from './exp3/Global';

window.onload = () => {
  GlobalExp1.init();
  GlobalExp2.init();
  GlobalExp2plus.init(3);
  // GlobalExp3.init();
  // Global();
};
