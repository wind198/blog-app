import { Box, Center, Heading } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import LazyLoadedRouteFallback from "../../components/lazy-loaded-route-fallback";
import { db } from "../../db";

interface IHomePageProps {}

export default function HomePage(props: IHomePageProps) {
  const blogPosts = useLiveQuery(() => {
    return db.blogPosts.toArray();
  });

  const blogPostCount = useLiveQuery(() => {
    return db.blogPosts.count();
  });

  return (
    <Box className="home-page">
      <Heading mb={6} size={"md"} as="h2">
        Home
      </Heading>
      {!blogPosts || blogPostCount === undefined ? (
        <LazyLoadedRouteFallback />
      ) : !blogPostCount ? (
        <Center>There are no blog posts</Center>
      ) : (
        blogPosts.map(({ content, createdAt, id }) => (
          <Box key={id} dangerouslySetInnerHTML={{ __html: content }}></Box>
        ))
      )}
    </Box>
  );
}
