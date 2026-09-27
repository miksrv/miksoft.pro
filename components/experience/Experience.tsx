import React, { useState } from 'react'

import Link from 'next/link'

import { useSiteData } from '@/utils'
import { formatDate, formatPeriod } from '@/utils/date'

import styles from './styles.module.sass'

const periodLabel = (period: string[]): string => {
    const start = formatDate(period[0], 'YYYY')
    const end = period[1] ? formatDate(period[1], 'YYYY') : 'now'

    return `${start} — ${end}`
}

const Chevron: React.FC = () => (
    <svg
        className={styles.chevron}
        viewBox={'0 0 10 10'}
        aria-hidden={'true'}
    >
        <path
            d={'M3 1.5 6.5 5 3 8.5'}
            fill={'none'}
            stroke={'currentColor'}
            strokeWidth={1.5}
        />
    </svg>
)

export const Experience: React.FC = () => {
    const data = useSiteData()

    // The current (first) role is expanded by default so its highlights are
    // visible without a single click; the rest open on demand.
    const [opened, setOpened] = useState<Set<number>>(new Set([0]))

    const handleToggle = (index: number, open: boolean) => {
        setOpened((prev) => {
            const next = new Set(prev)
            if (open) {
                next.add(index)
            } else {
                next.delete(index)
            }
            return next
        })
    }

    const linkedIn = data?.contactLinks?.find((item) => item.icon === 'linkedin')

    return (
        <section aria-label={'Experience'}>
            <p className={'sectionLabel'}>{'Experience'}</p>

            <ul className={styles.rows}>
                {data?.experience?.map((item, index) => (
                    <li key={`${item.role}-${item.period[0]}`}>
                        <details
                            open={opened.has(index)}
                            onToggle={(event) => handleToggle(index, event.currentTarget.open)}
                        >
                            <summary>
                                <span className={styles.rowMain}>
                                    <span className={styles.role}>{item.role}</span>{' '}
                                    <span className={styles.orgGroup}>
                                        {/* eslint-disable-next-line react/jsx-max-depth */}
                                        <span className={styles.org}>
                                            {'· '}
                                            {item.org}
                                        </span>
                                        {'badge' in item && item.badge && (
                                            <span className={styles.badge}>{item.badge}</span>
                                        )}
                                    </span>
                                </span>
                                <span className={styles.when}>
                                    {periodLabel(item.period)}
                                    {' · '}
                                    {formatPeriod(item.period)}
                                </span>
                                <Chevron />
                            </summary>
                            <div className={styles.body}>
                                <ul>
                                    {item.bullets.map((bullet) => (
                                        <li key={bullet.slice(0, 24)}>{bullet}</li>
                                    ))}
                                </ul>
                                {!!item.stack?.length && <p className={styles.stack}>{item.stack.join(', ')}</p>}
                            </div>
                        </details>
                    </li>
                ))}
                {data?.earlierRoles && (
                    <li className={styles.earlier}>
                        <span className={styles.rowMain}>{data.earlierRoles.label}</span>
                        <span className={styles.when}>{periodLabel(data.earlierRoles.period)}</span>
                    </li>
                )}
            </ul>

            {linkedIn && (
                <p className={styles.moreLink}>
                    {'Full history on '}
                    <Link
                        className={'textLink'}
                        href={linkedIn.link}
                        target={'_blank'}
                        rel={'noopener noreferrer'}
                    >
                        {'LinkedIn'}
                    </Link>
                </p>
            )}
        </section>
    )
}
