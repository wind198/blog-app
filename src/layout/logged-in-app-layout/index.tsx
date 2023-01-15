import { Box, Button, Heading, Stack } from "@chakra-ui/react";
import { Link, Outlet } from "react-router-dom";

interface ILoginedAppLayoutProps {}

const AppbarH = 80;

export default function LoginedAppLayout(props: ILoginedAppLayoutProps) {
  return (
    <Box w="full" h="full">
      <Stack
        p={5}
        pos={"fixed"}
        left={0}
        top={0}
        w="full"
        bgColor={"facebook.300"}
        boxShadow="lg"
        direction={"row"}
        spacing={4}
        justifyContent="space-between"
        h={`${AppbarH}px`}
        alignItems="center"
      >
        <Heading color={"white"}>Blog</Heading>
        <Button
          as={Link}
          to="/add-blog"
          variant={"solid"}
          colorScheme="facebook"
        >
          Add
        </Button>
      </Stack>
      <Box p={5} mt={`${AppbarH}px`} w="full" as="main">
        <Outlet />
      </Box>
    </Box>
  );
}
