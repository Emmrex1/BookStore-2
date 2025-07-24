import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Upload, Image, Star, Plus, X } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const ProductForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("electronics");
  const [popular, setPopular] = useState(false);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef();

  const categories = [
    "Fiction",
    "Adventure",
    "Fantasy",
    "Non-fiction",
    "Mystery",
    "Health & Beauty",
    "Technology",
  ];

  const handleImageUpload = async (files) => {
    const uploadedUrls = [];
    setUploading(true);

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "bookstore_uploads");

      try {
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dwhx6woy3/image/upload",
          formData
        );
        uploadedUrls.push(res.data.secure_url);
        toast.success(`Uploaded: ${file.name}`);
      } catch (err) {
        console.error("Upload error:", err);
        toast.error(`Upload failed: ${file.name}`);
      }
    }

    setImages((prev) => [...prev, ...uploadedUrls]);
    setUploading(false);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      handleImageUpload(selectedFiles);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (idx) => {
    const updated = [...images];
    updated.splice(idx, 1);
    setImages(updated);
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setCategory("electronics");
    setPopular(false);
    setImages([]);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }

    if (!name || !price) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);

    try {
      const productData = {
        name,
        description,
        price: Number(price),
        category,
        popular,
        images,
      };

      await axios.post("http://localhost:4000/api/product/create", productData);
      toast.success("Product created successfully!");
      resetForm();
    } catch (error) {
      toast.error("Failed to create product.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <form onSubmit={onSubmitHandler}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Panel */}
          <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm w-full">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2 sm:gap-3">
                <Plus className="h-5 w-5 sm:h-6 sm:w-6" /> Add New Product
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 sm:p-8 space-y-5 sm:space-y-6">
              <div>
                <Label>Product Name *</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label>Category *</Label>
                  <Select value={category} onValueChange={(val) => setCategory(val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Price *</Label>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
                <div className="flex items-center space-x-2">
                  <Star className="text-yellow-500" />
                  <div>
                    <p className="font-medium">Mark as Popular</p>
                    <p className="text-xs text-gray-500">Highlighted products gain more visibility</p>
                  </div>
                </div>
                <Switch checked={popular} onCheckedChange={(checked) => setPopular(checked)} />
              </div>
            </CardContent>
          </Card>

          {/* Right Panel */}
          <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm w-full">
            <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2 sm:gap-3">
                <Image className="h-5 w-5 sm:h-6 sm:w-6" /> Product Images
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 sm:p-8 space-y-6">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <div
                onClick={handleFileSelect}
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 cursor-pointer group"
              >
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-blue-50">
                    <Upload className="h-8 w-8 text-gray-400 group-hover:text-blue-500" />
                  </div>
                  <p className="text-base sm:text-lg font-semibold text-gray-700">Upload Product Images</p>
                  <Button type="button" variant="outline" onClick={handleFileSelect}>Choose Files</Button>
                </div>
              </div>
              {images.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Images ({images.length})</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {images.map((url, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border"
                      >
                        <img
                          src={url}
                          alt={`preview-${idx}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-red-100"
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">📸 Photo Tips</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Use high-resolution images (at least 1000px)</li>
                  <li>• Show multiple angles of your product</li>
                  <li>• Ensure good lighting and clear backgrounds</li>
                  <li>• First image will be used as the main thumbnail</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-6 sm:mt-8">
          <Button
            type="submit"
            disabled={uploading || submitting}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 text-lg sm:text-xl"
          >
            {uploading ? "Uploading Images..." : submitting ? "Creating Product..." : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;