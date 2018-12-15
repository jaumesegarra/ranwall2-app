export const loadConfig = (data) => (
	{
		type: 'LOAD_CONFIG',
		payload: {
			data: data
		}
	}
)

export const setProperties = (values) => (
	{
		type: 'SET_PROPERTIES',
		payload: {
			values: values
		}
	}
)

export const reset = () => (
	{
		type: 'RESET'
	}
)