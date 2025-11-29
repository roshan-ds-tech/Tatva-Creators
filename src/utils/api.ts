const API_BASE_URL = 'http://localhost:8000/api';

// Upload image to backend
export const uploadImage = async (image: File | string): Promise<{ url: string }> => {
  let body: FormData | string;
  const headers: HeadersInit = {};
  
  // If it's a File object, use FormData
  if (image instanceof File) {
    const formData = new FormData();
    formData.append('image', image);
    body = formData;
    // Don't set Content-Type for FormData - browser will set it with boundary
  } else {
    // If it's a base64 string, send as JSON
    body = JSON.stringify({ image });
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}/upload-image/`, {
    method: 'POST',
    headers,
    body,
  });

  if (!response.ok) {
    let errorMessage = 'Failed to upload image';
    try {
      const error = await response.json();
      errorMessage = error.error || errorMessage;
    } catch {
      // If response is not JSON, use status text
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

export interface SignupData {
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    date_joined: string;
  };
  tokens: {
    access: string;
    refresh: string;
  };
}

export interface ApiError {
  error?: string;
  [key: string]: string | string[] | undefined;
}

// Store tokens in localStorage
export const setAuthTokens = (access: string, refresh: string) => {
  localStorage.setItem('accessToken', access);
  localStorage.setItem('refreshToken', refresh);
};

// Store user data in localStorage
export const setUserData = (user: AuthResponse['user']) => {
  localStorage.setItem('userEmail', user.email);
  localStorage.setItem('userName', `${user.first_name} ${user.last_name}`);
  localStorage.setItem('userFirstName', user.first_name);
  localStorage.setItem('userLastName', user.last_name);
  localStorage.setItem('userId', user.id.toString());
  localStorage.setItem('userDateJoined', user.date_joined);
};

// Get access token from localStorage
export const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

// Clear tokens from localStorage
export const clearAuthTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  localStorage.removeItem('userFirstName');
  localStorage.removeItem('userLastName');
  localStorage.removeItem('userId');
  localStorage.removeItem('userDateJoined');
};

// Get user data from localStorage
export const getUserData = () => {
  const email = localStorage.getItem('userEmail');
  const firstName = localStorage.getItem('userFirstName');
  const lastName = localStorage.getItem('userLastName');
  const fullName = localStorage.getItem('userName');
  const userId = localStorage.getItem('userId');
  const dateJoined = localStorage.getItem('userDateJoined');

  if (!email || !fullName) {
    return null;
  }

  return {
    email,
    firstName: firstName || '',
    lastName: lastName || '',
    fullName: fullName || `${firstName || ''} ${lastName || ''}`.trim(),
    userId: userId ? parseInt(userId) : null,
    dateJoined: dateJoined || null,
  };
};

// Signup API call
export const signup = async (data: SignupData): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/signup/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
      confirm_password: data.confirm_password,
      first_name: data.first_name,
      last_name: data.last_name,
    }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    // Handle validation errors
    const error: ApiError = responseData;
    throw error;
  }

  // Store tokens and user data
  setAuthTokens(responseData.tokens.access, responseData.tokens.refresh);
  localStorage.setItem('isLoggedIn', 'true');
  setUserData(responseData.user);

  return responseData;
};

// Login API call
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
    }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    const error: ApiError = responseData;
    throw error;
  }

  // Store tokens and user data
  setAuthTokens(responseData.tokens.access, responseData.tokens.refresh);
  localStorage.setItem('isLoggedIn', 'true');
  setUserData(responseData.user);

  return responseData;
};

// Get user profile (requires authentication)
export const getUserProfile = async (): Promise<AuthResponse['user']> => {
  const token = getAccessToken();
  
  if (!token) {
    throw new Error('No access token found');
  }

  const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthTokens();
      throw new Error('Authentication failed. Please login again.');
    }
    throw new Error('Failed to fetch user profile');
  }

  return response.json();
};

// Refresh access token
export const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    throw new Error('No refresh token found');
  }

  const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refresh: refreshToken,
    }),
  });

  if (!response.ok) {
    clearAuthTokens();
    throw new Error('Token refresh failed');
  }

  const data = await response.json();
  localStorage.setItem('accessToken', data.access);
  
  return data.access;
};

// Product API interfaces
export interface ProductData {
  name: string;
  category: string;
  price: number;
  image: string;
  alt: string;
  description?: string;
  mainDescription?: string;
  subDescriptions?: { title: string; body: string }[];
  dimensions?: string;
  material?: string;
  weight?: string;
  inStock?: boolean;
  thumbnails?: string[];
  reviews?: Array<{
    id?: number;
    userName: string;
    rating: number;
    date: string;
    comment: string;
  }>;
  rating?: number;
}

export interface ProductResponse extends ProductData {
  id: number;
  rating: number;
}

// Get all products
export const getProducts = async (): Promise<ProductResponse[]> => {
  const response = await fetch(`${API_BASE_URL}/products/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      // If endpoint doesn't exist yet, return empty array
      return [];
    }
    throw new Error('Failed to fetch products');
  }

  return response.json();
};

// Create a new product (JWT token optional - backend may allow unauthenticated requests)
export const createProduct = async (product: ProductData): Promise<ProductResponse> => {
  const token = getAccessToken();
  
  // Build headers - include Authorization only if token exists
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/products/`, {
    method: 'POST',
    headers,
    body: JSON.stringify(product),
  });

  let responseData;
  try {
    responseData = await response.json();
  } catch (e) {
    // If response is not JSON, create a proper error
    const text = await response.text();
    throw new Error(`Server error (${response.status}): ${text || response.statusText}`);
  }

  if (!response.ok) {
    // Format error properly for better error messages
    const error: ApiError = responseData;
    
    // Extract error message from various possible formats
    let errorMessage = 'Failed to create product';
    
    // Handle Django REST framework error format
    if (typeof error === 'object' && error !== null) {
      const errorMessages: string[] = [];
      
      // Check for field-specific errors (Django format: { "field_name": ["error1", "error2"] })
      Object.keys(error).forEach(key => {
        if (Array.isArray(error[key])) {
          errorMessages.push(`${key}: ${(error[key] as string[]).join(', ')}`);
        } else if (typeof error[key] === 'string') {
          errorMessages.push(`${key}: ${error[key]}`);
        } else if (typeof error[key] === 'object') {
          // Nested error objects
          errorMessages.push(`${key}: ${JSON.stringify(error[key])}`);
        }
      });
      
      if (errorMessages.length > 0) {
        errorMessage = errorMessages.join('\n');
      } else if (error?.error) {
        if (typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (typeof error.error === 'object') {
          errorMessage = JSON.stringify(error.error, null, 2);
        }
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.detail) {
        errorMessage = error.detail;
      } else if (error?.non_field_errors) {
        errorMessage = Array.isArray(error.non_field_errors) 
          ? error.non_field_errors.join(', ') 
          : String(error.non_field_errors);
      } else {
        // Last resort: stringify the whole error object
        errorMessage = JSON.stringify(error, null, 2);
      }
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    const formattedError = new Error(errorMessage);
    (formattedError as any).originalError = error;
    (formattedError as any).status = response.status;
    throw formattedError;
  }

  return responseData;
};

// Update a product (JWT token optional - backend may allow unauthenticated requests)
export const updateProduct = async (id: number, product: Partial<ProductData>): Promise<ProductResponse> => {
  const token = getAccessToken();
  
  // Build headers - include Authorization only if token exists
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/products/${id}/`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(product),
  });

  let responseData;
  try {
    responseData = await response.json();
  } catch (e) {
    // If response is not JSON, create a proper error
    const text = await response.text();
    throw new Error(`Server error (${response.status}): ${text || response.statusText}`);
  }

  if (!response.ok) {
    // Format error properly for better error messages
    const error: ApiError = responseData;
    
    // Extract error message from various possible formats
    let errorMessage = 'Failed to update product';
    
    // Handle Django REST framework error format
    if (typeof error === 'object' && error !== null) {
      const errorMessages: string[] = [];
      
      // Check for field-specific errors (Django format: { "field_name": ["error1", "error2"] })
      Object.keys(error).forEach(key => {
        if (Array.isArray(error[key])) {
          errorMessages.push(`${key}: ${(error[key] as string[]).join(', ')}`);
        } else if (typeof error[key] === 'string') {
          errorMessages.push(`${key}: ${error[key]}`);
        } else if (typeof error[key] === 'object') {
          // Nested error objects
          errorMessages.push(`${key}: ${JSON.stringify(error[key])}`);
        }
      });
      
      if (errorMessages.length > 0) {
        errorMessage = errorMessages.join('\n');
      } else if (error?.error) {
        if (typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (typeof error.error === 'object') {
          errorMessage = JSON.stringify(error.error, null, 2);
        }
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.detail) {
        errorMessage = error.detail;
      } else if (error?.non_field_errors) {
        errorMessage = Array.isArray(error.non_field_errors) 
          ? error.non_field_errors.join(', ') 
          : String(error.non_field_errors);
      } else {
        // Last resort: stringify the whole error object
        errorMessage = JSON.stringify(error, null, 2);
      }
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    const formattedError = new Error(errorMessage);
    (formattedError as any).originalError = error;
    (formattedError as any).status = response.status;
    throw formattedError;
  }

  return responseData;
};

// Delete a product (requires admin authentication)
export const deleteProduct = async (id: number): Promise<void> => {
  const token = getAccessToken();
  
  // Build headers - include Authorization only if token exists
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/products/${id}/`, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Product not found');
    }
    const responseData = await response.json();
    const error: ApiError = responseData;
    throw error;
  }
};

// Get a single product by ID
export const getProductById = async (id: number): Promise<ProductResponse> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Product not found');
    }
    throw new Error('Failed to fetch product');
  }

  return response.json();
};


