const KEY = 'doodlespace:state:v1'

export const StorageService = {
  saveLocal(json) {
    localStorage.setItem(KEY, JSON.stringify(json))
  },
  loadLocal() {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  },
  exportJSON(json) {
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'doodlespace-board.json'
    a.click()
    URL.revokeObjectURL(url)
  },
  importJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result)
          resolve(parsed)
        } catch (e) {
          reject(e)
        }
      }
      reader.onerror = reject
      reader.readAsText(file)
    })
  }
}
