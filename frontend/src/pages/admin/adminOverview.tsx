import {
  Badge,
  Box,
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
import { InputField } from "../../components/InputField";
import { Layout } from "../../components/Layout";
import { SetAdminPopover } from "../../components/SetAdminPopover";
import {
  useAdminUsersQuery,
  useSetAdminUserMutation,
} from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useIsBanned } from "../../utils/useIsBanned";
import { useIsOwner } from "../../utils/useIsOwner";

export const AdminOverview: React.FC = ({}) => {
  useIsBanned();
  useIsOwner();
  const [{ data }] = useAdminUsersQuery();
  const [, setAdmin] = useSetAdminUserMutation();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const duration = 2000;

  return (
    <Layout>
      <NextLink href="/admin">
        <Link>
          <Text fontWeight="bold" fontSize={20} textAlign="center" mb={5}>
            Admin panel
          </Text>
        </Link>
      </NextLink>
      <Flex flexDirection="column" rounded="md" bg="gray.100" p={5}>
        <Flex
          flexDirection={{ md: "row", sm: "column" }}
          justifyContent="space-between"
          alignItems="center"
          mb={15}
        >
          <Text color="gray.700">Uživatelé s admin pravomocemi</Text>
          <Flex>
            <Button ml={4} colorScheme="green" onClick={onOpen}>
              Přidat práva uživateli
            </Button>

            <Modal blockScrollOnMount={true} isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Přidat práva uživateli</ModalHeader>
                <ModalCloseButton />
                <Formik
                  initialValues={{ username: "" }}
                  onSubmit={async (values) => {
                    const response = await setAdmin({
                      username: values.username,
                      action: "add",
                    });
                    const status = response.data?.setAdminUser.status as
                      | "info"
                      | "warning"
                      | "success"
                      | "error"
                      | undefined;
                    if (!response.data) {
                      toast({
                        title: "Něco se nepodařilo",
                        description: "Při přidávání práv se něco nezdařilo.",
                        status: "error",
                        duration,
                        isClosable: true,
                      });
                    }
                    if (response.data?.setAdminUser.error) {
                      toast({
                        title: "Účtu nebyla přidávána práva.",
                        description: response.data.setAdminUser.error,
                        status,
                        duration,
                        isClosable: true,
                      });
                    } else {
                      toast({
                        title: "Účtu byla přidána práva.",
                        description:
                          "Účtu " +
                          response.data?.setAdminUser.user?.username +
                          " byla úspěšně přidána práva.",
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
                          onClick={onClose}
                        >
                          Přidat práva
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
          </Flex>
        </Flex>
        {!data?.adminUsers[0] ? (
          <Text>ERROR</Text>
        ) : (
          <Stack spacing={5}>
            {data!.adminUsers.map((u) =>
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
                    <Flex
                      flexDirection="row"
                      mb={1}
                      alignItems="center"
                      left="-1"
                      pos="relative"
                    >
                      <Badge colorScheme={u.banned ? "red" : "green"}>
                        {u.banned ? "zabanovaný" : "nezabanovaný"}
                      </Badge>
                    </Flex>
                    <NextLink
                      href="/user/[username]"
                      as={`/user/${u.username}`}
                    >
                      <Link>
                        <Text color="blue.600">Profil</Text>
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
                  </Flex>
                  <Flex
                    flexDirection="column"
                    mb={1}
                    alignItems="center"
                    justifyContent="center"
                    maxW="200px"
                    w="100%"
                    mr={{ md: -7, sm: 0 }}
                    mt={{ md: 0, sm: 4 }}
                  >
                    <Box>
                      <Badge ml={1} fontSize="1.2em" colorScheme="green">
                        {u.role}
                      </Badge>
                    </Box>
                    <SetAdminPopover user={u} />
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

export default withUrqlClient(createUrqlClient, { ssr: true })(AdminOverview);
