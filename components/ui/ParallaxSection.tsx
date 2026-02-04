'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import styles from './ParallaxSection.module.css'

interface ParallaxSectionProps {
    children?: React.ReactNode
    image: string
    height?: string
    speed?: number
    overlay?: boolean
}

export default function ParallaxSection({
    children,
    image,
    height = "500px",
    speed = 0.5,
    overlay = true
}: ParallaxSectionProps) {
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], ["0%", `${30 * speed}%`])

    return (
        <div className={styles.container} style={{ height }} ref={ref}>
            <motion.div
                className={styles.background}
                style={{
                    backgroundImage: `url(${image})`,
                    y
                }}
            />
            {overlay && <div className={styles.overlay} />}
            <div className={styles.content}>
                {children}
            </div>
        </div>
    )
}
