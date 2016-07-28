#!/usr/bin/env node

var kit = require('../dist/kit');
var br = kit.require('brush');
var Promise = kit.Promise;
var _ = kit._;
var cmder = require('commander');
var htmlExtList = ['', '.htm', '.html'];

cmder
    .description('a tool to statically serve a folder')
    .usage('[options] [path]')
    .option('-p, --port <num>', 'port of the service [8080]', 8080)
    .option('--host <str>', 'host of the service [0.0.0.0]', '0.0.0.0')
    .option('-t, --proxyTo <host:port>', 'proxy the rest traffic to the specific host')
    .option('--openBrowser <on|off>', 'auto open browser [on]', 'on')

    .option('--production', 'start as production mode, default is development mode')
.parse(process.argv);

Promise.resolve().then(function () {
    kit.requireOptional('send', __dirname, '^0.14.0');
    var serveIndex = kit.requireOptional('serve-index', __dirname, '^1.8.0');
    var proxy = kit.require('proxy');
    var cwd = process.cwd();

    var app = proxy.flow();

    var dir = cmder.args[0] || '.';
    var staticOpts, indexOpts;

    app.push(function ($) {
        kit.logs(br.grey('access: ' + $.req.url));
        return $.next();
    })

    if (!cmder.production) {
        var devHelper = proxy.serverHelper();
        app.push(
            devHelper,
            function ($) {
                var ext = kit.path.extname($.req.url);
                if (_.includes(htmlExtList, ext.toLowerCase())) {
                    var path = kit.path.join(dir, $.req.url);

                    return kit.readFile(path)
                    .catch(function () {
                        path = kit.path.join(path, 'index.html');
                        devHelper.watch(kit.path.relative(cwd, path));
                        return kit.readFile(path);
                    }).then(function (html) {
                        $.body = html + devHelper.browserHelper;
                    }, function () {
                        return $.next();
                    });
                } else {
                    return $.next();
                }
            }
        );

        staticOpts = {
            dotfiles: 'allow',
            onFile: function (path) {
                devHelper.watch(kit.path.relative(cwd, path));
            }
        };

        indexOpts = {
            hidden: true,
            icons: true,
            view: 'details'
        };
    }

    staticOpts.root = dir;

    app.push(
        proxy.static(staticOpts),
        proxy.midToFlow(serveIndex(dir, indexOpts))
    )

    if (cmder.proxyTo) {
        app.push(
            proxy.url(cmder.proxyTo)
        );
    }

    return app.listen(cmder.port, cmder.host);
}).then(function () {
    var url = 'http://127.0.0.1:' + cmder.port;
    kit.logs('Serve: ' + br.cyan(url));

    if (cmder.openBrowser === 'on')
        return kit.xopen(url);
}).catch(kit.throw);
