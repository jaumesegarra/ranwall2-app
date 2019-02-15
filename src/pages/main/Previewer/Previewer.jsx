import React from 'react'; 

import Actions from './Actions/Actions';
import ErrorPannel from './ErrorPannel/ErrorPannel';

export default (pullContainer, pullElement, isLoading, wallpaperPath, setCurrentWallpaper, onLoad, hasError, isPreviewerActive) => (
    <div ref={pullContainer}>                                                                                
        <div className={`previewer ${(isLoading) ? 'loading' : ''} ${(hasError) ? 'hasError' : ''}${(isPreviewerActive) ? 'previewIsUp' : ''}`} ref={pullElement}>
        	{
        		!hasError && wallpaperPath && 
                (
                    <img 
                        src={wallpaperPath} 
                        alt="Current downloaded wallpaper" 
                        onLoad={onLoad} onMouseDown={() => false} 
                        onDoubleClick={setCurrentWallpaper} 
                        draggable="false"
                    />
                )
        	}
        	   
            {
                !hasError && !isLoading && wallpaperPath && 
                (
                    <Actions />
                )
            }

        	{
        		hasError &&
    		    ( 
    		    	<ErrorPannel />
    		    )
        	}
        </div>
    </div>
);