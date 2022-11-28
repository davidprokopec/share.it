import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Heading,
  Stack,
  Text,
  Image,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import { Layout } from "../components/Layout";
import { createUrqlClient } from "../utils/createUrqlClient";

export const Faq: React.FC = ({}) => {
  return (
    <Layout variant="small">
      <Heading textAlign="center" pb={5} color="blackAlpha.800">
        ČASTÉ DOTAZY
      </Heading>
      <Box bg="#DEE7E7" rounded="md">
        <Accordion allowToggle p={2}>
          <AccordionItem boxShadow="lg">
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Jak založit účet?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Flex direction="column" w="100" alignItems="center">
                <Text mb={2}>
                  Pro registraci klikněte na tlačítko "Registrovat se" v pravém
                  horním rohu webové stránky.
                </Text>
                <Image src="img/registrace.webp" w="40vw" mb={2} />
                <Text>Vyplňte potřebné údaje a zaregistrujte se.</Text>
                <Text color="pink.400" fontWeight="bold">
                  Gratulace!
                </Text>
                <Text>Nyní jste oficiálním členem Share.it 😊</Text>
              </Flex>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Jak vytvořit nový příspěvek?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Flex direction="column" w="100" alignItems="center">
                <Text mb={2}>
                  Pro vytvoření příspěvku musíte být přihlášeni. Po přihlášení
                  klikněte na tlačítko "Vytvořit příspěvek" v pravém horním rohu
                  webové stránky.
                </Text>
                <Image src="img/novyPrispevek.webp" w="40vw" mb={2} />
                <Text>
                  Napište titulek a text příspěvku a poté vytvořte příspěvek.
                </Text>
                <Text color="pink.400" fontWeight="bold">
                  Gratulace!
                </Text>
                <Text>Právě jste vytvořil příspěvek na Share.it 😊</Text>
              </Flex>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Proč jsem zabanovaný? Jak se banu zbavit?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Flex direction="column" w="100" alignItems="center">
                <Text mb={2}>
                  Byl jste pravděpodobně zabanován z důvodu porušení pravidel
                  webu Share.it (vulgarismy, rasismus, ...)
                </Text>
                <Image src="img/ban.webp" w="40vw" mb={2} />
                <Text fontWeight="bold">
                  Pokud si myslíte, že jste byl zabanován neprávem, kontaktujte
                  prosím administrátora na admin@davidprokopec.me.
                </Text>
              </Flex>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    </Layout>
  );
};
export default withUrqlClient(createUrqlClient, { ssr: false })(Faq);
