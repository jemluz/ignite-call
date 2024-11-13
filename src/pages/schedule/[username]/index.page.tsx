import { Avatar, Heading, Text } from "@ignite-ui/react";
import { GetStaticPaths, GetStaticProps } from "next";
import { prisma } from "../../../lib/prisma";
import { Container, UserHeader } from "./styles";
import { ScheduleForm } from "./ScheduleForm";
import { NextSeo } from "next-seo";

interface ScheduleProps {
  user: {
    name: string;
    bio: string;
    avatarUrl: string;
  };
}

export default function Schedule({ user }: ScheduleProps) {
  return (
    <>
      <NextSeo title={`Agendar com ${user.name} | Ignite Call`} />

      <Container>
        <UserHeader>
          <Avatar src={user.avatarUrl} />
          <Heading>{user.name}</Heading>
          <Text>{user.bio}</Text>
        </UserHeader>

        <ScheduleForm />
      </Container>
    </>
  );
}

// getStaticPaths help next to know wich routes (wich usernames) must be generated staticaly.
// This is necessary bcs in this case, we have a static page with a dinamic param
// (the path param)

// with paths = [] we're saying to next, to not generate no one [username] path at build moment, so generation will be done as users access
// for resume, each [username] page just will be generated at the access moment
export const getStaticPaths: GetStaticPaths = async () => {
  try {
    return {
      paths: [],
      fallback: "blocking",
    };
  } catch (error) {
    console.error("Failed to fetch paths:", error);
    return {
      paths: [],
      fallback: false,
    };
  }
};

// static pages dont have req and res object
// bcs them are created with build
export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const username = String(params?.username);
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        user: {
          name: user.name,
          bio: user.bio,
          avatarUrl: user.avatar_url,
        },
      },
      revalidate: 60 * 60 * 24, // 1 day
    };
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return { notFound: true }; // Ou handle como preferir
  }
};
