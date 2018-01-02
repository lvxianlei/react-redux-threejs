const isDev = process.env.NODE_ENV === 'development';

const HOST = isDev ? '' : 'http://t.50-jia.com';
const API_TOKEN = HOST + '/api-user/oauth/token';
const API_GETDESIGNID = HOST + '/bim/design/getDesignList';
const API_GET_NODE_LIST = HOST + '/product/bim/listCategory';
const API_GET_ALL_NODE_LIST = HOST + '/product/bim/listAllCategory';
const API_GET_PRODUCT_LIST = HOST + '/product/bim/listProductByCategory';
export { HOST, API_TOKEN, API_GET_NODE_LIST, API_GET_ALL_NODE_LIST, API_GET_PRODUCT_LIST };