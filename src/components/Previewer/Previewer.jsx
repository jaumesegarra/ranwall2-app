import React from 'react'; 

export default (wallpaper, hasError) => (
    <div className="previewer loading">
    	{
    		wallpaper.status === 0 && (<img src="" alt="Current download wallpaper"/>)
    	}
    	
    	{
    		hasError &&
		    	( 
		    	<div class="on-error">
		            <h2>Error trying load wallpaper</h2>
		            <p>Will be retry at 10 seconds automatically.</p>
		        </div>
		        )
    	}
    </div>
);