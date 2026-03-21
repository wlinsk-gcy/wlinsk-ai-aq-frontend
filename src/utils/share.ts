const DEFAULT_SHARE_PATH = '/app/details/'

export function buildAppShareUrl(appId: string) {
  const configuredSharePath = import.meta.env.VITE_SHARE_APP_PATH || DEFAULT_SHARE_PATH
  const normalizedSharePath = configuredSharePath.endsWith('/')
    ? configuredSharePath
    : `${configuredSharePath}/`

  return new URL(`${normalizedSharePath}${appId}`, window.location.origin).toString()
}

export async function copyText(text: string) {
  if (window.isSecureContext && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.setAttribute('readonly', 'true')
  textArea.style.position = 'fixed'
  textArea.style.opacity = '0'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  const copied = document.execCommand('copy')
  document.body.removeChild(textArea)

  if (!copied) {
    throw new Error('copy failed')
  }
}
