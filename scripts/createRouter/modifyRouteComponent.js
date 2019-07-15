export default (memo, args) => {
    const importPath = args.importPath, webpackChunkName = args.webpackChunkName;

    if (!webpackChunkName) {
        return memo;
    }

    let loadingOpts = '';
    loadingOpts = `LoadingComponent: require('./components/PageLoading').default,`;

    let extendStr = '';
    extendStr = `/* webpackChunkName: ^${webpackChunkName}^ */`;

    let ret = `
dynamic({
component: () => import(${extendStr}'${importPath}'),
${loadingOpts}
})
`.trim();
    return ret;
}
