import React, { useEffect, useState } from 'react'

import { buildEmail, useSiteData } from '@/utils'
import { formatDate, formatPeriod } from '@/utils/date'

import styles from './styles.module.sass'

/**
 * Hidden print-only resume layout: "Resume (PDF)" triggers window.print(),
 * and this is the document that gets printed / saved as PDF.
 * The email is assembled after hydration so it never appears in the static HTML.
 */
export const PrintResume: React.FC = () => {
    const data = useSiteData()
    const [email, setEmail] = useState<string>('')

    useEffect(() => {
        setEmail(buildEmail(data?.emailParts))
    }, [data?.emailParts])

    const stripBold = (text: string) => text.replace(/\*\*/g, '')

    return (
        <div
            className={styles.printResume}
            aria-hidden={'true'}
        >
            <header className={styles.header}>
                <h1>{data?.biography?.name}</h1>
                <p className={styles.title}>{data?.biography?.title}</p>
                <p className={styles.contacts}>
                    {data?.biography?.location}
                    {email && ` · ${email}`}
                    {' · miksoft.pro'}
                </p>
                <p className={styles.contacts}>{data?.contactLinks?.map((item) => item.link).join(' · ')}</p>
            </header>

            <section>
                {data?.biography?.now?.map((paragraph) => (
                    <p
                        key={paragraph.slice(0, 24)}
                        className={styles.summary}
                    >
                        {stripBold(paragraph)}
                    </p>
                ))}
            </section>

            <section>
                <h2>{'Experience'}</h2>
                {data?.experience?.map((item) => (
                    <div
                        key={`${item.role}-${item.period[0]}`}
                        className={styles.role}
                    >
                        <div className={styles.roleHeader}>
                            <h3>
                                {item.role}
                                {' · '}
                                {item.org}
                                {'badge' in item && item.badge ? ` (${item.badge})` : ''}
                            </h3>
                            <span>
                                {formatDate(item.period[0], 'MMM YYYY')}
                                {' — '}
                                {item.period[1] ? formatDate(item.period[1], 'MMM YYYY') : 'Present'}
                                {' · '}
                                {formatPeriod(item.period)}
                            </span>
                        </div>
                        <ul>
                            {item.bullets.map((bullet) => (
                                <li key={bullet.slice(0, 24)}>{bullet}</li>
                            ))}
                        </ul>
                        {!!item.stack?.length && <p className={styles.stack}>{item.stack.join(', ')}</p>}
                    </div>
                ))}
                {data?.earlierRoles && (
                    <div className={styles.role}>
                        <div className={styles.roleHeader}>
                            <h3>{data.earlierRoles.label}</h3>
                            <span>
                                {formatDate(data.earlierRoles.period[0], 'YYYY')}
                                {' — '}
                                {formatDate(data.earlierRoles.period[1], 'YYYY')}
                            </span>
                        </div>
                    </div>
                )}
            </section>

            <section>
                <h2>{'Projects'}</h2>
                {data?.projects?.featured?.map((project) => (
                    <div
                        key={project.title}
                        className={styles.project}
                    >
                        <h3>{project.title}</h3>
                        <p>
                            {project.description}
                            {' — '}
                            {project.link}
                        </p>
                    </div>
                ))}
            </section>

            <section>
                <h2>{'Stack'}</h2>
                {data?.stack?.map((row) => (
                    <p
                        key={row.group}
                        className={styles.stackRow}
                    >
                        <strong>{row.group}</strong>
                        {': '}
                        {row.items}
                    </p>
                ))}
            </section>
        </div>
    )
}
