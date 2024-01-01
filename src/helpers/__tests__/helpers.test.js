import {urlhelperEncode, urlhelperDecode} from '../urlhelper';

const mock_album = {
	id: '1123-asdf-1234-asdd',
	title: 'Mock Album',
	desc: 'Description for mock album',
	privacy:'public'
}

describe('testing urlHelperEncoder', ()=>{
	test('encodes URL, converts spaces to -', () => {
		expect(urlhelperEncode(mock_album)).toMatch('mock-album-dd');
	});
});

describe('testing urlHelperDecoder', ()=>{
	test('Url matches, album name includes space', () => {
		expect(urlhelperDecode(mock_album, 'mock-album-dd')).toBe(true);
	});
	test('Url doesn not match album', ()=>{
		expect(urlhelperDecode(mock_album, 'dummy-album-da')).toBe(false);
	})
});
