/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
/* eslint-disable jsx-a11y/alt-text */
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import React, { useActionState, useEffect, useRef, useState } from "react";
import Image from "./Image";
import NextImage from "next/image";
import { mediaFile } from "../actions";
import ImageEditor from "./ImageEditor";
import { useUser } from "@clerk/nextjs";
import { addPost } from "@/actions";
import { notFound } from "next/navigation";

const Share = () => {
  const [media, setMedia] = useState<File | null>(null);
  // State to keep track of the current upload progress (percentage)
  const [progress, setProgress] = useState(0);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const [settings, setSettings] = useState<{
    type: "original" | "wide" | "square";
    sensitive: boolean;
  }>({
    type: "original",
    sensitive: false,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  // we are on the client component that's why we don't use auth()
  const { isLoaded, isSignedIn, user: currentUser } = useUser();

  //It helps manage the state of asynchronous actions, particularly form submissions and server-side operations.
  const [state, formAction, isPending] = useActionState(addPost, {
    success: false,
    error: false,
  });
  useEffect(() => {
    if (state.success) {
      setMedia(null);
      fileInputRef.current = null;
      setSettings({
        type: "original",
        sensitive: false,
      });
    }
  }, [state]);

  // ✅ Wait for Clerk to finish loading before making decisions
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-textGray">Loading...</div>
      </div>
    );
  }
  // ✅ Only call notFound after we know the loading is complete
  if (!isSignedIn || !currentUser) {
    return notFound();
  }

  const imagePreview = media ? URL.createObjectURL(media) : null;
  // Create a ref for the file input element to access its files easily

  // Create an AbortController instance to provide an option to cancel the upload if needed.
  const abortController = new AbortController();
  const authenticator = async () => {
    try {
      // Perform the request to the upload authentication endpoint.
      const response = await fetch("/api/upload-auth");
      if (!response.ok) {
        // If the server response is not successful, extract the error text for debugging.
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      // Parse and destructure the response JSON for upload credentials.
      const data = await response.json();
      const { signature, expire, token, publicKey } = data;
      return { signature, expire, token, publicKey };
    } catch (error) {
      // Log the original error for debugging before rethrowing a new error.
      console.error("Authentication error:", error);
      throw new Error("Authentication request failed");
    }
  };

  /**
   * Handles the file upload process.
   *
   * This function:
   * - Validates file selection.
   * - Retrieves upload authentication credentials.
   * - Initiates the file upload via the ImageKit SDK.
   * - Updates the upload progress.
   * - Catches and processes errors accordingly.
   */
  const handleUpload = async () => {
    // Access the file input element using the ref
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      alert("Please select a file to upload");
      return;
    }

    // Extract the first file from the file input
    const file = fileInput.files[0];

    // Retrieve authentication parameters for the upload.
    let authParams;
    try {
      authParams = await authenticator();
    } catch (authError) {
      console.error("Failed to authenticate for upload:", authError);
      return;
    }
    const { signature, expire, token, publicKey } = authParams;

    // Call the ImageKit SDK upload function with the required parameters and callbacks.
    try {
      const uploadResponse = await upload({
        // Authentication parameters
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name, // Optionally set a custom file name
        // Progress callback to update upload progress state
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
        // Abort signal to allow cancellation of the upload if needed.
        abortSignal: abortController.signal,
      });
      console.log("Upload response:", uploadResponse);
    } catch (error) {
      // Handle specific error types provided by the ImageKit SDK.
      if (error instanceof ImageKitAbortError) {
        console.error("Upload aborted:", error.reason);
      } else if (error instanceof ImageKitInvalidRequestError) {
        console.error("Invalid request:", error.message);
      } else if (error instanceof ImageKitUploadNetworkError) {
        console.error("Network error:", error.message);
      } else if (error instanceof ImageKitServerError) {
        console.error("Server error:", error.message);
      } else {
        // Handle any other errors that may occur.
        console.error("Upload error:", error);
      }
    }
  };

  const handleMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setMedia(e.target.files[0]);
  };

  return (
    <form
      className="flex p-4 gap-4 border-b-[1px] border-b-borderGray"
      action={formAction}
      /* action={(formData) => {
        console.log({ formData, settings });
        mediaFile(formData, settings);
      }} */
    >
      {/* AVATAR */}
      <div className="rounded-full w-10 h-10 overflow-hidden">
        <Image
          src={currentUser.imageUrl ?? "general/avatar.png"}
          alt="avatar"
          w={100}
          h={100}
        />
      </div>
      {/* MAIN CONTENT */}
      <div className="flex flex-col flex-1 gap-4">
        {/* pass the type and isSensitive to form data */}
        <input
          type="text"
          name="imageType"
          value={settings.type}
          hidden
          readOnly
        />
        <input
          type="text"
          name="isSensitive"
          value={settings.sensitive ? "true" : "false"}
          hidden
          readOnly
        />
        <input
          type="text"
          name="desc"
          placeholder="What's happening?"
          className="text-xl bg-transparent py-2 outline-none placeholder:text-gray-500 
          placeholder:text-2xl"
        />
        {isEditorOpen && imagePreview && (
          <ImageEditor
            src={imagePreview}
            onClose={() => setIsEditorOpen(false)}
            settings={settings}
            setSettings={setSettings}
          />
        )}
        {media?.type.includes("image") && imagePreview && (
          <div
            className={`rounded-xl flex relative w-[600px] 
              ${
                settings.type === "square"
                  ? "h-[500px]"
                  : settings.type === "original"
                  ? "h-[300px]"
                  : "h-[250px]"
              }`}
          >
            <NextImage
              src={imagePreview}
              alt="preview"
              height={500}
              width={600}
              className={`rounded-xl ${
                settings.type === "square"
                  ? "aspect-square object-cover"
                  : settings.type === "original"
                  ? "h-[300px]"
                  : "h-[250px]"
              }`}
            />
            <div
              className="absolute top-2 left-2 px-4 py-1 font-bold text-sm bg-black 
                bg-opacity-50 text-white rounded-full cursor-pointer"
              onClick={() => setIsEditorOpen(true)}
            >
              Edit
            </div>
            <button
              className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 
                text-white rounded-full cursor-pointer font-bold"
              onClick={() => setMedia(null)}
            >
              X
            </button>
          </div>
        )}
        {media?.type.includes("video") && imagePreview && (
          <div className="relative h-72">
            {/* the video’s aspect ratio is preserved by default, so if the width is not constrained, 
            the video can overflow vertically or horizontally. */}
            <video
              src={imagePreview}
              controls
              className="h-full  object-contain w-full"
            ></video>
            <button
              className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 
                text-white rounded-full cursor-pointer font-bold"
              onClick={() => setMedia(null)}
            >
              X
            </button>
          </div>
        )}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex gap-3">
            <input
              type="file"
              name="file"
              ref={fileInputRef}
              placeholder="upload a file"
              onChange={handleMedia}
              className="hidden"
              id="file"
              accept="image/*, video/*"
            />
            <label htmlFor="file">
              <Image
                src="icons/image.svg"
                w={20}
                h={20}
                className="cursor-pointer"
              />
            </label>
            {/* Upload progress: <progress value={progress} max={100}></progress> */}
            <Image
              src="icons/gif.svg"
              w={20}
              h={20}
              className="cursor-pointer"
            />
            <Image
              src="icons/poll.svg"
              w={20}
              h={20}
              className="cursor-pointer"
            />
            <Image
              src="icons/emoji.svg"
              w={20}
              h={20}
              className="cursor-pointer"
            />
            <Image
              src="icons/schedule.svg"
              w={20}
              h={20}
              className="cursor-pointer"
            />
            <div className="cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="#3b82f6"
                stroke="none"
              >
                <path d="M12 7c-1.93 0-3.5 1.57-3.5 3.5S10.07 14 12 14s3.5-1.57 3.5-3.5S13.93 7 12 7zm0 5c-.827 0-1.5-.673-1.5-1.5S11.173 9 12 9s1.5.673 1.5 1.5S12.827 12 12 12zm0-10c-4.687 0-8.5 3.813-8.5 8.5 0 5.967 7.621 11.116 7.945 11.332l.555.37.555-.37c.324-.216 7.945-5.365 7.945-11.332C20.5 5.813 16.687 2 12 2zm0 17.77c-1.665-1.241-6.5-5.196-6.5-9.27C5.5 6.916 8.416 4 12 4s6.5 2.916 6.5 6.5c0 4.073-4.835 8.028-6.5 9.27z" />
              </svg>
            </div>
          </div>
          <button
            type="submit"
            onClick={handleUpload}
            disabled={isPending}
            className="text-black bg-white rounded-full font-bold py-2 px-4 disabled:cursor-not-allowed disabled:bg-slate-200"
          >
            {isPending ? "Posting ..." : "Post"}
          </button>
        </div>
        {state.error && (
          <span className="text-red-600 p-4">Something went wrong</span>
        )}
      </div>
    </form>
  );
};

export default Share;
