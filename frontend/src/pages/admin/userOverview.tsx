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
import { BanPopover } from "../../components/BanPopover";
import { InputField } from "../../components/InputField";
import { Layout } from "../../components/Layout";
import { SetAdminPopover } from "../../components/SetAdminPopover";
import {
  useAdminUsersQuery,
  useSetAdminUserMutation,
  useUsersQuery,
} from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useIsBanned } from "../../utils/useIsBanned";
import { useIsOwner } from "../../utils/useIsOwner";

export const AdminOverview: React.FC = ({}) => {
  useIsBanned();
  useIsOwner();
  const [{ data }] = useUsersQuery();

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
          <Text color="gray.700">Uživatelé</Text>
        </Flex>
        {!data?.users[0] ? (
          <Text>ERROR</Text>
        ) : (
          <Stack spacing={5}>
            {data!.users.map((u) =>
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
                    ></Flex>
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
                    <Flex flexDirection="column">
                      <Badge ml={1} fontSize="1.2em" colorScheme="green">
                        {u.role}
                      </Badge>
                      <SetAdminPopover user={u} />
                      <Badge mt={2} colorScheme={u.banned ? "red" : "green"}>
                        {u.banned ? "zabanovaný" : "nezabanovaný"}
                      </Badge>
                      <BanPopover user={u} />
                    </Flex>
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
