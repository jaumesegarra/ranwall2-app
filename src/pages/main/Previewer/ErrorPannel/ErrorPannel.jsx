import React from 'react'; 

export default (time, isLoading) => (
    <div className="errorPannel">
    	<h2>Error trying load wallpaper</h2>
    	<p>
    		{ (isLoading) ? 'Retrying...' : `Will be retry at ${time} seconds automatically.` } 
    	</p>
   	</div>
);