import React from 'react'; 

export default (close, minimize) => (
   <div className="controls">
   		<button id="close" title="Close" onClick={close}>
   			<span>
   				&times;
   			</span>
   		</button>
    	<button id="minimize" title="Minimize" onClick={minimize}>
    		<span>
    			&ndash;
    		</span>
    	</button>
   </div>
);