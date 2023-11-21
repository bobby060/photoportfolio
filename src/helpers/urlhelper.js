

export function urlhelperEncode(album){
	const ending = album.id.slice(-2);
	const new_name = album.title.toLowerCase().replace(' ', '-');
	const url = new_name.concat("-", ending);
	return url
}

// takes an album and a url and returns true or false
export function urlhelperDecode(album, url){
	const ending = url.slice(-2);
	console.log(ending);
	const name = url.slice(0,-3).replace('-', ' ');
	console.log(name);
	if (album.id.slice(-2) === ending && name === album.title.toLowerCase()) return true;
	return false;
}