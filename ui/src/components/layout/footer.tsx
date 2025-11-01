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
                                src="/logo-light.png"
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

                        <Link href={"https://unityalgo.com/"} className="text-blue-100 text-xs" target="_blank">
                            Powered by UnityAlgo ®
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};