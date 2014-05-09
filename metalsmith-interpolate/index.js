
/**
 * Expose `interpolate`.
 *
 * A debug plugin modified from MetaSmith's example draft plugin
 */

var consolidate = require('consolidate');
var each = require('async').each;
var extend = require('extend');
var debug = console.log;

module.exports = interpolate;

/**
 * A Metalsmith plugin to interpolate variables
 *
 * Note, this is different from metalsmith-template,
 * although both plugin uses templating engine:
 *
 *    - metalsmith-template:
 *    render(template=template, data={contents, metadata})
 *    - metalsmith-interpolate:
 *    render(template=contents, data={metadata})
 *
 * This plugin is useful to interpolate metadata in the source
 * before markdown compilation.
 *
 * @param {Object} files
 * @param {Metalsmith} metalsmith
 * @param {Function} done
 */

function interpolate(opts){
    if ('string' == typeof opts) opts = { engine: opts };
    opts = opts || {};
    console.log('opts:');
    console.log(opts);
    var engine = opts.engine;

    if (!opts.engine) throw new Error('"engine" option required');

    return function(files, metalsmith, done){
        var metadata = metalsmith.metadata();

        each(Object.keys(files), convert, done);

        function convert(file, done){
            debug('checking file: %s', file);
            var data = files[file];
            if (!data.template) return done();

            debug('converting file: %s', file);
            data.contents = data.contents.toString();
            //var tmpl = metalsmith.join(dir, data.template);
            var tmpl = data.contents.toString();
            var clone = extend({}, metadata);

            // This is not documented (in README)...
            // Get a hint here:
            // https://github.com/visionmedia/consolidate.js/pull/62
            consolidate[engine].render(tmpl, clone, function(err, str){
                if (err) return done(err);
                data.contents = new Buffer(str);
                debug('converted file: %s', file);
                done();
            });
        }
    };
}

