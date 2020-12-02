"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var HtmlWebpackPlugin = require("html-webpack-plugin");
var minimatch = require("minimatch");
var PLUGIN_NAME = 'HtmlSkipAssetsPlugin';
var HtmlWebpackSkipAssetsPlugin = (function () {
    function HtmlWebpackSkipAssetsPlugin(_config) {
        if (_config === void 0) { _config = { skipAssets: [], excludeAssets: [] }; }
        this._config = _config;
    }
    HtmlWebpackSkipAssetsPlugin.prototype.apply = function (compiler) {
        var _this = this;
        if (compiler.hooks) {
            compiler.hooks.compilation.tap(PLUGIN_NAME, function (compilation) {
                if (compilation.hooks.htmlWebpackPluginAlterAssetTags) {
                    compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(PLUGIN_NAME, function (data, cb) {
                        var filters = __spreadArrays((_this._config.skipAssets || []), (_this._config.excludeAssets || []), (data.plugin.options.skipAssets || []), (data.plugin.options.excludeAssets || []));
                        data.head = _this._skipAssets(data.head, filters);
                        data.body = _this._skipAssets(data.body, filters);
                        return cb(null, data);
                    });
                }
                else if (HtmlWebpackPlugin && HtmlWebpackPlugin.getHooks) {
                    var hooks = HtmlWebpackPlugin.getHooks(compilation);
                    hooks.alterAssetTags.tapAsync(PLUGIN_NAME, function (data, cb) {
                        var filters = __spreadArrays((_this._config.skipAssets || []), (_this._config.excludeAssets || []), (data.plugin['options'].skipAssets || []), (data.plugin['options'].excludeAssets || []));
                        data.assetTags.scripts = _this._skipAssets(data.assetTags.scripts, filters);
                        data.assetTags.styles = _this._skipAssets(data.assetTags.styles, filters);
                        data.assetTags.meta = _this._skipAssets(data.assetTags.meta, filters);
                        return cb(null, data);
                    });
                }
                else {
                    throw new Error('Cannot find appropriate compilation hook');
                }
            });
        }
        else {
            compiler.plugin('compilation', function (compilation) {
                compilation.plugin('html-webpack-plugin-alter-asset-tags', function (htmlPluginData, callback) {
                    var filters = __spreadArrays((_this._config.skipAssets || []), (_this._config.excludeAssets || []), (htmlPluginData.plugin.options.skipAssets || []), (htmlPluginData.plugin.options.excludeAssets || []));
                    htmlPluginData.head = _this._skipAssets(htmlPluginData.head, filters);
                    htmlPluginData.body = _this._skipAssets(htmlPluginData.body, filters);
                    return callback(null, htmlPluginData);
                });
            });
        }
    };
    HtmlWebpackSkipAssetsPlugin.prototype._skipAssets = function (assets, filters) {
        return assets.filter(function (a) {
            var skipped = filters.some(function (pattern) {
                if (!pattern) {
                    return false;
                }
                var asset = a.attributes.src || a.attributes.href;
                if (!asset) {
                    return true;
                }
                if (typeof pattern === 'string') {
                    return minimatch(asset, pattern);
                }
                if (pattern.constructor && pattern.constructor.name === 'RegExp') {
                    return pattern.test(asset);
                }
                return false;
            });
            return !skipped;
        });
    };
    return HtmlWebpackSkipAssetsPlugin;
}());
exports.HtmlWebpackSkipAssetsPlugin = HtmlWebpackSkipAssetsPlugin;
//# sourceMappingURL=plugin.js.map