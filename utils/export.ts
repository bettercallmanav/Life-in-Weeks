import html2canvas from 'html2canvas'

export async function exportGridAsImage(
  gridElement: HTMLElement,
  filename: string = 'life-in-weeks.png'
): Promise<void> {
  try {
    const isLight = document.body.classList.contains('light')

    // Add temporary padding for export
    const originalPadding = gridElement.style.padding
    gridElement.style.padding = '40px'

    const canvas = await html2canvas(gridElement, {
      backgroundColor: isLight ? '#ffffff' : '#000000',
      scale: 2,
      useCORS: true,
      logging: false,
    })

    // Restore original padding
    gridElement.style.padding = originalPadding

    // Convert to PNG and download
    const dataUrl = canvas.toDataURL('image/png')
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
