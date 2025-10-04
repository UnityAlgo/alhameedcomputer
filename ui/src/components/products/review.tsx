"use client"
import { useParams } from "next/navigation";
import { MessageCircle, Star, ThumbsUp, UserRound } from 'lucide-react'
import { useProductReviews } from "@/api/product";

const Review = () => {
    const { id } = useParams();

    const { data: reviewsData, isLoading: reviewsLoading } =
        useProductReviews(id as string);

    const renderStars = (rating: number, size = "h-4 w-4") => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`${size} ${i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"
                    }`}
            />
        ));
    };

    const reviews = reviewsData || [];

    return (
        <div className="space-y-6">
            {reviewsLoading ? (
                <p className="text-gray-500">Loading reviews...</p>
            ) : reviews.length > 0 ? (
                reviews.map((review: any) => (
                    <div
                        key={review.id}
                        className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-sm transition-shadow duration-200"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                    <UserRound className="h-5 w-5 text-gray-500" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{review.customer_name}</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(review.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">{renderStars(review.rating)}</div>
                        </div>
                        <p className="text-gray-700 mb-3">{review.comment}</p>
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                                <ThumbsUp className="h-4 w-4" />
                                Helpful ({review.helpful || 0})
                            </button>
                            <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                                <MessageCircle className="h-4 w-4" />
                                Reply
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p className="flex items-center justify-center bg-white text-gray-500 h-50 w-full rounded-lg">
                    No reviews yet.
                </p>
            )}
        </div>
    )
}

export default Review