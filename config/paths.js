'use strict';

const path = require('path');
const fs = require('fs');
const url = require('url');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(path, needsSlash) {
    const hasSlash = path.endsWith('/');
    if (hasSlash && !needsSlash) {
        return path.substr(path, path.length - 1);
    } else if (!hasSlash && needsSlash) {
        return `${path}/`;
    } else {
        return path;
    }
}

const getPublicUrl = appPackageJson =>
    envPublicUrl || require(appPackageJson).homepage;

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath(appPackageJson) {
    const publicUrl = getPublicUrl(appPackageJson);
    const servedUrl = envPublicUrl ||
        (publicUrl ? url.parse(publicUrl).pathname : '/');
    return ensureSlash(servedUrl, true);
}

const isProduction = process.env.NODE_ENV === 'production'
// config after eject: we're in ./config/
module.exports = {
    //webpack context
    contextPath:resolveApp(''),
    //output path
    outPutPath:resolveApp('dist'),
    //bulid output index.html path 
    outHtmlPath:resolveApp('dist/index.html'),
    //env path
    dotenv: resolveApp('.env'),
    //output publicPath
    assetsPublicPath:'/',
    //entry path 
    appPath :resolveApp('src/main.js'),
    //babel-loader path 
    appSrc: [resolveApp('src'),  resolveApp('node_modules/webpack-dev-server/client')],
    assetsSubDirectory: resolveApp('static'),
    //extra resolve-alias
    extraAlias:{
      'images':resolveApp('static/images'),
      'component' : resolveApp('src/component'),
      'utils' : resolveApp('src/utils'),
      'styles':resolveApp('src/styles'),
    },
    //eslint-path
    eslintPath : [resolveApp('src')],
    //svg-sprite-loader path
    svgSpritePath : [resolveApp('static/svg')],
    //static source path
    staticResolve:(_path)=>path.posix.join('static', _path),
    // is open Gzip in prodction 
    productionGzip:true,
    productionGzipExtensions: ['js', 'css'],
    //is open bundle analyzer
    bundleAnalyzerReport : process.env.npm_config_report || false,
    // is open soucre map
    isOpenSoucreMap:isProduction ? false : true,
    // is open dll reference
    isDll:false,
    //package.json path
    packageJSON : resolveApp('package.json'),
    //dll manifest path
    dllManifestPath : path.resolve(resolveApp('dist/dll-manifest.json')),
    dllOutPutPath : path.resolve(resolveApp('dist')),
    dllHtml : path.resolve(resolveApp('dist/dll.html')),
    //vue-loader config
    cacheBusting : true,
    globalSass:[
        resolveApp('src/styles/style.scss'),
        resolveApp('src/styles/media.scss'),
    ]
};
