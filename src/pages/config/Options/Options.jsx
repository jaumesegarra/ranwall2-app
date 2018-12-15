import React from 'react'; 

export default (values, isMacos, providers, setPredefinedResolution, magicShortcut, resetApp, setProperty) => (
    <div className="options">
    	<table border="0">
    		<tbody>
				<tr id="app">
					<td><h2>App:</h2></td>
					<td>
						<div className="config-option">
							<label>
								<input type="checkbox" checked={values.hideAtLaunch} onChange={(e) => setProperty.common('hideAtLaunch', e)}/>
								Hide at launch (always)
							</label>
						</div>
						<div className="config-option">
							<label>
								<input type="checkbox" checked={values.launchAtStartup} onChange={setProperty.launchAtStartup}/>
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
									<input type="checkbox" checked={values.autoDetectTheme} onChange={setProperty.autoDetectTheme}/>
									Detect automatically
								</label>
							</div>
						  )
						}
						<div className="config-option">
							<label>
								<input type="checkbox" checked={values.darkTheme} onChange={e => setProperty.common('darkTheme', e)} disabled={values.autoDetectTheme}/>
								Dark theme
							</label>
						</div>
					</td>
				</tr>
				<tr id="wallpaper">
					<td><h2>Wallpaper:</h2></td>
					<td>
						<div className="config-option">
							<label className="block">
								<span>Providers:</span>
								<div className="select-wrapper">
									<select multiple="multiple" value={values.providers} onChange={setProperty.providers} size={providers.length}>
										{
											providers.map(p =>
												<option key={p.code} value={p.code}>{p.name}</option>
											)
										}
									</select>
								</div>
							</label>
						</div>
						<div className="config-option resolution">
							<label className="block">
								<span>Resolution:</span>
								
								<input type="number" value={values.resolution[0]} onChange={e => setProperty.resolution(0, e)} step="10"/>
								<span className="x">&times;</span>
								<input type="number" value={values.resolution[1]} onChange={e => setProperty.resolution(1, e)} step="10"/>
							</label>
							
							<button className="button grey" onClick={e => setPredefinedResolution(0)} title="Default">DF</button>
							<button className="button grey" onClick={e => setPredefinedResolution(1)} title="HD">HD</button>
							<button className="button grey" onClick={e => setPredefinedResolution(2)} title="4K">4K</button>
							<span className="info">+ resolution, + loading time</span>
						</div>
					</td>
				</tr>
				<tr id="tricks">
					<td><h2>Tricks:</h2></td>
					<td>
						<div className="config-option">
							<label>
								<input type="checkbox" checked={values.wallpaperPreview} onChange={(e) => setProperty.common('wallpaperPreview', e)}/>
								Wallpaper preview
							</label>
						</div>
						<div className="config-option">
							<label>
								<input type="checkbox" checked={values.forceWallpaperResize} onChange={(e) => setProperty.common('forceWallpaperResize', e)}/>
								Force wallpaper resize
							</label>
							<span className="info">Blur input to cancel record or save. Restart app for try your custom shortcut!</span>
						</div>
					</td>
				</tr>
				<tr id="advanced">
					<td><h2>Advanced options:</h2></td>
					<td>
						<div className="config-option">
							<label className="block">
								<span>Magic shortcut:</span>
								<input type="text" value={magicShortcut.tmpKeys || values.magicShortcutKeys} disabled="disabled"/>
								<button className={'button'+(magicShortcut.tmpKeys !== null ? ' red': '')} onClick={magicShortcut.record} onBlur={magicShortcut.stop} onKeyUp={magicShortcut.onKeyUp}>
								{ 
								  magicShortcut.tmpKeys === null ? (
									<font><i className="fa fa-microphone"></i> Record</font>
								  ) : (
									<font><i className="fa fa-stop"></i> Stop</font>
								  )
								}
								</button>
								<span className="info">Blur input to cancel recording or save. Restart app for apply the new shortcut keys!</span>
							</label>
						</div>
						<div className="space"></div>
						<div className="config-option">
							<button className="button" onClick={resetApp}>Delete cache</button>
							<span className="info">If you have set a ranwallpaper, it may not be established when restart the computer.</span>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
    </div>
);