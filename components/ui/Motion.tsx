'use client'

import { motion, AnimatePresence } from 'framer-motion'
import React from 'react'

export const FadeIn = ({ children, delay = 0, duration = 0.5, className }: any) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration, delay }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export const ScaleIn = ({ children, delay = 0 }: any) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
        >
            {children}
        </motion.div>
    )
}

export const StaggerContainer = ({ children, stagger = 0.1, className }: any) => {
    return (
        <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
                hidden: {},
                show: {
                    transition: {
                        staggerChildren: stagger
                    }
                }
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export const StaggerItem = ({ children, className }: any) => {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}
