"use client";

import { deleteProduct } from "@/app/actions";
import React, { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import Image from "next/image";
import { Badge } from "./ui/badge";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Trash2,
  TrendingDown,
  TrendingDownIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import PriceChart from "./PriceChart";

const ProductCard = ({ product }) => {
  const [showChart, setShowChart] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Remove this product from tracking?")) {
      return;
    }

    setDeleting(true);
    const result = await deleteProduct(product.id);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.message || "Product deleted successfully!");
      setUrl("");
    }
    setDeleting(false);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex gap-4">
          {product.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <Image
              src={product.image_url}
              alt={product.name}
              width={80}
              height={80}
              className="rounded-md border object-cover"
              unoptimized
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
              {product.name}
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-orange-500">
                {product.currency} {product.current_price}
              </span>

              <Badge variant="secondary" className="gap-1">
                <TrendingDown className="w-3 h-3" />
                Tracking
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1 cursor-pointer"
            onClick={() => setShowChart(!showChart)}
          >
            {showChart ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Hide Chart
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Show Chart
              </>
            )}
          </Button>

          <Button
            className="gap-1 cursor-pointer"
            variant="outline"
            size="sm"
            asChild
          >
            <Link href={product.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
              View Product
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            disabled={deleting}
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-1 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Remove
          </Button>
        </div>
      </CardContent>
      {showChart && (
        <CardFooter className="pt-0">
          <PriceChart productId = {product.id} />
        </CardFooter>
      )}
    </Card>
  );
};

export default ProductCard;
