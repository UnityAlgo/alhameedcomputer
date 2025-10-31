import Link from "next/link";

const Page = () => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 py-12 text-center">
            <h1 className="text-9xl font-extrabold">404</h1>
            <h2 className="mt-4 text-3xl font-semibold text-gray-800">Page Not Found</h2>
            <p className="mt-2 text-gray-500">
                Sorry, we couldn’t find the page you’re looking for.
            </p>
            <div className="mt-6">
                <Link
                    href="/"
                    className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
                >
                    Go Home
                </Link>
            </div>
        </div>
    )
}

export default Page;