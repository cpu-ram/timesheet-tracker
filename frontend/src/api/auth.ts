export async function fetchAuthData(): Promise<{ authStatus: boolean; signUpCompletionStatus: boolean }> {
  let result: { authStatus: boolean; signUpCompletionStatus: boolean } | null = null;
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/auth/status`, {
      method: 'GET',
      credentials: 'include',
    })
    const data = await response.json();
    result = {
      authStatus: data.authStatus,
      signUpCompletionStatus: data.signUpCompletionStatus
    };
  }
  catch (error: unknown) {
    throw new Error(`Error fetching authentication status: ${error}`);
  }
  return result;
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
  let result: boolean = false;
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    if (response.ok) {
      result = true;
      return result;
    } else {
      console.error('Logout failed:', response.statusText);
    }
  }
  catch (error) {
    console.error('Error during logout:', error);
  }
}
