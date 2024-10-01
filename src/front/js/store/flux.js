const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {},
		actions: {
			logout: () => {
				localStorage.removeItem('access_token');
			},
			login: async (credentials) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
						'method': 'POST',
						'body': JSON.stringify(credentials),
						'headers': {
							'Access-Control-Allow-Origin': '*',
							'Content-Type': 'application/json'
						}
					});
					if (!response.ok) {
						const errorData = await response.json();
						console.error('Login failed: ', errorData.message);
						return { error: errorData.message };
					}
					const data = await response.json();
					return { accessToken: data.access_token };
				} catch (error) {
					console.error(error);
					return { error: 'Network error' };
				}
			},
			signup: async (signupForm) => {
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/auth/signup`, {
						'method': 'POST',
						'body': JSON.stringify(signupForm),
						'headers': {
							'Access-Control-Allow-Origin': '*',
							'Content-Type': 'application/json'
						}
					});
					if (!response.ok) {
						const errorData = await response.json();
						console.error('Signup failed: ', errorData.message);
						return { error: errorData.message };
					}
					const data = await response.json();
					return { createdUser: data };
				} catch (error) {
					console.error(error);
					return { error: 'Network error' };
				}
			}
		}
	};
};

export default getState;
