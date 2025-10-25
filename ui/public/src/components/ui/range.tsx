"use client"

import React, { useState } from 'react';
import * as Slider from '@radix-ui/react-slider';

interface MinMaxRange {
    min: number;
    max: number;
}

interface RangeSelectorProps {
    min?: number;
    max?: number;
    step?: number;
    defaultValue?: MinMaxRange;
    value?: MinMaxRange;
    onValueChange?: (range: MinMaxRange) => void;
    label?: string;
    showValues?: boolean;
    disabled?: boolean;
    className?: string;
    formatValue?: (value: number) => string;
    'aria-label'?: string;
}

// Custom Min/Max Range Selector Component
const RangeSelector: React.FC<RangeSelectorProps> = ({
    min = 0,
    max = 100,
    step = 1,
    defaultValue = { min: 20, max: 80 },
    value,
    onValueChange,
    label = "Range",
    showValues = true,
    disabled = false,
    className = "",
    formatValue = (val: number) => val.toString(),
    'aria-label': ariaLabel
}) => {
    const [internalRange, setInternalRange] = useState<MinMaxRange>(defaultValue);

    const currentRange: MinMaxRange = value || internalRange;

    // Convert MinMaxRange to array format for Radix Slider
    const sliderValue = [currentRange.min, currentRange.max];

    const handleValueChange = (newValue: number[]): void => {
        const newRange: MinMaxRange = {
            min: newValue[0],
            max: newValue[1]
        };

        if (onValueChange) {
            onValueChange(newRange);
        } else {
            setInternalRange(newRange);
        }
    };

    const getRangeSpan = (): number => {
        return currentRange.max - currentRange.min;
    };

    const getRangePercentage = (): number => {
        const totalRange = max - min;
        const selectedRange = getRangeSpan();
        return Math.round((selectedRange / totalRange) * 100);
    };

    return (
        <div className={`w-full space-y-4 ${className}`}>
            {/* Header with label and range info */}
            {/* <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </label>
                {showValues && (
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">
                            {formatValue(currentRange.min)}
                        </span>
                        <span>to</span>
                        <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">
                            {formatValue(currentRange.max)}
                        </span>
                    </div>
                )}
            </div> */}

            {/* Slider Component */}
            <div className="relative">
                <Slider.Root
                    className={`relative flex items-center select-none touch-none w-full h-6 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                    value={sliderValue}
                    onValueChange={handleValueChange}
                    max={max}
                    min={min}
                    step={step}
                    disabled={disabled}
                    aria-label={ariaLabel || `${label} range selector`}
                >

                    <Slider.Track className="bg-gray-200  relative grow rounded-full h-2">
                        <Slider.Range className="absolute bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-full h-full shadow-sm" />
                    </Slider.Track>

                    
                    <Slider.Thumb
                        className="block w-6 h-6 bg-white  border-2 border-blue-500 dark:border-blue-400 rounded-full shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200 hover:scale-110 disabled:hover:scale-100 relative"
                        aria-label={`${label} minimum value`}
                    >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white dark:text-gray-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {formatValue(currentRange.min)}
                        </div>
                    </Slider.Thumb>

                    
                    <Slider.Thumb
                        className="block w-6 h-6 bg-white  border-2 border-blue-500 dark:border-blue-400 rounded-full shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200 hover:scale-110 disabled:hover:scale-100 relative"
                        aria-label={`${label} maximum value`}
                    >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900  text-gray-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {formatValue(currentRange.max)}
                        </div>
                    </Slider.Thumb>
                </Slider.Root>


                <div className="flex justify-between mt-2 text-xs text-gray-400 dark:text-gray-500">
                    <span>{formatValue(min)}</span>
                    <span>{formatValue(max)}</span>
                </div>
            </div>

            {/* Range Statistics */}
            {/* {showValues && (
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg">
                    <div>
                        <span className="font-medium">Range Span:</span> {formatValue(getRangeSpan())}
                    </div>
                    <div>
                        <span className="font-medium">Coverage:</span> {getRangePercentage()}%
                    </div>
                </div>
            )} */}
        </div>
    );
};


export { RangeSelector };

// Demo Component
// const RangeDemo = () => {
//     const [singleValue, setSingleValue] = useState([25]);
//     const [dualValue, setDualValue] = useState([20, 80]);
//     const [volumeValue, setVolumeValue] = useState([75]);

//     return (
//         <div className="max-w-2xl mx-auto p-8 space-y-8 bg-white dark:bg-gray-900 min-h-screen">
//             <div className="text-center space-y-2">
//                 <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//                     Custom Range Slider
//                 </h1>
//                 <p className="text-gray-600 dark:text-gray-400">
//                     Built with Radix UI, React, and Tailwind CSS
//                 </p>
//             </div>

//             <div className="space-y-8">
//                 {/* Single Value Slider */}
//                 <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
//                     <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
//                         Single Value Slider
//                     </h2>
//                     <RangeSlider
//                         label="Progress"
//                         min={0}
//                         max={100}
//                         step={1}
//                         value={singleValue}
//                         onValueChange={setSingleValue}
//                         showValue={true}
//                     />
//                 </div>

//                 {/* Dual Range Slider */}
//                 <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
//                     <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
//                         Dual Range Slider
//                     </h2>
//                     <RangeSlider
//                         label="Price Range"
//                         min={0}
//                         max={1000}
//                         step={10}
//                         value={dualValue}
//                         onValueChange={setDualValue}
//                         showValue={true}
//                         dual={true}
//                         defaultValue={[20, 80]}
//                     />
//                 </div>

//                 {/* Volume Slider */}
//                 <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
//                     <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
//                         Volume Control
//                     </h2>
//                     <RangeSlider
//                         label="Volume"
//                         min={0}
//                         max={100}
//                         step={5}
//                         value={volumeValue}
//                         onValueChange={setVolumeValue}
//                         showValue={true}
//                     />
//                 </div>

//                 {/* Disabled Slider */}
//                 <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
//                     <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
//                         Disabled Slider
//                     </h2>
//                     <RangeSlider
//                         label="Disabled"
//                         min={0}
//                         max={100}
//                         defaultValue={[40]}
//                         disabled={true}
//                         showValue={true}
//                     />
//                 </div>

//                 {/* Custom Step Slider */}
//                 <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
//                     <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
//                         Custom Step (0.1)
//                     </h2>
//                     <RangeSlider
//                         label="Precision"
//                         min={0}
//                         max={10}
//                         step={0.1}
//                         defaultValue={[5.5]}
//                         showValue={true}
//                     />
//                 </div>
//             </div>

//             {/* Current Values Display */}
//             <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
//                 <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
//                     Current Values
//                 </h3>
//                 <div className="space-y-2 text-sm">
//                     <div className="text-gray-700 dark:text-gray-300">
//                         Single Value: <span className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{singleValue[0]}</span>
//                     </div>
//                     <div className="text-gray-700 dark:text-gray-300">
//                         Dual Range: <span className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{dualValue[0]} - {dualValue[1]}</span>
//                     </div>
//                     <div className="text-gray-700 dark:text-gray-300">
//                         Volume: <span className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{volumeValue[0]}%</span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default RangeDemo;