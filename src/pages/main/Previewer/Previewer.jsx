import React from 'react'; 

export default (isLoading, wallpaperPath, onLoad, hasError) => (
    <div className={`previewer ${(isLoading) ? 'loading' : ''} ${(hasError) ? 'hasError' : ''}`}>
    	{
    		wallpaperPath && (<img src={wallpaperPath} alt="Current downloaded wallpaper" onLoad={onLoad} onMouseDown={() => false}/>)
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
);