import React, { useEffect, useState } from 'react'

import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { NextSeo } from 'next-seo'

import { StarField } from '@/components'
import astronaut from '@/public/astronaut.png'

type NotFoundProps = object

// The starfield lives here now — an astronomy-themed easter egg,
// kept off the main page to leave it quiet and professional.
const NotFound: NextPage<NotFoundProps> = () => {
    const [starCount, setStarCount] = useState(1000)

    useEffect(() => {
        if (window.innerWidth <= 768) {
            setStarCount(400)
        }
    }, [])

    return (
        <div className={'page404'}>
            <NextSeo
                nofollow={true}
                noindex={true}
            />
            <StarField
                starCount={starCount}
                starColor={[255, 255, 255]}
                speedFactor={0.05}
                backgroundColor={'black'}
            />
            <div className={'container'}>
                <h1>{'404 - Lost in Space'}</h1>
                <h2>{'Oops! This page drifted off into a black hole'}</h2>
                <div className={'description'}>
                    <div>
                        <p>{'As a developer, I know this might be a bug'}</p>
                        <p>{'As an astronomer, I prefer to call it a cosmic anomaly'}</p>
                        <Link
                            href='/'
                            title={'Go to main page'}
                            className={'link'}
                        >
                            {'Go to home'}
                        </Link>
                    </div>
                    <Image
                        className={'astronaut'}
                        src={astronaut}
                        alt={''}
                    />
                </div>
            </div>
        </div>
    )
}

export default NotFound
