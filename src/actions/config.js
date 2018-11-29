export const loadConfig = (data) => (
	{
		type: 'LOAD_CONFIG',
		payload: {
			data: data
		}
	}
)

export const setProperty = (name, value) => (
	{
		type: 'SET_PROPERTY',
		payload: {
			name: name,
			value: value
		}
	}
)

export const reset = () => (
	{
		type: 'RESET'
	}
)