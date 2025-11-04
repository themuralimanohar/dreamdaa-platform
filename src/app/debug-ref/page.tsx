'use client'

import { useCallback, useState } from 'react'

export default function DebugRefPage() {
  const [status, setStatus] = useState('Component mounting...')
  const [refStatus, setRefStatus] = useState('Ref not called yet')

  console.log('DebugRefPage rendering...')

  const testRef = useCallback((node: HTMLDivElement | null) => {
    console.log('Callback ref called with:', node)
    if (node) {
      setRefStatus(`Ref callback fired! Element: ${node.tagName}`)
      console.log('Node details:', {
        tagName: node.tagName,
        className: node.className,
        offsetHeight: node.offsetHeight,
        offsetWidth: node.offsetWidth
      })
    } else {
      setRefStatus('Ref callback fired with null')
    }
  }, [])

  const handleClick = () => {
    setStatus('Button clicked - component is interactive')
  }

  console.log('Component rendered, returning JSX...')

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">React Ref Debug Test</h1>
        
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Component Status:</h3>
          <div className="text-sm bg-blue-50 p-2 rounded">{status}</div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Ref Callback Status:</h3>
          <div className="text-sm bg-green-50 p-2 rounded">{refStatus}</div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Test Element:</h3>
          <div 
            ref={testRef}
            className="w-full h-32 bg-gray-200 border-2 border-dashed border-gray-400 rounded flex items-center justify-center"
          >
            This div should trigger the ref callback
          </div>
        </div>

        <button 
          onClick={handleClick}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Test Interactivity
        </button>

        <div className="text-xs text-gray-500">
          Check browser console for detailed logs
        </div>
      </div>
    </div>
  )
}