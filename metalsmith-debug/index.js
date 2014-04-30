
/**
 * Expose `debug`.
 *
 * A debug plugin modified from MetaSmith's example draft plugin
 */

module.exports = debug;

/**
 * A Metalsmith plugin to hide any files marked as `draft`.
 *
 * @param {Object} files
 * @param {Metalsmith} metalsmith
 * @param {Function} done
 */

function debug(options){
  return function(files, metalsmith, done){
    for (var file in files) {
      if (options['enabled']){
          console.log('begin ' + file + ' -------');
          console.log(files[file]);
          console.log('end ' + file + ' -------');
      }
    }
    done();
  };
}
