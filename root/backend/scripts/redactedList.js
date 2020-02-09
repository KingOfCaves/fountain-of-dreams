const path = require('path');
const fs = require('fs');
const fg = require('fast-glob');

const redacted_dir = 'C:/Users/rainydays/Desktop/fountain-music/__redacted__/';
const redacted_list_path = path.join(redacted_dir, '../__redacted__.txt');

const rmExt = (str) => {
	return str.replace(/\.[^/.]+$/, '');
};

const listDir = async (dir) => {
	return await fg(dir).then((files) => {
		return files.map((file) => rmExt(path.basename(file)));
	});
};

listDir(`${redacted_dir}/**/*`)
	.then((redacted_list) => {
		if (fs.existsSync(redacted_list_path)) {
			fs.unlink(redacted_list_path, (err) => {
				if (err) return console.log(err);
				console.log('gone!');
			});
		}
		return redacted_list;
	})
	.then((redacted_list) => {
		fs.writeFile(
			redacted_list_path,
			redacted_list.join('\n'),
			{ encoding: 'utf8', flag: 'w' },
			(err) => {
				if (err) return console.log(err);
				console.log('redacted list written!');
			}
		);
	});
