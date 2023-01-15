import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";
import { lazy, Suspense } from "react";
import LazyLoadedRouteFallback from "../../lazy-loaded-route-fallback";
const EmojiListing = lazy(() => import("./EmojiListing"));

interface IEmojiPickerProps {
  onSelect: (emoji: string) => void;
}

export default function EmojiPicker(props: IEmojiPickerProps) {
  const { onSelect } = props;

  return (
    <Popover isLazy>
      <PopoverTrigger>
        <Button>Emoji 😊</Button>
      </PopoverTrigger>
      <PopoverContent width={"fit-content"}>
        <PopoverBody>
          <Suspense fallback={<LazyLoadedRouteFallback />}>
            {" "}
            <EmojiListing onSelect={onSelect} />
          </Suspense>{" "}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
