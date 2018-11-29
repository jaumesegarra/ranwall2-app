import React from 'react'; 

import Controls from './Controls/Controls';

export default () => (
   <div className="header">
   		<Controls />

   		<h1><img src="logoMark.png" title="ranwall: created by Jaume Segarra" alt="Logo"/></h1>

   		<button id="refresh" title="Refresh">
   			<i className="fa fa-refresh"></i>
   		</button>
        <button id="config" title="Configuration">
        	<i className="fa fa-cog"></i>
        </button>
   </div>
);