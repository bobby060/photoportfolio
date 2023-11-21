// Takes an album and generates it's url based the id and the title
export function urlhelperEncode(album){
	const ending = album.id.slice(-2);
	const new_name = album.title.toLowerCase().replace(' ', '-');
	const url = new_name.concat("-", ending);
	return url
}

// takes an album and a url and returns true or false. Use: validating if a specific path is the right one for a given album
export function urlhelperDecode(album, url){
	const ending = url.slice(-2);
	const name = url.slice(0,-3).replace('-', ' ');
	if (album.id.slice(-2) === ending && name === album.title.toLowerCase()) return true;
	return false;
}