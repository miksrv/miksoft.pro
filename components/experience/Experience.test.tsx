import React from 'react'

import { fireEvent, render, screen } from '@testing-library/react'

import data from '@/public/data.json'
import { DataProvider } from '@/utils'

import { Experience } from './Experience'

const renderExperience = () =>
    render(
        <DataProvider>
            <Experience />
        </DataProvider>
    )

describe('Experience Component', () => {
    it('renders every role and org from data.json', () => {
        renderExperience()

        data.experience.forEach((item) => {
            expect(screen.getAllByText(item.role).length).toBeGreaterThan(0)
            expect(screen.getByText(`· ${item.org}`)).toBeInTheDocument()
        })
    })

    it('expands the first (current) role by default', () => {
        renderExperience()

        const details = document.querySelectorAll('details')
        expect(details[0]).toHaveAttribute('open')
        expect(details[1]).not.toHaveAttribute('open')
    })

    it('shows bullets of the first role without any interaction', () => {
        renderExperience()

        expect(screen.getByText(data.experience[0].bullets[0])).toBeInTheDocument()
    })

    it('renders badges for contract and part-time roles', () => {
        renderExperience()

        expect(screen.getByText('Contract')).toBeInTheDocument()
        expect(screen.getByText('Part-time')).toBeInTheDocument()
    })

    it('renders the collapsed earlier-roles row', () => {
        renderExperience()

        expect(screen.getByText(data.earlierRoles.label)).toBeInTheDocument()
    })

    it('toggles a role open state via onToggle', () => {
        renderExperience()

        const details = document.querySelectorAll('details')
        fireEvent(details[1], new Event('toggle', { bubbles: false }))

        expect(screen.getByText(data.experience[1].bullets[0])).toBeInTheDocument()
    })

    it('links to LinkedIn for the full history', () => {
        renderExperience()

        const link = screen.getByRole('link', { name: 'LinkedIn' })
        expect(link).toHaveAttribute('href', expect.stringContaining('linkedin.com'))
    })
})
