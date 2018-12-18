import React from 'react'; 

import Controls from './Controls/Controls';

export default (hideWindow, newWallpaper, openConfig) => (
   <div className="header" onDoubleClick={hideWindow}>
   		<Controls />

   		<h1><img src="logoMark.png" title="ranwall: created by Jaume Segarra" alt="Logo"/></h1>

   		<button id="refresh" title="Refresh" onClick={newWallpaper}>
   			<i className="fa fa-refresh"></i>
   		</button>
        <button id="config" title="Configuration" onClick={openConfig}>
        	<i className="fa fa-cog"></i>
        </button>
   </div>
);