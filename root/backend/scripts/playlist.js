const path = require('path');
const fs = require('fs');
const fg = require('fast-glob');

const available_dir = 'C:/Users/rainydays/Desktop/fountain-music/__available__/';
const playlist_path = path.join(available_dir, '../playlist.txt');
const liq_path = 'C:/Users/rainydays/Desktop/fountain-music/';

const rmExt = (str) => {
	return str.replace(/\.[^/.]+$/, '');
};

const listDir = async (dir) => {
	return await fg(dir).then((files) => {
		return files.filter((file) => !!file.match(/^.*\.(ogg|mp3|flac|wav)$/));
	});
};

listDir(`${available_dir}/**/*`)
	.then((playlist) => {
		if (fs.existsSync(playlist_path)) {
			fs.unlink(playlist_path, (err) => {
				if (err) return console.log(err);
				console.log('gone!');
			});
		}
		return playlist;
	})
	.then((playlist) => {
		fs.writeFile(
			playlist_path,
			playlist.join('\n'),
			{ encoding: 'utf8', flag: 'w' },
			(err) => {
				if (err) return console.log(err);
				console.log('available list written!');
			}
		);
	});
