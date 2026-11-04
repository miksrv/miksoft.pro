import React from 'react'

import { NextSeo } from 'next-seo'

import { Experience, Hero, Now, Projects, Stack } from '@/components'
import { useSiteData } from '@/utils'

const MainPage: React.FC = () => {
    const data = useSiteData()

    return (
        <>
            <NextSeo
                title={data?.seo?.title}
                description={data?.seo?.description}
                canonical={'https://miksoft.pro/'}
                openGraph={{
                    type: 'profile',
                    url: 'https://miksoft.pro/',
                    profile: {
                        firstName: data?.biography?.name?.split(' ')[0],
                        lastName: data?.biography?.name?.split(' ').slice(1).join(' ')
                    },
                    images: [
                        {
                            alt: data?.seo?.title,
                            height: 630,
                            url: 'https://miksoft.pro/og-image.png',
                            width: 1200
                        }
                    ],
                    locale: 'en-US',
                    siteName: 'miksoft.pro'
                }}
                twitter={{ cardType: 'summary_large_image' }}
            />

            <Hero />
            <Now />
            <Experience />
            <Projects />
            <Stack />
        </>
    )
}

export default MainPage
