export default [{
	"code": "PSUM",
	"name": "picsum.photos",
	"url": res => `https://picsum.photos/${res[0]}/${res[1]}/?random`
},
{	
	"code": "UNSP",
	"name": "unsplash.com",
	"url": res => `https://source.unsplash.com/random/${res[0]}x${res[1]}`
},
{
	"code": "FLCK",
	"name": "loremFlickr.com *",
	"url": res => `https://loremflickr.com/${res[0]}/${res[1]}`
},
{
	"code": "SPLB",
	"name": "splashbase.co *",
	"url": res => `http://www.splashbase.co/api/v1/images/random?images_only=true`,
	"get": {
		"imgPath": data => data.large_url
	}
}]