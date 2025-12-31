import { toPng } from 'html-to-image'

export async function exportGridAsImage(
  gridElement: HTMLElement,
  filename: string = 'life-in-weeks.png'
): Promise<void> {
  try {
    // Get current theme
    const isLight = document.body.classList.contains('light')

    // Create a wrapper with padding and background
    const wrapper = document.createElement('div')
    wrapper.style.padding = '40px'
    wrapper.style.background = isLight ? '#ffffff' : '#000000'
    wrapper.style.display = 'inline-block'

    // Clone the grid
    const clone = gridElement.cloneNode(true) as HTMLElement
    wrapper.appendChild(clone)

    // Temporarily add to DOM (off-screen)
    wrapper.style.position = 'fixed'
    wrapper.style.left = '-9999px'
    wrapper.style.top = '-9999px'
    document.body.appendChild(wrapper)

    // Generate image
    const dataUrl = await toPng(wrapper, {
      quality: 1,
      pixelRatio: 2,
      backgroundColor: isLight ? '#ffffff' : '#000000',
    })

    // Clean up
    document.body.removeChild(wrapper)

    // Download
    const link = document.createElement('a')
    link.download = filename
    link.href = dataUrl
    link.click()
  } catch (error) {
    console.error('Failed to export image:', error)
    throw error
  }
}

export function generateFilename(dob: Date): string {
  const age = Math.floor(
    (Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  )
  const date = new Date().toISOString().split('T')[0]
  return `life-in-weeks-age-${age}-${date}.png`
}
