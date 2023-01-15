import {
  Box,
  Button,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { getEmojisGroupedBy, GroupedBy } from "unicode-emoji";
import { startCase } from "lodash";

interface IEmojiListingProps {
  onSelect: (emoji: string) => void;
}

export default function EmojiListing(props: IEmojiListingProps) {
  const { onSelect } = props;

  const emojiMap = useMemo(() => getEmojisGroupedBy("category"), []);

  const emojiCategoryList: GroupedBy[] = useMemo(
    () => Object.keys(emojiMap) as GroupedBy[],
    [emojiMap]
  );

  return (
    <Box className="emoji-listing">
      <Tabs isLazy>
        <TabList>
          {emojiCategoryList.map((cat) => (
            <Tab fontSize={"small"} key={cat}>
              {startCase(cat)}
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          {emojiCategoryList.map((cat) => (
            <TabPanel key={cat}>
              <SimpleGrid columns={20}>
                {emojiMap[cat].map(({ emoji, description }, index) => (
                  <Button
                    variant={"ghost"}
                    p={0.5}
                    title={description}
                    key={index}
                    onClick={() => onSelect(emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </SimpleGrid>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Box>
  );
}
