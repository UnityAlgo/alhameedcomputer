"use client";
import Link from "next/link";
import { List } from "lucide-react";
import { useCategories } from "@/api/category";

export const HeadLink = () => {
  const { data: categories = [], isLoading, isError } = useCategories();

  if (isLoading) {
    return (
      <header className="border-b border-accent">
        <div className="px-2 md:px-4 py-4 max-w-6xl mx-auto text-sm text-gray-500">
          Loading categories...
        </div>
      </header>
    );
  }

  if (isError || !categories.length) {
    return (
      <header className="border-b border-accent">
        <div className="px-2 md:px-4 py-4 max-w-6xl mx-auto text-sm text-gray-500">
          No categories available
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-accent">
      <div className="flex items-center gap-6 px-2 md:px-4 py-4 max-w-6xl mx-auto text-sm text-gray-700 overflow-x-scroll whitespace-nowrap hide-scrollbar">
        <Link
          href="/products/all"
          className="flex items-center gap-1 hover:text-gray-500 transition-colors"
        >
          <List className="w-4 h-4" strokeWidth={2} />
          <span>All Categories</span>
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products/${cat.name}`}
            className="flex items-center gap-1 hover:text-gray-500 transition-colors"
          >
            <span>{cat.name}</span>
          </Link>
        ))}
      </div>
    </header>

  );
};

// "use client";
// import Link from "next/link";
// import { List, X, ChevronRight } from "lucide-react";
// import { useCategories } from "@/api/category";
// import { useState, useEffect } from "react";

// export const HeadLink = () => {
//   const { data: categories = [], isLoading, isError } = useCategories();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   useEffect(() => {
//     if (isSidebarOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }
    
//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, [isSidebarOpen]);

//   const openSidebar = () => setIsSidebarOpen(true);
//   const closeSidebar = () => setIsSidebarOpen(false);

//   if (isLoading) {
//     return (
//       <header className="border-b border-accent">
//         <div className="px-2 md:px-4 py-4 max-w-6xl mx-auto text-sm text-gray-500">
//           Loading categories...
//         </div>
//       </header>
//     );
//   }

//   if (isError || !categories.length) {
//     return (
//       <header className="border-b border-accent">
//         <div className="px-2 md:px-4 py-4 max-w-6xl mx-auto text-sm text-gray-500">
//           No categories available
//         </div>
//       </header>
//     );
//   }

//   return (
//     <>
//       <header className="border-b border-accent bg-white relative z-40">
//         <div className="flex items-center gap-6 px-2 md:px-4 py-4 max-w-6xl mx-auto text-sm text-gray-700 overflow-x-scroll whitespace-nowrap hide-scrollbar">
//           <button
//             onClick={openSidebar}
//             className="flex items-center gap-2 hover:text-gray-500 transition-colors duration-200 font-medium bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg border border-gray-200"
//           >
//             <List className="w-4 h-4" />
//             <span>All Categories</span>
//           </button>
          
//           <div className="hidden md:flex items-center gap-6">
//             {categories.slice(0, 6).map((cat) => (
//               <Link
//                 key={cat.id}
//                 href={`/products/${cat.name}`}
//                 className="hover:text-gray-500 transition-colors duration-200"
//               >
//                 <span>{cat.name}</span>
//               </Link>
//             ))}
//             {categories.length > 6 && (
//               <span className="text-gray-400">+{categories.length - 6} more</span>
//             )}
//           </div>
//           {/* <Link href='#'>Gaming Products</Link>
//           <Link href='#'>Pre Build PC</Link>
//           <Link href='#'></Link>
//           <Link href='#'></Link>
//           <Link href='#'></Link> */}
//         </div>
//       </header>

//       <div
//         className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-50 ${
//           isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
//         }`}
//         onClick={closeSidebar}
//       />

//       <div
//         className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-out z-50 ${
//           isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
//         }`}
//       >
//         <div className="flex items-center justify-between p-6 border-b border-gray-200">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-blue-100 rounded-lg">
//               <List className="w-5 h-5 text-blue-600" strokeWidth={2} />
//             </div>
//             <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
//           </div>
//           <button
//             onClick={closeSidebar}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
//             aria-label="Close sidebar"
//           >
//             <X className="w-5 h-5 text-gray-500" strokeWidth={2} />
//           </button>
//         </div>

//         <div className="flex-1 overflow-y-auto">
//           <div className="p-6">
//             <Link
//               href="/products/all"
//               onClick={closeSidebar}
//               className="flex items-center justify-between p-4 mb-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl transition-all duration-200 group border border-blue-100"
//             >
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-blue-100 group-hover:bg-blue-200 rounded-lg transition-colors duration-200">
//                   <List className="w-4 h-4 text-blue-600" strokeWidth={2} />
//                 </div>
//                 <span className="font-medium text-gray-900">All Products</span>
//               </div>
//               <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors duration-200" strokeWidth={2} />
//             </Link>

//             <div className="space-y-1">
//               <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 px-2">
//                 Browse Categories
//               </h3>
//               {categories.map((cat, index) => (
//                 <Link
//                   key={cat.id}
//                   href={`/products/${cat.name}`}
//                   onClick={closeSidebar}
//                   className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 group"
//                   style={{ animationDelay: `${index * 20}ms` }}
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="w-2 h-2 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full group-hover:from-blue-400 group-hover:to-blue-500 transition-all duration-200"></div>
//                     <span className="text-gray-700 group-hover:text-gray-900 font-medium transition-colors duration-200">
//                       {cat.name}
//                     </span>
//                   </div>
//                   <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-all duration-200 transform group-hover:translate-x-1" strokeWidth={2} />
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="p-6 border-t border-gray-200 bg-gray-50">
//           <p className="text-xs text-gray-500 text-center">
//             {categories.length} Categories Available
//           </p>
//         </div>
//       </div>

//     </>
//   );
// };