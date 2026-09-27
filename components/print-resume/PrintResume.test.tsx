import React from 'react'

import { render, screen } from '@testing-library/react'

import data from '@/public/data.json'
import { buildEmail, DataProvider } from '@/utils'

import { PrintResume } from './PrintResume'

const renderResume = () =>
    render(
        <DataProvider>
            <PrintResume />
        </DataProvider>
    )

describe('PrintResume Component', () => {
    it('renders the name, title and every role', () => {
        renderResume()

        expect(screen.getByText(data.biography.name)).toBeInTheDocument()
        expect(screen.getByText(data.biography.title)).toBeInTheDocument()

        data.experience.forEach((item) => {
            expect(screen.getByText(new RegExp(`${item.role} · ${item.org}`))).toBeInTheDocument()
        })
    })

    it('assembles the email only after hydration', () => {
        renderResume()

        // useEffect has run by the time render returns, so the address is present —
        // the point is that it comes from state, not from the static markup
        expect(screen.getByText(new RegExp(buildEmail(data.emailParts)))).toBeInTheDocument()
    })

    it('renders stack groups and featured projects', () => {
        renderResume()

        data.stack.forEach((row) => {
            expect(screen.getByText(row.group)).toBeInTheDocument()
        })
        data.projects.featured.forEach((project) => {
            expect(screen.getByText(project.title)).toBeInTheDocument()
        })
    })

    it('is hidden from assistive technology', () => {
        const { container } = renderResume()

        expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
    })
})
