import SimpleGoogleMap from '@/components/debug/SimpleGoogleMap'

export default function DebugMapPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <SimpleGoogleMap />
      </div>
    </div>
  )
}