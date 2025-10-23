import { API_URL } from "@/api";
import { formatCurrency } from "@/utils";
import { ProductMedia } from "./product-media";
import { ProductDetails } from "./product-actions";
import axios from "axios";


interface MetadataProps {
  params: { id: string };
}

export const generateMetadata = async ({ params }: { params: { id: string } }) => {
  try {
    const response = await axios.get(API_URL + "api/products?id=" + params.id);
    const product = response.data;
    console.log(product)

    const productName = product.product_name || "Product";
    const brandName = product.brand?.name || "";
    const price = product.price;
    const images = [product.cover_image, ...(product.images || [])].filter(Boolean);
    const description = product.short_description?.replace(/<[^>]*>/g, "").slice(0, 160) ||
      product.description?.replace(/<[^>]*>/g, "").slice(0, 160) ||
      `Buy ${productName} at the best price`;
    return {
      title: `${productName} ${brandName ? `- ${brandName}` : ""} | Your Store Name`,
      description,
      keywords: [
        productName,
        brandName,
        product.category?.name,
        "buy online",
        "best price",
      ].filter(Boolean).join(", "),
      openGraph: {
        title: `${productName} ${brandName ? `- ${brandName}` : ""}`,
        description,
        images: images.map(img => ({ url: img })),
        type: "website",
        siteName: "Al Hameed Computers",
      },
      twitter: {
        card: "summary_large_image",
        title: `${productName} ${brandName ? `- ${brandName}` : ""}`,
        description,
        images: images,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${params.id}`,
      },
    };
  }

  catch (error) {
    return {
      title: "Al Hameed Computers – Gaming PCs, Laptops & Accessories",
      description:
        "Al Hameed Computers is Karachi&#039;s trusted computer shop for gaming PCs, graphics cards, motherboards, and accessories—all at affordable and competitive prices.",
    };

  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const response = await axios.get(API_URL + "api/products?id=" + params.id);
  const product = response.data

  return (
    <div className="max-w-6xl mx-auto">
      <div className="px-2 md:px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          <div className="space-y-4">
            <ProductMedia images={product.images} product={product} />
          </div>

          <div className="space-y-6">

            <div className="mb-2">
              <p className="text-sm">{product.brand?.name}</p>
            </div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-4">
                {product.product_name}
              </h1>
              <h2 className="">{formatCurrency(product.price)}</h2>
              {product.is_listing_item && (
                <h2 className="text-lg font-semibold text-yellow-500 mt-3">
                  Please confirm the price before placing your order.
                  Contact us: <a href="tel:02136642335" className="underline">(021) 36642335</a> | <a href="tel:+923029779392" className="underline">+92 302-9779392</a>
                </h2>
              )}
            </div>

            <div dangerouslySetInnerHTML={{ __html: product.short_description }} className="prose"></div>
            <ProductDetails product={product} />
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-4">Product Description</h4>
          <div dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>
      </div>
    </div>
  );
}



// // Prepare structured data for Google Rich Results
// const structuredData = {
//   "@context": "https://schema.org",
//   "@type": "Product",
//   name: product.product_name,
//   image: [product.cover_image, ...(product.images || [])].filter(Boolean),
//   description: product.short_description?.replace(/<[^>]*>/g, "") || product.description?.replace(/<[^>]*>/g, ""),
//   sku: product.sku || product.id,
//   brand: {
//     "@type": "Brand",
//     name: product.brand?.name || "Generic",
//   },
//   offers: {
//     "@type": "Offer",
//     url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${params.id}`,
//     priceCurrency: "USD", // Change to your currency
//     price: product.price,
//     priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days
//     availability: product.in_stock !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
//     itemCondition: "https://schema.org/NewCondition",
//   },
//   aggregateRating: product.rating ? {
//     "@type": "AggregateRating",
//     ratingValue: product.rating,
//     reviewCount: product.review_count || 1,
//   } : undefined,
// };

// const breadcrumbStructuredData = {
//   "@context": "https://schema.org",
//   "@type": "BreadcrumbList",
//   itemListElement: [
//     {
//       "@type": "ListItem",
//       position: 1,
//       name: "Home",
//       item: process.env.NEXT_PUBLIC_SITE_URL,
//     },
//     {
//       "@type": "ListItem",
//       position: 2,
//       name: "Products",
//       item: `${process.env.NEXT_PUBLIC_SITE_URL}/products`,
//     },
//     {
//       "@type": "ListItem",
//       position: 3,
//       name: product.product_name,
//       item: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${params.id}`,
//     },
//   ],
// };
{/* <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
</> */}