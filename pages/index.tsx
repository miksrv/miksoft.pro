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
                openGraph={{
                    images: [
                        {
                            height: 630,
                            url: 'https://miksoft.pro/og-image.png',
                            width: 1200
                        }
                    ],
                    locale: 'en-US',
                    siteName: 'miksoft.pro'
                }}
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
