import axios from "axios";
import { API_URL } from "@/api";
import { formatCurrency } from "@/utils";
import { ProductMedia } from "./product-media";
import { ProductDetails } from "./product-actions";
import { Metadata } from "next";

interface ProductPageProps {
  params: { slug: string };
}

export const generateMetadata = async ({ params }: { params: { slug: string } }): Promise<Metadata> => {
  try {
    const { slug } = await params;
    const response = await axios.get(`${API_URL}api/products?slug=${slug}`);
    const product = response.data;

    const productName = product.product_name || "Product";
    const brandName = product.brand?.name || "";

    const metaData = product.meta_data || {};
    const title = metaData.title || productName.slice(0, 60)
    const description = metaData.description || product.description
    const images = [product.cover_image, ...(product.images || [])]
      .filter(Boolean)
      .map(img => ({
        url: img,
        alt: `${productName} ${brandName ? `- ${brandName}` : ""}`,
      }));

    const keywords = metaData.keywords || productName
    const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/products/${slug}`;

    return {
      title: title.slice(0, 60),
      description: description.slice(0, 160),
      keywords,
      authors: [{ name: "Al Hameed Computers" }],
      openGraph: {
        title: title.slice(0, 60),
        description: description.slice(0, 160),
        images,
        type: "website",
        siteName: "Al Hameed Computers",
        url: canonicalUrl,
        locale: "en_PK",
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
        images: images.map(img => img.url),
        site: "@alhameedcomputers",
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      },
      alternates: {
        canonical: canonicalUrl,
      },
      other: {
        "price:currency": "PKR",
        "price:amount": product.price?.toString() || "0",
        "product:availability": "in stock",
        "product:condition": "new",
        "product:brand": brandName,
      },
    };
  } catch (error) {
    return {
      title: "Al Hameed Computers – Gaming PCs, Laptops & Accessories",
      description: "Al Hameed Computers is Karachi's trusted computer shop for gaming PCs, graphics cards, motherboards, and accessories—all at affordable and competitive prices.",
    };
  }
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const response = await axios.get(`${API_URL}api/products?slug=${slug}`);
  const product = response.data;

  // Prepare structured data for Google Rich Results
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.product_name,
    image: [product.cover_image, ...(product.images || [])].filter(Boolean),
    description: product.short_description?.replace(/<[^>]*>/g, "") || product.description?.replace(/<[^>]*>/g, ""),
    sku: product.sku || product.id,
    brand: product.brand?.name ? {
      "@type": "Brand",
      name: product.brand.name,
    } : undefined,
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${slug}`,
      priceCurrency: "PKR",
      price: product.price,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Al Hameed Computers",
      },
    },
    aggregateRating: product.rating ? {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.review_count || 1,
      bestRating: 5,
      worstRating: 1,
    } : undefined,
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: process.env.NEXT_PUBLIC_SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: `${process.env.NEXT_PUBLIC_SITE_URL}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.product_name,
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${slug}`,
      },
    ].filter(Boolean),
  };

  return (
    <>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />

      <div className="max-w-6xl mx-auto">
        <div className="px-2 md:px-4 py-4">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
            <div className="space-y-4">
              <ProductMedia 
              files={product.media}
              // images={product.images} 
              product={product} 
              />
            </div>

            <div className="space-y-6">
              {product.brand?.name && (
                <div className="mb-2">
                  <p className="text-sm text-gray-600">Brand: <span className="font-medium">{product.brand.name}</span></p>
                </div>
              )}

              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold mb-4">
                  {product.product_name}
                </h1>

                <div className="text-2xl font-bold text-green-600" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                  <meta itemProp="priceCurrency" content="PKR" />
                  <meta itemProp="price" content={product.price} />
                  <link itemProp="availability" href={product.in_stock !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"} />
                  {formatCurrency(product.price)}
                </div>
                {product.is_listing_item && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                    <p className="text-sm font-semibold text-yellow-800">
                      ⚠ Please confirm the price before placing your order.
                    </p>
                    <p className="text-sm text-yellow-700 mt-2">
                      Contact us: <a href="tel:02136642335" className="underline hover:text-yellow-900">(021) 36642335</a> | <a href="tel:+923029779392" className="underline hover:text-yellow-900">+92 302-9779392</a>
                    </p>
                  </div>
                )}
              </div>

              {product.short_description && (
                <div
                  dangerouslySetInnerHTML={{ __html: product.short_description }}
                  className="prose prose-sm max-w-none"
                />
              )}

              <ProductDetails product={product} />
            </div>
          </div>

          {product.description && (
            <div className="border-t pt-8 mt-8">
              <h2 className="text-xl md:text-2xl font-bold mb-6">Product Description</h2>
              <div
                dangerouslySetInnerHTML={{ __html: product.description }}
                className="prose max-w-none"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}