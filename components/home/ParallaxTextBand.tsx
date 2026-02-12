'use client'

import {
    motion,
    useAnimationFrame,
    useMotionValue,
    useReducedMotion,
    useTransform,
} from 'framer-motion'
import styles from './ParallaxTextBand.module.css'

interface ParallaxTextBandProps {
    text: string
}

const BASE_VELOCITY = -1.4
const REPEAT_COUNT = 10
const WRAP_START = -50
const WRAP_END = 0

const wrap = (min: number, max: number, value: number) => {
    const range = max - min
    return ((((value - min) % range) + range) % range) + min
}

export default function ParallaxTextBand({ text }: ParallaxTextBandProps) {
    const prefersReducedMotion = useReducedMotion()
    const baseX = useMotionValue(0)
    const x = useTransform(baseX, (value) => `${wrap(WRAP_START, WRAP_END, value)}%`)

    useAnimationFrame((_, delta) => {
        if (prefersReducedMotion) return

        const moveBy = BASE_VELOCITY * (delta / 1000)
        baseX.set(baseX.get() + moveBy)
    })

    const textChunks = Array.from({ length: REPEAT_COUNT }, (_, index) => (
        <span key={index} className={styles.text}>
            {text}
        </span>
    ))

    return (
        <section className={styles.section} aria-label="Store promises">
            <div className={styles.trackViewport}>
                {prefersReducedMotion ? (
                    <div className={styles.trackStatic}>{textChunks}</div>
                ) : (
                    <motion.div className={styles.track} style={{ x }}>
                        {textChunks}
                    </motion.div>
                )}
            </div>
        </section>
    )
}
