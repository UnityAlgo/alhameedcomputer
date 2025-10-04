"use client"
const Brand = () => {
    return (
        <div className="flex items-center gap-2">
            <img src="/logo.png" alt="UnityStore" className="h-8 w-8 sm:h-10 sm:w-10" />
            <div className="font-bold sm:text-xl">UnityStore</div>
        </div>

    )
}

export { Brand };