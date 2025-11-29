/**
 * Admin authentication utilities
 */

/**
 * Check if admin is authenticated
 * Returns true only if adminAuthed is exactly the string 'true'
 */
export const isAdminAuthenticated = (): boolean => {
  try {
    if (typeof window === 'undefined') return false
    const authed = window.localStorage.getItem('adminAuthed')
    // Strict check - must be exactly the string 'true'
    return authed === 'true'
  } catch (error) {
    return false
  }
}

/**
 * Set admin authentication
 */
export const setAdminAuthenticated = (value: boolean): void => {
  try {
    if (typeof window === 'undefined') return
    if (value) {
      window.localStorage.setItem('adminAuthed', 'true')
    } else {
      window.localStorage.removeItem('adminAuthed')
    }
  } catch (error) {
    console.error('Failed to set admin authentication:', error)
  }
}

/**
 * Clear admin authentication
 */
export const clearAdminAuth = (): void => {
  setAdminAuthenticated(false)
}

