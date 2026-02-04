'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/product/ProductCard'
import Input from '@/components/ui/Input'
import styles from './page.module.css'

export default function SearchPage() {
    const searchParams = useSearchParams()
    const initialQuery = searchParams.get('q') || ''

    const [query, setQuery] = useState(initialQuery)
    const [results, setResults] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (initialQuery) {
            performSearch(initialQuery)
        }
    }, [initialQuery])

    const performSearch = async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([])
            return
        }

        setLoading(true)
        // TODO: Implement Supabase full-text search
        // For now, just simulate empty results
        setTimeout(() => {
            setResults([])
            setLoading(false)
        }, 500)
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        performSearch(query)
    }

    const popularSearches = [
        'iPhone 13',
        'Samsung Galaxy',
        'OnePlus',
        'AirPods',
        'Smartwatch',
        'Wireless Earbuds',
    ]

    return (
        <div className={styles.page}>
            <div className={styles.searchSection}>
                <div className="container">
                    <h1 className={styles.title}>Search Products</h1>
                    <form onSubmit={handleSearch} className={styles.searchForm}>
                        <Input
                            type="search"
                            placeholder="Search for phones, accessories, wearables..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            fullWidth
                            leftIcon={
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path
                                        d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            }
                        />
                    </form>

                    {!query && (
                        <div className={styles.popularSearches}>
                            <h3>Popular Searches</h3>
                            <div className={styles.searchTags}>
                                {popularSearches.map((search) => (
                                    <button
                                        key={search}
                                        className={styles.searchTag}
                                        onClick={() => {
                                            setQuery(search)
                                            performSearch(search)
                                        }}
                                    >
                                        {search}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="container">
                {loading ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>Searching...</p>
                    </div>
                ) : query && results.length === 0 ? (
                    <div className={styles.noResults}>
                        <div className={styles.noResultsIcon}>🔍</div>
                        <h2>No results found for "{query}"</h2>
                        <p>Try different keywords or browse our categories</p>
                        <div className={styles.suggestions}>
                            <h3>Suggestions:</h3>
                            <ul>
                                <li>Check your spelling</li>
                                <li>Try more general keywords</li>
                                <li>Try different keywords</li>
                                <li>Browse by category instead</li>
                            </ul>
                        </div>
                    </div>
                ) : query && results.length > 0 ? (
                    <div className={styles.results}>
                        <h2 className={styles.resultsTitle}>
                            {results.length} results for "{query}"
                        </h2>
                        <div className={styles.productGrid}>
                            {results.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    )
}
