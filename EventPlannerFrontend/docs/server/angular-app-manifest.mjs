
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/eventaccess/',
  locale: undefined,
  routes: [
  {
    "renderMode": 1,
    "route": "/eventaccess"
  },
  {
    "renderMode": 1,
    "route": "/eventaccess/calendar"
  },
  {
    "renderMode": 1,
    "route": "/eventaccess/contact"
  },
  {
    "renderMode": 1,
    "route": "/eventaccess/imprint"
  },
  {
    "renderMode": 1,
    "route": "/eventaccess/eventedit/*"
  },
  {
    "renderMode": 1,
    "route": "/eventaccess/addevent"
  },
  {
    "renderMode": 1,
    "route": "/eventaccess/event"
  },
  {
    "renderMode": 1,
    "route": "/eventaccess/event/*"
  },
  {
    "renderMode": 1,
    "route": "/eventaccess/survey"
  },
  {
    "renderMode": 1,
    "route": "/eventaccess/survey/*"
  },
  {
    "renderMode": 1,
    "route": "/eventaccess/wishlist"
  },
  {
    "renderMode": 1,
    "route": "/eventaccess/to-do-list/*"
  },
  {
    "renderMode": 1,
    "route": "/eventaccess/guesttable/*"
  },
  {
    "renderMode": 1,
    "route": "/eventaccess/login"
  },
  {
    "renderMode": 1,
    "route": "/eventaccess/qr/event/*"
  },
  {
    "renderMode": 1,
    "route": "/eventaccess/EventPlannerFrontend/event/*"
  },
  {
    "renderMode": 1,
    "route": "/eventaccess/qrSurvey"
  },
  {
    "renderMode": 1,
    "redirectTo": "/eventaccess",
    "route": "/eventaccess/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 23699, hash: '5552be7a836f488e0d05ff70743e67250f4ff2ee96351a4d5991efd62ae1800f', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17150, hash: 'd9dffb3fc0cd2f0553e909b6a8fccbe84dc2ea58f2c6b5ed1120a3ebebd75085', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-IVF5H57H.css': {size: 7107, hash: 'N0vjDt7mL7w', text: () => import('./assets-chunks/styles-IVF5H57H_css.mjs').then(m => m.default)}
  },
};
