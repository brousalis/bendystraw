module.exports = function(paths) {
  // 🐸 i know, but i got lazy
  return  '' +
    '<!doctype html>\n' +
    '<html>\n' +
      '\t<head>\n' +
        '\t\t<meta charset="utf-8">\n' +
        '\t\t<title></title>\n' +
        '\t\t<meta name="description" content="">\n' +
        '\t\t<meta name="viewport" content="width=device-width">\n' +
        '\t\t<!-- build:css ' + paths.styles + '/app.css -->\n' +
          '\t\t\t<!-- inject:css -->\n' +
          '\t\t\t<!-- endinject -->\n' +
        '\t\t<!-- endbuild -->\n' +
      '\t</head>\n' +
      '\t<body>\n' +
        '\t\t<!-- build:js ' + paths.scripts + '/vendor.js -->\n' +
          '\t\t\t<!-- inject:vendor -->\n' +
          '\t\t\t<!-- endinject -->\n' +
          '\t\t\t<!-- bower:js -->\n' +
          '\t\t\t<!-- endbower -->\n' +
        '\t\t<!-- endbuild -->\n' +
        '\t\t<!-- build:js ' + paths.scripts + '/app.js -->\n' +
          '\t\t\t<!-- inject:templates -->\n' +
          '\t\t\t<!-- endinject -->\n' +
          '\t\t\t<!-- inject:js -->\n' +
          '\t\t\t<!-- endinject -->\n' +
        '\t\t<!-- endbuild -->\n' +
        '\t\t<!-- @if NODE_ENV="production" -->\n' +
        '\t\t<!-- @endif -->\n' +
      '\t</body>\n' +
    '</html>\n';
}
