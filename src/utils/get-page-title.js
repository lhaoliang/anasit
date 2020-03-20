import defaultSettings from '@/settings'

const title = defaultSettings.title || '风味后台'

export default function getPageTitle(key) {
  const hasKey = key
  if (hasKey) {
    const pageName = key
    return `${pageName} - ${title}`
  }
  return `${title}`
}
