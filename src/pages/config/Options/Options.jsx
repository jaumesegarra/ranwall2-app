import React from 'react'; 

export default (values, setProperty, isMacos, setLaunchAtStartup, setAutoDetectTheme) => (
    <div className="options">
    	<table border="0">
    		<tbody>
				<tr id="app">
					<td><h2>App:</h2></td>
					<td>
						<div className="config-option">
							<label>
								<input type="checkbox" checked={values.hideAtLaunch} onChange={(e) => setProperty('hideAtLaunch', e)}/>
								Hide at launch (always)
							</label>
						</div>
						<div className="config-option">
							<label>
								<input type="checkbox" checked={values.launchAtStartup} onChange={setLaunchAtStartup}/>
								Launch at startup
							</label>
						</div>
					</td>
				</tr>
				<tr id="look">
					<td><h2>Theme:</h2></td>
					<td>
						{ isMacos && (
							<div className="config-option">
								<label>
									<input type="checkbox" checked={values.autoDetectTheme} onChange={setAutoDetectTheme}/>
									Detect automatically
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