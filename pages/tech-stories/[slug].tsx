import { Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { SINGLE_BLOG_POST_QUERY, SanityClient } from '@/lib/sanityClient';

import { BlockContainer } from '@/containers/BlockContainer';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/header';
import Image from 'next/image';
import { NextPage } from 'next';
import { PageWrapper } from '@/containers/PageWrapper';
import { map } from 'lodash';

const postSlugsQuery = `*[_type == "post"]{
  _id,
  slug,
}`;

export async function getStaticPaths() {
  const paths = await SanityClient.fetch(postSlugsQuery);

  return {
    paths: map(paths, ({ slug }) => ({
      params: { slug: slug.current },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params: { slug } }: any) {
  const post = await SanityClient.fetch(SINGLE_BLOG_POST_QUERY, { slug });

  return {
    props: {
      post,
    },
  };
}

type ReadBlogPostPageProps = {
  post: any;
};

const ReadBlogPostPage: NextPage<ReadBlogPostPageProps> = ({ post }) => {
  return (
    <PageWrapper Nav={Header}>
      <BlockContainer>
        <Stack
          justifyContent={'center'}
          alignItems={'center'}
          spacing={{
            base: '1rem',
            md: '2rem',
          }}>
          <Heading
            as={'h1'}
            maxW={'container.lg'}
            fontSize={{
              base: '2xl',
              md: '4xl',
            }}
            textTransform={'capitalize'}>
            {post.title}
          </Heading>
          <Flex
            position={'relative'}
            h={{
              base: '300px',
              md: '500px',
            }}
            w={'100%'}
            maxW={'container.lg'}>
            <Image
              src={post.mainImage.asset.url}
              alt={post.title}
              fill
              style={{
                objectFit: 'cover',
                objectPosition: 'top center',
                borderRadius: '10px',
              }}
            />
          </Flex>
          <Text>{post.excerpt}</Text>
        </Stack>
      </BlockContainer>

      <Footer />
    </PageWrapper>
  );
};

export default ReadBlogPostPage;
