const request = require('request');
const jsdom = require('jsdom');

request('https://jpop80ss2.blogspot.com', (err, res, body) => {
	const dom = new jsdom.JSDOM(body);
	const doc = dom.window.document;
	console.log(doc.querySelector('#sidebar-right-1h'));
});
