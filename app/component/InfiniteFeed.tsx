"use client";
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "./Post";

const InfiniteFeed = ({ profileId }: { profileId?: string }) => {
  const fetchPosts = async (pageParam: number) => {
    const res = await fetch(
      "https://xclone-nextjs.onrender.com/api/posts?cursor=" +
        pageParam +
        "&profileId=" +
        profileId
    );
    return res.json();
  };
  // the useInfiniteQuery hook will execute when the component mounts/loads.
  const {
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isPending,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    /* we set pageParam as 2 because we've already fetch the first page inside the Feed.tsx */
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam),
    getNextPageParam: (lastPage, pages) => {
      //console.log({ lastPage });
      /* initially before fetching the page number is 1 
        after the first fetch the pages length is 1 so the page number become 2 */
      return lastPage?.hasMore ? pages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  if (error) return "something went wrong!";
  if (isPending) return "loading ...";

  //console.log(data);
  const loader = <p>the posts are loading ...</p>;
  const endMessage = <p>all posts loaded</p>;

  /* get all the previous posts to keep them visible until the new ones get fetched 
  this function will unify all the posts inside the data */
  const allPosts = data?.pages?.flatMap((page) => page.posts) || [];
  return (
    <InfiniteScroll
      dataLength={allPosts.length}
      loader={loader}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      endMessage={endMessage}
    >
      {allPosts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </InfiniteScroll>
  );
};

export default InfiniteFeed;
