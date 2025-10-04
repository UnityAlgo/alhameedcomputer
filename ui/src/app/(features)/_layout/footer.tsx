// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import {
//     Mail,
//     Phone,
//     MapPin,
//     Facebook,
//     Twitter,
//     Instagram,
//     Youtube,
//     Linkedin,
//     ChevronUp,
//     Globe,
//     CreditCard,
//     Shield,
//     Truck,
//     HeadphonesIcon,
//     MailIcon,
//     PhoneIcon
// } from "lucide-react";
// import { contactEmail, contactPhone } from "@/app/global";

// export const Footer = () => {
//     const scrollToTop = () => {
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//     };

//     return (
//         <footer className="bg-gray-900 text-white">
//             <div className="bg-gray-800 hover:bg-gray-700 transition-colors">
//                 <div className="max-w-6xl mx-auto">
//                     <button
//                         onClick={scrollToTop}
//                         className="w-full py-4 flex items-center justify-center gap-2 text-sm font-medium hover:text-blue-400 transition-colors"
//                     >
//                         Back to top
//                         <ChevronUp className="h-4 w-4" />
//                     </button>
//                 </div>
//             </div>

//             <div className="max-w-6xl mx-auto px-2 md:px-4 py-4">
//                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
//                     <div className="col-span-1">
//                         <h3 className="text-white font-bold text-base mb-4">Get to Know Us</h3>
//                         <ul className="space-y-2">
//                             {[
//                                 'About Us',
//                                 'Careers',
//                                 'Press Releases',
//                                 'Our Blog',
//                                 'Investor Relations',
//                                 'Our Community'
//                             ].map((item) => (
//                                 <li key={item}>
//                                     <Link href="#" className="text-gray-300 text-sm hover:text-white hover:underline transition-colors">
//                                         {item}
//                                     </Link>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>

//                     <div className="col-span-1">
//                         <h3 className="text-white font-bold text-base mb-4">Make Money with Us</h3>
//                         <ul className="space-y-2">
//                             {[
//                                 'Sell Products',
//                                 'Become an Affiliate',
//                                 'Advertise Your Products',
//                                 'Self-Publish with Us',
//                                 'Host a Hub',
//                                 'See More Ways'
//                             ].map((item) => (
//                                 <li key={item}>
//                                     <Link href="#" className="text-gray-300 text-sm hover:text-white hover:underline transition-colors">
//                                         {item}
//                                     </Link>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>

//                     <div className="col-span-1">
//                         <h3 className="text-white font-bold text-base mb-4">Payment Products</h3>
//                         <ul className="space-y-2">
//                             {[
//                                 'Business Card',
//                                 'Shop with Points',
//                                 'Reload Your Balance',
//                                 'Currency Converter',
//                                 'Gift Cards',
//                                 'Payment Methods'
//                             ].map((item) => (
//                                 <li key={item}>
//                                     <Link href="#" className="text-gray-300 text-sm hover:text-white hover:underline transition-colors">
//                                         {item}
//                                     </Link>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>

//                     <div className="col-span-1">
//                         <h3 className="text-white font-bold text-base mb-4">Let Us Help You</h3>
//                         <ul className="space-y-2">
//                             {[
//                                 'Your Account',
//                                 'Your Orders',
//                                 'Shipping Rates',
//                                 'Returns & Replacements',
//                                 'Manage Your Content',
//                                 'Help Center'
//                             ].map((item) => (
//                                 <li key={item}>
//                                     <Link href="#" className="text-gray-300 text-sm hover:text-white hover:underline transition-colors">
//                                         {item}
//                                     </Link>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>

//                     <div className="col-span-1">
//                         <h3 className="text-white font-bold text-base mb-4">Shop by Category</h3>
//                         <ul className="space-y-2">
//                             {[
//                                 'Electronics',
//                                 'Fashion',
//                                 'Home & Garden',
//                                 'Sports & Outdoors',
//                                 'Books & Media',
//                                 'Health & Beauty'
//                             ].map((item) => (
//                                 <li key={item}>
//                                     <Link href="#" className="text-gray-300 text-sm hover:text-white hover:underline transition-colors">
//                                         {item}
//                                     </Link>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>

//                     <div className="col-span-1">
//                         <h3 className="text-white font-bold text-base mb-4">Customer Care</h3>
//                         <ul className="space-y-2">
//                             {[
//                                 'Contact Us',
//                                 'FAQ',
//                                 'Track Your Order',
//                                 'Return Policy',
//                                 'Size Guide',
//                                 'Live Chat'
//                             ].map((item) => (
//                                 <li key={item}>
//                                     <Link href="#" className="text-gray-300 text-sm hover:text-white hover:underline transition-colors">
//                                         {item}
//                                     </Link>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 </div>

//                 <div className="border-t border-gray-700 mb-8"></div>

//                 <div className="flex flex-col md:flex-row items-center justify-center md:justify-between mb-8">
//                     <div className="flex items-center gap-4 mb-4 md:mb-0">
//                         <Link href="/" className="flex items-center gap-3">
//                             <Image
//                                 src="/logo.png"
//                                 alt="UnityStore"
//                                 width={60}
//                                 height={60}
//                                 className="h-50 w-50"
//                             />
//                         </Link>
//                     </div>

//                     {/* <div className="flex items-center gap-2 md:gap-4">
//                         <button className="flex items-center gap-2 px-3 py-2 border border-gray-600 rounded hover:bg-gray-800 transition-colors">
//                             <Globe className="h-4 w-4" />
//                             <span className="text-sm">English</span>
//                         </button>
//                         <button className="flex items-center gap-2 px-3 py-2 border border-gray-600 rounded hover:bg-gray-800 transition-colors">
//                             <span className="text-sm">USD</span>
//                         </button>
//                         <button className="flex items-center gap-2 px-3 py-2 border border-gray-600 rounded hover:bg-gray-800 transition-colors">
//                             <MapPin className="h-4 w-4" />
//                             <span className="text-sm">Pakistan</span>
//                         </button>
//                     </div> */}
//                 </div>

//                 {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-t border-b border-gray-700">
//                     <div className="flex items-center gap-3">
//                         <Truck className="h-8 w-8 text-blue-400" />
//                         <div>
//                             <h4 className="font-semibold text-sm text-white">Free Shipping</h4>
//                             <p className="text-xs text-gray-400">On orders your first order</p>
//                         </div>
//                     </div>

//                     <div className="flex items-center gap-3">
//                         <Shield className="h-8 w-8 text-green-400" />
//                         <div>
//                             <h4 className="font-semibold text-sm text-white">Secure Payment</h4>
//                             <p className="text-xs text-gray-400">100% secure payment</p>
//                         </div>
//                     </div>

//                     <div className="flex items-center gap-3">
//                         <HeadphonesIcon className="h-8 w-8 text-yellow-400" />
//                         <div>
//                             <h4 className="font-semibold text-sm text-white">24/7 Support</h4>
//                             <p className="text-xs text-gray-400">Dedicated support</p>
//                         </div>
//                     </div>

//                     <div className="flex items-center gap-3">
//                         <CreditCard className="h-8 w-8 text-purple-400" />
//                         <div>
//                             <h4 className="font-semibold text-sm text-white">Money Back</h4>
//                             <p className="text-xs text-gray-400">30-day guarantee</p>
//                         </div>
//                     </div>
//                 </div> */}

//                 <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 my-4">
//                     <div>
//                         <h4 className="text-white font-semibold mb-3">Connect with Us</h4>
//                         <div className="flex gap-4">
//                             {[
//                                 { icon: Facebook, label: 'Facebook' },
//                                 { icon: Twitter, label: 'Twitter' },
//                                 { icon: Instagram, label: 'Instagram' },
//                                 { icon: Youtube, label: 'Youtube' },
//                                 { icon: Linkedin, label: 'LinkedIn' }
//                             ].map(({ icon: Icon, label }) => (
//                                 <Link
//                                     key={label}
//                                     href="#"
//                                     className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
//                                     aria-label={label}
//                                 >
//                                     <Icon className="h-5 w-5 text-gray-300 hover:text-white" />
//                                 </Link>
//                             ))}
//                         </div>
//                     </div>

//                     <div className="text-left md:text-left ">
//                         <h4 className="text-white font-semibold mb-3">Contact Info</h4>
//                         <div className="space-y-2">
//                             <div className="flex items-center gap-3 group">
//                                 <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors duration-200">
//                                     <MailIcon className="size-4 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
//                                 </div>
//                                 <div className="text-sm">
//                                     <p
//                                         className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
//                                     >
//                                         {contactEmail}
//                                     </p>
//                                 </div>
//                             </div>

//                             <div className="flex items-center gap-3 group">
//                                 <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors duration-200">
//                                     <PhoneIcon className="size-4 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
//                                 </div>
//                                 <div className="text-sm">
//                                     <p
//                                         className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
//                                     >
//                                         {contactPhone}
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* <div className="mb-8">
//                     <h4 className="text-white font-semibold mb-3">We Accept</h4>
//                     <div className="flex gap-2 flex-wrap">
//                         {['Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'Google Pay', 'Stripe'].map((payment) => (
//                             <div
//                                 key={payment}
//                                 className="px-3 py-2 bg-gray-800 rounded text-xs text-gray-300 border border-gray-700"
//                             >
//                                 {payment}
//                             </div>
//                         ))}
//                     </div>
//                 </div> */}

//                 <div className="border-t border-gray-700 pt-6">
//                     <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
//                         <div className="flex flex-wrap justify-center md:justify-start gap-4">
//                             <Link href="#" className="hover:text-white transition-colors">Conditions of Use</Link>
//                             <Link href="#" className="hover:text-white transition-colors">Privacy Notice</Link>
//                             <Link href="#" className="hover:text-white transition-colors">Your Ads Privacy Choices</Link>
//                             <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
//                             <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
//                         </div>

//                         <p className="text-center md:text-right">
//                             © {new Date().getFullYear()} UnityStore, All rights reserved.
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </footer>
//     );
// };


"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, ChevronUp, Facebook, Twitter, Instagram, Youtube} from "lucide-react";
import { contactEmail, contactPhone } from "@/app/global";

export const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    return (
        <footer className="bg-gray-900 text-white">
            <div className="bg-gray-800 hover:bg-gray-700 transition-colors">
                <div className="max-w-6xl mx-auto">
                    <button
                        onClick={scrollToTop}
                        className="w-full py-4 flex items-center justify-center gap-2 text-sm font-medium hover:text-blue-400 transition-colors  cursor-pointer"
                    >
                        Back to top
                        <ChevronUp className="h-4 w-4" />
                    </button>
                </div>
            </div>
            <div className="max-w-6xl mx-auto p-4 sm:p-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="col-span-2 sm:col-span-1 space-y-2">
                        <Link href="/" className="flex items-center justify-center sm:justify-start gap-3 mb-4">
                            <Image
                                src="/logo2.png"
                                alt="Al Hameed Computers"
                                // width={50}  
                                // height={80}  
                                width={140}  
                                height={140}  
                                className="object-contain"
                            />
                        </Link>
                        <p className="text-blue-100 text-sm leading-relaxed text-center sm:text-left">
                            Offers all kinds of Gaming accessories and Gaming components in Karachi. Find gaming keyboards, mice, headsets, graphic cards, casings, and more at the best prices.
                        </p>
                    </div>

                    <div className="col-span-1">
                        <h3 className="font-bold text-lg text-white mb-4">PRODUCTS</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/products/pre-build-gaming-pc" className="text-blue-100 text-sm hover:text-white transition-colors">
                                    Gaming PC
                                </Link>
                            </li>
                            <li>
                                <Link href="/products/graphic-card" className="text-blue-100 text-sm hover:text-white transition-colors">
                                    Graphic Cards
                                </Link>
                            </li>
                            <li>
                                <Link href="/products/processor" className="text-blue-100 text-sm hover:text-white transition-colors">
                                    Processors
                                </Link>
                            </li>
                            <li>
                                <Link href="/products/gaming-monitor" className="text-blue-100 text-sm hover:text-white transition-colors">
                                    Gaming Monitor
                                </Link>
                            </li>
                            <li>
                                <Link href="/products/gaming-headphones" className="text-blue-100 text-sm hover:text-white transition-colors">
                                    Gaming Headphones
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="col-span-1">
                        <h3 className="font-bold text-lg text-white mb-4">ACCOUNT</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/login" className="text-blue-100 text-sm hover:text-white transition-colors">
                                    Sign Up
                                </Link>
                            </li>
                            <li>
                                <Link href="/profile" className="text-blue-100 text-sm hover:text-white transition-colors">
                                    My Account
                                </Link>
                            </li>
                            <li>
                                <Link href="/cart" className="text-blue-100 text-sm hover:text-white transition-colors">
                                    Shopping Cart
                                </Link>
                            </li>
                            <li>
                                <Link href="/orders" className="text-blue-100 text-sm hover:text-white transition-colors">
                                    Order History
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col justify-between gap-12 sm:gap-4 col-span-2 sm:col-span-1">
                        <div className="">
                            <h3 className="font-bold text-lg text-white mb-4 text-center sm:text-start">CONTACT</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-blue-100 text-sm">
                                        Shop No 36, Bhayani Shopping Center, Block M, North Nazimabad, Karachi. 74600
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                                    <a
                                        href={`tel:${contactPhone}`}
                                        className="text-blue-100 text-sm hover:text-white transition-colors"
                                    >
                                        {contactPhone}
                                    </a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                                    <a
                                        href={`mailto:${contactEmail}`}
                                        className="text-blue-100 text-sm hover:text-white transition-colors"
                                    >
                                        {contactEmail}
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center sm:items-start">
                            <h4 className="text-white font-semibold mb-4">Connect with Us</h4>
                            <div className="flex gap-4">
                                {[
                                    { icon: Facebook, label: 'Facebook', url: 'https://www.facebook.com/Al.Hameed.Computers' },
                                    { icon: Instagram, label: 'Instagram', url: 'https://www.instagram.com/alhameedcomputersgamingshop?igsh=MTc2bzlrMWd3dmRxMQ==' },
                                    { icon: Youtube, label: 'Youtube', url: 'https://www.youtube.com/@alhameedcomputers' },
                                    { icon: Twitter, label: 'Twitter', url: '#' },
                                ].map(({ icon: Icon, label, url }) => (
                                    <Link
                                        key={label}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                                        aria-label={label}
                                    >
                                        <Icon className="h-5 w-5 text-gray-300 hover:text-white" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-blue-100 text-sm text-center">
                            Copyright © 2019 AlhameedComputers. All rights reserved.
                        </div>

                        {/* <div className="flex items-center gap-2">
                            <div className="bg-white rounded px-2 py-1">
                                <span className="text-xs font-semibold text-gray-700">VISA</span>
                            </div>
                            <div className="bg-white rounded px-2 py-1">
                                <span className="text-xs font-semibold text-gray-700">MC</span>
                            </div>
                            <div className="bg-white rounded px-2 py-1">
                                <span className="text-xs font-semibold text-blue-600">PayPal</span>
                            </div>
                            <div className="bg-white rounded px-2 py-1">
                                <span className="text-xs font-semibold text-gray-700">AMEX</span>
                            </div>
                        </div> */}

                        <div className="text-blue-100 text-xs">
                            Powered by UnityAlgo ®
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};