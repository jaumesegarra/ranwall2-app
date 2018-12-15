//import { Observable } from 'rxjs';

export default [{
	"code": "PSUM",
	"name": "picsum.photos",
	"url": res => `https://picsum.photos/${res[0]}/${res[1]}/?random`,
	"get": {
		"type": "image"
	}
},
{	
	"code": "UNSP",
	"name": "unsplash.com",
	"url": res => `https://source.unsplash.com/random/${res[0]}x${res[1]}`,
	"get": {
		"type": "image"
	}
},
/*{
	"code": "WLLUP",
	"name": "wallpaperup.com",
	"url": res => Observable.create(obs => {
			window.require("ranwallpaperup").random(res[0], res[1]).then(data => {
				obs.next(data.url);
				obs.complete();
			}).catch(e => obs.error(e));
	}),
	"get": {
		"type": "image"
	}
},*/
{
	"code": "DSKPR",
	"name": "desktoppr.co *",
	"url": res => `https://api.desktoppr.co/1/wallpapers/random`,
	"get": {
		"type": "json",
		"imgPath": data => {
			return data.image.url
		}
	}
}]