import { RotateCcw, Shield, Truck } from "lucide-react";

const SideInfo = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
    <div className="flex items-center gap-3">
        <div className="p-2 bg-green-100 rounded-lg">
            <Truck className="h-5 w-5 text-green-600" />
        </div>
        <div>
            <p className="text-xs text-gray-500">We Deliver All Over Pakistan</p>
        </div>
    </div>

    <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
            <RotateCcw className="h-5 w-5 text-blue-600" />
        </div>
        <div>
            <p className="text-xs text-gray-500">15-Day Returns</p>
        </div>
    </div>

    <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-100 rounded-lg">
            <Shield className="h-5 w-5 text-purple-600" />
        </div>
        <div>
            <p className="text-xs text-gray-500">Warranty & Returns</p>
        </div>
    </div>
</div>
  )
}

export default SideInfo