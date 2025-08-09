import {apiClient, handleError} from './api.js';

export const createEmployee = async (employeeData) => {
  try {
    const response =await apiClient.post('users/create/', employeeData);
    return response.data;
  } catch (error) {
    handleError(error);
    }
}
export const getAllUsers = async () => {
  try {
    const response = await apiClient.get("/users/");
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Logs in a regular staff member using their email (looked up from their ID) and PIN.
 * This is for the main employee grid UI.
 * @param {string} username - The user's email.
 * @param {string} pin - The user's PIN.
 * @returns {Promise<{access_token: string, token_type: string}>}
 */
export const loginUserWithPin = async (username, pin) => {
    // OAuth2PasswordRequestForm expects data in a URL-encoded form format.
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', pin);

    try {
        const response = await apiClient.post("/auth/login", formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

/**
 * Logs in a manager or admin using their email and password.
 * This is for the dedicated "Manager Login" screen.
 * @param {string} email - The manager's email.
 * @param {string} password - The manager's password.
 * @returns {Promise<{access_token: string, token_type: string}>}
 */
export const loginManager = async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    try {
        const response = await apiClient.post("/auth/login", formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};


/**
 * Fetches the details of the currently authenticated user.
 * We can add the token to the apiClient instance for this request.
 * @param {string} token - The user's JWT access token.
 */
export const getMe = async (token) => {
    try {
        const response = await apiClient.get("/auth/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};
