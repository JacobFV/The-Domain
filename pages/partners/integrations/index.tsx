/* eslint-disable react/jsx-no-undef */
import { IconLoader, IconSearch, Input } from '@supabase/ui'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'

import PartnerLinkBox from '@/components/PartnerLinkBox'
import PartnerTileGrid from '@/components/PartnerTileGrid'
import SectionContainer from '@/components/SectionContainer'

import supabase from '@/lib/supabase'

import { Partner } from 'types/partners'
import Footer from '@/components/Footer'
import { PropsWithChildren } from 'react'
import { useTheme } from '@/components/theme'
import Image from 'next/image'
import Link from 'next/link'



type LayoutProps = {
  hideHeader?: boolean
  hideFooter?: boolean
}





export const Layout = ({
  hideHeader = true,
  hideFooter = true,
  children,
}: PropsWithChildren<LayoutProps>) => {


  return (
    <>
      {/* {!hideHeader && <Nav />} */}
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-100">
        <main>{children}</main>
      </div>
      {/* {!hideFooter && <Footer />} */}
    </>
  )
}




export async function getStaticProps() {
  try {
    const { data: partners } = await supabase
      .from('partners')
      .select('*')
      .eq('approved', true)
      .eq('type', 'technology')
      .order('category')
      .order('title')

    return {
      props: {
        partners,
      },
      revalidate: 18000,
    }
  } catch (error) {
    console.error('Error fetching partners:', error);
    return {
      props: {
        partners: [],
      },
      revalidate: 18000,
    }
  }
}

interface Props {
  partners: Partner[]
}

function IntegrationPartnersPage(props: Props) {
  const { partners: initialPartners } = props
  const [partners, setPartners] = useState(initialPartners)

  const allCategories = Array.from(
    new Set(initialPartners.map((p) => p.category))
  )

  const partnersByCategory: { [category: string]: Partner[] } = {};

  if (partners) {
    partners.forEach(
      (p) =>
        (partnersByCategory[p.category] = [
          ...(partnersByCategory[p.category] ?? []),
          p,
        ])
    );
  }

  console.log("allCategories:", allCategories);
  console.log("partnersByCategory:", partnersByCategory);
  
  const router = useRouter()

  const meta_title = 'Find an Integration'
  const meta_description = `Integrate your favorite tools with the Domain.`

  const [search, setSearch] = useState('')
  const [debouncedSearchTerm] = useDebounce(search, 300)
  const [isSearching, setIsSearching] = useState(false)
  console.log('partnersByCategory:', partnersByCategory);

  // useEffect(() => {
  //   const searchPartners = async () => {
  //     setIsSearching(true)

  //     let query = supabase
  //       .from('partners')
  //       .select('*')
  //       .eq('approved', true)
  //       .order('category')
  //       .order('title')

  //     if (search.trim()) {
  //       query = query
  //         // @ts-ignore
  //         .textSearch('tsv', `${search.trim()}`, {
  //           type: 'websearch',
  //           config: 'english',
  //         })
  //     }

  //     const { data: partners } = await query

  //     return partners
  //   }

  //   if (search.trim() === '') {
  //     setIsSearching(false)
  //     setPartners(initialPartners)
  //     return
  //   }

  //   searchPartners().then((partners: any) => {
  //     if (partners) {
  //       setPartners(partners)
  //     }

  //     setIsSearching(false)
  //   })
  // }, [debouncedSearchTerm, router])
  useEffect(() => {
    const searchPartners = async () => {
      setIsSearching(true)
  
      let query = supabase
        .from('partners')
        .select('*')
        .eq('approved', true)
        .order('category')
        .order('title')
  
      if (search.trim()) {
        query = query
          // @ts-ignore
          .textSearch('tsv', `${search.trim()}`, {
            type: 'websearch',
            config: 'english',
          })
      }
  
      const { data: partners } = await query
  
      return partners
    }
  
    if (search.trim() === '') {
      setIsSearching(false)
      setPartners(initialPartners)
      return
    }
  
    searchPartners().then((partners: any) => {
      if (partners) {
        setPartners(partners)
      }
  
      setIsSearching(false)
    })
  }, [debouncedSearchTerm, router, initialPartners, search])

  return (
    <>
      <Head>
        <title>{meta_title} |Domain integrations</title>
        <meta name="description" content={meta_description}></meta>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <SectionContainer className="space-y-16">
          <div>
            <h1 className="h1">{meta_title}</h1>
            <h2 className="text-xl text-scale-900">{meta_description}</h2>
          </div>
          {/* Title */}
          {/* class="fixed h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100" */}
          <div className="grid space-y-12 md:gap-8 lg:grid-cols-12 lg:gap-16 lg:space-y-0 xl:gap-16 bg-gradient-to-br from-indigo-50 via-white to-cyan-100">
            <div className="lg:col-span-4 xl:col-span-3">
              {/* Horizontal link menu */}
              <div className="space-y-6">
                {/* Search Bar */}

                <Input
                  size="small"
                  icon={<IconSearch />}
                  placeholder="Search..."
                  type="text"
                  // className="md:w-1/2"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  actions={
                    isSearching && (
                      <span className="mr-1 animate-spin text-white">
                        <IconLoader />
                      </span>
                    )
                  }
                />
                <div className="hidden lg:block">
                  <div className="mb-2 text-sm text-scale-900">Categories</div>
                  <div className="space-y-1">
                  {/* {allCategories && allCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() =>
                        router.push(`#${category.toLowerCase()}`)
                      }
                      className="block text-base text-scale-1100"
                    >
                      {category}
                      </button>
                    ))} */}
                    {/* {allCategories && allCategories.length > 0 ? (
                      allCategories.map((category) => (
                        <button
                          key={category}
                          onClick={() => router.push(`#${category.toLowerCase()}`)}
                          className="block text-base text-scale-1100"
                        >
                          {category}
                        </button>
                      ))
                    ) : (
                      <div>No categories found</div>
                    )} */}
                  {/* {allCategories && allCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() =>
                        router.push(`#${category.toLowerCase()}`)
                      }
                      className="block text-base text-scale-1100"
                    >
                      {category}
                    </button>
                  ))} */}
                  {allCategories && allCategories.length > 0 && allCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() =>
                        router.push(`#${category.toLowerCase()}`)
                      }
                      className="block text-base text-scale-1100"
                    >
                      {category}
                    </button>
                  ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="mb-2 text-sm text-scale-900">
                    Explore more
                  </div>
                  <div className="grid grid-cols-2 gap-8 lg:grid-cols-1">
                    <PartnerLinkBox
                      title="Experts"
                      color="blue"
                      description="Explore our certified Supabase agency experts that build with Supabase"
                      href={`/partners/experts`}
                      icon={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      }
                    />

                    <PartnerLinkBox
                      href={`/partners/integrations#become-a-partner`}
                      title="Become a partner"
                      color="brand"
                      description="Fill out a quick 30 second form to apply to become a partner"
                      icon={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-8 xl:col-span-9">
              {/* Partner Tiles */}
              <div className="grid space-y-10">
                {/* {partners.length ? (
                  <PartnerTileGrid partnersByCategory={partnersByCategory} />
                ) : (
                  <h2 className="h2">No Partners Found</h2>
                )} */}
              {/* {partnersByCategory && Object.keys(partnersByCategory).length > 0 ? (
                <PartnerTileGrid partnersByCategory={partnersByCategory} />
              ) : (
                <h2 className="h2">No Partners Found</h2>
              )} */}
              {/* {partnersByCategory && Object.keys(partnersByCategory).length > 0 ? (
                <PartnerTileGrid partnersByCategory={partnersByCategory} />
              ) : (
                <h2 className="h2">No Partners Found</h2>
              )} */}
              {partnersByCategory ? (
                Object.keys(partnersByCategory).length > 0 ? (
                  <PartnerTileGrid partnersByCategory={partnersByCategory} />
                ) : (
                  <h2 className="h2">No Partners Found</h2>
                )
              ) : null}
              </div>
            </div>
          </div>
          {/* Become a partner form */}
        </SectionContainer>
        {/* <BecomeAPartner supabase={supabase} /> */}
      </Layout>
    </>
  )
}

export default IntegrationPartnersPage
