// Updated VendorPortfolio component with fixes for image loading issues
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, Upload, X, Check, AlertCircle } from "lucide-react";
import supabase from "@/config/supabase";
import { vendorService } from "@/services/api";
import { toast } from "sonner";

function VendorPortfolio() {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Get vendor data from localStorage
  const [vendorId, setVendorId] = useState("");
  const [vendorName, setVendorName] = useState("");

  // Load vendor data from localStorage on component mount
  useEffect(() => {
    try {
      const currentUserStr = localStorage.getItem("currentUser");
      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        setVendorId(currentUser.id);
        setVendorName(currentUser.name || "Vendor");
        console.log("Loaded vendor ID from localStorage:", currentUser.id);
      } else {
        console.error("No vendor found in localStorage");
        toast({
          title: "Error",
          description: "Unable to identify vendor. Please log in again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error parsing vendor data from localStorage:", error);
      toast({
        title: "Error",
        description: "Unable to load vendor information. Please log in again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // Limit to 3 images
    if (selectedImages.length + files.length > 3) {
      toast("Maximum 3 images allowed", {
        description: "Please remove some images before adding more.",
      });
      return;
    }

    // Preview the images
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: (file.size / 1024).toFixed(2) + "KB",
    }));

    setSelectedImages([...selectedImages, ...newImages]);
  };

  const removeImage = (index) => {
    const updatedImages = [...selectedImages];

    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(updatedImages[index].preview);

    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
  };

  const removeAllImages = () => {
    // Revoke all object URLs to prevent memory leaks
    selectedImages.forEach((image) => {
      URL.revokeObjectURL(image.preview);
    });

    setSelectedImages([]);
  };

  // Check if a URL is accessible (returns an image)
  const checkImageUrl = async (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  const uploadToSupabase = async () => {
    if (selectedImages.length === 0) return;

    setIsUploading(true);
    setErrorMessage(null);
    const urls = [];

    try {
      for (const image of selectedImages) {
        // Create a readable name from the original filename
        // Remove special characters and spaces that might cause issues
        const safeFileName = image.file.name.replace(/[^a-zA-Z0-9.-]/g, "_");

        // Just store in the vendor's folder with a timestamp to prevent collisions
        const timestamp = new Date().getTime();
        const filePath = `vendors/${vendorId}/${timestamp}_${safeFileName}`;

        // Get file content type
        const contentType = image.file.type || "image/jpeg";
        console.log(
          `Uploading file ${safeFileName} with content type: ${contentType}`
        );

        // Upload to Supabase bucket with content type and caching options
        const { data, error } = await supabase.storage
          .from("images")
          .upload(filePath, image.file, {
            contentType: contentType,
            cacheControl: "3600",
            upsert: true,
          });

        if (error) throw error;

        // Get the public URL from the bucket
        const { data: publicUrlData } = supabase.storage
          .from("images")
          .getPublicUrl(filePath);

        // Add the URL to our array
        urls.push(publicUrlData.publicUrl);

        // Verify the URL is accessible
        const isImageAccessible = await checkImageUrl(publicUrlData.publicUrl);
        if (!isImageAccessible) {
          console.warn(
            "Image uploaded but might not be publicly accessible:",
            publicUrlData.publicUrl
          );
        }
      }

      // Set the uploaded URLs in state
      setUploadedUrls(urls);
      setUploadComplete(true);

      // Clear the selected images
      setSelectedImages([]);

      // Log the uploaded URLs for reference
      console.log("Uploaded images for vendor", vendorId, ":", urls);

      toast("Images uploaded successfully", {
        description: "Your portfolio images have been uploaded to Supabase.",
      });
    } catch (error) {
      console.error("Error uploading images:", error);
      setErrorMessage(error.message || "Failed to upload images");
      toast("Error uploading images", {
        description: error.message || "Failed to upload images.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Function to test bucket permissions
  const testBucketPermissions = async () => {
    try {
      // Check if we can list files in the bucket
      const { data, error } = await supabase.storage.from("images").list();

      if (error) {
        console.error("Error accessing bucket:", error);
        setErrorMessage(`Bucket access error: ${error.message}`);
        return;
      }

      console.log("Bucket access successful:", data);
      setErrorMessage(null);

      toast("Bucket access test successful", {
        description: "Your Supabase storage bucket is accessible.",
      });
    } catch (error) {
      console.error("Error testing bucket:", error);
      setErrorMessage(`Bucket test error: ${error.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Portfolio Images</h1>
        <Button variant="outline" size="sm" onClick={testBucketPermissions}>
          Test Bucket Access
        </Button>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700">{errorMessage}</p>
              <p className="text-sm text-red-700 mt-2">
                <strong>Possible fixes:</strong> Ensure your Supabase RLS
                policies are correctly set up. Your bucket should have a policy
                allowing public read access, and authenticated users should have
                upload permissions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Container */}
      <div
        className={`border border-dashed rounded-lg p-8 ${
          isDragging ? "bg-primary/10 border-primary" : "bg-muted/50"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);

          const files = Array.from(e.dataTransfer.files);
          if (files.length > 0) {
            // Handle the dropped files
            const imageFiles = files.filter((file) =>
              file.type.startsWith("image/")
            );
            if (imageFiles.length > 0) {
              handleFileChange({ target: { files: imageFiles } });
            }
          }
        }}
      >
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <ImageIcon className="h-16 w-16 text-muted-foreground mb-2" />
          <h2 className="text-xl font-medium">Upload files</h2>
          <p className="text-sm text-muted-foreground mb-2">
            Drag & drop or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            All files • Max 3 files • Up to 10MB each
          </p>

          <Input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            id="image-upload"
            onChange={handleFileChange}
            disabled={selectedImages.length >= 3 || isUploading}
          />
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            disabled={selectedImages.length >= 3 || isUploading}
            onClick={() => document.getElementById("image-upload").click()}
          >
            Select Files
          </Button>
        </div>
      </div>

      {/* Selected Files */}
      {selectedImages.length > 0 && (
        <div className="mt-6">
          {selectedImages.map((image, index) => (
            <div
              key={index}
              className="flex items-center border rounded-md p-3 mb-3"
            >
              <div className="h-12 w-12 mr-3 flex-shrink-0 bg-muted rounded overflow-hidden">
                <img
                  src={image.preview}
                  alt={`Upload preview ${index}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{image.name}</p>
                <p className="text-xs text-muted-foreground">{image.size}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="ml-2"
                onClick={() => removeImage(index)}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={removeAllImages}
              disabled={isUploading}
            >
              Remove all files
            </Button>
            <Button
              onClick={uploadToSupabase}
              disabled={isUploading}
              className="flex-1"
            >
              {isUploading ? (
                <span className="flex items-center justify-center w-full">
                  <span className="animate-spin mr-2">⏳</span>
                  Uploading...
                </span>
              ) : (
                <span className="flex items-center justify-center w-full">
                  <Upload className="h-4 w-4 mr-2" /> Upload to Supabase
                </span>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Uploaded Images */}
      {uploadComplete && uploadedUrls.length > 0 && (
        <div className="mt-8 border-t pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Check className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-medium">Upload Complete</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {uploadedUrls.map((url, index) => (
              <div key={index} className="border rounded-md overflow-hidden">
                <img
                  src={url}
                  alt={`Uploaded image ${index}`}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    console.error(`Failed to load image ${index}:`, url);
                    e.target.src =
                      "https://placehold.co/600x400?text=Image+Not+Found";
                  }}
                />
                <div className="p-2 bg-muted/50">
                  <p className="text-xs font-medium">
                    Image {index + 1} for {vendorName}
                  </p>
                  <p className="text-xs text-muted-foreground overflow-hidden text-ellipsis">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      View image URL
                    </a>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* View on Vendor Listing Button */}
          <div className="mt-6">
            <Button
              onClick={() => {
                window.location.href = "/dashboard/vendor/profile";
              }}
              className="w-full"
            >
              <span>View on Vendor Listing Page</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VendorPortfolio;
