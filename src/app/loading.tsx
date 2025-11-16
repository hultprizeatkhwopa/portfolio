export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-light">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-4"></div>
        <p className="text-xl text-gray-700 font-semibold">Loading...</p>
      </div>
    </div>
  )
}
