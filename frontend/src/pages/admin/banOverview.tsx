import {
  Badge,
  Button,
  Flex,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import moment from "moment";
import "moment/locale/cs";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React from "react";
import { BanPopover } from "../../components/BanPopover";
import { InputField } from "../../components/InputField";
import { Layout } from "../../components/Layout";
import { Loading } from "../../components/Loading";
import {
  useBannedUsersQuery,
  useBanUserMutation,
} from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useIsAdmin } from "../../utils/useIsAdmin";
import { useIsBanned } from "../../utils/useIsBanned";

type Status = "info" | "warning" | "success" | "error" | undefined;

export const BanOverview: React.FC = ({}) => {
  useIsBanned();
  useIsAdmin();
  const [{ data, fetching }] = useBannedUsersQuery();
  const [, banUser] = useBanUserMutation();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenUnban,
    onOpen: onOpenUnban,
    onClose: onCloseUnban,
  } = useDisclosure();

  const toast = useToast();

  const duration = 2000;

  if (fetching) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  if (!data) {
    return <Layout>ERROR</Layout>;
  }

  return (
    <Layout>
      <NextLink href="/admin">
        <Link>
          <Text fontWeight="bold" fontSize={20} textAlign="center" mb={5}>
            Admin panel
          </Text>
        </Link>
      </NextLink>
      <Flex
        flexDirection="column"
        rounded="md"
        bg="gray.100"
        p={5}
        textAlign="center"
      >
        <Flex
          flexDirection={{ md: "row", sm: "column" }}
          justifyContent="space-between"
          alignItems="center"
          mb={15}
        >
          <Text color="gray.700">Zabanovaní uživatelé</Text>
          <Flex flexDirection={{ md: "row", sm: "column" }} alignItems="center">
            <Button colorScheme="red" onClick={onOpen}>
              Zabanovat uživatele
            </Button>

            <Modal blockScrollOnMount={true} isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Zabanovat uživatele</ModalHeader>
                <ModalCloseButton />
                <Formik
                  initialValues={{ username: "" }}
                  onSubmit={async (values) => {
                    const response = await banUser({
                      username: values.username,
                      action: "ban",
                    });

                    const status = response.data?.banUser.status as Status;
                    if (!response.data) {
                      toast({
                        title: "Něco se nepodařilo",
                        description: "Při banování užitele se něco nepodařilo.",
                        status: "error",
                        duration,
                        isClosable: true,
                      });
                    }
                    if (response.data?.banUser.error) {
                      toast({
                        title: "Účet nebyl zabanován",
                        description: response.data.banUser.error,
                        status,
                        duration,
                        isClosable: true,
                      });
                    } else {
                      toast({
                        title: "Účet byl zabanován",
                        description:
                          "Účet " +
                          response.data?.banUser.user?.username +
                          " byl úspěšně zabanován.",
                        status,
                        duration,
                        isClosable: true,
                      });
                    }
                  }}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <ModalBody>
                        <InputField
                          name="username"
                          label="Uživatelské jméno"
                          placeholder="Uživatelské jméno"
                        />
                      </ModalBody>

                      <ModalFooter>
                        <Button
                          type="submit"
                          colorScheme="red"
                          mr={3}
                          onClick={onClose}
                        >
                          Zabanovat
                        </Button>
                        <Button variant="ghost" onClick={onClose}>
                          Zrušit
                        </Button>
                      </ModalFooter>
                    </Form>
                  )}
                </Formik>
              </ModalContent>
            </Modal>
            <Button
              ml={{ md: 4, sm: 0 }}
              mt={{ md: 0, sm: 2 }}
              colorScheme="green"
              onClick={onOpenUnban}
            >
              Odbanovat uživatele
            </Button>

            <Modal
              blockScrollOnMount={true}
              isOpen={isOpenUnban}
              onClose={onCloseUnban}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Odbanovat uživatele</ModalHeader>
                <ModalCloseButton />
                <Formik
                  initialValues={{ username: "" }}
                  onSubmit={async (values) => {
                    const response = await banUser({
                      username: values.username,
                      action: "unban",
                    });
                    const status = response.data?.banUser.status as Status;
                    if (!response.data) {
                      toast({
                        title: "Něco se nepodařilo",
                        description:
                          "Při odbanování užitele se něco nepodařilo.",
                        status: "error",
                        duration,
                        isClosable: true,
                      });
                    }
                    if (response.data?.banUser.error) {
                      toast({
                        title: "Účet nebyl odbanován",
                        description: response.data.banUser.error,
                        status,
                        duration,
                        isClosable: true,
                      });
                    } else {
                      toast({
                        title: "Účet byl odbanován",
                        description:
                          "Účet " +
                          response.data?.banUser.user?.username +
                          " byl úspěšně odbanován.",
                        status,
                        duration,
                        isClosable: true,
                      });
                    }
                  }}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <ModalBody>
                        <InputField
                          name="username"
                          label="Uživatelské jméno"
                          placeholder="Uživatelské jméno"
                        />
                      </ModalBody>

                      <ModalFooter>
                        <Button
                          type="submit"
                          colorScheme="green"
                          mr={3}
                          onClick={onCloseUnban}
                        >
                          Odbanovat
                        </Button>
                        <Button variant="ghost" onClick={onCloseUnban}>
                          Zrušit
                        </Button>
                      </ModalFooter>
                    </Form>
                  )}
                </Formik>
              </ModalContent>
            </Modal>
          </Flex>
        </Flex>
        {!data?.bannedUsers[0] ? (
          <Text>momentálně nejsou zabanovaní žádní uživatelé</Text>
        ) : (
          <Stack spacing={5}>
            {data!.bannedUsers.map((u) =>
              !u ? null : (
                <Flex
                  p={5}
                  shadow="md"
                  borderWidth="1px"
                  bg="#DEE7E7"
                  rounded="md"
                  alignItems="center"
                  justifyContent="space-between"
                  flexDirection={{ md: "row", sm: "column" }}
                >
                  <Flex flexDirection="column">
                    <NextLink
                      href="/user/[username]"
                      as={`/user/${u.username}`}
                    >
                      <Link>
                        <Text color="blue.600" textAlign="left">
                          Profil
                        </Text>
                      </Link>
                    </NextLink>
                    <Flex flexDirection="row" mb={1}>
                      <Text color="blue.600">Id: </Text>
                      <Text fontWeight="bolder" ml={2}>
                        {u.id}
                      </Text>
                    </Flex>
                    <Flex flexDirection="row" mb={1}>
                      <Text color="blue.600">Uživatelské jméno: </Text>
                      <Text fontWeight="bolder" ml={2}>
                        {u.username}
                      </Text>
                    </Flex>
                    <Flex flexDirection="row" mb={1}>
                      <Text color="blue.600">E-mail: </Text>
                      <Text fontWeight="bolder" ml={2}>
                        {u.email}
                      </Text>
                    </Flex>
                    <Flex flexDirection="row" mb={1}>
                      <Text color="blue.600">Zaregistrován: </Text>
                      <Text fontWeight="bolder" ml={2}>
                        {moment(new Date(parseInt(u.createdAt))).format("LLLL")}
                      </Text>
                    </Flex>
                    <Flex flexDirection="row" mb={1}>
                      <Text color="blue.600">Role: </Text>
                      <Text fontWeight="bolder" ml={2}>
                        {u.role}
                      </Text>
                    </Flex>
                  </Flex>
                  <Flex flexDirection="column">
                    <Badge mb={1} colorScheme={u.banned ? "red" : "green"}>
                      {u.banned ? "zabanovaný" : "nezabanovaný"}
                    </Badge>
                    <BanPopover user={u} />
                  </Flex>
                </Flex>
              )
            )}
          </Stack>
        )}
      </Flex>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(BanOverview);
