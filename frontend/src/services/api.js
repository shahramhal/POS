// frontend/src/services/api.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * A generic error handler for axios responses.
 * @param {*} error - The error object from axios.
 */
const handleError = (error) => {
  if (axios.isAxiosError(error)) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const message = error.response?.data?.detail || error.message;
    console.error("API Error:", message);
    throw new Error(message);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Unexpected Error:", error);
    throw new Error("An unexpected error occurred.");
  }
};


// --- API Functions ---

/**
 * Fetches all users from the backend.
 * This will replace the mock employee data.
 */
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
 * @param {string} email - The user's email.
 * @param {string} pin - The user's PIN.
 * @returns {Promise<{access_token: string, token_type: string}>}
 */
export const loginUserWithPin = async (email, pin) => {
    // OAuth2PasswordRequestForm expects data in a URL-encoded form format.
    const formData = new URLSearchParams();
    formData.append('username', email);
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
