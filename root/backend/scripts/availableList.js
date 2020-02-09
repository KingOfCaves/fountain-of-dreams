const path = require('path');
const fs = require('fs');
const fg = require('fast-glob');

const available_dir = 'C:/Users/rainydays/Desktop/fountain-music/__available__/';
const available_list_path = path.join(available_dir, '../__available__.txt');

const rmExt = (str) => {
	return str.replace(/\.[^/.]+$/, '');
};

const listDir = async (dir) => {
	return await fg(dir).then((files) => {
		return files.map((file) => rmExt(path.basename(file)));
	});
};

listDir(`${available_dir}/**/*`)
	.then((available_list) => {
		if (fs.existsSync(available_list_path)) {
			fs.unlink(available_list_path, (err) => {
				if (err) return console.log(err);
				console.log('gone!');
			});
		}
		return available_list;
	})
	.then((available_list) => {
		fs.writeFile(
			available_list_path,
			available_list.join('\n'),
			{ encoding: 'utf8', flag: 'w' },
			(err) => {
				if (err) return console.log(err);
				console.log('available list written!');
			}
		);
	});
