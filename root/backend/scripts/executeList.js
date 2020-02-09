const path = require('path');
const fs = require('fs');
const fg = require('fast-glob');
const moveFile = require('move-file');

const available_dir = 'C:/Users/rainydays/Desktop/fountain-music/__available__/';
const available_list =
	'C:/Users/rainydays/Desktop/fountain-music/__available__.txt';

const rmExt = (str) => {
	return str.replace(/\.[^/.]+$/, '');
};

const executeList = async (list) => {
	return await fs.promises.readFile(list);
};

const listDir = async (dir) => {
	return await fg(`${dir}/**/*`)
		.then((files) => files)
		.catch((err) => console.log(err));
};

executeList(available_list)
	.then((files) => files.toString().split('\n'))
	.then((available) => {
		listDir(available_dir)
			.then((list) => list.filter((item) => !available.includes(item)))
			.then((checked) => console.log(checked));
	});
