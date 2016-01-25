var $ = require('jquery');

// Ensure this is configured in browswerify
requre('jquery.swiftype.autocomplete');

// File system module, used to read in our template
var fs = require('fs');
// The library that will compile our template
var swig = require('swig');

// template for the individual result
// ensure you have `brfs` configured
// in browserify
var templateResult = fs.readFileSync(
  __dirname +
  '/templateResult.html', 'utf8');

/**
 * Configure & manage swiftype.
 */
function Search () {
  if (!(this instanceof Search)) { return new Search(); }
  
  // The search box
  var $input = $('#st-search-input');

  // Initialize swiftype
  $input.swiftype({ 
    engineKey: 'jaDGyzkR6iYHkfNsPpNK',
    resultLimit: 20,
    resultRenderFunction: resultRenderFunction,
    renderFunction: renderResults
  });

  // `show` is emitted when the $input is in focus
  // the search results list will be showing
  $input[0].dispatcher.on('show', function () {

  });

  // `hide` is emitted when the $input is unfocused
  // the search results will no longer be showing
  $input[0].dispatcher.on('hide', function () {

  });

}

module.exports Search;


/**
 * Responsible for rendering incoming results using
 * the `renderResults` function.
 */
function resultRenderFunction (ctx, results) {
  var $list = ctx.list,
    config = ctx.config;

  var query = self.$activeInput.val().toLowerCase();

  $.each(results, function(document_type, items) {
    $.each(items, function(idx, item) {
      ctx.registerResult($(config.renderFunction(query, document_type, item)).appendTo($list), item);
    });
  });
}


/**
 * @param  {string} query The current search query
 * @param  {string} document_type Search result document type
 * @param  {object} item
 * @return {string} output HTML string of the result
 */
function renderResults (query, document_type, item) {
  var output;

  /* Decide if the result is worth listing.
    - All results should be `document_type` of 'page'.
    - WebHook's default page title is 'Webhook site'.
      If a page has this title, it is likely a page
      that is being generated, but not linked to. As
      it has no title that speaks to the project.
    */
  if (document_type === 'page' &&
      item.title !== 'Webhook site') {

    // Add a query snippet to the object that will
    // render your results.
    item.querySnippet = createQuerySnippet(
        item.body, query);

    // Render the HTML. Output will be a string of HTML.
    output = swig.render(templateResult, { locals: item });

  }

  return output;
}


/**
 * @param  {string} body The HTML to find the `query` in
 * @param  {string} query The string to find in the `body`
 * @return {string} querySnippet Emptry string or string
 * of HTML. The HTML is a snippet of the `body`, that 
 * includes a <span> around the `query`.
 */
function createQuerySnippet(body, query) {
  var querySnippet = '';

  var queryPositionInBody = body.toLowerCase().indexOf(query);
  if (queryPositionInBody === -1) return querySnippet;

  var bodyQuerySpan =
    body.slice(0, queryPositionInBody) +
    '<span class="search-results__query">' +
    body
      .slice(
        queryPositionInBody,
        (queryPositionInBody + query.length)) +
    '</span>' +
    body
      .slice(
        (queryPositionInBody + query.length),
        body.length);
  
  var startOfQuerySnippet = 0;
  var endOfQuerySnippet = bodyQuerySpan.length;

  var optimalStartOfQuerySnippet = queryPositionInBody - 100;
  var optimalEndOfQuerySnippet = queryPositionInBody + 100;

  if (optimalStartOfQuerySnippet > startOfQuerySnippet) {
    startOfQuerySnippet =
      closestSpacePositionInStringAtPosition(
        bodyQuerySpan,
        optimalStartOfQuerySnippet);
  }
  else {
    optimalEndOfQuerySnippet += 100;
  }
  if (optimalEndOfQuerySnippet < endOfQuerySnippet) {
    endOfQuerySnippet =
      closestSpacePositionInStringAtPosition(
        bodyQuerySpan,
        optimalEndOfQuerySnippet);
  }
  
  querySnippet =
    bodyQuerySpan
      .slice(startOfQuerySnippet, endOfQuerySnippet)
      .trim();

  if (startOfQuerySnippet > 0) {
    querySnippet = '…' + querySnippet;
  }
  if (endOfQuerySnippet < body.length) {
    querySnippet += '…';
  }

  return querySnippet;

  function closestSpacePositionInStringAtPosition (string, position) {
    if (string[position] === ' ') return position;

    var beforeOption = string.lastIndexOf(' ', position);
    var afterOption = string.indexOf(' ', position);

    if ((position - beforeOption) <
        (afterOption - position)) {
      return beforeOption;
    }
    else {
      return afterOption;
    }
  }
}
