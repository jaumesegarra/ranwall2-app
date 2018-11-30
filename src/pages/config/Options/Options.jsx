import React from 'react'; 

export default (values, setProperty, isMacos, setAutoDetectTheme) => (
    <div className="options">
    	<table border="0">
    		<tbody>
				<tr id="app">
					<td><h2>App:</h2></td>
					<td>
						{ isMacos && (
							<div className="config-option">
								<label>
									<input type="checkbox" checked={values.autoDetectTheme} onChange={setAutoDetectTheme}/>
									Detect theme automatically
								</label>
							</div>
						  )
						}
						<div className="config-option">
							<label>
								<input type="checkbox" checked={values.darkTheme} onChange={e => setProperty('darkTheme', e)} disabled={values.autoDetectTheme}/>
								Dark theme
							</label>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
    </div>
);