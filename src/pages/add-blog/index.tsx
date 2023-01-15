import { Box, Heading } from "@chakra-ui/react";
import AddBlogEditor from "../../components/add-blog-editor";

interface IAddBlogProps {}

export default function AddBlogPage(props: IAddBlogProps) {
  return (
    <Box className="add-blog-page">
      <Heading mb={6} size={"md"} as="h2">
        Add a New Blog
      </Heading>
      <AddBlogEditor />
    </Box>
  );
}
