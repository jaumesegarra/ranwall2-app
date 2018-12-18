import React from 'react'; 

export default (pullContainer, pullElement, isLoading, wallpaperPath, setCurrentWallpaper, onLoad, hasError) => (
    <div ref={pullContainer}>                                                                                
        <div className={`previewer ${(isLoading) ? 'loading' : ''} ${(hasError) ? 'hasError' : ''}`} ref={pullElement}>
        	{
        		wallpaperPath && (<img src={wallpaperPath} alt="Current downloaded wallpaper" onLoad={onLoad} onMouseDown={() => false} onDoubleClick={setCurrentWallpaper} draggable="false"/>)
        	}
        	
        	{
        		hasError &&
    		    	( 
    		    	<div className="on-error">
    		            <h2>Error trying load wallpaper</h2>
    		            <p>Will be retry at 10 seconds automatically.</p>
    		        </div>
    		        )
        	}
        </div>
    </div>
);