"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomProgres } from "./custom-progres";
import { FilePreview } from "./file-preview";

type FileStatus = {
  file: File;
  progress: number;
  status: "uploading" | "complete" | "error";
  error?: string;
};

export function FileUploadForm() {
  const [filesStatus, setFilesStatus] = useState<FileStatus[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      processFile(files[0]);
    }
  };

  function uploadFile(file: File, presignedUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", presignedUrl, true);
      xhr.setRequestHeader("Content-Type", file.type);

      let fileStatus: FileStatus = {
        file: file,
        progress: 0,
        status: "uploading",
      };
      setIsUploading(true);
      setFilesStatus([fileStatus]);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = (event.loaded / event.total) * 100;
          console.log(`Uploaded ${percent.toFixed(2)}%`);

          let fileStatus: FileStatus = {
            file: file,
            progress: parseInt(percent.toFixed(0)),
            status: "uploading",
          };
          setFilesStatus([fileStatus]);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          const errorMsg = `Upload failed with status ${xhr.status}`;
          let fileStatus: FileStatus = {
            file: file,
            progress: 0,
            status: "error",
            error: errorMsg,
          };
          setFilesStatus([fileStatus]);
          reject(new Error(errorMsg));
        }
      };

      xhr.onerror = () => {
        const errorMsg = `Upload failed due to network error`;
        let fileStatus: FileStatus = {
          file: file,
          progress: 0,
          status: "error",
          error: errorMsg,
        };
        setFilesStatus([fileStatus]);
        reject(new Error(errorMsg));
      };

      xhr.send(file);
    });
  }

  const processFile = async (selectedFile: File) => {
    if (
      selectedFile.type.startsWith("audio/") ||
      selectedFile.type.startsWith("video/")
    ) {
      const fileType = selectedFile.type;
      const fileExtension = selectedFile.name.split(".").pop();
      console.log("Type:", fileType, "Extension:", fileExtension);

      const response = await fetch(
        "http://localhost:3000/api/test/preseignedPut",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uploadType: fileType,
            fileExtension: fileExtension,
          }),
        }
      );

      const { fileKey, uploadUrl } = await response.json();
      console.log(fileKey, uploadUrl);

      const uplResp = await uploadFile(selectedFile, uploadUrl);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      processFile(files[0]);
    }
  };

  //   const removeFile = (index: number) => {
  //     setFiles((prev) => prev.filter((_, i) => i !== index));
  //   };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return !isUploading ? (
    <div
      className={`border border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
        isDragging
          ? "border-primary bg-primary/5"
          : "border-gray-300 hover:border-gray-400"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={triggerFileInput}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="audio/*,video/*"
      />
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-3 bg-primary/10 rounded-full">
          <Upload className="h-8 w-8 text-primary" />
        </div>
        <div>
          <p className="text-lg font-medium">
            Drag and drop your audio or video files here
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Only audio and video files are accepted
          </p>
        </div>
      </div>
    </div>
  ) : (
    filesStatus.length > 0 && (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Uploaded Files</h2>
        <div className="space-y-3">
          {filesStatus.map((fileStatus, index) => (
            <div key={index} className="border rounded-md p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <FilePreview file={fileStatus.file} />
                  <div>
                    <p className="font-medium truncate max-w-[200px] sm:max-w-[300px]">
                      {fileStatus.file.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {(fileStatus.file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {fileStatus.status === "complete" && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {fileStatus.status === "error" && (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  {/* <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button> */}
                </div>
              </div>
              <CustomProgres value={fileStatus.progress} className="h-2" />
              {fileStatus.status === "uploading" && (
                <p className="text-xs text-muted-foreground mt-1">
                  Uploading: {fileStatus.progress}%
                </p>
              )}
              {fileStatus.status === "error" && (
                <p className="text-xs text-red-500 mt-1">{fileStatus.error}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  );
}
