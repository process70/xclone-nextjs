import React from "react";
import Image from "./Image";
import PostInfo from "./PostInfo";
import PostInteractions from "./PostInteractions";
import KVideo from "./KVideo";
import Link from "next/link";
import { Like, Post as PostType, Save, User } from "@prisma/client";
import { format } from "timeago.js";

type PostWithUser = PostType & {
  User: User;
  rePost?:
    | (PostType & {
        User: User;
        _count: {
          comments: number;
          likes: number;
          reposts: number;
        };
        likes: Like[];
        reposts: PostType[];
        saves: Save[];
      })
    | null;
  _count: {
    comments: number;
    likes: number;
    reposts: number;
  };
  likes: Like[];
  reposts: PostType[];
  saves: Save[];
};

const Post = ({
  type,
  post,
}: {
  type?: "status" | "comment";
  post: PostWithUser;
}) => {
  //console.log("original post id: " + post.rePost ? post?.rePost?.id : post.id);
  /*   const getImageKitInstance = () => {
    return new ImageKit({
      privateKey: process.env.PRIVATE_KEY!,
      publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
      urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
    });
  };

  const getFileDetails = (fileId: string): Promise<FileDetailsResponse> => {
    const imageKit = getImageKitInstance();

    return new Promise((resolve, reject) => {
      imageKit.getFileDetails(fileId, function (err, res) {
        if (err) reject(err);
        if (res) resolve(res as FileDetailsResponse);
      });
    });
  };
  const postImageDetials = await getFileDetails("686548985c7cd75eb87401ff");
  console.log(postImageDetials); */

  // Calculate appropriate max dimensions based on content type
  /*   const getMaxDimensions = (
    fileType: string,
    width: number,
    height: number
  ) => {
    if (fileType === "video") {
      // For videos, allow more flexibility while maintaining aspect ratio
      const aspectRatio = width / height;
      const maxWidth = 600;
      const maxHeight = 400;

      if (aspectRatio > maxWidth / maxHeight) {
        return { maxWidth, maxHeight: maxWidth / aspectRatio };
      } else {
        return { maxWidth: maxHeight * aspectRatio, maxHeight };
      }
    }
    return { maxWidth: 600, maxHeight: 500 };
  }; */

  /*   const { maxWidth, maxHeight } = getMaxDimensions(
    postImageDetials.fileType,
    postImageDetials.width,
    postImageDetials.height
  ); */
  return (
    <div className="p-4 border-b-borderGray border-b-[1px]">
      {/* Post Type */}
      {type !== "status" && post?.repostId && (
        <div className="flex items-center gap-2 text-textGray text-sm font-bold mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="none"
            className="text-textGray group-hover:text-textGreen"
          >
            <path d="M4.75 3.79l4.603 4.3-1.706 1.82L6 8.38v7.37c0 .97.784 1.75 1.75 1.75H13V20H7.75c-2.347 0-4.25-1.9-4.25-4.25V8.38L1.853 9.91.147 8.09l4.603-4.3zm11.5 2.71H11V4h5.25c2.347 0 4.25 1.9 4.25 4.25v7.37l1.647-1.53 1.706 1.82-4.603 4.3-4.603-4.3 1.706-1.82L18 15.62V8.25c0-.97-.784-1.75-1.75-1.75z" />
          </svg>

          <span className="text-sm">{post?.User.displayName} reposted</span>
        </div>
      )}

      {/* Post Content */}
      <div className={`flex gap-4 ${type === "status" && "flex-col"}`}>
        {/* Profile Avatar */}
        <div
          className={`${
            type === "status" && "hidden"
          } w-10 h-10 rounded-full overflow-hidden`}
        >
          <Image
            src={
              post?.rePost?.User.avatar ||
              post.User.avatar ||
              "general/avatar.png"
            }
            alt="avatar"
            w={100}
            h={100}
            className="w-full h-full"
          />
        </div>
        {/* Content Details */}
        <div className="flex flex-col gap-2 flex-1">
          {/* Top */}
          <div className="w-full flex justify-between ">
            <Link
              href={`/${
                post?.repostId
                  ? post.rePost?.User.username
                  : post?.User.username
              }`}
              className="flex gap-3"
            >
              <div
                className={`${
                  type !== "status" && "hidden"
                }  rounded-full overflow-hidden w-10 h-10`}
              >
                <Image
                  src={
                    post?.rePost?.User.avatar ||
                    post.User.avatar ||
                    "general/avatar.png"
                  }
                  alt="avatar"
                  w={100}
                  h={100}
                  className="h-full w-full"
                />
              </div>
              <div
                className={`flex items-center gap-2 flex-wrap ${
                  type === "status" && "flex-col !items-start !gap-0"
                }`}
              >
                <h3 className="font-bold hover:underline">
                  {post?.repostId
                    ? post.rePost?.User.displayName
                    : post?.User.displayName}
                </h3>
                <span className="text-textGray">
                  @
                  {post?.repostId
                    ? post.rePost?.User.username
                    : post?.User.username}
                </span>
                {type !== "status" && (
                  <span className={`text-textGray`}>
                    {format(
                      post?.repostId
                        ? post.rePost?.createdAt ?? post.createdAt
                        : post.createdAt
                    )}
                  </span>
                )}
              </div>
            </Link>
            <PostInfo />
          </div>
          {/* TEXT AND MEDIA */}
          {type !== "status" ? (
            <Link
              href={`/${
                post?.repostId
                  ? post.rePost?.User.username
                  : post?.User.username
              }/status/${post.repostId ? post?.rePost?.id : post.id}`}
            >
              <p className="text-lg">{post.description}</p>
            </Link>
          ) : (
            <p>{post.description}</p>
          )}

          {post && post.image && (
            <Image
              src={post?.repostId ? post.rePost?.image || "" : post.image}
              alt=""
              w={600}
              h={400}
              className={`rounded-lg max-h-[400px]
                    ${
                      post.repostId
                        ? post.rePost?.isSensitive
                        : post.isSensitive
                        ? "blur-lg"
                        : ""
                    }`}
            />
          )}
          {post && post.video && (
            <KVideo
              src={post?.repostId ? post.rePost?.video || "" : post.video}
              maxWidth={600}
              maxHeight={400}
              originalWidth={500}
              originalHeight={400}
              className={`w-full 
                    ${
                      post?.repostId
                        ? post.rePost?.isSensitive
                        : post.isSensitive
                        ? "blur-lg"
                        : ""
                    }`}
            />
          )}
          {type === "status" && (
            <div className="flex gap-2 text-textGray mt-4">
              <p className="text-md cursor-pointer">9:21 AM · Jul 10, 2025</p>
              <p className="text-md text-white">
                1936 <span className="text-textGray">Views</span>
              </p>
            </div>
          )}

          <PostInteractions
            username={post?.rePost?.User.username || post.User.username}
            postId={post?.rePost?.id || post.id}
            likes={post?.rePost?._count.likes || post._count.likes}
            comments={post?.rePost?._count.comments || post._count.comments}
            reposts={post?.rePost?._count.reposts || post._count.reposts}
            isliked={!!(post?.rePost?.likes?.length || post.likes.length)}
            isReposted={
              !!(post?.rePost?.reposts?.length || post.reposts.length)
            }
            isSaved={!!(post?.rePost?.saves?.length || post.saves.length)}
          />
        </div>
        {/* Post Actions */}
      </div>
    </div>
  );
};

export default Post;
