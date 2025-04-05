export async function fetchAuthData() {
  const result = false;
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/auth/status`, {
      method: 'GET',
      credentials: 'include',
    })
    const data = await response.json();
    return {
      authStatus: data.authStatus,
      signUpCompletionStatus: data.signUpCompletionStatus
    };
  }
  catch (error) {
    console.error('Error fetching authentication status:', error);
    return false;
  }
  return fetchedAuthData;
}

export async function fetchUsername() {
  let result = null;
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/username`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Unable to fetch username');
    }
    result = await response.json();
    if (result && result.username) {
      return result.username;
    }
    else {
      console.error('No username found in the response');
      return null;
    }
  }
  catch (error) {
    console.error('Error fetching username:', error);
    return null;
  }
}

export async function logout() {
  let result = false;
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    if (response.ok) {
      result = true;
    } else {
      console.error('Logout failed:', response.statusText);
    }
  }
  catch (error) {
    console.error('Error during logout:', error);
  }
}