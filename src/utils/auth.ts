/**
 * Check if user is logged in
 */
export const isLoggedIn = (): boolean => {
  return localStorage.getItem('isLoggedIn') === 'true' && !!localStorage.getItem('accessToken')
}


