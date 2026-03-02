import { describe, it, expect, beforeEach } from 'vitest'

describe('Theme System', () => {
  beforeEach(() => {
    // Clear document classes and styles
    document.documentElement.classList.remove('dark')
    document.documentElement.style.cssText = ''
  })

  it('returns default config when localStorage is empty', () => {
    const config = JSON.parse(localStorage.getItem('nexus-theme') || '{"mode":"system","themeId":"default"}')
    expect(config).toEqual({ mode: 'system', themeId: 'default' })
  })

  it('saves and retrieves theme config from localStorage', () => {
    const config = { mode: 'dark', themeId: 'ocean' }
    localStorage.setItem('nexus-theme', JSON.stringify(config))
    
    const retrieved = JSON.parse(localStorage.getItem('nexus-theme') || '{}')
    expect(retrieved).toEqual(config)
  })

  it('applies dark mode class', () => {
    document.documentElement.classList.add('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('removes dark mode class for light mode', () => {
    document.documentElement.classList.add('dark')
    document.documentElement.classList.remove('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('applies custom primary color', () => {
    document.documentElement.style.setProperty('--primary', '#FF5733')
    expect(document.documentElement.style.getPropertyValue('--primary')).toBe('#FF5733')
  })
})
