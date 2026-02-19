type LoginPageProps = {
  onSignIn: () => void
}

export function LoginPage({ onSignIn }: LoginPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Smart Bookmark App</h1>
        <button
          onClick={onSignIn}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  )
}
