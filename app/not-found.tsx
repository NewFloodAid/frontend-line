import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Not Found</h2>
                <p className="text-gray-600 mb-6">Could not find requested resource</p>
                <Link
                    href="/"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
                >
                    Return Home
                </Link>
            </div>
        </div>
    )
}
