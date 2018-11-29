let defaultState = {
	lightTheme: false
}

export default (state = defaultState, action) => {
	switch(action.type){
		case 'LOAD_CONFIG':
			return {...action.payload.data};
		case 'SET_PROPERTY':
			return {...state, [action.payload.name]: action.payload.value};
		case 'RESET':
			return state;
		default: return state
	}
}