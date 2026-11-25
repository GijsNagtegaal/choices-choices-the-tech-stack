
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: "/",
  locale: undefined,
  routes: [
  {
    "renderMode": 0,
    "route": "/"
  },
  {
    "renderMode": 0,
    "redirectTo": "/",
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    "index.csr.html": {size: 2773, hash: "91d2684210d2a1be5f772d71278fd5269c6a91080934ec3a2973adf51b3045f7", text: () => import("./assets-chunks/index_csr_html.mjs").then(m => m.default)},
    "index.server.html": {size: 988, hash: "aed32a5477501367e8103fe57adfeac06e621d25d66879f3e5889344a8f9c25b", text: () => import("./assets-chunks/index_server_html.mjs").then(m => m.default)},
    "styles-YBPPAIHM.css": {size: 3917, hash: "ye39Tl9Tf8o", text: () => import("./assets-chunks/styles-YBPPAIHM_css.mjs").then(m => m.default)}
  },
};
