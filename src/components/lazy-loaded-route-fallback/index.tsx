import { Center, Spinner, Box } from "@chakra-ui/react";

interface ILazyLoadedRouteFallbackProps {}

export default function LazyLoadedRouteFallback(
  props: ILazyLoadedRouteFallbackProps
) {
  return (
    <Center w="full" h="full">
      <Spinner colorScheme={"blue"} />
    </Center>
  );
}
