import React from 'react'

import { fireEvent, render, screen } from '@testing-library/react'

import data from '@/public/data.json'
import { buildEmail, DataProvider } from '@/utils'

import { Now } from './Now'

const renderNow = () =>
    render(
        <DataProvider>
            <Now />
        </DataProvider>
    )

describe('Now Component', () => {
    it('renders contact links from data.json', () => {
        renderNow()

        data.contactLinks.forEach((item) => {
            expect(screen.getByRole('link', { name: item.label })).toHaveAttribute('href', item.link)
        })
    })

    it('does not render the email address until the Email button is clicked', () => {
        renderNow()

        const email = buildEmail(data.emailParts)
        expect(screen.queryByText(email)).not.toBeInTheDocument()

        fireEvent.click(screen.getByRole('button', { name: 'Email' }))

        expect(screen.getByText(email)).toBeInTheDocument()
    })

    it('copies the email address to the clipboard', async () => {
        const writeText = jest.fn().mockResolvedValue(undefined)
        Object.assign(navigator, { clipboard: { writeText } })

        renderNow()
        fireEvent.click(screen.getByRole('button', { name: 'Email' }))
        fireEvent.click(screen.getByRole('button', { name: 'Copy' }))

        expect(writeText).toHaveBeenCalledWith(buildEmail(data.emailParts))
        expect(await screen.findByRole('button', { name: 'Copied' })).toBeInTheDocument()
    })

    it('opens the print dialog for the resume link', () => {
        const print = jest.fn()
        Object.assign(window, { print })

        renderNow()
        fireEvent.click(screen.getByRole('link', { name: 'Resume (PDF)' }))

        expect(print).toHaveBeenCalled()
    })

    it('renders the Save contact button', () => {
        renderNow()

        expect(screen.getByRole('button', { name: 'Save contact' })).toBeInTheDocument()
    })
})
