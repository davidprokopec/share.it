import { Box, Button, Flex, Heading, Input, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { InputField } from "./InputField";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });
  let body = null;

  let searchQuery = router.query.searchQuery;

  //loading
  if (fetching) {
    // not logged in
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={4} color="white">
            Přihlásit se
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link color="white">Registrovat se</Link>
        </NextLink>
      </>
    );

    // logged in
  } else {
    body = (
      <Flex align="center">
        <NextLink href="create-post">
          <Button as={Link} mr={2}>
            Vytvořit příspěvek
          </Button>
        </NextLink>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          onClick={async () => {
            await logout();
            router.reload();
          }}
          isLoading={logoutFetching}
          variant="link"
          color="white"
        >
          Odhlásit se
        </Button>
      </Flex>
    );
  }
  return (
    <Flex zIndex={1} position="sticky" top={0} bg="#4F646F" p={4}>
      <Flex flex={1} m="auto" maxW={800} alignItems="center">
        <NextLink href="/">
          <Link style={{ textDecoration: "none", marginRight: "auto" }}>
            <Heading
              color="gray.100"
              transition="0.5s"
              _hover={{
                transform: "scale(1.2)",
                transition: "0.5s",
                textDecoration: "none",
              }}
            >
              Share.it
            </Heading>
          </Link>
        </NextLink>
        <Formik
          initialValues={{ query: searchQuery }}
          onSubmit={(values, { setSubmitting }) => {
            router.push(
              "/search/[searchQuery]",
              (`/search/` + values.query) as string
            );
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Flex flexDirection="row" mr={2} role="group">
                <Box mr={4}>
                  <InputField name="query" placeholder="zadejte hledaný text" />
                </Box>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  fontSize={[12, 15]}
                >
                  Hledat
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
        <Box ml={"auto"}>{body}</Box>
      </Flex>
    </Flex>
  );
};
