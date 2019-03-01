import React from 'react'; 

export default (wallpaper, isDesiredSize, setWallpaper, saveAs, previewUp, previewDown) => (
   <div className="actions">
   		<div className="info">
   			<span title="Wallpaper provider">{wallpaper.provider.name}</span>
            
            { 
              !isDesiredSize && (
            	<span title="Original wallpaper size">{wallpaper.originalResize.width} x {wallpaper.originalResize.height}</span>
   			  )
        	}
   		</div>

   		<button className="button very light" title="Save as wallpaper" onClick={saveAs}><i className="fa fa-download"></i></button>

   		{
   			!wallpaper.wasSetAsWallpaper && (
   			   <button className="button light" title="Set wallpaper" onClick={setWallpaper} onMouseEnter={previewUp} onMouseLeave={previewDown}>Set</button>
   			)
   		}
   </div>
)
