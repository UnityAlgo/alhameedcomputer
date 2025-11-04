import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

const Page = () => {

    return (

        <>
            <Header />
            <div className="max-w-6xl mx-auto py-16">
                <div>
                    <div className="text-center text-3xl font-bold">
                        Privacy Policy
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Information We Collect</h2>
                        <p className="text-gray-700 mb-4">We collect the following types of information:</p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                            <li><strong>Personal Information:</strong> Name, email address, phone number, shipping and billing addresses</li>

                            <li><strong>Order Information:</strong> Purchase history, product preferences, order details</li>
                            <li><strong>Technical Information:</strong> IP address, browser type, device information, cookies</li>
                            <li><strong>Communications:</strong> Customer service interactions, reviews, and feedback</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">How We Use Your Information</h2>
                        <p className="text-gray-700 mb-4">Your information is used to:</p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                            <li>Process and fulfill your orders</li>
                            <li>Communicate about your orders and provide customer support</li>
                            <li>Send promotional offers and updates (with your consent)</li>
                            <li>Improve our website and services</li>
                            <li>Prevent fraud and enhance security</li>
                            <li>Comply with legal obligations</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Information Sharing</h2>
                        <p className="text-gray-700 mb-4">We do not sell your personal information. We may share your data with:</p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                            <li><strong>Service Providers:</strong> Shipping companies, payment processors, IT services</li>
                            <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
                            <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Data Security</h2>
                        <p className="text-gray-700 mb-4">We implement industry-standard security measures including:</p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                            <li>SSL encryption for data transmission</li>
                            <li>Secure payment gateways</li>
                            <li>Regular security audits</li>
                            <li>Access controls and authentication</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Your Rights</h2>
                        <p className="text-gray-700 mb-4">You have the right to:</p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                            <li>Access your personal data</li>
                            <li>Correct inaccurate information</li>
                            <li>Request deletion of your data</li>
                            <li>Opt-out of marketing communications</li>
                            <li>Object to data processing</li>
                            <li>Data portability</li>
                        </ul>
                        <p className="text-gray-700 mb-6">To exercise these rights, contact us at <a href="mailto:info@alhameedcomputers.com" className="text-blue-600 hover:underline">info@alhameedcomputers.com</a></p>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Cookies</h2>
                        <p className="text-gray-700 mb-4">We use cookies to enhance your browsing experience. You can control cookies through your browser settings. Types of cookies we use:</p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                            <li><strong>Essential Cookies:</strong> Required for website functionality</li>
                            <li><strong>Analytics Cookies:</strong> Help us understand website usage</li>
                        </ul>

                        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Contact Us</h2>
                        <div className="">
                            <p className="text-gray-700"><strong>Email:</strong> info@alhameedcomputers.com</p>
                            <p className="text-gray-700"><strong>Phone:</strong> +92-302 9779392</p>
                            <p className="text-gray-700"><strong>Address:</strong> Al Hameed Computers, Karachi, Pakistan</p>
                        </div>
                    </div>
                </div>


                <div>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Return Eligibility</h2>
                    <p className="text-gray-700 mb-4">Products can be returned within <strong>7 days</strong> of delivery if they meet the following conditions:</p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                        <li>Product is unused, undamaged, and in original packaging</li>
                        <li>All accessories, manuals, and warranty cards are included</li>
                        <li>Product seals and stickers are intact</li>
                        <li>Original invoice/receipt is provided</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Non-Returnable Items</h2>
                    <p className="text-gray-700 mb-4">The following items cannot be returned:</p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                        <li>Software products (opened or downloaded)</li>
                        <li>Gift cards and vouchers</li>
                        <li>Clearance/sale items marked "Final Sale"</li>
                        <li>Customized or special-order products</li>
                        <li>Products without original packaging or missing components</li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Return Process</h2>
                    <p className="text-gray-700 mb-4">To initiate a return:</p>
                    <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-6">
                        <li>Contact our customer service at <a href="mailto:info@alhameedcomputers.com" className="text-blue-600 hover:underline">info@alhameedcomputers.com</a> or call +92-302 9779392</li>
                        <li>Provide your order number and reason for return</li>
                        <li>Receive return authorization and shipping instructions</li>
                        <li>Pack the item securely with all original contents</li>
                        <li>Ship to our returns center (address will be provided)</li>
                        <li>We will inspect the item within 3-5 business days</li>
                    </ol>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Refund Methods</h2>
                    <p className="text-gray-700 mb-4">Once your return is approved, refunds will be processed as follows:</p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                        <li><strong>Original Payment Method:</strong> 7-10 business days</li>
                        <li><strong>Store Credit:</strong> Issued immediately upon approval</li>
                        <li><strong>Bank Transfer:</strong> 5-7 business days</li>
                    </ul>
                    <p className="text-gray-700 mb-6">Shipping charges are non-refundable unless the return is due to our error or a defective product.</p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Exchange Policy</h2>
                    <p className="text-gray-700 mb-4">We offer exchanges for:</p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                        <li>Defective products within 7 days</li>
                        <li>Wrong items delivered</li>
                        <li>Size/specification mismatches (where applicable)</li>
                    </ul>
                    <p className="text-gray-700 mb-6">Exchange requests follow the same process as returns. Subject to product availability.</p>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Damaged or Defective Items</h2>
                    <p className="text-gray-700 mb-4">If you receive a damaged or defective product:</p>
                    <ol className="list-decimal pl-6 text-gray-700 space-y-2 mb-6">
                        <li>Contact us within 48 hours of delivery</li>
                        <li>Provide photos/videos of the damage</li>
                        <li>Do not use or discard the packaging</li>
                        <li>We will arrange pickup and replacement/refund</li>
                    </ol>

                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Contact for Returns</h2>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700"><strong>Email:</strong> info@alhameedcomputers.com</p>
                        <p className="text-gray-700"><strong>Phone:</strong> +92-302 9779392</p>
                        <p className="text-gray-700"><strong>Hours:</strong> Monday - Saturday, 13:30 PM - 11:00 PM</p>
                    </div>
                </div>
            </div>
            
            <Footer />
        </>

    )
}

export default Page;